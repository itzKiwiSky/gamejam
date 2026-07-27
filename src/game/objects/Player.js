import k from "../../Engine";
import createPulver from "./Pulver";
import { componentFill } from "../../components/Fill";

export default function createPlayer() {
    let dir = k.vec2(0, 0);

    const root = k.get("root_game")[0];
    const director = root.get("director")[0];

    const audioContext = k.play("spray" + k.randi(1, 4));

    const player = root.add([
        k.pos(k.center()),
        k.rect(32, 32, {
            fill: false,
        }),
        k.anchor("center"),

        k.area(),
        k.body(),

        k.health(100, 100),

        k.z(50),

        {
            speed: 250,
            speedMulti: 1.25,        // velocidade do jogador quando o shift estiver apertado
            stamina: 100,
            staminaPenalty: 30.654,   // aqui indica quanto vai perder de stamina
            staminaRecover: 14.2,   // quando o jogador estiver sem shift apertado, recarregar a stamina

            isRunning: false,
            isResting: false,

            damageReduction: 0,
            hpRegenRate: 2,
            hpRegenDelay: 3,
            hpRegenTimer: 0,
        },

        "player"
    ]);

    player.onHurt(() => {
        player.hpRegenTimer = player.hpRegenDelay
    })

    const playerSprite = player.add([
        //k.pos(16, 8),
        k.sprite("player", {
            anim: "idle",
        }),
        k.scale(3),
        k.anchor("center"),
    ])

    const gun = createPulver(player);
    console.log("gun logo após criar:", gun.aimDir);

    player.onUpdate(() => {

        if (director.anyUIActive)
            return;

        gun.paused = director.anyUIActive;

        let dt = k.dt();
        dir.x = 0;
        dir.y = 0;
        let speedMultiplier = 1;

        playerSprite.z = player.pos.y;

        const worldMousePos = k.toWorld(k.mousePos());
        const mouseDir = worldMousePos.sub(player.pos).unit();

        if (k.isKeyDown("a") || k.isKeyDown("left")) dir.x -= 1;
        if (k.isKeyDown("d") || k.isKeyDown("right")) dir.x += 1;
        if (k.isKeyDown("w") || k.isKeyDown("up")) dir.y -= 1;
        if (k.isKeyDown("s") || k.isKeyDown("down")) dir.y += 1;

        player.isRunning = k.isKeyDown("shift") && player.stamina > 0 && dir.len() > 0 && !player.isResting;

        playerSprite.flipX = mouseDir.x < 0;

        // a stamina so e perdida quando o jogador estiver se movendo de fato //
        if (player.isRunning) {
            speedMultiplier = player.speedMulti;
            player.stamina = player.stamina - player.staminaPenalty * dt;
        } //caso contrario a stamina se estiver abaixo do valor maximo, começa a regerenar
        else if (player.stamina < 100)
            player.stamina = player.stamina + player.staminaRecover * dt;

        if (player.stamina <= 0 && !player.isResting)
            player.isResting = true;

        if (player.stamina >= 100 && player.isResting)
            player.isResting = false;

        // regen de vida: só regenera depois do delay pós-dano, e nunca passa do máximo
        if (player.hpRegenTimer > 0) {
            player.hpRegenTimer -= dt;
        } else if (player.hpRegenRate > 0 && player.hp < player.maxHP) {
            player.hp = Math.min(player.hp + player.hpRegenRate * dt, player.maxHP);
        }

        if (dir.len() > 0) {
            dir = dir.unit();
            player.move(dir.scale(player.speed * speedMultiplier));
            if (playerSprite.getCurAnim().name !== "walk")
                playerSprite.play("walk");
        }
        else
            if (playerSprite.getCurAnim().name !== "idle")
                playerSprite.play("idle");

        //input de gameplay//
        if (k.isMouseDown("left")) {
            if (gun.cooldown > 0)
                return;

            k.play("spray" + k.randi(1, 4), {
                detune: k.rand(0.5, 1),
                volume: 0.45,
            })
            gun.shoot(mouseDir);
        }

        if (k.isMousePressed("right")) {
            if (gun.cooldown > 0)
                return;

            k.play("spray" + k.randi(1, 4), {
                detune: k.rand(0.5, 1),
                volume: 0.45,
            })
            gun.shootSpread(mouseDir);
        }

    });

    return player;
}