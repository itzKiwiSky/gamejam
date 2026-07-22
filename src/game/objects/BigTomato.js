import k from "../../Engine";


export default function createBigTomate() {
    const root = k.get("root_game")[0];;
    const big = root.add([
        k.pos(k.center()),
        k.rect(128, 128),
        k.color(k.RED),
        k.area(),
        k.body({ isStatic: true }),
        k.anchor("center"),

        k.health(100),

        "objective",
    ]);

    return big;
}