package creation.matrix;

import creation.matrix.jei.*;
import com.google.gson.*;
import java.nio.*;
import java.nio.file.*;
import java.util.*;
import java.util.zip.ZipFile;
import java.awt.Color;
import java.awt.Font;
import java.awt.image.BufferedImage;
import javax.imageio.ImageIO;
import org.joml.*;
import org.lwjgl.BufferUtils;
import org.lwjgl.opengl.GL;
import static org.lwjgl.glfw.GLFW.*;
import static org.lwjgl.opengl.GL33C.*;

/** 隐藏GLFW窗口的离线像素检查：原版GUI着色器、24字节顶点格式及生产投影矩阵。没有启动Minecraft。 */
public final class GpuBlueprintProbe {
    private record Face(float[] vertices,float depth,int texture,float shade) { }
    private static final int[][][] FACES={{{0,1,0},{0,1,1},{1,1,1},{1,1,0}},{{0,0,1},{0,0,0},{1,0,0},{1,0,1}},{{0,0,0},{0,1,0},{1,1,0},{1,0,0}},{{1,0,1},{1,1,1},{0,1,1},{0,0,1}},{{1,0,0},{1,1,0},{1,1,1},{1,0,1}},{{0,0,1},{0,1,1},{0,1,0},{0,0,0}}};
    private static int shader(int type,String source){int id=glCreateShader(type);glShaderSource(id,source);glCompileShader(id);if(glGetShaderi(id,GL_COMPILE_STATUS)==0)throw new AssertionError(glGetShaderInfoLog(id));return id;}
    private static int texture(Path path)throws Exception{
        var image=ImageIO.read(path.toFile());var data=BufferUtils.createByteBuffer(image.getWidth()*image.getHeight()*4);
        for(int y=0;y<image.getHeight();y++)for(int x=0;x<image.getWidth();x++){int c=image.getRGB(x,y);data.put((byte)(c>>16)).put((byte)(c>>8)).put((byte)c).put((byte)(c>>24));}data.flip();
        int id=glGenTextures();glBindTexture(GL_TEXTURE_2D,id);glTexImage2D(GL_TEXTURE_2D,0,GL_RGBA8,image.getWidth(),image.getHeight(),0,GL_RGBA,GL_UNSIGNED_BYTE,data);
        glTexParameteri(GL_TEXTURE_2D,GL_TEXTURE_MIN_FILTER,GL_NEAREST);glTexParameteri(GL_TEXTURE_2D,GL_TEXTURE_MAG_FILTER,GL_NEAREST);return id;
    }
    public static void main(String[] args)throws Exception{
        Path root=Path.of(args[0]),extra=Path.of(args[1]),dest=Path.of(args[2]);Files.createDirectories(dest);
        if(!glfwInit())throw new IllegalStateException("GLFW unavailable");
        glfwWindowHint(GLFW_VISIBLE,GLFW_FALSE);glfwWindowHint(GLFW_CONTEXT_VERSION_MAJOR,3);glfwWindowHint(GLFW_CONTEXT_VERSION_MINOR,2);glfwWindowHint(GLFW_OPENGL_PROFILE,GLFW_OPENGL_CORE_PROFILE);
        long window=glfwCreateWindow(704,840,"Offline blueprint shader probe",0,0);if(window==0)throw new IllegalStateException("No hidden GL context");
        try{
            glfwMakeContextCurrent(window);GL.createCapabilities();String vertex,fragment;
            try(var zip=new ZipFile(extra.toFile())){vertex=new String(zip.getInputStream(zip.getEntry("assets/minecraft/shaders/core/position_tex_color.vsh")).readAllBytes());fragment=new String(zip.getInputStream(zip.getEntry("assets/minecraft/shaders/core/position_tex_color.fsh")).readAllBytes());}
            int program=glCreateProgram();glAttachShader(program,shader(GL_VERTEX_SHADER,vertex));glAttachShader(program,shader(GL_FRAGMENT_SHADER,fragment));
            glBindAttribLocation(program,0,"Position");glBindAttribLocation(program,1,"UV0");glBindAttribLocation(program,2,"Color");glBindFragDataLocation(program,0,"fragColor");glLinkProgram(program);
            if(glGetProgrami(program,GL_LINK_STATUS)==0)throw new AssertionError(glGetProgramInfoLog(program));glUseProgram(program);
            float[] values=new float[16];glUniformMatrix4fv(glGetUniformLocation(program,"ProjMat"),false,new Matrix4f().ortho(0,176,210,0,-1000,1000).get(values));
            glUniformMatrix4fv(glGetUniformLocation(program,"ModelViewMat"),false,new Matrix4f().get(values));glUniform4f(glGetUniformLocation(program,"ColorModulator"),1,1,1,1);glUniform1i(glGetUniformLocation(program,"Sampler0"),0);
            int vao=glGenVertexArrays();glBindVertexArray(vao);int buffer=glGenBuffers();glBindBuffer(GL_ARRAY_BUFFER,buffer);
            glEnableVertexAttribArray(0);glVertexAttribPointer(0,3,GL_FLOAT,false,24,0);glEnableVertexAttribArray(1);glVertexAttribPointer(1,2,GL_FLOAT,false,24,12);glEnableVertexAttribArray(2);glVertexAttribPointer(2,4,GL_UNSIGNED_BYTE,true,24,20);
            var data=JsonParser.parseString(Files.readString(root.resolve("kubejs/data/rain/dimension_matrix/structure.json"))).getAsJsonObject();
            var pattern=new ArrayList<List<String>>();for(var floor:data.getAsJsonArray("pattern")){var rows=new ArrayList<String>();for(var line:floor.getAsJsonArray())rows.add(line.getAsString());pattern.add(rows);}
            var keys=new HashMap<Character,List<String>>();data.getAsJsonObject("keys").entrySet().forEach(e->{var list=new ArrayList<String>();if(e.getValue().isJsonArray())for(var item:e.getValue().getAsJsonArray())list.add(item.getAsString());else list.add(e.getValue().getAsString());keys.put(e.getKey().charAt(0),list);});
            var plan=new Blueprint(pattern,keys);var matrix=new BlueprintView().matrix(plan);var textures=new HashMap<String,Integer>();var faces=new ArrayList<Face>();
            for(var cell:plan.cells){
                String id=cell.choices().getFirst();if(Blueprint.air(id))continue;
                Path texture=id.equals("$controller")?root.resolve("kubejs/assets/rain/textures/block/dimension_matrix_controller.png"):
                    id.startsWith("poc_dimension_matrix:")?root.resolve("tools/poc-dimension-matrix/src/main/resources/assets/poc_dimension_matrix/textures/block/"+id.split(":")[1]+".png"):
                    root.resolve("kubejs/assets/rain/textures/block/"+id.split(":")[1]+".png");
                int tex;if(textures.containsKey(id))tex=textures.get(id);else{tex=texture(texture);textures.put(id,tex);}
                for(int side=0;side<6;side++){
                    float[] points=new float[12];float depth=0;
                    for(int i=0;i<4;i++){var raw=FACES[side][i];var p=matrix.transformPosition(new Vector3f(cell.x()+raw[0],cell.y()+raw[1],cell.z()+raw[2]));points[i*3]=p.x;points[i*3+1]=p.y;points[i*3+2]=0;depth+=p.z/4;}
                    faces.add(new Face(points,depth,tex,side==0?1:side==1?.5f:side>=4?.7f:.85f));
                }
            }
            faces.sort(Comparator.comparingDouble(Face::depth));glViewport(0,0,704,840);glDisable(GL_DEPTH_TEST);glDisable(GL_CULL_FACE);glEnable(GL_BLEND);glBlendFunc(GL_SRC_ALPHA,GL_ONE_MINUS_SRC_ALPHA);glClearColor(16/255f,28/255f,42/255f,1);glClear(GL_COLOR_BUFFER_BIT);
            glEnable(GL_SCISSOR_TEST);glScissor(3*4,(210-128)*4,170*4,97*4);
            var vertices=BufferUtils.createByteBuffer(6*24);int[] indices={0,1,2,0,2,3};float[][] uv={{0,1},{0,0},{1,0},{1,1}};
            for(var face:faces){
                vertices.clear();for(int index:indices){vertices.putFloat(face.vertices[index*3]).putFloat(face.vertices[index*3+1]).putFloat(0).putFloat(uv[index][0]).putFloat(uv[index][1]);byte color=(byte)(255*face.shade);vertices.put(color).put(color).put(color).put((byte)255);}vertices.flip();
                glBindTexture(GL_TEXTURE_2D,face.texture);glBufferData(GL_ARRAY_BUFFER,vertices,GL_STREAM_DRAW);glDrawArrays(GL_TRIANGLES,0,6);
            }glDisable(GL_SCISSOR_TEST);glFinish();
            var pixels=BufferUtils.createByteBuffer(704*840*4);glReadPixels(0,0,704,840,GL_RGBA,GL_UNSIGNED_BYTE,pixels);
            var image=new BufferedImage(704,840,BufferedImage.TYPE_INT_RGB);int changed=0;
            for(int y=0;y<840;y++)for(int x=0;x<704;x++){int i=((839-y)*704+x)*4,r=pixels.get(i)&255,g=pixels.get(i+1)&255,b=pixels.get(i+2)&255;image.setRGB(x,y,(r<<16)|(g<<8)|b);if(r!=16||g!=28||b!=42)changed++;}
            if(changed<20000)throw new AssertionError("Blank GUI render: "+changed);
            var graphics=image.createGraphics();graphics.setColor(new Color(207,239,247));graphics.setFont(new Font("Microsoft YaHei",Font.PLAIN,28));graphics.drawString("维度方阵 · 新结构预览",32,70);
            graphics.setFont(new Font("Microsoft YaHei",Font.PLAIN,19));graphics.drawString("11×11×11 / 底座4个高维投影模块",32,102);
            graphics.setFont(new Font("Microsoft YaHei",Font.PLAIN,25));int[] xs={16,124,228,492,600},widths={88,88,248,88,88};String[] labels={"<","−","全部 / 重置","+",">"};
            for(int i=0;i<5;i++){graphics.setColor(new Color(31,52,69));graphics.fillRect(xs[i],528,widths[i],60);graphics.setColor(new Color(207,239,247));graphics.drawString(labels[i],xs[i]+15,567);}
            graphics.setFont(new Font("Microsoft YaHei",Font.PLAIN,22));graphics.drawString("滚轮缩放 · 左拖旋转 · 右拖平移 · 悬停显示方块名",26,630);
            graphics.drawString("装甲56 / 框架148 / 导轨101 / 节点28 / 投影模块4",26,675);graphics.drawString("左墙输入 · 右墙输出 · 背墙冷却液（默认水）",26,714);
            graphics.setColor(new Color(116,157,179));graphics.setFont(new Font("Microsoft YaHei",Font.PLAIN,19));graphics.drawString("离线原版GUI着色器像素检查；方块以源贴图立方体表示",26,778);graphics.drawString("非游戏截图；未打开存档或触发爆炸",26,810);graphics.dispose();
            ImageIO.write(image,"PNG",dest.resolve("jei-blueprint-offline.png").toFile());
            System.out.println("PASS hidden GPU GUI pipeline: installed vanilla position_tex_color shaders / 24-byte vertex layout / production BlueprintView / "+faces.size()+" textured source cube faces / "+changed+" non-background pixels; no Minecraft launched");
        }finally{glfwDestroyWindow(window);glfwTerminate();}
    }
}
