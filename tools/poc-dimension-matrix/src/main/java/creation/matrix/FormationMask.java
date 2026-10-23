package creation.matrix;

import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

/** 主线程维护所属结构，区块网格工作线程只读；重叠成员使用引用计数。 */
public final class FormationMask {
    private final Map<Long,Set<Long>> owners=new HashMap<>();
    private final ConcurrentHashMap<Long,Integer> members=new ConcurrentHashMap<>();
    private final Set<Long> controllers=ConcurrentHashMap.newKeySet();
    public boolean hidden(long position){return members.containsKey(position);}
    public boolean controller(long position){return controllers.contains(position);}
    public Set<Long> update(long owner,Set<Long> next){
        var old=owners.getOrDefault(owner,Set.of());Set<Long> changed=new HashSet<>();
        for(long p:old)if(!next.contains(p))members.compute(p,(key,n)->{if(n==null||n<=1){changed.add(key);return null;}return n-1;});
        for(long p:next)if(!old.contains(p))members.compute(p,(key,n)->{if(n==null)changed.add(key);return n==null?1:n+1;});
        if(next.isEmpty()){owners.remove(owner);controllers.remove(owner);}else{owners.put(owner,Set.copyOf(next));controllers.add(owner);}
        return changed;
    }
    public Set<Long> clear(){var previous=Set.copyOf(members.keySet());owners.clear();members.clear();controllers.clear();return previous;}
    public int size(){return members.size();}
}
