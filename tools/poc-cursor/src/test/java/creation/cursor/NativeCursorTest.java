package creation.cursor;

import java.util.ArrayList;
import java.util.List;
import org.lwjgl.glfw.GLFW;
import org.lwjgl.glfw.GLFWErrorCallback;

public final class NativeCursorTest {
    public static void main(String[] args) throws Exception {
        List<String> errors=new ArrayList<>();
        GLFWErrorCallback callback=GLFWErrorCallback.create((code,text)->errors.add(code+": "+GLFWErrorCallback.getDescription(text)));
        callback.set();
        if(!GLFW.glfwInit()) throw new AssertionError("GLFW init failed: "+errors);
        long window=0;
        try {
            GLFW.glfwWindowHint(GLFW.GLFW_VISIBLE,GLFW.GLFW_FALSE);
            window=GLFW.glfwCreateWindow(320,200,"POC Cursor native test",0,0);
            if(window==0) throw new AssertionError("Hidden window failed: "+errors);
            GlfwCursor access=new GlfwCursor(new FancyCursorCompat(NativeCursorTest.class.getClassLoader(),errors::add),errors::add);
            int before=GLFW.glfwGetInputMode(window,GLFW.GLFW_CURSOR);
            for(int i=0;i<100;i++) {
                long cursor=access.create(); assert cursor!=0;
                access.set(window,cursor); access.set(window,0); access.destroy(cursor);
            }
            assert before==GLFW.glfwGetInputMode(window,GLFW.GLFW_CURSOR);
            if(!errors.isEmpty()) throw new AssertionError(errors.toString());
            System.out.println("PASS: 100 real GLFW RGBA cursor create/set/restore/destroy cycles; input mode unchanged; zero native errors");
        } finally {
            if(window!=0) GLFW.glfwDestroyWindow(window);
            GLFW.glfwTerminate(); GLFW.glfwSetErrorCallback(null); callback.free();
        }
    }
}
