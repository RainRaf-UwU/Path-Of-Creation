"""Inspect and refine the fully visible quest graph without gameplay edits."""

from __future__ import annotations

import argparse
import json
import math
import copy
import hashlib
import shutil
from itertools import combinations

import numpy as np

from audit_progression import CHAPTERS, MAIN_FILES, ROOT, QUEST_BLOCK, QUEST_ID, read_chapters, validate
from compact_layout import EXITS, FIELDS, patch_chapter, point_segment_distance
import compact_layout
from PIL import Image,ImageDraw,ImageFont,ImageOps
from evaluate_layout import intersects
from spine_layout import branch_components, mainline_order

OUT = ROOT / "design/visible-layout"
CROSS_BRANCH = 100_000_000.0
CROSS_MAIN = 50_000.0
THROUGH_NODE = 1_000_000.0
LONG_LINK = 5_000.0
BACKUP=ROOT/"design/backups/quest-layout-2026-10-04-visible"
MAX_BRANCH_LINK=8.25
FINAL_SCALE=.92
FINAL_CLEARANCE=.5
FINAL_LINE_MARGIN=.05
INDEPENDENT_BLUEPRINTS={'082A860A24936FA8','2B4A2F4E70823F3D'}


def validate_sources(quests):
    errors=validate(quests)
    allowed={'Unreachable from Chapter 1: '+qid for qid in INDEPENDENT_BLUEPRINTS
             if qid in quests and not quests[qid]['dependencies']
             and quests[qid]['task_types']==['checkmark']}
    unexpected=[error for error in errors if error not in allowed]
    if unexpected:raise ValueError(unexpected)
    return [error for error in errors if error in allowed]


def include_new_support_tasks(chapter,nodes,path):
    for qid in sorted(set(chapter)-set(nodes)):
        if qid not in INDEPENDENT_BLUEPRINTS:raise ValueError('Unreviewed quest added while editing: '+qid)
        quest=chapter[qid]
        node={'shape':quest['shape'],'size':quest['size'],'stage':0,'role':'support','hide_dependent_lines':False}
        x,y=nodes[path[0]]['x'],nodes[path[0]]['y']
        positions=[(x+math.cos(angle)*radius,y+math.sin(angle)*radius)
                   for radius in (2.5,3.0,3.5,4.0,4.5,5.0,6.0) for angle in np.arange(24)*math.tau/24]
        for px,py in positions:
            nodes[qid]={**node,'x':round(px,2),'y':round(py,2)}
            report=analyze(chapter,nodes,path)
            if not report['overlaps'] and not report['obstructions']:break
        else:raise ValueError('No close support-task position: '+qid)


def analyze(chapter,nodes,path):
    refiner=Refiner(chapter,nodes,path)
    result=refiner.summary()
    edges=graph(chapter)
    lengths=sorted(math.dist((nodes[a]['x'],nodes[a]['y']),(nodes[b]['x'],nodes[b]['y']))
                   for a,b in edges if a not in path or b not in path)
    mixed=[math.dist((nodes[a]['x'],nodes[a]['y']),(nodes[b]['x'],nodes[b]['y']))
           for a,b in edges if (a in path)!=(b in path)]
    overlaps=[]
    for a,b in combinations(nodes,2):
        gap=(nodes[a]['size']+nodes[b]['size'])/2+FINAL_CLEARANCE
        if abs(nodes[a]['x']-nodes[b]['x'])<gap-.001 and abs(nodes[a]['y']-nodes[b]['y'])<gap-.001:
            overlaps.append([a,b])
    obstructions=[[a,b,k] for a,b in edges for k in nodes if k not in(a,b) and
                  point_segment_distance((nodes[k]['x'],nodes[k]['y']),
                                         (nodes[a]['x'],nodes[a]['y']),
                                         (nodes[b]['x'],nodes[b]['y']))<nodes[k]['size']/2+FINAL_LINE_MARGIN-1e-6]
    result.update(quests=len(nodes),mainline=len(path),edges=len(edges),
                  branch_p90=round(lengths[int((len(lengths)-1)*.9)],3),
                  main_branch_max=round(max(mixed),3),overlaps=overlaps,obstructions=obstructions,
                  hidden_line_sources=sum(bool(n.get('hide_dependent_lines')) for n in nodes.values()),
                  width=round(max(n['x']+n['size']/2 for n in nodes.values())-min(n['x']-n['size']/2 for n in nodes.values()),2),
                  height=round(max(n['y']+n['size']/2 for n in nodes.values())-min(n['y']-n['size']/2 for n in nodes.values()),2))
    return result


