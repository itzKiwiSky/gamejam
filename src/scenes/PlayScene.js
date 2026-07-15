import k from "../Engine";

k.scene("playscene", () => {
    const bean = k.add([
        k.pos(k.center()),
        k.sprite("nd"),
        k.rotate(),
        k.anchor("center")
    ]);

    bean.onUpdate(() => {
        bean.pos.y = k.wave(400, 30, k.time() + 2);
        bean.angle = k.wave(-10, 10, k.time() + 2)
    });

    // write more of your stuff here :3 //
});