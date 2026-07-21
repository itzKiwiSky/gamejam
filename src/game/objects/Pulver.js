import k from "../../Engine";


export default function createPulver(player) {
    const root = k.get("root_game")[0];
    const gun = root.add([
        k.pos(),
        k.anchor("center"),
        k.sprite("@gun-o"),
        k.rotate(0), // se você quiser que a arma tb rotacione visualmente

        {
            orbitAngle: 0,
            orbitRadius: 60,
            orbitSpeed: 180, // graus por segundo

            cooldown: 0,
            fireRate: 0.3, // segundos entre tiros
            spreadFireRate: 0.6,
            bulletSpeed: 500,

            bulletCount: 200,
            bulletPenaltySpread: 3,
            spreadCount: 3,
            spreadAngle: 32,

            shoot() { },
            shootSpread() { },
        },

        "gun",
    ]);

    gun.onUpdate(() => {
        // direção do player até o mouse
        const dir = mousePos().sub(player.pos).unit();

        // posiciona a arma nessa direção, a uma distância fixa do player
        gun.pos = player.pos.add(dir.scale(gun.orbitRadius));

        // rotaciona a arma pra apontar pro mouse
        gun.angle = dir.angle();

        if (gun.cooldown > 0)
            gun.cooldown -= k.dt();

    });

    gun.shoot = () => {

        gun.cooldown = gun.fireRate;

        gun.bulletCount -= 1;

        const dir = Vec2.fromAngle(gun.angle);
        createBullet(gun.pos, dir);
    }

    gun.shootSpread = () => {
        gun.cooldown = gun.fireRate;
        gun.bulletCount -= gun.bulletPenaltySpread;

        const dir = Vec2.fromAngle(gun.angle);
        shootSpread(gun.pos, dir);
    };

    function shootSpread(startPos, baseDir) {
        const baseAngle = baseDir.angle(); // ângulo central em graus
        const step = gun.spreadAngle / (gun.spreadCount - 1);
        const startAngle = baseAngle - gun.spreadAngle / 2;

        for (let i = 0; i < gun.spreadCount; i++) {
            const angle = startAngle + step * i;
            const dir = Vec2.fromAngle(angle);
            createBullet(startPos, dir);
        }
    }

    function createBullet(startPos, dir) {
        const bullet = root.add([
            k.pos(startPos),
            k.anchor("center"),
            k.rect(4, 4),
            k.color(k.YELLOW),
            k.rotate(gun.angle), // já rotaciona visualmente na direção do tiro
            k.area(),
            k.offscreen({ destroy: true }), // destroi quando sair da tela
            {
                dir: dir,
                speed: gun.bulletSpeed,
                lifetime: 3,
            },
            "bullet",
        ]);

        bullet.onUpdate(() => {
            bullet.pos = bullet.pos.add(bullet.dir.scale(bullet.speed * dt()));

            bullet.lifetime -= k.dt();

            // se auto destroy quando a vida ficar menor que zero //
            if (bullet.lifetime <= 0)
                bullet.destroy();
        });
    }

    return gun;
}