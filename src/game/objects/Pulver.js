import k from "../../Engine";

export default function createPulver(player) {
    const root = k.get("root_game")[0];
    const gun = root.add([
        k.pos(),
        k.anchor("center"),
        k.sprite("pulver"),
        k.scale(1.8),
        k.rotate(0),
        k.outline(3, k.WHITE, 1, "round"),
        k.z(60),

        {
            aimDir: k.vec2(1, 0),

            orbitRadius: 32,

            cooldown: 0,

            // valores base + efetivos, pra cartas multiplicarem sem perder a referência original
            baseFireRate: 0.26,
            fireRate: 0.26,
            baseSpreadFireRate: 0.76,
            spreadFireRate: 0.76,

            bulletSpeed: 500,

            bulletCount: 120,
            maxBulletCount: 120,

            reloadTime: 2,
            maxReloadTimer: 2,

            bulletPenaltySpread: 4,
            spreadCount: 8,
            baseSpreadAngle: 50,
            spreadAngle: 50,

            isReloading: false,

            // --- sistema de crítico (chance aleatória) ---
            criticalChance: 0.15,
            criticalDamageBonus: 1.5,

            // --- crítico bônus a cada N ataques (carta CRITICAL_BOOST) ---
            shotsFired: 0,
            criticalBoostValue: 0,      // acumulado das cartas, +2 por carta aplicada
            criticalBoostInterval: 10,  // a cada 10 tiros, aplica o bônus fixo

            bulletDamage: 7,
            shoot() { },
            shootSpread() { },
        },

        "gun",
        "pulver"
    ]);

    // --- aplica efeitos de cartas na arma ---
    gun.applyCard = (card) => {
        switch (card.id) {
            case "fire_rate":
                gun.fireRate = gun.baseFireRate * card.valor;
                gun.spreadFireRate = gun.baseSpreadFireRate * card.valor;
                break;

            case "spray_spread":
                gun.spreadAngle = gun.baseSpreadAngle * card.valor;
                break;

            case "critical_boost":
                gun.criticalBoostValue += card.valor; // acumula, permite pegar a carta mais de uma vez
                break;

            default:
                console.warn("Pulver: carta sem efeito implementado aqui:", card.id);
        }
    };

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
                gun.cooldown = gun.maxReloadTimer;
                gun.isReloading = false;
            }
        }
    });

    gun.shoot = () => {
        if (gun.bulletCount <= 0) return;
        if (gun.isReloading) return;

        gun.cooldown = gun.fireRate;
        gun.bulletCount -= 1;

        createBullet(gun.pos, gun.aimDir);
    }

    gun.shootSpread = () => {
        if (gun.bulletCount <= 0) return;
        if (gun.isReloading) return;

        gun.cooldown = gun.spreadFireRate;
        gun.bulletCount -= gun.bulletPenaltySpread;

        shootSpread(gun.pos, gun.aimDir);
    };

    function shootSpread(startPos, baseDir) {
        const baseAngle = baseDir.angle();
        const step = gun.spreadAngle / (gun.spreadCount - 1);
        const startAngle = baseAngle - gun.spreadAngle / 2;

        for (let i = 0; i < gun.spreadCount; i++) {
            const angle = startAngle + step * i;
            const dir = k.Vec2.fromAngle(angle);
            createBullet(startPos, dir);
        }
    }

    function createBullet(startPos, dir) {
        gun.shotsFired += 1;

        const isCritical = k.rand(0, 1) < gun.criticalChance;
        const isBoostShot = gun.criticalBoostValue > 0 && gun.shotsFired % gun.criticalBoostInterval === 0;

        let finalDamage = gun.bulletDamage;

        if (isCritical) finalDamage = Math.round(finalDamage * gun.criticalDamageBonus);
        if (isBoostShot) finalDamage += gun.criticalBoostValue;

        const bullet = root.add([
            k.pos(startPos),
            k.anchor("center"),
            k.rect(8, 8),
            k.opacity(0),
            k.rotate(dir.angle()),
            k.area({ isSensor: true }),
            k.offscreen({ destroy: true }),
            {
                dir: dir,
                speed: gun.bulletSpeed,
                lifetime: 0.465,
                damage: finalDamage,
                isCritical: isCritical || isBoostShot,
            },
            "bullet",
        ]);

        const bulletSprite = bullet.add([
            k.sprite("smokeFX", { frame: k.randi(0, 2) }),
            k.anchor("center"),
            k.scale((isCritical || isBoostShot) ? k.randi(3, 6) / 5 : k.randi(2, 5) / 5),
            k.opacity(1)
        ]);

        bulletSprite.onUpdate(() => {
            bulletSprite.opacity = k.map(bullet.lifetime, 0, 0.25, 0, 1);
        });

        bullet.onCollide("enemy", (enemy) => {
            enemy.hp -= bullet.damage;
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