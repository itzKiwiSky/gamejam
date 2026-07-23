import k from "../../Engine";
import createPulver from "./Pulver";

export default function createPlayer() {
    let dir = k.vec2(0, 0);

    const root = k.get("root_game")[0];
    const director = root.get("director")[0];

    const player = root.add([
        k.pos(k.center()),
        k.rect(32, 32),
        k.opacity(0),
        k.anchor("center"),

        k.area(),
        k.body(),

        k.z(50),


        {
            speed: 250,
            speedMulti: 2.5,        // velocidade do jogador quando o shift estiver apertado
            stamina: 100,
            staminaPenalty: 30.654,   // aqui indica quanto vai perder de stamina
            staminaRecover: 14.2,   // quando o jogador estiver sem shift apertado, recarregar a stamina

            isRunning: false,

            //propriedada vida
            hp: 100,
            maxHp: 100, //vida maxima

            isResting: false,

        },

        "player"
    ]);

    const playerSprite = player.add([
        //k.pos(16, 8),
        k.sprite("player", {
            anim: "idle",
        }),
        k.scale(3),
        k.anchor("center"),
        k.z(10),
    ])

    const gun = createPulver(player);

    player.onUpdate(() => {

        if (director.anyUIActive)
            return;

        gun.paused = director.anyUIActive;

        let dt = k.dt();
        dir.x = 0;
        dir.y = 0;
        let speedMultiplier = 1;

        player.z = player.pos.y;

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

            gun.shoot(mouseDir);
        }

        if (k.isMousePressed("right")) {
            if (gun.cooldown > 0)
                return;

            gun.shootSpread(mouseDir);
        }

    });

    return player;
}