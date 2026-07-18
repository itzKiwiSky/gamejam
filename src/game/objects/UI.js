import k from "../../Engine";

export default function createUI(player) {
    // Posições da UI
    const uiX = 20;
    const uiY = 20;
    const barWidth = 200;
    const barHeight = 20;
    const spacing = 10; // espaçamento entre as barras

    // Container da UI (pra tudo ficar junto)
    const uiContainer = k.add([
        k.pos(uiX, uiY),
        k.fixed(), // fica fixo na câmera
        k.layer("ui"), // fica na frente dos outros elementos
    ]);

    // Barra de vida 
    // Fundo da barra de vida (cinza)
    const healthBarBg = uiContainer.add([
        k.rect(barWidth, barHeight),
        k.pos(0, 0),
        k.color(k.Color.fromHex("#333333")),
        k.anchor("topleft"),
    ]);

    // Barra de vida (verde)
    const healthBar = uiContainer.add([
        k.rect(barWidth, barHeight),
        k.pos(0, 0),
        k.color(k.Color.fromHex("#22c55e")),
        k.anchor("topleft"),
    ]);

    // Texto de vida
    const healthText = uiContainer.add([
        k.text("", { size: 14 }),
        k.pos(barWidth / 2, barHeight / 2),
        k.anchor("center"),
        k.color(k.WHITE),
    ]);

    // Barra de Estamina
    // Fundo da barra de estamina (cinza)
    const estaminaBarBg = uiContainer.add([
        k.rect(barWidth, barHeight),
        k.pos(0, barHeight + spacing),
        k.color(k.Color.fromHex("#333333")),
        k.anchor("topleft"),
    ]);

    // Barra de estamina  
    const estaminaBar = uiContainer.add([
        k.rect(barWidth, barHeight),
        k.pos(0, barHeight + spacing),
        k.color(k.Color.fromHex("#f59e0b")),
        k.anchor("topleft"),
    ]);

    // Texto de estamina
    const estaminaText = uiContainer.add([
        k.text("", { size: 14 }),
        k.pos(barWidth / 2, barHeight + spacing + barHeight / 2),
        k.anchor("center"),
        k.color(k.WHITE),
    ]);

//Atualizar a Ui
    uiContainer.onUpdate(() => {
        // Atualizar a vida 
        if (player.health !== undefined && player.maxHealth !== undefined) {
            // Calcula a porcentagem de vida
            const healthPercent = Math.max(0, player.health / player.maxHealth);
            
            // Atualiza a largura da barra
            healthBar.width = barWidth * healthPercent;
            
            // Atualiza o texto
            healthText.text = `HP: ${Math.round(player.health)}/${player.maxHealth}`;
            
            // Muda cor baseado na vida  
            if (healthPercent > 0.5) {
                healthBar.color = k.Color.fromHex("#22c55e"); // Verde
            } else if (healthPercent > 0.2) {
                healthBar.color = k.Color.fromHex("#eab308"); // Amarelo
            } else {
                healthBar.color = k.Color.fromHex("#ef4444"); // Vermelho
            }
        } else {
            // Se não tiver vida, mostra como vazio
            healthText.text = "HP: 0";
            healthBar.width = 0;
        }

        // Atualizar estamina
        if (player.stamina !== undefined) {
            // Estamina máxima é de 100
            const maxEstamina = 100;
            const estaminaPercent = Math.max(0, Math.min(1, player.stamina / maxEstamina));
            
            // Atualiza a largura da barra
            estaminaBar.width = barWidth * estaminaPercent;
            
            // Atualiza o texto
            estaminaText.text = `Estamina: ${player.stamina.toFixed(1)}/${maxEstamina}`;
            
            // Muda cor baseado na estamina  
            if (estaminaPercent > 0.5) {
                estaminaBar.color = k.Color.fromHex("#f59e0b"); // Amarelo 
            } else if (estaminaPercent > 0.2) {
                estaminaBar.color = k.Color.fromHex("#f97316"); // Laranja
            } else {
                estaminaBar.color = k.Color.fromHex("#ef4444"); // Vermelho
            }
        }
    });

    // Retorna o container pra poder destruir depois se necessário
    return uiContainer;
}