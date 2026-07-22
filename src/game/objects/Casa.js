
import k from "../../Engine";


export default function createCasa(player) {
    const root = k.get("root_game")[0];
    const rootUI = k.get("root_ui")[0];
    const director = root.get("director")[0];
    const casa = root.add([
        k.pos(k.center().x, 120),
        k.rect(128, 110),
        k.opacity(0),
        k.anchor("center"),
        k.area(),
        k.scale(1.5),
        k.body({ isStatic: true }),
        k.z(50),

        {
            baseOffset: 50,
        }
    ]);

    casa.onUpdate(() => {
        const p = root.get(player)[0];

        casa.z = casa.pos.y + casa.baseOffset;
    });

    const areaAcao = casa.add([
        k.pos(0, casa.height * 0.5),
        k.rect(128, 32, {
            fill: false
        }),
        k.anchor("center"),
        k.color(k.BLUE),
        k.area({ isSensor: true }),
        k.z(59),
    ])

    areaAcao.onUpdate(() => {
        if (director.anyUIActive)
            return;

        for (const obj of areaAcao.getCollisions()) {
            if (!obj.target.is("player")) //evita que ataque objetos que tenha id de inimigo
                if (k.isKeyDown("e")) {
                    const UI = rootUI.get("confirmUIChange")[0];
                    UI.trigger("popupOpen");
                }

        }
    });

    const casaSprite = casa.add([
        k.sprite("casa"),
        k.anchor("center"),
        k.scale(1.2),
        k.z(3),
    ]);

    return casa;
}