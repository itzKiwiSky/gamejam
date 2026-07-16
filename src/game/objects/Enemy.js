import k from "../../Engine";


export default function createEnemy(target) {
    const tomato = k.add([
        k.pos(),
        k.sprite("tomaicon"),
        k.scale(3),
        k.area(),
        k.body(),
        k.state("idle", ["idle", "walk", "attack"]),

        {
            speed: 40,
            health: 100,
            damage: 6,
        }
    ]);

    const attackArea = tomato.add([
        k.pos(),
        k.circle(20),
        k.color(k.RED),
        k.opacity(0.45),
        k.area({ isSensor: true }),
    ]);

    tomato.onStateEnter("idle", () => {
        if (k.exists(target)) {

        }
    });

    tomato.onStateUpdate("walk", () => {
        if (!k.exists(target)) return;

        const dir = target.pos.sub(tomato.pos).unit();
        tomato.move(dir.scale(tomato.speed));
    });
}