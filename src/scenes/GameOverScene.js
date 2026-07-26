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

    k.add([
        k.text("Aperte ESPACO para voltar ao menu", {
            size: 25,
        }),
        k.pos(k.center().x, k.height() - 72),
        k.anchor("center"),
        k.color(k.WHITE),
    ]);

    k.onKeyPress("space", () => {
        k.go("menuscene");
    });
});