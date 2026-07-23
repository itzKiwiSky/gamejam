import k from "../../Engine";

function getSpawnPointAroundPlayer(player, minDistance, maxDistance = minDistance) {
    const angle = k.rand(0, 360);
    const rad = k.deg2rad(angle);
    const distance = k.rand(minDistance, maxDistance);

    return player.pos.add(k.vec2(
        Math.cos(rad) * distance,
        Math.sin(rad) * distance
    ));
}

function getSpawnRadiusOutsideCamera(margin = 50) {
    const halfW = k.width() / 2;
    const halfH = k.height() / 2;

    // distância do centro até o canto da tela (a "pior" distância, garante que sempre fica fora)
    const cameraRadius = Math.sqrt(halfW * halfW + halfH * halfH);

    return cameraRadius + margin; // margem extra pra garantir que não aparece colado na borda
}

export default function createEnemyWaveSystem({
    totalEnemies,
    batchSize = 6,
    batchSizeMax = 7,
    player,
    spawnFn,
    onAllDefeated,
}) {

    const root = k.get("root_game")[0];
    const director = root.get("director")[0];

    director.enemiesRemainingTotal = 0;
    director.aliveInBatch = 0;
    let isRunning = false;

    function spawnNextBatch() {
        console.log("spawnando inimigos do priomeoro lote")
        if (director.enemiesRemainingTotal <= 0) {
            isRunning = false;
            onAllDefeated?.();
            return;
        }

        const size = Math.min(
            k.randi(batchSize, batchSizeMax + 1),
            director.enemiesRemainingTotal
        );

        director.aliveInBatch = size;

        const minRadius = getSpawnRadiusOutsideCamera(20);
        const maxRadius = minRadius + 100;

        for (let i = 0; i < size; i++) {
            const pos = getSpawnPointAroundPlayer(player, minRadius, maxRadius);
            const enemy = spawnFn(pos);

            director.enemiesRemainingTotal -= 1;

            enemy.on("death", () => {
                director.aliveInBatch -= 1;
                if (director.aliveInBatch <= 0 && isRunning)
                    spawnNextBatch();
            });
        }
    }

    return {
        // inicia (ou reinicia) a wave com uma quantidade de inimigos
        start(newTotalEnemies = totalEnemies) {
            if (isRunning) return; // evita iniciar 2x ao mesmo tempo por engano

            director.enemiesRemainingTotal = newTotalEnemies;
            isRunning = true;
            spawnNextBatch();
        },

        stop() {
            isRunning = false; // impede que o próximo lote seja disparado, mesmo se os inimigos atuais morrerem
        },

        isActive: () => isRunning,
        getRemaining: () => director.enemiesRemainingTotal,
    };
}