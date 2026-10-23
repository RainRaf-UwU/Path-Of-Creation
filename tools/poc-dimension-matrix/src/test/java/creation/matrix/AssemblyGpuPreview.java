package creation.matrix;
import java.nio.*;import java.nio.file.*;import java.util.*;import java.awt.image.BufferedImage;import javax.imageio.ImageIO;
import org.joml.Matrix4f;import org.joml.Vector3f;import org.lwjgl.BufferUtils;import org.lwjgl.opengl.GL;
import static org.lwjgl.glfw.GLFW.*;import static org.lwjgl.opengl.GL33C.*;
/** 离线隐藏GLFW窗口，直接绘制生产整机网格；深度、透明和加色三条管线与生产一致。 */
public final class AssemblyGpuPreview {
    private static int shader(int type,String source){int s=glCreateShader(type);glShaderSource(s,source);glCompileShader(s);if(glGetShaderi(s,GL_COMPILE_STATUS)==0)throw new IllegalStateException(glGetShaderInfoLog(s));return s;}
    private static void upload(List<float[]> vertices,int mode){FloatBuffer data=BufferUtils.createFloatBuffer(vertices.size()*7);for(var v:vertices)data.put(v);data.flip();glBufferData(GL_ARRAY_BUFFER,data,GL_STREAM_DRAW);glDrawArrays(mode,0,vertices.size());}
    private static List<float[]> triangles(List<FormedMachineScene.Quad> mesh,int layer){var result=new ArrayList<float[]>();for(var q:mesh)if(q.layer()==layer)for(int i:new int[]{0,1,2,0,2,3}){var p=q.p()[i];var c=q.color();result.add(new float[]{(float)p[0],(float)p[1],(float)p[2],c[0],c[1],c[2],c[3]});}return result;}
    public static void main(String[] args)throws Exception{
        Path out=Path.of(args[0]);boolean still=Arrays.asList(args).contains("--static");Files.createDirectories(out);
        if(!glfwInit())throw new IllegalStateException("GLFW unavailable");glfwWindowHint(GLFW_VISIBLE,GLFW_FALSE);glfwWindowHint(GLFW_CONTEXT_VERSION_MAJOR,3);glfwWindowHint(GLFW_CONTEXT_VERSION_MINOR,3);glfwWindowHint(GLFW_OPENGL_PROFILE,GLFW_OPENGL_CORE_PROFILE);glfwWindowHint(GLFW_SAMPLES,4);
        int width=800,height=600;long window=glfwCreateWindow(width,height,"POC offline formed model",0,0);if(window==0)throw new IllegalStateException("Hidden GL context unavailable");
        try{glfwMakeContextCurrent(window);GL.createCapabilities();int program=glCreateProgram();glAttachShader(program,shader(GL_VERTEX_SHADER,"#version 330 core\nlayout(location=0)in vec3 Position;layout(location=1)in vec4 Color;uniform mat4 MVP;out vec4 tint;void main(){gl_Position=MVP*vec4(Position,1.0);tint=Color;}"));glAttachShader(program,shader(GL_FRAGMENT_SHADER,"#version 330 core\nin vec4 tint;out vec4 color;void main(){color=tint;}"));glLinkProgram(program);if(glGetProgrami(program,GL_LINK_STATUS)==0)throw new IllegalStateException(glGetProgramInfoLog(program));glUseProgram(program);
            int vao=glGenVertexArrays(),vbo=glGenBuffers();glBindVertexArray(vao);glBindBuffer(GL_ARRAY_BUFFER,vbo);glEnableVertexAttribArray(0);glEnableVertexAttribArray(1);glVertexAttribPointer(0,3,GL_FLOAT,false,28,0);glVertexAttribPointer(1,4,GL_FLOAT,false,28,12);glViewport(0,0,width,height);glEnable(GL_DEPTH_TEST);glDepthFunc(GL_LEQUAL);glDisable(GL_CULL_FACE);glEnable(GL_MULTISAMPLE);
            for(var l:MachineFx.LAYOUTS){if(l.family.equals("inspector")||l.effect.equals("time"))continue;
                double minX=-l.originX-.5,maxX=l.pattern.getFirst().getFirst().length()-l.originX-.5,minY=-l.originY-.5,maxY=l.pattern.size()-l.originY-.5,minZ=-l.originZ-.5,maxZ=l.pattern.getFirst().size()-l.originZ-.5;
                var center=new Vector3f((float)((minX+maxX)/2),(float)((minY+maxY)/2),(float)((minZ+maxZ)/2));var eye=new Vector3f(center).add(90,63,90);var view=new Matrix4f().lookAt(eye,center,new Vector3f(0,1,0));float loX=Float.POSITIVE_INFINITY,hiX=-loX,loY=loX,hiY=-loX;
                for(double x:new double[]{minX,maxX})for(double y:new double[]{minY,maxY})for(double z:new double[]{minZ,maxZ}){var p=view.transformPosition(new Vector3f((float)x,(float)y,(float)z));loX=Math.min(loX,p.x);hiX=Math.max(hiX,p.x);loY=Math.min(loY,p.y);hiY=Math.max(hiY,p.y);}
                float extentX=(hiX-loX)*.56f,extentY=(hiY-loY)*.56f,aspect=width/(float)height;if(extentX/extentY<aspect)extentX=extentY*aspect;else extentY=extentX/aspect;float midX=(loX+hiX)/2,midY=(loY+hiY)/2;var mvp=new Matrix4f().ortho(midX-extentX,midX+extentX,midY-extentY,midY+extentY,.1f,500).mul(view);FloatBuffer matrix=BufferUtils.createFloatBuffer(16);mvp.get(matrix);glUniformMatrix4fv(glGetUniformLocation(program,"MVP"),false,matrix);
                Path target=out.resolve(l.id);Files.createDirectories(target);var state=new MachineFx.State();state.layout=l.index;
                for(int frame=0;frame<64;frame++){
                    state.flags=frame<8?0:frame<24?1:frame<48?7:frame<56?3:0;if(l.id.equals("fluid-2")&&frame>=40&&frame<56)state.flags|=8;
                    for(int tick=0;tick<5;tick++)state.advance(.025);if((state.flags&1)==0||still&&frame!=16&&frame!=36&&frame!=44)continue;
                    glDepthMask(true);glClearColor(9/255f,18/255f,28/255f,1);glClear(GL_COLOR_BUFFER_BIT|GL_DEPTH_BUFFER_BIT);glDisable(GL_BLEND);
                    List<float[]> grid=new ArrayList<>();for(int k=-60;k<=60;k+=2)for(float[] p:new float[][]{{k,(float)minY-.04f,-60},{k,(float)minY-.04f,60},{-60,(float)minY-.04f,k},{60,(float)minY-.04f,k}})grid.add(new float[]{p[0],p[1],p[2],.07f,.13f,.18f,1});glDepthMask(false);upload(grid,GL_LINES);glDepthMask(true);
                    var mesh=FormedMachineScene.mesh(l,state);upload(triangles(mesh,0),GL_TRIANGLES);glEnable(GL_BLEND);glBlendFunc(GL_SRC_ALPHA,GL_ONE_MINUS_SRC_ALPHA);glDepthMask(false);
                    var sorted=new ArrayList<>(mesh);sorted.sort(Comparator.comparingDouble(q->{double sum=0;for(var p:q.p())sum+=view.transformPosition(new Vector3f((float)p[0],(float)p[1],(float)p[2])).z;return sum;}));upload(triangles(sorted,1),GL_TRIANGLES);
                    glBlendFunc(GL_SRC_ALPHA,GL_ONE);upload(triangles(mesh,2),GL_TRIANGLES);glFinish();ByteBuffer pixels=BufferUtils.createByteBuffer(width*height*4);glReadPixels(0,0,width,height,GL_RGBA,GL_UNSIGNED_BYTE,pixels);BufferedImage image=new BufferedImage(width,height,BufferedImage.TYPE_INT_RGB);for(int y=0;y<height;y++)for(int x=0;x<width;x++){int i=((height-1-y)*width+x)*4;image.setRGB(x,y,((pixels.get(i)&255)<<16)|((pixels.get(i+1)&255)<<8)|(pixels.get(i+2)&255));}ImageIO.write(image,"PNG",target.resolve(String.format("%03d.png",frame)).toFile());
                }
                System.out.println("GPU depth preview "+l.id);
            }
            glDeleteBuffers(vbo);glDeleteVertexArrays(vao);glDeleteProgram(program);
        }finally{glfwDestroyWindow(window);glfwTerminate();}
    }
}
