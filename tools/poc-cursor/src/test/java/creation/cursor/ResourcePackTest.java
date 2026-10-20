package creation.cursor;

import java.awt.image.BufferedImage;
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.StringReader;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.ArrayList;
import java.util.List;
import javax.imageio.ImageIO;

public final class ResourcePackTest {
    private static final String PROFILE = "{\"hotspot_x\":1,\"hotspot_y\":2,\"click_colors\":{"
            + "\"left\":\"#112233\",\"right\":\"#445566\",\"middle\":\"#778899\"}}";

    private static byte[] png(int width, int height, int type) throws Exception {
        var bytes = new ByteArrayOutputStream();
        ImageIO.write(new BufferedImage(width, height, type), "png", bytes);
        return bytes.toByteArray();
    }

    private static CursorTheme read(String profile, byte[] bytes) throws Exception {
        return CursorTheme.read(new StringReader(profile), new ByteArrayInputStream(bytes));
    }

    private static void invalid(String profile, byte[] bytes) throws Exception {
        boolean rejected = false;
        try { read(profile, bytes); } catch (Exception expected) { rejected = true; }
        assert rejected : "Invalid profile/image was accepted";
    }

    public static void main(String[] args) throws Exception {
        Path pack = Path.of(args[0]);
        try (var reader = Files.newBufferedReader(pack.resolve("assets/poc_cursor/cursor.json"));
             var image = Files.newInputStream(pack.resolve("assets/poc_cursor/textures/cursor.png"))) {
            CursorTheme installed = CursorTheme.read(reader, image);
            assert installed.image().getWidth() == 48 && installed.hotspotX() == 24 && installed.hotspotY() == 24;
            assert installed.leftColor() == 0x58D9EA;
        }
        byte[] image = png(16, 32, BufferedImage.TYPE_INT_ARGB);
        CursorTheme changed = read(PROFILE, image);
        assert changed.hotspotX() == 1 && changed.hotspotY() == 2 && changed.rightColor() == 0x445566;
        invalid(PROFILE.replace("\"hotspot_x\":1", "\"hotspot_x\":16"), image);
        invalid(PROFILE.replace("\"hotspot_y\":2", "\"hotspot_y\":-1"), image);
        invalid(PROFILE.replace("\"hotspot_x\":1", "\"hotspot_x\":1.5"), image);
        invalid(PROFILE.replace("#112233", "#XX2233"), image);
        invalid("{}", image);
        invalid(PROFILE, new byte[]{1, 2, 3});
        invalid(PROFILE, png(257, 32, BufferedImage.TYPE_INT_ARGB));
        invalid(PROFILE, png(16, 32, BufferedImage.TYPE_INT_RGB));

        CursorTest.Fake nativeApi = new CursorTest.Fake();
        CursorController controller = new CursorController(nativeApi);
        controller.update(1, true);
        controller.reload(1); // Resource reload must restore before destroying the old handle.
        assert nativeApi.current == 0 && nativeApi.destroys == 1;
        controller.update(1, true);
        assert nativeApi.creates == 2 && nativeApi.current == 77;
        controller.reload(1);
        controller.update(1, false); // Deselection leaves the original cursor and creates nothing.
        assert nativeApi.current == 0 && nativeApi.creates == 2 && nativeApi.destroys == 2;
        nativeApi.created = 0;
        controller.update(1, true);
        assert nativeApi.creates == 3;
        nativeApi.created = 77;
        controller.reload(1); // A fixed resource pack may recover from a previous creation failure.
        controller.update(1, true);
        assert nativeApi.current == 77 && nativeApi.creates == 4;
        controller.close(1);

        var rings = new ClickEffects();
        rings.context("screen", 100, 100, true);
        rings.colors(changed.leftColor(), changed.rightColor(), changed.middleColor());
        rings.click(50, 50, 0, 1);
        int[] drawnColor = {0};
        rings.render(2, 100, (a,b,c,d,e,f,g,h,color) -> drawnColor[0] = color & 0xFFFFFF);
        assert drawnColor[0] == 0x112233;
        rings.context(null, 0, 0, false);
        assert rings.size() == 0;

        Path temporary = Files.createTempDirectory("poc-ui-defaults-");
        Path marker = temporary.resolve("local/poc-ui/default-selection-v1");
        List<List<String>> applications = new ArrayList<>();
        List<String> previous = List.of("vanilla", "file/player-pack.zip");
        assert !DefaultPackSelection.initialize(marker, List.of("vanilla"), previous, applications::add);
        assert !Files.exists(marker) && applications.isEmpty();
        assert DefaultPackSelection.initialize(marker, List.of(DefaultPackSelection.PACK_ID), previous, applications::add);
        assert applications.equals(List.of(List.of("vanilla", "file/player-pack.zip", DefaultPackSelection.PACK_ID)));
        assert previous.equals(List.of("vanilla", "file/player-pack.zip"));
        // Simulate a restart after the player has disabled the pack.
        assert DefaultPackSelection.initialize(marker, List.of(DefaultPackSelection.PACK_ID), previous, applications::add);
        assert applications.size() == 1;
        Files.delete(marker);
        List<String> alreadySelected = List.of("vanilla", DefaultPackSelection.PACK_ID, "file/player-pack.zip");
        assert DefaultPackSelection.initialize(marker, alreadySelected, alreadySelected, applications::add);
        assert applications.size() == 1; // Existing pack priority remains the player's choice.
        Files.delete(marker);
        try {
            DefaultPackSelection.initialize(marker, alreadySelected, previous, next -> { throw new IllegalStateException("save failed"); });
            throw new AssertionError("Selection failure was swallowed");
        } catch (IllegalStateException expected) { assert !Files.exists(marker); }
        Files.delete(marker.getParent()); Files.delete(marker.getParent().getParent()); Files.delete(temporary);
        System.out.println("PASS: installed cursor, alternate texture/hotspot/colors, invalid resources, reload/deselection/recovery, one-time defaults and player choice preservation");
    }
}
