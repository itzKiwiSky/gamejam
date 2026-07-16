import k from "../../Engine";


export default function createBigTomate(params) {
    const big = k.add([
        k.pos(k.center()),
        k.rect(96, 96),
        k.color(k.RED),
        k.area(),
        k.body({ isStatic: true }),
        k.anchor("center"),
    ]);
}