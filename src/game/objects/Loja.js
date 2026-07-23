import k from "../../Engine";


export default function createLoja() {
    const root = k.get("root_game")[0];
    const loja = root.add([
        k.pos(k.center()),
        k.rect(96, 48),
        k.color(k.RED),
        k.area(),
        k.body({ isStatic: true }),
        k.anchor("center"),

        "loja",
    ]);

    const areaAcao = loja.add([
        k.pos(0, 32),
        k.rect(96, 32),
        k.color(k.BLUE),
        k.anchor("center"),
        k.area({ isSensor: true }),
    ]);

    return loja;
}