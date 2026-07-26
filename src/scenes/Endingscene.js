import k from "../Engine";

export const ENDING_TYPES = {
    FIRST_PLACE: "primeiro_lugar",
    SECOND_PLACE: "segundo_lugar",
    THIRD_PLACE: "terceiro_lugar",
};

k.scene("ending", (data) => {
    const endingType = data.endingType;
    const tomatoHealth = data.tomatoHealth;

    const root = k.add([
        k.layer("ui"),
    ]);

    root.add([
        k.rect(k.width(), k.height()),
        k.color(0, 0, 0),
    ]);

    // Sprite do teste
    const bg = root.add([
        k.sprite(endingType),
        k.pos(k.center()),
        k.anchor("center"),
        k.scale(1),
    ]);

    if (endingType === ENDING_TYPES.FIRST_PLACE) {
        const c = root.add([
            k.sprite("nd"),
            k.pos(128, k.height() - 128),
            k.rotate(0),
            k.anchor("center"),
            k.scale(0.25)
        ])

        c.onUpdate(() => {
            c.angle = k.wave(-12, 12, k.time() * 2);
        })

        root.add([
            k.text("pabens", {
                size: 20,
            }),
            k.pos(180, k.height() - 128),
            k.anchor("left"),
        ])
    }

    bg.scale.x = k.width() / bg.width
    bg.scale.y = k.height() / bg.height
    console.log(bg.scale.serialize());

    root.add([
        k.text("Aperte ESPACO para voltar ao menu", {
            size: 25,
        }),
        k.pos(k.center().x, k.height() - 50),
        k.anchor("center"),
        k.color(k.WHITE),
    ]);

    k.onKeyPress("space", () => {
        k.go("menuscene");
    });
});