import k from "../../Engine";

export default function createPulver(player) {
    const root = k.get("root_game")[0];
    const gun = root.add([
        k.pos(),
        k.anchor("center"),
        k.sprite("pulver"),
        k.scale(1.8),
        k.rotate(0), // se você quiser que a arma tb rotacione visualmente
        k.outline(3, k.WHITE, 1, "round"),
        k.z(60),

        {
            orbitRadius: 32,

            cooldown: 0,
            fireRate: 0.3, // segundos entre tiros
            spreadFireRate: 0.76,
            bulletSpeed: 500,

            bulletCount: 100,
            maxBulletCount: 100,

            reloadTime: 2,
            maxReloadTimer: 2,

            bulletPenaltySpread: 4,
            spreadCount: 8,
            spreadAngle: 50,

            isReloading: false,

            //Dano das balas
            bulletDamage: 7,
            shoot() { },
            shootSpread() { },
        },


        "gun",
        "pulver"
    ]);

    gun.onUpdate(() => {
        const worldMousePos = k.toWorld(k.mousePos());
        const dir = worldMousePos.sub(player.pos).unit();

        gun.pos = player.pos.add(dir.scale(gun.orbitRadius));
        gun.aimDir = dir;

        if (dir.x < 0) {
            gun.flipX = true;
            gun.angle = dir.angle() - 180;
        } else {
            gun.flipX = false;
            gun.angle = dir.angle();
        }

        gun.bulletCount = k.clamp(gun.bulletCount, 0, gun.maxBulletCount);

        if (gun.cooldown > 0) gun.cooldown -= k.dt();

        if (gun.isReloading) {
            gun.reloadTime -= k.dt();

            if (gun.reloadTime <= 0) {
                gun.bulletCount = gun.maxBulletCount;
                gun.isReloading = false;
            }
        }
    });

    gun.shoot = () => {
        if (gun.bulletCount <= 0)
            return;

        if (gun.isReloading)
            return;

        gun.cooldown = gun.fireRate;
        gun.bulletCount -= 1;

        // usa aimDir, não gun.angle
        createBullet(gun.pos, gun.aimDir);
    }

    gun.shootSpread = () => {
        if (gun.bulletCount <= 0)
            return;

        if (gun.isReloading)
            return;

        gun.cooldown = gun.spreadFireRate;
        gun.bulletCount -= gun.bulletPenaltySpread;

        // usa aimDir aqui também
        shootSpread(gun.pos, gun.aimDir);
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
            k.rect(8, 8),
            k.opacity(0),
            k.rotate(dir.angle()), // usa o ângulo do dir real, não gun.angle
            k.area(),
            k.offscreen({ destroy: true }),
            {
                dir: dir,
                speed: gun.bulletSpeed,
                lifetime: 0.465,
                damage: gun.bulletDamage, //cada bala recebe o dano do pulverizador
            },
            "bullet",
        ]);

        const bulletSprite = bullet.add([
            k.sprite("smokeFX", {
                frame: k.randi(0, 2),
            }),
            k.anchor("center"),
            k.scale(0.078),
            k.opacity(1)
        ]);

        bulletSprite.onUpdate(() => {
            bulletSprite.opacity = k.map(bullet.lifetime, 0, 0.25, 0, 1);
        });

        //detectar colisão com o inimigo e aplicar o dano

        bullet.onCollide("enemy", (enemy) => {
            //verifica se o inimigo tem a função hurt
            if (enemy.hurt) {
                //aplica o dano no innimigo
                enemy.hurt(bullet.damage);
                console.log(`Bala atingiu inimigo! Dano: ${bullet.damage}, Vida restante: ${enemy.hp()}`);
            }
            //destroi a bala após atingir o inimigo
            k.destroy(bullet);
        })

        bullet.onUpdate(() => {
            bullet.pos = bullet.pos.add(bullet.dir.scale(bullet.speed * k.dt()));
            bullet.lifetime -= k.dt();

            if (bullet.lifetime <= 0)
                k.destroy(bullet);
        });
    }

    return gun;
}