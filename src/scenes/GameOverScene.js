import k from "../Engine";

k.scene("gameoverscene", () => {
    const bg = k.add([
        k.sprite("gameover"),
        k.pos(k.center()),
        k.anchor("center"),
        k.scale(1),
    ])
    bg.scale.x = k.width() / bg.width
    bg.scale.y = k.height() / bg.height
});