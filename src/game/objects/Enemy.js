import k from "../../Engine";
import { weightedChoice } from "../../utils/Utils";

function circlePolygon(radius, sides = 16) {
    const pts = [];

    for (let i = 0; i < sides; i++) {
        const angle = (i / sides) * 360;
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
    const director = root.get("director")[0];

    const barWidth = 100; // largura das barras
    const barHeight = 20; // altura das barras
    const tomato = root.add([
        k.pos(),
        k.rect(16, 16, {
            fill: false,
        }),
        k.area(),
        k.body(),
        k.scale(3),
        k.state("idle", ["idle", "change_target", "move", "attack", "die"]),
        k.anchor("center"),
        k.health(100),
        k.z(50),

        {
            speed: 40,
            damage: 4,

            chasingPlayerPatience: 4,
            patienceTimer: 4,

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

    // Texto de vida (valores dela)
    const healthText = tomato.add([
        k.text("100 / 100", { size: 12, weight: "bold" }), // texto vazio que vai atualizando
        k.pos(0, -20), // centralizado na barra
        k.scale(0.8),
        k.anchor("center"), // ponto de referencia eh o centro
        k.color(k.WHITE), // cor branca
    ]);

    healthText.onUpdate(() => {
        // Atualiza o texto mostrando os valores

        healthText.text = `${Math.round(tomato.hp)} / ${tomato.maxHP}`;
    });

    const tomatoSprite = tomato.add([
        k.pos(0, -6),
        k.sprite("tomaicon", {
            anim: "idle",
            animSpeed: 3,
        }),
        k.anchor("center"),
    ]);

    tomato.onUpdate(() => {
        tomatoSprite.z = tomato.pos.y;
    });

    tomato.hurt = (dmg) => {
        tomato.hp -= dmg;
    }

    tomato.onDeath(() => {
        if (tomato.isDead) return;
        tomato.isDead = true;

        const baseDropChance = 47;
        const multiplier = director.manureDropMultiplier ?? 1;
        const finalDropChance = Math.min(baseDropChance * multiplier, 100);

        if (weightedChoice({
            ["true"]: finalDropChance,
            ["false"]: 100 - finalDropChance,
        }) === "true")
            director.manureCount++;

        if (tomatoSprite?.getCurAnim()?.name !== "death")
            tomatoSprite.play("death");
    });

    const attackArea = tomato.add([
        k.area({ isSensor: true, shape: new k.Circle(k.vec2(0, 0), 14) }),
    ]);

    const tomatoVisionArea = tomato.add([
        k.area({ isSensor: true, shape: new k.Circle(k.vec2(0, 0), 56) }),
    ]);

    tomatoSprite.onAnimEnd((anim) => {
        tomatoSprite.onAnimEnd((anim) => {
            if (anim === "death")
                k.destroy(tomato);
        })
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

        if (tomato.currentTarget !== player && tomatoVisionArea.isOverlapping(player)) {
            tomato.enterState("change_target");
            return;
        }

        if (tomato.currentTarget === player) {
            if (tomatoVisionArea.isOverlapping(player)) {
                tomato.patienceTimer = tomato.chasingPlayerPatience;
            } else {
                tomato.patienceTimer -= k.dt() * 2;

                if (tomato.patienceTimer <= 0) {
                    tomato.currentTarget = tomato.lastTarget;
                }
            }
        }

        if (attackArea.isOverlapping(tomato.currentTarget)) {
            tomato.enterState("attack");
        }
    });

    tomato.onStateEnter("change_target", () => {
        if (tomato.isDead) return;

        tomato.currentTarget = player;
        tomato.patienceTimer = tomato.chasingPlayerPatience;

        k.wait(0.3, () => {
            tomato.enterState("move");
        });
    });

    tomato.onStateUpdate("attack", () => {
        if (tomato.isDead) return;

        if (!tomato.attacked) {
            tomatoSprite.play("attack");
            tomato.attacked = true;

            for (const obj of attackArea.getCollisions()) {
                if (!obj.target.is("enemy")) {
                    const reduction = obj.target.damageReduction ?? 0;
                    const finalDamage = Math.max(tomato.damage - reduction, 0);
                    obj.target.hp -= finalDamage;
                }
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