import k from "../../Engine";
import createPulver from "./Pulver";

export default function createPlayer() {
    let dir = k.vec2(0, 0);

    const root = k.get("root_game")[0];

    const player = root.add([
        k.pos(k.center()),
        k.rect(32, 32),
        k.color(k.BLUE),
        k.anchor("center"),

        k.area(),
        k.body(),


        {
            speed: 250,
            speedMulti: 2.5,        // velocidade do jogador quando o shift estiver apertado
            stamina: 100,
            staminaPenalty: 14.4,   // aqui indica quanto vai perder de stamina
            staminaRecover: 14.2,   // quando o jogador estiver sem shift apertado, recarregar a stamina

            health: 100,

            isRunning: false,
        },

        "player"
    ]);

    const playerSprite = player.add([
        //k.pos(16, 8),
        k.sprite("player"),
        k.scale(3),
        k.anchor("center"),
    ])

    const gun = createPulver(player);

    player.onUpdate(() => {
        let dt = k.dt();
        dir.x = 0;
        dir.y = 0;
        let speedMultiplier = 1;

        if (k.isKeyDown("a") || k.isKeyDown("left")) dir.x -= 1;
        if (k.isKeyDown("d") || k.isKeyDown("right")) dir.x += 1;
        if (k.isKeyDown("w") || k.isKeyDown("up")) dir.y -= 1;
        if (k.isKeyDown("s") || k.isKeyDown("down")) dir.y += 1;

        player.isRunning = k.isKeyDown("shift") && player.stamina > 0 && dir.len() > 0;

        // a stamina so e perdida quando o jogador estiver se movendo de fato //
        if (player.isRunning) {
            speedMultiplier = player.speedMulti;
            player.stamina = player.stamina - player.staminaPenalty * dt;
        } //caso contrario a stamina se estiver abaixo do valor maximo, começa a regerenar
        else if (player.stamina < 100)
            player.stamina = player.stamina + player.staminaRecover * dt;


        if (dir.len() > 0) {
            dir = dir.unit();
            player.move(dir.scale(player.speed * speedMultiplier));
        }

        //input de gameplay//
        if (k.isMousePressed("left")) {
            if (gun.cooldown > 0)
                return;

            gun.shoot();
        }

        if (k.isMousePressed("right")) {
            if (gun.cooldown > 0)
                return;

            gun.shootSpread();
        }
    });

    return player;
}