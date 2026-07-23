import k from "../../Engine";


export default function createBigTomate() {
    const root = k.get("root_game")[0];
    const barWidth = 100; // largura das barras
    const barHeight = 20; // altura das barras

    const big = root.add([
        k.pos(k.center()),
        k.rect(128, 128),
        k.color(k.RED),
        k.area(),
        k.body({ isStatic: true }),
        k.anchor("center"),

        k.health(500, 500),

        "objective",
    ]);

    const healthBarBg = big.add([
        k.rect(barWidth, barHeight, { radius: 5 }), // retangulo 200x20 com cantos arredondados
        k.pos(0, -big.height * 0.5 - 16), // posicao relativa ao container
        k.color(k.Color.fromHex("#333333")),
        k.outline(4, k.Color.fromHex("#111111")), // borda preta mais grossa
        k.anchor("center"), // o ponto de referencia eh o canto superior esquerdo
    ]);

    // Barra de vida da parte visual (verde)
    const healthBar = healthBarBg.add([
        k.rect(barWidth, barHeight, { radius: 5 }), // mesmo tamanho do fundo com cantos arredondados
        k.pos(0, 0), // mesma posicao
        k.color(k.Color.fromHex("#22c55e")),
        k.outline(3, k.Color.fromHex("#16a34a")), // borda verde escuro mais grossa
        k.anchor("center"),
    ]);

    // Texto de vida (valores dela)
    const healthText = healthBarBg.add([
        k.text("100 / 100", { size: 12, weight: "bold" }), // texto vazio que vai atualizando
        k.pos(0, 0), // centralizado na barra
        k.anchor("center"), // ponto de referencia eh o centro
        k.color(k.WHITE), // cor branca
    ]);

    healthBarBg.onUpdate(() => {
        if (big.hp !== undefined && big.maxHP !== undefined) {
            // Calcula a porcentagem de vida (entre 0 a 1)
            const healthPercent = Math.max(0, big.hp() / big.maxHP());

            // Atualiza a largura da barra (quanto mais vida, mais larga)
            healthBar.width = barWidth * healthPercent;

            // Atualiza o texto mostrando os valores
            healthText.text = `${Math.round(big.hp())} / ${big.maxHP()}`;

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
    });

    return big;
}