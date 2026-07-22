import k from "../../Engine";

// funcao que cria a UI (barra de vida + barra de estamina)
export default function createUI(player) {
    // Posicoes da UI
    const uiX = 50; // posicao X (esquerda) - aumentado pra direita
    const uiY = 20; // posicao Y (topo)
    const barWidth = 200; // largura das barras
    const barHeight = 20; // altura das barras
    const spacing = 10; // espacamento entre as barras
    const root = k.get("root_game")[0];
    const uiLayer = k.get("root_ui")[0];

    // contrainer que agrupa todos elementos da UI 
    const uiContainer = uiLayer.add([
        k.pos(uiX, uiY), // posiciona no topo esquerdo
        k.fixed(), // fica fixo na camera
        k.layer("ui"), // fica na frente dos outros elementos
    ]);

    // Label "HP"
    uiContainer.add([
        k.text("HP", { size: 18, weight: "bold" }),
        k.pos(-30, barHeight / 2),
        k.anchor("center"),
        k.color(k.WHITE),
    ]);

    // Barra de vida 
    // Fundo da barra de vida (cinza)
    const healthBarBg = uiContainer.add([
        k.rect(barWidth, barHeight, { radius: 5 }), // retangulo 200x20 com cantos arredondados
        k.pos(0, 0), // posicao relativa ao container
        k.color(k.Color.fromHex("#333333")),
        k.outline(4, k.Color.fromHex("#111111")), // borda preta mais grossa
        k.anchor("topleft"), // o ponto de referencia eh o canto superior esquerdo
    ]);

    // Barra de vida da parte visual (verde)
    const healthBar = uiContainer.add([
        k.rect(barWidth, barHeight, { radius: 5 }), // mesmo tamanho do fundo com cantos arredondados
        k.pos(0, 0), // mesma posicao
        k.color(k.Color.fromHex("#22c55e")),
        k.outline(3, k.Color.fromHex("#16a34a")), // borda verde escuro mais grossa
        k.anchor("topleft"),
    ]);

    // Texto de vida (valores dela)
    const healthText = uiContainer.add([
        k.text("", { size: 18, weight: "bold" }), // texto vazio que vai atualizando
        k.pos(barWidth / 2, barHeight / 2), // centralizado na barra
        k.anchor("center"), // ponto de referencia eh o centro
        k.color(k.WHITE), // cor branca
    ]);

    // Barra de Estamina (sem label)
    // Fundo da barra de estamina (cinza)
    const estaminaBarBg = uiContainer.add([
        k.rect(barWidth, barHeight, { radius: 5 }),
        k.pos(0, barHeight + spacing), // posiciona abaixo da vida
        k.color(k.Color.fromHex("#333333")),
        k.outline(4, k.Color.fromHex("#111111")), // borda preta mais grossa
        k.anchor("topleft"),
    ]);

    // Barra de estamina  
    const estaminaBar = uiContainer.add([
        k.rect(barWidth, barHeight, { radius: 5 }),
        k.pos(0, barHeight + spacing), // mesma posicao que o fundo
        k.color(k.Color.fromHex("#f59e0b")),
        k.outline(3, k.Color.fromHex("#d97706")), // borda laranja escuro mais grossa
        k.anchor("topleft"),
    ]);

    // Texto de estamina
    const estaminaText = uiContainer.add([
        k.text("", { size: 16, weight: "bold" }), // texto vazio
        k.pos(barWidth / 2, barHeight + spacing + barHeight / 2), // centralizado na barra de estamina
        k.anchor("center"),
        k.color(k.WHITE),
    ]);

    // funcao que atualiza a UI a cada frame
    uiContainer.onUpdate(() => {
        // Atualizar a barra de vida 
        // verifica se o player tem a propriedade de vida primeiro
        if (player.hp !== undefined && player.maxHp !== undefined) {
            // Calcula a porcentagem de vida (entre 0 a 1)
            const healthPercent = Math.max(0, player.hp / player.maxHp);

            // Atualiza a largura da barra (quanto mais vida, mais larga)
            healthBar.width = barWidth * healthPercent;

            // Atualiza o texto mostrando os valores
            healthText.text = `${Math.round(player.hp)}/${player.maxHp}`;

            // Muda cor baseado na vida  
            if (healthPercent > 0.5) {
                healthBar.color = k.Color.fromHex("#22c55e"); // Verde
            } else if (healthPercent > 0.2) {
                healthBar.color = k.Color.fromHex("#eab308"); // Amarelo
            } else {
                healthBar.color = k.Color.fromHex("#ef4444"); // Vermelho
            }
        } else {
            // Se nao tiver vida, mostra como vazio
            healthText.text = "0";
            healthBar.width = 0;
        }

        // Atualizar estamina
        // verifica se tem o player tem estamina
        if (player.stamina !== undefined) {
            // Estamina maxima eh de 100
            const maxEstamina = 100;
            // calcula a porcentagem de estamina entre 0 e 1
            const estaminaPercent = Math.max(0, Math.min(1, player.stamina / maxEstamina));

            // Atualiza a largura da barra
            estaminaBar.width = barWidth * estaminaPercent;

            // Atualiza o texto com valor da estamina
            estaminaText.text = `${player.stamina.toFixed(1)}/${maxEstamina}`;

            // Muda cor baseado na estamina  
            if (estaminaPercent > 0.5) {
                estaminaBar.color = k.Color.fromHex("#f59e0b"); // Amarelo/Laranja
            } else if (estaminaPercent > 0.2) {
                estaminaBar.color = k.Color.fromHex("#f97316"); // Laranja
            } else {
                estaminaBar.color = k.Color.fromHex("#ef4444"); // Vermelho
            }
        }
    });

    //ui de balas //
    const length = 320;
    const sharpness = 64;
    const height = 64;
    const balasUI = uiLayer.add([
        k.pos(0, k.height() - height),
        k.polygon([
            k.vec2(0, 0),
            k.vec2(length - sharpness, 0),
            k.vec2(length, height),
            k.vec2(0, height),
        ]),
        k.color(k.Color.fromHex("#562f17")),
        k.outline(6, k.BLACK, 1),
        k.z(10),
        k.layer("ui"),
        k.fixed(),
    ]);

    const uiSprite = balasUI.add([
        k.pos(28, 28),
        k.sprite("pulver"),
        k.scale(2.25),
        k.rotate(0),
        k.anchor("center")
    ]);

    uiSprite.flipX = true;

    uiSprite.onUpdate(() => {
        uiSprite.angle = k.wave(-10, 10, k.time());
    })

    const balasText = balasUI.add([
        k.pos(64, 12),
        k.text("100%"),
    ]);

    balasUI.onUpdate(() => {
        const pulver = root.get("gun")[0];

        let count = pulver.bulletCount / pulver.maxBulletCount;

        balasText.text = Math.floor(count * 100) + "%";
    });

    // Retorna o container pra poder destruir depois se necessario
    return uiContainer;
}