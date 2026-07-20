import k from "../../Engine";

export default function createEnemy(target, player) {
    const root = k.get("root_game")[0];;
    const tomato = root.add([
        k.pos(),
        k.rect(16, 16),
        k.area(),
        k.body(),
        k.scale(3),
        k.state("idle", ["idle", "idle_attack", "move", "attack"]),
        k.anchor("center"),

        {
            speed: 40,
            health: 100,
            damage: 6,

            chasingPlayerPatience: 200,

            lastTarget: target,
            currentTarget: target,

            attackSpeed: 1.2,
            maxAttackSpeed: 1.2,
            attacked: false,
            damage: 14,
        },

        "enemy",
    ]);

    const tomatoSprite = tomato.add([
        k.pos(0, -6),
        k.sprite("tomaicon", {
            anim: "idle",
            animSpeed: 3,
        }),
        k.anchor("center"),
    ])

    const attackArea = tomato.add([
        k.pos(),
        k.circle(20),
        k.color(k.RED),
        k.opacity(0.45),
        k.area({ isSensor: true }),
    ]);

    const playerVisionArea = tomato.add([
        k.pos(),
        k.circle(40),
        k.color(k.GREEN),
        k.opacity(0.45),
        k.area({ isSensor: true }),
    ]);

    tomato.onStateEnter("idle", () => {
        tomatoSprite.play("idle");
        k.wait(1, () => {
            tomatoSprite.play("walk");
            tomato.enterState("move");
        });
    });

    tomato.onStateUpdate("move", () => {
        const dir = tomato.currentTarget.pos.sub(tomato.pos).unit();
        tomatoSprite.flipX = dir.x > 0;
        tomato.move(dir.scale(tomato.speed));

        if (attackArea.isOverlapping(tomato.currentTarget))
            tomato.enterState("attack");


    });

    tomato.onStateUpdate("attack", () => {
        if (!tomato.attacked) {
            tomatoSprite.play("attack");
            tomato.attacked = true;
        }

        if (tomato.attacked)
            if (tomato.attackSpeed > 0) {
                tomato.attackSpeed -= k.dt();

                if (tomato.attackSpeed <= 0) {
                    tomato.attacked = false;
                    tomato.attackSpeed = tomato.maxAttackSpeed;
                }
            }

        if (!attackArea.isOverlapping(tomato.currentTarget))
            tomato.enterState("idle");
    });
    return tomato;
}