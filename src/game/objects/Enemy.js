import k from "../../Engine";

function circlePolygon(radius, sides = 16) {
    const pts = [];

    for (let i = 0; i < sides; i++) {
        const angle = (i / sides) * 360; // distribui os pontos igualmente em volta do círculo
        const rad = k.deg2rad(angle);

        pts.push(k.vec2(
            Math.cos(rad) * radius,
            Math.sin(rad) * radius
        ));
    }

    return new k.Polygon(pts);
}

export default function createEnemy(target, player) {
    const root = k.get("root_game")[0];
    const tomato = root.add([
        k.pos(),
        k.rect(16, 16),
        k.area(),
        k.body(),
        k.scale(3),
        k.state("idle", ["idle", "change_target", "move", "attack", "die"]),
        k.anchor("center"),
        k.health(100),
        k.z(50),

        {
            speed: 40,
            damage: 14,

            chasingPlayerPatience: 4, // segundos que ele "aguenta" sem ver o player antes de desistir
            patienceTimer: 4,          // contador atual (começa igual ao max)

            lastTarget: target,
            currentTarget: target,

            attackSpeed: 1.2,
            maxAttackSpeed: 1.2,
            attacked: false,

            visionRadius: 100,
            attackRadius: 18,

            isDead: false,
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
    ]);

    tomato.onDeath(() => {
        if (tomatoSprite.getCurAnim().name !== "death")
            tomatoSprite.play("death");
    });

    const attackArea = tomato.add([
        k.pos(),
        k.circle(tomato.attackRadius),
        k.color(k.RED),
        k.opacity(0.45),
        k.area({ isSensor: true, shape: circlePolygon(tomato.attackRadius, 25) }),
    ]);

    const tomatoVisionArea = tomato.add([
        k.pos(),
        k.circle(tomato.visionRadius),
        k.color(k.GREEN),
        k.opacity(0.45),
        k.area({ isSensor: true, shape: circlePolygon(tomato.visionRadius, 25) }),
    ]);

    tomatoSprite.onAnimEnd((anim) => {
        if (anim === "death")
            tomato.destroy();
    })

    tomato.onStateEnter("idle", () => {
        if (tomato.isDead) return;

        tomatoSprite.play("idle");
        k.wait(1, () => {
            tomatoSprite.play("walk");
            tomato.enterState("move");
        });
    });

    tomato.onStateUpdate("move", () => {
        if (tomato.isDead) return;

        const dir = tomato.currentTarget.pos.sub(tomato.pos).unit();
        tomatoSprite.flipX = dir.x > 0;
        tomato.move(dir.scale(tomato.speed));

        // se ainda não tá perseguindo o player e ele entrou na visão, troca o alvo
        if (tomato.currentTarget !== player && tomatoVisionArea.isOverlapping(player)) {
            tomato.enterState("change_target");
            return;
        }

        // se tá perseguindo o player, gerencia a paciência
        if (tomato.currentTarget === player) {
            if (tomatoVisionArea.isOverlapping(player)) {
                tomato.patienceTimer = tomato.chasingPlayerPatience; // player visível, reseta paciência
            } else {
                tomato.patienceTimer -= k.dt() * 2;

                if (tomato.patienceTimer <= 0) {
                    tomato.currentTarget = tomato.lastTarget; // desiste e volta pro alvo original
                }
            }
        }

        // chegou perto o suficiente do alvo atual pra atacar
        if (attackArea.isOverlapping(tomato.currentTarget)) {
            tomato.enterState("attack");
        }
    });

    tomato.onStateEnter("change_target", () => {
        if (tomato.isDead) return;

        tomato.currentTarget = player;
        tomato.patienceTimer = tomato.chasingPlayerPatience; // reseta a paciência

        k.wait(0.3, () => {
            tomato.enterState("move");
        });
    });

    tomato.onStateUpdate("attack", () => {
        if (tomato.isDead) return;

        if (!tomato.attacked) {
            tomatoSprite.play("attack");
            tomato.attacked = true;

            // no momento que o ataque dispara, dá dano em tudo que tiver na área
            for (const obj of attackArea.getCollisions()) {
                if (!obj.target.is("enemy")) //evita que ataque objetos que tenha id de inimigo
                    obj.target.hurt?.(tomato.damage);

            }
        }

        if (tomato.attacked) {
            if (tomato.attackSpeed > 0) {
                tomato.attackSpeed -= k.dt();

                if (tomato.attackSpeed <= 0) {
                    tomato.attacked = false;
                    tomato.attackSpeed = tomato.maxAttackSpeed;
                }
            }
        }

        if (!attackArea.isOverlapping(tomato.currentTarget))
            tomato.enterState("idle");
    });

    return tomato;
}