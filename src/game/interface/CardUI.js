import k from "../../Engine";

export default function createCardUI() {
    const root = k.get("root_ui")[0];
    const gameRoot = k.get("root_game")[0];
    const director = gameRoot.get("director")[0];

    //console.log(director);

    const cardMenuContainer = root.add([
        k.layer("pause"),
        k.pos(48, 48),
        k.rect(k.width() - 48 * 2, k.height() - 48 * 2, {
            radius: 15
        }),      // Retângulo do tamanho da tela
        k.color(k.BLACK),              // Preto com 60% transparência
        k.opacity(0.6),
        k.scale(1),
        k.fixed(),

        {
            selectedCard: null,              // Nenhuma carta selecionada ainda
            onCardSelected: null,            // Callback  
            menuActive: false,
        },

        "card_menu",                         // Tag 
    ]);

    cardMenuContainer.on("popupOpen", () => {

        cardMenuContainer.hidden = false;
        cardMenuContainer.menuActive = true;
        director.anyUIActive = true;
        k.tween(0, 1, 0.876, (v) => cardMenuContainer.scaleTo(v), k.easings.easeOutBounce);
    });

    cardMenuContainer.on("popupClose", () => {

        k.tween(1, 0, 0.876, (v) => cardMenuContainer.scaleTo(v), k.easings.easeOutBounce).onEnd(() => {
            cardMenuContainer.menuActive = false;
            director.anyUIActive = false;
            cardMenuContainer.hidden = true;
        });
    });

    cardMenuContainer.add([
        k.rect(cardMenuContainer.width, cardMenuContainer.height, {
            radius: 15,
            fill: false,
        }),
        k.outline(6, new k.Color(255, 200, 100))
    ]);

    cardMenuContainer.add([
        k.text("Escolha seu upgrade", {
            size: 35,
        }),
        k.pos(cardMenuContainer.width * 0.5, 32),                      // Posição: meio horizontal, 20px do topo
        k.color(255, 200, 100),              // Amarelo 
        k.anchor("center"),
    ]);

    const cardsContainer = cardMenuContainer.add([
        k.pos(30, 80),                       // Começa 30px da esquerda, 80px do topo
        "cards_container",                   // Tag
    ]);


    function renderCard(card, index) {
        // Dimensões de cada carta
        const cardWidth = 260;
        const cardHeight = 280;
        const spacing = 20;                  // Espaço entre elas
        const xPos = index * (cardWidth + spacing); // Posição X (0, 280, 560)


        const cardObj = cardsContainer.add([
            k.rect(cardWidth, cardHeight),
            k.pos(xPos, 0),
            k.color(40, 40, 50),             // Fundo cinza-azulado  
            k.area({ isSensor: true }),
            k.anchor("topleft"),
            {
                cardData: card,              // Guarda referência pra carta
            }
        ]);

        //borda
        cardObj.add([
            k.rect(cardWidth, cardHeight),
            k.pos(0, 0),                     // Posição relativa (canto da carta)
            k.outline(2, k.color(100, 200, 255)), // Borda azul, 2px
        ]);

        //nome da carta
        cardObj.add([
            k.text(card.nome, {
                size: 16,
                font: "monospace",
                width: cardWidth - 20,
                align: "center",
            }),
            k.pos(cardWidth / 2, 15),
            k.anchor("top"),
            k.color(255, 200, 100),
        ]);


        //Icone da Carta
        cardObj.add([
            k.text(card.icon, {
                size: 40,
                font: "monospace",
            }),
            k.pos(cardWidth / 2, 50),
            k.anchor("center"),
            k.color(150, 255, 150),         // Verde 
        ]);


        //Descrição da carta

        cardObj.add([
            k.text(card.descricao, {
                size: 12,
                font: "monospace",
                width: cardWidth - 20,
                align: "center",
            }),
            k.pos(cardWidth / 2, 120),
            k.anchor("top"),
            k.color(200, 200, 200),         // Cinza claro
        ]);

        //Tag do tipo
        cardObj.add([
            k.rect(cardWidth - 40, 30),
            k.pos(20, cardHeight - 50),
            k.color(100, 100, 150),
            k.anchor("topleft"),
            k.outline(1, k.color(150, 150, 200)), // Borda mais clara
        ]);

        // texto do tipo
        cardObj.add([
            k.text(card.tipo, {
                size: 12,
                font: "monospace",
            }),
            k.pos(cardWidth / 2, cardHeight - 35), // Meio horizontal
            k.anchor("center"),
            k.color(200, 200, 255),         // Azul claro
        ]);

        //hover
        cardObj.onUpdate(() => {
            if (cardObj.isHovering())
                cardObj.color = k.color(60, 60, 80);
            else
                cardObj.color = k.color(40, 40, 50);
        });



        //click
        cardObj.onClick(() => {
            if (!cardMenuContainer.menuActive)
                return;

            cardMenuContainer.selectedCard = card;

            // Chama o callback se existir
            if (cardMenuContainer.onCardSelected) {
                cardMenuContainer.onCardSelected(card);
            }

            cardMenuContainer.trigger("popupClose");
        });

        return cardObj; // Retorna a carta (por enquanto não usa)
    }

    return {

        hide() {
            cardMenuContainer.hidden = true;
        },

        showCards(cardsArray, onCardSelectedCallback) {
            // Remove todas as cartas antigas (se houver)
            cardsContainer.removeAll();

            // Renderiza as 3 novas cartas
            cardsArray.forEach((card, index) => {
                renderCard(card, index);
            });

            // Salva o callback pra quando alguma carta for clicada
            cardMenuContainer.onCardSelected = onCardSelectedCallback;

            // Mostra o menu na tela
            cardMenuContainer.hidden = false;
        },

        getContainer() {
            return cardMenuContainer;
        },
    };
}