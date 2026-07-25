import k from "../Engine";

export const ENDING_TYPES = {
    FIRST_PLACE: "first",
    SECOND_PLACE: "second",
    THIRD_PLACE: "third",
};

function getEndingType(tomatoHealth, maxHealth) {
    const healthPercentage = (tomatoHealth / maxHealth) * 100;
    
    if (healthPercentage >= 75) {
        return ENDING_TYPES.FIRST_PLACE;
    } else if (healthPercentage >= 40) {
        return ENDING_TYPES.SECOND_PLACE;
    } else {
        return ENDING_TYPES.THIRD_PLACE;
    }
}

k.scene("ending", (data) => {
    const endingType = data.endingType;
    const tomatoHealth = data.tomatoHealth;

    const root = k.add([
        k.layer("ui"),
    ]);

    root.add([
        k.rect(k.width(), k.height()),
        k.color(0, 0, 0),
    ]);

    if (endingType === ENDING_TYPES.FIRST_PLACE) {
        // Título em cima
        root.add([
            k.text("PRIMEIRO LUGAR", {
                size: 48,
            }),
            k.pos(k.center().x, 60),
            k.anchor("center"),
            k.color(255, 215, 0),
        ]);

        // Container imagem centralizado
        root.add([
            k.rect(400, 350),
            k.pos(k.center().x, k.center().y),
            k.anchor("center"),
            k.color(60, 60, 60),
        ]);

        // Sprite do teste
        root.add([
            k.sprite("teste"),
            k.pos(k.center().x, k.center().y),
            k.anchor("center"),
            k.scale(1.0),
        ]);

        // Texto verde - mais largo no meio
        root.add([
            k.text("Depois de tres dias e tres noites de trabalho arduo, seu esforco foi recompensado!", {
                size: 18,
                width: 700,
                align: "center",
            }),
            k.pos(k.center().x, k.center().y - 80),
            k.anchor("center"),
            k.color(100, 255, 100),
        ]);

        // Descrição abaixo
        root.add([
            k.text("Voce conquistou o primeiro lugar na competicao!", {
                size: 18,
                width: 700,
                align: "center",
            }),
            k.pos(k.center().x, k.center().y + 120),
            k.anchor("center"),
            k.color(200, 200, 200),
        ]);
    } 
    else if (endingType === ENDING_TYPES.SECOND_PLACE) {
        // Título em cima
        root.add([
            k.text("SEGUNDO LUGAR", {
                size: 48,
            }),
            k.pos(k.center().x, 60),
            k.anchor("center"),
            k.color(192, 192, 192),
        ]);

        // Container imagem centralizado
        root.add([
            k.rect(400, 350),
            k.pos(k.center().x, k.center().y),
            k.anchor("center"),
            k.color(60, 60, 60),
        ]);

        // Texto
        root.add([
            k.text("Seu tomate ficou bom, mas não foi o melhor. Mas dois ainda é melhor que três. ", {
                size: 16,
                width: 700,
                align: "center",
            }),
            k.pos(k.center().x, k.center().y - 80),
            k.anchor("center"),
            k.color(255, 200, 100),
        ]);

        // Descrição abaixo
        root.add([
            k.text("Voce conquistou o segundo lugar na competicao.", {
                size: 18,
                width: 700,
                align: "center",
            }),
            k.pos(k.center().x, k.center().y + 120),
            k.anchor("center"),
            k.color(200, 200, 200),
        ]);
    } 
    else if (endingType === ENDING_TYPES.THIRD_PLACE) {
        // Título em cima
        root.add([
            k.text("TERCEIRO LUGAR", {
                size: 48,
            }),
            k.pos(k.center().x, 60),
            k.anchor("center"),
            k.color(205, 127, 50),
        ]);

        // Container imagem centralizado
        root.add([
            k.rect(400, 350),
            k.pos(k.center().x, k.center().y),
            k.anchor("center"),
            k.color(60, 60, 60),
        ]);

        // Texto
        root.add([
            k.text("Seu tomate não sobreviveu bem ao processo... Talvez na próxima?", {
                size: 16,
                width: 700,
                align: "center",
            }),
            k.pos(k.center().x, k.center().y - 80),
            k.anchor("center"),
            k.color(255, 100, 100),
        ]);

        // Descrição abaixo
        root.add([
            k.text("Voce ficou em ultimo lugar na competicao...", {
                size: 18,
                width: 700,
                align: "center",
            }),
            k.pos(k.center().x, k.center().y + 120),
            k.anchor("center"),
            k.color(200, 200, 200),
        ]);
    }

    root.add([
        k.text("Aperte ESPACO para voltar ao menu", {
            size: 18,
        }),
        k.pos(k.center().x, k.height() - 50),
        k.anchor("center"),
        k.color(150, 150, 150),
    ]);

    k.onKeyPress("space", () => {
        k.go("menuscene");
    });
});

export default getEndingType;