def verify_layout(chapter,nodes,path):
    if set(chapter)!=set(nodes):raise ValueError('Quest IDs differ from source')
    result=analyze(chapter,nodes,path)
    if result['branch_crossings'] or result['overlaps'] or result['obstructions'] or result['hidden_line_sources'] or result['branch_max']>MAX_BRANCH_LINK:
        raise ValueError(json.dumps(result,ensure_ascii=False))
    return result


def logic_hash(source):
    return hashlib.sha256(FIELDS.sub('',source).encode('utf-8')).hexdigest()


def preview():
    quests=read_chapters()
    source_notes=validate_sources(quests)
    manifest=json.loads((ROOT/'design/quest-layout.json').read_text(encoding='utf-8'))
    candidate,reports={},{}
    compact_layout.OUT=OUT
    for index,filename in enumerate(MAIN_FILES):
        chapter={k:v for k,v in quests.items() if v['chapter']==filename}
        path=mainline_order(chapter,EXITS[index])
        nodes=json.loads((OUT/f'{index+1}-nodes.json').read_text(encoding='utf-8'))
        # The search reserves .75 units around icons and .15 around lines.
        # Tighten the reviewed map uniformly while retaining at least .5 units
        # between icon bounds and .05 units between a line and unrelated icons.
        for node in nodes.values():
            node['x']=round(node['x']*FINAL_SCALE,2)
            node['y']=round(node['y']*FINAL_SCALE,2)
        # Put chapter entry above the finale; mirroring preserves spacing and
        # all intersection tests while keeping the reading direction familiar.
        if nodes[path[0]]['y']>nodes[path[-1]]['y']:
            for node in nodes.values():node['y']=-node['y']
        for node in nodes.values():node['hide_dependent_lines']=False
        include_new_support_tasks(chapter,nodes,path)
        after=verify_layout(chapter,nodes,path)
        source=(CHAPTERS/filename).read_bytes().decode('utf-8')
        old=copy.deepcopy(manifest[filename])
        for qid in set(chapter)-set(old):
            quest=chapter[qid]
            old[qid]={'x':quest['x'],'y':quest['y'],'size':quest['size'],'shape':quest['shape'],'hide_dependent_lines':False}
        hidden={QUEST_ID.search(m.group()).group(1) for m in QUEST_BLOCK.finditer(source) if 'hide_dependent_lines: true' in m.group()}
        for qid,node in old.items():node['hide_dependent_lines']=qid in hidden
        candidate[filename]=nodes
        reports[filename]={'before':analyze(chapter,old,path),'after':after,'path':path,'logic_sha256':logic_hash(source),'existing_source_notes':source_notes}
        compact_layout.render(index,chapter,nodes,path,after,fully_visible=True)
        print(index+1,json.dumps(after,ensure_ascii=False),flush=True)
    (OUT/'candidate.json').write_text(json.dumps(candidate,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
    (OUT/'metrics.json').write_text(json.dumps(reports,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
    overview(reports)


def overview(reports):
    canvas=Image.new('RGB',(1980,1580),'#101821');draw=ImageDraw.Draw(canvas)
    title=ImageFont.truetype('C:/Windows/Fonts/msyhbd.ttc',38)
    font=ImageFont.truetype('C:/Windows/Fonts/msyh.ttc',23)
    small=ImageFont.truetype('C:/Windows/Fonts/msyh.ttc',19)
    draw.text((32,24),'创世之径 · 第 1–5 章任务布局',font=title,fill='#edf4f8')
    draw.text((32,78),'所有依赖连线常显；相关支线紧靠排列，支线之间无交叉。静态示意图，游戏仍使用原物品图标。',font=font,fill='#b5c5d0')
    for index,filename in enumerate(MAIN_FILES):
        x,y=24+(index%3)*652,128+(index//3)*702
        draw.rounded_rectangle((x,y,x+632,y+680),radius=16,fill='#18232d',outline='#354653',width=2)
        after=reports[filename]['after']
        draw.text((x+20,y+18),f'第 {index+1} 章 · {compact_layout.TITLES[index]}',font=font,fill='#edf4f8')
        draw.text((x+20,y+55),f"{after['quests']} 个任务 · 主线 {after['mainline']} 个 · 支线间交叉 0",font=small,fill='#a9bcc8')
        preview=Image.open(OUT/f'{index+1}-compact.png')
        preview=preview.crop((190,110,preview.width,preview.height-45))
        preview=ImageOps.contain(preview,(594,530),Image.Resampling.LANCZOS)
        canvas.paste(preview,(x+(632-preview.width)//2,y+96+(530-preview.height)//2))
        draw.text((x+20,y+641),f"支线连接：平均 {after['branch_mean']:.2f} / 最长 {after['branch_max']:.2f}",font=small,fill='#b5d8c5')
    x,y=1328,830
    draw.rounded_rectangle((x,y,x+632,y+680),radius=16,fill='#18232d',outline='#354653',width=2)
    draw.text((x+32,y+40),'本轮修正',font=title,fill='#edf4f8')
    count=sum(report['after']['quests'] for report in reports.values())
    lines=['所有连线直接显示，无需悬停','每章支线之间交叉均为 0','连接距离同时检查入口、回接和支线后续','主线沿大节点连续前进','密集目录围绕入口展开，避免线穿过图标','',f'{count} 个任务保留原有 ID、依赖与奖励','修改前配置已备份；需重载游戏确认显示']
    for number,line in enumerate(lines):draw.text((x+32,y+125+number*52),line,font=font if number<5 else small,fill='#b9cbd6')
    canvas.save(OUT/'overview.png')


def apply_or_check(mode):
    quests=read_chapters()
    source_notes=validate_sources(quests)
    candidate=json.loads((OUT/'candidate.json').read_text(encoding='utf-8'))
    reports=json.loads((OUT/'metrics.json').read_text(encoding='utf-8'))
    updates={}
    for index,filename in enumerate(MAIN_FILES):
        chapter={k:v for k,v in quests.items() if v['chapter']==filename}
        verify_layout(chapter,candidate[filename],mainline_order(chapter,EXITS[index]))
        source=(CHAPTERS/filename).read_bytes().decode('utf-8')
        if logic_hash(source)!=reports[filename]['logic_sha256']:raise ValueError('Gameplay source changed since preview: '+filename)
        updated=patch_chapter(source,candidate[filename])
        if mode=='check':
            if source!=updated:raise ValueError('Source differs from reviewed layout: '+filename)
            original=(BACKUP/filename).read_bytes().decode('utf-8')
            if FIELDS.sub('',source)!=FIELDS.sub('',original):raise ValueError('Gameplay fields changed: '+filename)
            if 'hide_dependent_lines: true' in source or 'hide_dependency_lines: true' in source:
                raise ValueError('A connection is still hidden: '+filename)
        updates[filename]=updated
    if mode=='apply':
        if BACKUP.exists():raise ValueError('Refusing to overwrite the existing backup')
        BACKUP.mkdir(parents=True)
        for filename in MAIN_FILES:shutil.copy2(CHAPTERS/filename,BACKUP/filename)
        shutil.copy2(ROOT/'design/quest-layout.json',BACKUP/'quest-layout.json')
        for filename,source in updates.items():(CHAPTERS/filename).write_bytes(source.encode('utf-8'))
        (ROOT/'design/quest-layout.json').write_text(json.dumps(candidate,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
        print('Applied only coordinates, native node styles and line visibility; previous files backed up.')
    else:
        if json.loads((ROOT/'design/quest-layout.json').read_text(encoding='utf-8'))!=candidate:raise ValueError('Manifest differs from source')
        count=sum(len(nodes) for nodes in candidate.values())
        print(f'PASS: {count} stable quests, gameplay fields unchanged, all lines visible, no branch-pair crossings, no overlaps or lines through nodes, branch links <= 8.25 units.')
        if source_notes:print('Preserved existing independent checkmark/template tasks:',source_notes)


def cross2(a, b):
    return a[..., 0] * b[..., 1] - a[..., 1] * b[..., 0]


class Refiner:
    def __init__(self, chapter, nodes, path):
        self.ids = list(nodes)
        self.lookup = {qid: i for i, qid in enumerate(self.ids)}
        self.xy = np.array([[nodes[k]["x"], nodes[k]["y"]] for k in self.ids], dtype=float)
        self.original = self.xy.copy()
        self.sizes = np.array([nodes[k]["size"] for k in self.ids])
        self.main = np.array([k in path for k in self.ids])
        self.edges = np.array([(self.lookup[a], self.lookup[b]) for a, b in graph(chapter)])
        self.branch = ~np.all(self.main[self.edges], axis=1)
        self.neighbors = [np.array([b if a == q else a for a, b in self.edges if q in (a, b)],dtype=int)
                          for q in range(len(nodes))]
        pairs = np.array([(a, b) for a, b in combinations(range(len(self.edges)), 2)
                          if len(set(self.edges[a]) | set(self.edges[b])) == 4])
        self.pairs = pairs
        self.pair_weights = np.where(self.branch[pairs].all(axis=1), CROSS_BRANCH, CROSS_MAIN)
        self.rng = np.random.default_rng(22004)
        self.groups = [np.array([self.lookup[k] for k in sorted(group)])
                       for group in branch_components(chapter, set(path)) if len(group)>1]
        linked=[set() for _ in self.ids]
        for a,b in self.edges[self.branch]:
            linked[a].add(b);linked[b].add(a)
        unseen=set(range(len(self.ids)))
        while unseen:
            pending=[unseen.pop()];component=set(pending)
            while pending:
                q=pending.pop()
                for r in linked[q]&unseen:
                    unseen.remove(r);component.add(r);pending.append(r)
            if len(component)>1:self.groups.append(np.array(sorted(component)))

    def clear(self):
        gaps=(self.sizes[:,None]+self.sizes[None,:])/2+.75
        overlap=np.all(np.abs(self.xy[:,None]-self.xy[None])<gaps[...,None]-.001,axis=2)
        np.fill_diagonal(overlap,False)
        return not overlap.any()

    def summary(self):
        lines = self.xy[self.edges]
        a, b = lines[self.pairs[:, 0], 0], lines[self.pairs[:, 0], 1]
        c, d = lines[self.pairs[:, 1], 0], lines[self.pairs[:, 1], 1]
        crossed = (cross2(b-a, c-a) * cross2(b-a, d-a) < -1e-8) & (cross2(d-c, a-c) * cross2(d-c, b-c) < -1e-8)
        lengths = np.linalg.norm(lines[:, 0] - lines[:, 1], axis=1)
        return {"crossings": int(crossed.sum()), "branch_crossings": int((crossed & self.branch[self.pairs].all(axis=1)).sum()),
                "branch_max": round(float(max(lengths[self.branch])), 3),
                "branch_mean": round(float(np.mean(lengths[self.branch])), 3)}

    def global_cost(self):
        lines=self.xy[self.edges]
        a,b=lines[self.pairs[:,0],0],lines[self.pairs[:,0],1]
        c,d=lines[self.pairs[:,1],0],lines[self.pairs[:,1],1]
        crossed=(cross2(b-a,c-a)*cross2(b-a,d-a)<-1e-8)&(cross2(d-c,a-c)*cross2(d-c,b-c)<-1e-8)
        lengths=np.linalg.norm(lines[:,0]-lines[:,1],axis=1)
        value=np.sum(lengths**2+np.where(self.branch,LONG_LINK,500)*np.maximum(0,lengths-np.where(self.branch,7.0,10.0))**2)+np.sum(crossed*self.pair_weights)
        a=lines[:,0,None];ab=lines[:,1,None]-a;p=self.xy[None]
        t=np.clip(np.sum((p-a)*ab,axis=2)/np.maximum(1e-9,np.sum(ab*ab,axis=2)),0,1)
        dist=np.linalg.norm(p-(a+t[...,None]*ab),axis=2)
        legal=np.ones(dist.shape,dtype=bool)
        legal[np.arange(len(self.edges)),self.edges[:,0]]=False
        legal[np.arange(len(self.edges)),self.edges[:,1]]=False
        value+=THROUGH_NODE*np.sum((dist<self.sizes[None]/2+.15)&legal)
        value+=np.sum(np.sum((self.xy-self.original)**2,axis=1)*np.where(self.main,5,.05))
        return float(value)

    def costs(self, q, points, crossing_weight=1):
        points = np.atleast_2d(points)
        neighbors = self.neighbors[q]
        delta = np.abs(points[:, None] - self.xy[None])
        gaps = (self.sizes[q] + self.sizes) / 2 + 0.75
        overlap = np.all(delta < gaps[None, :, None] - 0.001, axis=2)
        overlap[:, q] = False
        invalid = overlap.any(axis=1)
        lengths = np.linalg.norm(points[:, None] - self.xy[neighbors][None], axis=2)
        incident_branch = ~(self.main[q] & self.main[neighbors])
        value = (lengths**2 + np.where(incident_branch,LONG_LINK,500)[None] *
                 np.maximum(0, lengths - np.where(incident_branch,7.0,10.0)[None])**2).sum(axis=1)
        value += (5 if self.main[q] else .05) * np.sum((points - self.original[q])**2, axis=1)
        # Check every incident link against every nonincident link, including
        # the main-to-branch links which were previously folded on hover.
        other_edges = self.edges[~np.any(self.edges == q, axis=1)]
        other_branch = ~self.main[other_edges].all(axis=1)
        a = points[:, None, None, :]
        b = self.xy[neighbors][None, :, None, :]
        c = self.xy[other_edges[:, 0]][None, None]
        d = self.xy[other_edges[:, 1]][None, None]
        legal = ~np.any(other_edges[None] == neighbors[:, None, None], axis=2)
        crossed = (cross2(b-a, c-a) * cross2(b-a, d-a) < -1e-8) & (cross2(d-c, a-c) * cross2(d-c, b-c) < -1e-8)
        weights = np.where(incident_branch[:, None] & other_branch[None], CROSS_BRANCH, CROSS_MAIN)
        value += crossing_weight * (crossed * legal[None] * weights[None]).sum(axis=(1, 2))
        # Keep links from running through unrelated icons, including collinear
        # overlaps that a proper-segment crossing test alone would miss.
        a = points[:, None, None]
        ab = self.xy[neighbors][None, :, None] - a
        p = self.xy[None, None]
        t = np.clip(np.sum((p-a)*ab, axis=3) / np.maximum(1e-9, np.sum(ab*ab,axis=3)), 0, 1)
        distance = np.linalg.norm(p - (a + t[..., None]*ab), axis=3)
        legal_nodes = np.ones((len(neighbors), len(self.ids)), dtype=bool)
        legal_nodes[:, q] = False
        legal_nodes[np.arange(len(neighbors)), neighbors] = False
        obstruction = distance < self.sizes[None, None]/2 + .15
        value += THROUGH_NODE * (obstruction * legal_nodes[None]).sum(axis=(1, 2))
        e0, e1 = self.xy[other_edges[:, 0]], self.xy[other_edges[:, 1]]
        diff = e1-e0
        t = np.clip(np.sum((points[:, None]-e0[None])*diff[None],axis=2) / np.maximum(1e-9,np.sum(diff*diff,axis=1))[None],0,1)
        d = np.linalg.norm(points[:, None]-(e0[None]+t[..., None]*diff[None]),axis=2)
        value += THROUGH_NODE * (d < self.sizes[q]/2 + .15).sum(axis=1)
        value[invalid] = np.inf
        return value

    def candidates(self, q, sweep):
        current = self.xy[q]
        near = self.xy[self.neighbors[q]]
        center = near.mean(axis=0)
        angles = np.arange(24) * math.tau / 24
        directions = np.column_stack((np.cos(angles), np.sin(angles)))
        points = [current[None], center[None]]
        for origin in [current, center, *near[:4]]:
            for radius in (1.5, 2.25, 3.0, 4.5, 6.0, 7.5):
                points.append(origin + radius * directions)
        # A regular lattice encourages local rows, without forcing disconnected
        # parts of one branch onto opposite sides of the canvas.
        xs = np.arange(center[0]-7.5, center[0]+7.6, 1.5)
        ys = np.arange(center[1]-7.5, center[1]+7.6, 1.5)
        points.append(np.array([(x,y) for x in xs for y in ys]))
        candidates=np.unique(np.round(np.concatenate(points), 2), axis=0)
        if self.main[q]:
            candidates=candidates[np.linalg.norm(candidates-self.original[q],axis=1)<=12.0]
        return candidates

    def swaps(self):
        best_cost=self.global_cost()
        moved=0
        off=np.array([q for q in range(len(self.ids)) if len(self.neighbors[q])])
        for q in self.rng.permutation(off):
            choices=sorted((r for r in off if r!=q),key=lambda r: np.linalg.norm(self.xy[q]-self.xy[r]))[:24]
            for r in choices:
                old_q,old_r=self.xy[q].copy(),self.xy[r].copy()
                self.xy[q],self.xy[r]=old_r,old_q
                score=self.global_cost() if self.clear() else np.inf
                if score+.01<best_cost:
                    best_cost=score;moved+=1
                    break
                self.xy[q],self.xy[r]=old_q,old_r
        return moved

    def move_groups(self):
        moved=0
        best_cost=self.global_cost()
        transforms=[np.array([[1,0],[0,1]]),np.array([[-1,0],[0,1]]),
                    np.array([[1,0],[0,-1]]),np.array([[-1,0],[0,-1]]),
                    np.array([[0,-1],[1,0]]),np.array([[0,1],[-1,0]])]
        shifts=[np.array([0.,0.])]+[np.array([math.cos(a),math.sin(a)])*r
                 for r in (2.25,4.5,7.5,10.5,15.0,21.0,30.0,42.0) for a in np.arange(8)*math.tau/8]
        lines=self.xy[self.edges]
        a,b=lines[self.pairs[:,0],0],lines[self.pairs[:,0],1]
        c,d=lines[self.pairs[:,1],0],lines[self.pairs[:,1],1]
        crossed=(cross2(b-a,c-a)*cross2(b-a,d-a)<-1e-8)&(cross2(d-c,a-c)*cross2(d-c,b-c)<-1e-8)
        groups=list(self.groups)
        for e0,e1 in self.pairs[crossed]:
            ends=list(self.edges[e0])+list(self.edges[e1])
            groups.extend(np.array(pair) for pair in combinations(ends,2))
            groups.append(np.array(ends))
        for a,b in self.edges[np.linalg.norm(lines[:,0]-lines[:,1],axis=1)>7.5]:
            groups.append(np.array([a,b]))
        for (a,b),line in zip(self.edges,lines):
            delta=line[1]-line[0]
            t=np.clip(np.sum((self.xy-line[0])*delta,axis=1)/max(1e-9,np.sum(delta*delta)),0,1)
            near=np.linalg.norm(self.xy-(line[0]+t[:,None]*delta),axis=1)<self.sizes/2+.15
            near[[a,b]]=False
            for q in np.where(near)[0]:
                groups.extend((np.array([a,q]),np.array([b,q]),np.array([a,b,q])))
        groups={tuple(sorted(group)):group for group in groups}
        for group in sorted(groups.values(),key=len):
            original=self.xy[group].copy()
            center=original.mean(axis=0)
            best=original
            for transform in transforms:
                shape=(original-center)@transform
                for shift in shifts:
                    self.xy[group]=np.round(shape+center+shift,2)
                    if not self.clear():
                        continue
                    score=self.global_cost()
                    if score+.01<best_cost:
                        best_cost=score;best=self.xy[group].copy()
            self.xy[group]=best
            if not np.array_equal(best,original):moved+=1
        return moved

    def refine(self, sweeps=24):
        off = np.array([q for q in range(len(self.ids)) if len(self.neighbors[q])])
        for sweep in range(sweeps):
            moved = 0
            order = sorted(off, key=lambda q: -len(self.neighbors[q])) if sweep % 3 == 0 else self.rng.permutation(off)
            for q in order:
                points = self.candidates(q, sweep)
                scores = np.concatenate([self.costs(q, chunk) for chunk in np.array_split(points, max(1, len(points)//180))])
                current_cost = self.costs(q, self.xy[q])[0]
                best = int(np.argmin(scores))
                if scores[best] + .01 < current_cost:
                    self.xy[q] = points[best]
                    moved += 1
            if sweep%3==2 or not moved:
                moved+=self.swaps()
                moved+=self.move_groups()
            print(sweep+1, moved, self.summary(), flush=True)
            if not moved:
                break


def optimize(index, seed_file=None):
    quests = read_chapters()
    filename = MAIN_FILES[index]
    chapter = {k:v for k,v in quests.items() if v["chapter"]==filename}
    manifest = json.loads((ROOT/"design/quest-layout.json").read_text(encoding="utf-8"))
    candidate=OUT/seed_file if seed_file else OUT/f"{index+1}-nodes.json"
    nodes = json.loads(candidate.read_text(encoding="utf-8")) if candidate.exists() else copy.deepcopy(manifest[filename])
    path = mainline_order(chapter,EXITS[index])
    refiner=Refiner(chapter,nodes,path)
    print("START",index+1,refiner.summary(),flush=True)
    refiner.refine()
    for qid,point in zip(refiner.ids,refiner.xy):
        nodes[qid].update(x=round(float(point[0]),2),y=round(float(point[1]),2),hide_dependent_lines=False)
    OUT.mkdir(parents=True,exist_ok=True)
    (OUT/f"{index+1}-nodes.json").write_text(json.dumps(nodes,ensure_ascii=False,indent=2)+"\n",encoding="utf-8")
    print("FINAL",refiner.summary(),flush=True)


def graph(chapter):
    return [(a, b) for b, q in chapter.items() for a in q["dependencies"] if a in chapter]


def crossing_pairs(edges, nodes):
    return [(a, b, c, d) for (a, b), (c, d) in combinations(edges, 2)
            if len({a, b, c, d}) == 4 and intersects(
                (nodes[a]["x"], nodes[a]["y"]), (nodes[b]["x"], nodes[b]["y"]),
                (nodes[c]["x"], nodes[c]["y"]), (nodes[d]["x"], nodes[d]["y"]))]


def inspect():
    quests = read_chapters()
    manifest = json.loads((ROOT / "design/quest-layout.json").read_text(encoding="utf-8"))
    for index, filename in enumerate(MAIN_FILES):
        chapter = {k: v for k, v in quests.items() if v["chapter"] == filename}
        path = mainline_order(chapter, EXITS[index])
        edges = graph(chapter)
        crossings = crossing_pairs(edges, manifest[filename])
        print(f"CHAPTER {index + 1}: {len(edges)} edges, {len(crossings)} crossings, "
              f"{sum((a not in path or b not in path) and (c not in path or d not in path) for a,b,c,d in crossings)} branch-pair crossings")
        for comp in sorted(branch_components(chapter, set(path)), key=lambda group: -len(group)):
            if len(comp) > 2:
                print("GROUP", len(comp))
                for qid in sorted(comp):
                    print(qid[:6], chapter[qid]["title"], "<-", ", ".join(
                        ("MAIN:" if a in path else "") + a[:6] + ":" + chapter[a]["title"]
                        for a in chapter[qid]["dependencies"] if a in chapter))
        print("CROSSINGS")
        for a, b, c, d in crossings:
            print(" / ".join(" -> ".join(chapter[k]["title"] + ("[M]" if k in path else "")
                                        for k in edge) for edge in ((a, b), (c, d))))


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("mode", choices=("inspect", "optimize", "preview", "apply", "check"))
    parser.add_argument("chapter", nargs="?", type=int, default=1)
    parser.add_argument("--seed")
    arguments = parser.parse_args()
    if arguments.mode == "inspect":
        inspect()
    elif arguments.mode=='optimize':
        optimize(arguments.chapter-1,arguments.seed)
    elif arguments.mode=='preview':
        preview()
    else:
        apply_or_check(arguments.mode)
