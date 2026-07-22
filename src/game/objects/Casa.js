
import k from "../../Engine";


export default function createCasa(player) {
    const root = k.get("root_game")[0];
    const casa = root.add([
        k.pos(k.center().x, 120),
        k.rect(128, 110),
        k.opacity(0),
        k.anchor("center"),
        k.area(),
        k.scale(1.5),
        k.body({ isStatic: true }),
        k.z(50),
    ]);

    const casaSprite = casa.add([
        k.sprite("casa"),
        k.anchor("center"),
        k.scale(1.2),
        k.z(3),
    ]);

    return casa;
}