import k from "../../Engine";

export default function createCardUI() {
    const cardMenuContainer = k.add([
        k.layer("pause"),
        "card_menu",
        {
            selectedCard: null,
            onCardSelected: null,
        }
    ]);

    cardMenuContainer.hidden=true;

    cardMenuContainer.add([
        k.rect(k.width(), k.height()),
        k.color(0, 0, 0, 0.6),
        k.layer("pause"),
    ]);

    const cardPanel = cardMenuContainer.add([
        k.rect(900, 400),
        k.pos(k.width() / 2 - 450, k.height() / 2 - 200),
        k.color(20, 20, 20),
        k.anchor("topleft"),
        "card_panel",
    ]);

    cardPanel.add([
        k.text("Escolha seu upgrade", {
            size: 28,
            font: "monospace",
            width: 900,
        }),
        k.pos(450, 20),
        k.anchor("top"),
        k.color(255, 200, 100),
    ]);

    const cardsContainer = cardPanel.add([
        k.pos(30, 80),
        "cards_container",
    ]);

    function renderCard(card, index) {
        const cardWidth = 260;
        const cardHeight = 280;
        const spacing = 20;
        const xPos = index * (cardWidth + spacing);

        const cardObj = cardsContainer.add([
            k.rect(cardWidth, cardHeight),
            k.pos(xPos, 0),
            k.color(40, 40, 50),
            k.anchor("topleft"),
            k.area(),
            {
                cardData: card,
                isHovered: false,
            }
        ]);

        cardObj.add([
            k.rect(cardWidth, cardHeight),
            k.pos(0, 0),
            k.outline(2, k.color(100, 200, 255)),
        ]);

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

        cardObj.add([
            k.text(card.icon, {
                size: 40,
                font: "monospace",
            }),
            k.pos(cardWidth / 2, 50),
            k.anchor("center"),
            k.color(150, 255, 150),
        ]);

        cardObj.add([
            k.text(card.descricao, {
                size: 12,
                font: "monospace",
                width: cardWidth - 20,
                align: "center",
            }),
            k.pos(cardWidth / 2, 120),
            k.anchor("top"),
            k.color(200, 200, 200),
        ]);

        cardObj.add([
            k.rect(cardWidth - 40, 30),
            k.pos(20, cardHeight - 50),
            k.color(100, 100, 150),
            k.anchor("topleft"),
            k.outline(1, k.color(150, 150, 200)),
        ]);

        cardObj.add([
            k.text(card.tipo, {
                size: 12,
                font: "monospace",
            }),
            k.pos(cardWidth / 2, cardHeight - 35),
            k.anchor("center"),
            k.color(200, 200, 255),
        ]);

        cardObj.onHover(() => {
            cardObj.color = k.color(60, 60, 80);
            cardObj.isHovered = true;
        });

        cardObj.onHoverEnd(() => {
            cardObj.color = k.color(40, 40, 50);
            cardObj.isHovered = false;
        });

        cardObj.onClick(() => {
            cardMenuContainer.selectedCard = card;
            if (cardMenuContainer.onCardSelected) {
                cardMenuContainer.onCardSelected(card);
            }
            cardMenuContainer.hidden = true;
        });

        return cardObj;
    }

    return {
        showCards(cardsArray, onCardSelectedCallback) {
            cardsContainer.removeAll();
            cardsArray.forEach((card, index) => {
                renderCard(card, index);
            });
            cardMenuContainer.onCardSelected = onCardSelectedCallback;
            cardMenuContainer.hidden = false;
        },

        hide() {
            cardMenuContainer.hidden = true;
        },

        getContainer() {
            return cardMenuContainer;
        },
    };
}