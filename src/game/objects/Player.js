import k from "../../Engine";

export default function createPlayer() {
    let dir = k.vec2(0, 0);
    const player = k.add([
        k.pos(k.center()),
        k.rect(32, 32),
        k.color(k.BLUE),

        k.area(),
        k.body(),

        {
            speed: 250,
            speedMulti: 2.5,        // velocidade do jogador quando o shift estiver apertado
            stamina: 100,
            staminaPenalty: 14.4,   // aqui indica quanto vai perder de stamina
            staminaRecover: 14.2,   // quando o jogador estiver sem shift apertado, recarregar a stamina

            isRunning: false,
        }
    ]);

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

        if (player.isRunning) {
            speedMultiplier = player.speedMulti;
            player.stamina = player.stamina - player.staminaPenalty * dt;
        }
        else if (player.stamina < 100)
            player.stamina = player.stamina + player.staminaRecover * dt;


        if (dir.len() > 0) {
            dir = dir.unit();
            player.move(dir.scale(player.speed * speedMultiplier));
        }
    });

    return player;
}