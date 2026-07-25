import k from "../Engine";


export const ENDING_TYPES = {
    FIRST_PLACE: "first",
    SECOND_PLACE: "second",
    THIRD_PLACE: "third",
};


function getEndingType(tomatoHealth, maxHealth) {
    const healthPercentage = (tomatoHealth / maxHealth) * 100;

    if (healthPercentage >= 75) {
        return ENDING_TYPES.FIRST_PLACE;      // Muito bom  75% ou mais
    } else if (healthPercentage >= 40) {
        return ENDING_TYPES.SECOND_PLACE;     // Bom. 40-75%
    } else {
        return ENDING_TYPES.THIRD_PLACE;      // Ruim. Menos de 40%
    }
}


k.scene("ending", (data) => {
    const endingType = data.endingType;
    const tomatoHealth = data.tomatoHealth;


    const root = k.add([
        k.layer("ui"),
    ]);

    if (endingType === ENDING_TYPES.FIRST_PLACE) {
        root.add([
            k.pos(k.center()),
            k.sprite("teste"),          //isso não ta funcionando por algum motivo
            k.anchor("center"),
            k.scale(1),
            k.layer("background"),       // Fica no fundo
            k.z(10),
        ]);


        /*
        root.add([
            k.rect(k.width(), k.height()),
            k.color(0, 0, 0, 0.3),      // Preto com 30% opacidade
            k.layer("ui"),              // Fica entre o background e o texto
        ]);
        */


        // Fundo do título
        root.add([
            k.rect(500, 80),
            k.pos(k.width() / 2 - 250, 20),
            k.color(0, 0, 0, 0.7),      // Preto 70% opaco
            k.anchor("topleft"),
            k.layer("ui"),
        ]);

        // Texto do título
        root.add([
            k.text(" PRIMEIRO LUGAR ", {
                size: 48,
            }),
            k.pos(k.width() / 2, 60),
            k.anchor("center"),
            k.color(255, 215, 0),        // Ouro
            k.layer("ui"),
        ]);


        // Fundo do texto
        root.add([
            k.rect(450, 120),
            k.pos(40, k.height() / 2.5 - 60),
            k.color(0, 0, 0, 0.7),
            k.anchor("topleft"),
            k.layer("ui"),
        ]);

        // Texto em si
        root.add([
            k.text("Depois de tres dias e tres noites de trabalho arduo, seu esforco foi recompensado.", {
                size: 20,
                width: 430,
                align: "center",
            }),
            k.pos(265, k.height() / 2.5),
            k.anchor("center"),
            k.color(100, 255, 100),      // Verde
            k.layer("ui"),
        ]);


        // Fundo da saúde
        root.add([
            k.rect(450, 80),
            k.pos(k.width() - 490, k.height() / 2.5 - 40),
            k.color(0, 0, 0, 0.7),
            k.anchor("topleft"),
            k.layer("ui"),
        ]);

        // Texto da saúde
        root.add([
            k.text(`Saude do tomate: ${tomatoHealth.toFixed(0)}/100`, {
                size: 28,
            }),
            k.pos(k.width() - 265, k.height() / 2.5),
            k.anchor("center"),
            k.color(255, 255, 255),      // Branco
            k.layer("ui"),
        ]);


        // Fundo da mensagem
        root.add([
            k.rect(600, 60),
            k.pos(k.width() / 2 - 300, k.height() - 120),
            k.color(0, 0, 0, 0.7),
            k.anchor("topleft"),
            k.layer("ui"),
        ]);

        // Texto da mensagem
        root.add([
            k.text("Voce conquistou o primeiro lugar na competicao!", {
                size: 22,
            }),
            k.pos(k.width() / 2, k.height() - 90),
            k.anchor("center"),
            k.color(200, 200, 200),
            k.layer("ui"),
        ]);


        root.add([
            k.text("Aperte ESPACO para voltar ao menu", {
                size: 16,
            }),
            k.pos(k.width() / 2, k.height() - 30),
            k.anchor("center"),
            k.color(150, 150, 150),
            k.layer("ui"),
        ]);
    }


    else if (endingType === ENDING_TYPES.SECOND_PLACE) {

        root.add([
            k.text(" SEGUNDO LUGAR ", {
                size: 48,
            }),
            k.pos(k.center().x, k.height() / 4),
            k.anchor("center"),
            k.color(192, 192, 192),
        ]);

        root.add([
            k.text("O segundo lugar e bom, mas nao e o melhor... Pelo menos teve alguem pior do que voce", {
                size: 32,
                width: 900,
                align: "center",
            }),
            k.pos(k.center().x, k.height() / 2.5),
            k.anchor("center"),
            k.color(255, 200, 100),
        ]);

        root.add([
            k.text(`Saude do tomate: ${tomatoHealth.toFixed(0)}/100`, {
                size: 24,
            }),
            k.pos(k.center().x, k.height() / 2),
            k.anchor("center"),
            k.color(255, 255, 255),
        ]);

        root.add([
            k.text("Voce conquistou o segundo lugar na competicao.", {
                size: 20,
            }),
            k.pos(k.center().x, k.height() / 1.7),
            k.anchor("center"),
            k.color(200, 200, 200),
        ]);
    }


    else if (endingType === ENDING_TYPES.THIRD_PLACE) {

        root.add([
            k.text(" TERCEIRO LUGAR ", {
                size: 48,
            }),
            k.pos(k.center().x, k.height() / 4),
            k.anchor("center"),
            k.color(205, 127, 50),
        ]);

        root.add([
            k.text("Alguns diriam que tres e demais... Quem sabe no ano que vem?", {
                size: 32,
                width: 900,
                align: "center",
            }),
            k.pos(k.center().x, k.height() / 2.5),
            k.anchor("center"),
            k.color(255, 100, 100),
        ]);

        root.add([
            k.text(`Saude do tomate: ${tomatoHealth.toFixed(0)}/100`, {
                size: 24,
            }),
            k.pos(k.center().x, k.height() / 2),
            k.anchor("center"),
            k.color(255, 255, 255),
        ]);

        root.add([
            k.text("Voce ficou em ultimo lugar...", {
                size: 20,
            }),
            k.pos(k.center().x, k.height() / 1.7),
            k.anchor("center"),
            k.color(200, 200, 200),
        ]);
    }


    if (endingType !== ENDING_TYPES.FIRST_PLACE) {
        root.add([
            k.text("Aperte ESPACO para voltar ao menu", {
                size: 18,
            }),
            k.pos(k.center().x, k.height() - 50),
            k.anchor("center"),
            k.color(150, 150, 150),
        ]);
    }


    k.onKeyPress("space", () => {
        k.go("menuscene");
    });
});

export default getEndingType;