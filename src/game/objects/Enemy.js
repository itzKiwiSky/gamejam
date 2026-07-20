import k from "../../Engine";


export default function createEnemy(target, player) {
    const tomato = k.add([
        k.pos(),
        k.sprite("tomaicon", {
            anim: "idle",
            animSpeed: 3,

        }),
        //k.rect(16, 16),
        k.area(),
        k.body(),
        k.scale(3),
        k.state("idle", ["idle", "move", "attack"]),
        k.anchor("center"),

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

        tomato.play("idle");
        k.wait(2, () => {
            tomato.play("walk");
            tomato.enterState("move");
        });

    });

    tomato.onStateUpdate("move", () => {
        const dir = target.pos.sub(tomato.pos).unit();
        tomato.flipX = dir.x > 0;
        tomato.move(dir.scale(tomato.speed));
    });
     return tomato;
}