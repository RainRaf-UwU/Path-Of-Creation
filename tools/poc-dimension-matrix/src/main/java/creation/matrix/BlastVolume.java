package creation.matrix;

/** 11×11×11 个16格区块单元；水平按区块对齐，纵向按区块节对齐并裁到世界边界。 */
public record BlastVolume(int minChunkX,int minY,int minChunkZ,int maxY) {
    public static final int CHUNKS=11,SIZE=CHUNKS*16;
    private static final int[] ORDER=java.util.stream.IntStream.range(0,121).boxed().sorted(java.util.Comparator.<Integer>comparingInt(i->Math.max(Math.abs(i%11-5),Math.abs(i/11-5))).thenComparingInt(i->(i%11-5)*(i%11-5)+(i/11-5)*(i/11-5))).mapToInt(Integer::intValue).toArray();
    public static BlastVolume around(int x,int y,int z,int worldMin,int worldMax){
        int section=Math.floorDiv(y,16);
        return new BlastVolume(Math.floorDiv(x,16)-5,Math.max(worldMin,(section-5)*16),Math.floorDiv(z,16)-5,Math.min(worldMax,(section+6)*16));
    }
    public int perChunk(){return (maxY-minY)*256;}
    public int cells(){return CHUNKS*CHUNKS*perChunk();}
    public int chunkX(int cursor){return minChunkX+ORDER[cursor/perChunk()]%CHUNKS;}
    public int chunkZ(int cursor){return minChunkZ+ORDER[cursor/perChunk()]/CHUNKS;}
    public int x(int cursor){return chunkX(cursor)*16+cursor%16;}
    public int z(int cursor){return chunkZ(cursor)*16+cursor/16%16;}
    public int y(int cursor){return minY+cursor%perChunk()/256;}
    public boolean contains(double x,double y,double z){return x>=minChunkX*16&&x<(minChunkX+CHUNKS)*16&&z>=minChunkZ*16&&z<(minChunkZ+CHUNKS)*16&&y>=minY&&y<maxY;}
}
