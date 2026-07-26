import k from "../../Engine";

export default function createLoja() {
    const root = k.get("root_game")[0];

    const loja = root.add([
        k.pos(k.center()),
        k.rect(96, 48, {
            fill: false
        }),
        k.area(),
        k.body({ isStatic: true }),
        k.anchor("center"),

        {
            baseOffset: 50,
        },

        "loja",
    ]);

    const lojaSprite = loja.add([
        k.sprite("loja"),
        k.pos(0, -24),
        k.anchor("center"),
        k.z(20),
        k.scale(0.75),
    ]);

    lojaSprite.onUpdate(() => {

    });

    const areaAcao = loja.add([
        k.pos(0, 32),
        k.rect(96, 32, {
            fill: false
        }),
        k.anchor("center"),
        k.area({ isSensor: true }),

        "areaAcao",
    ]);

    return loja;
}