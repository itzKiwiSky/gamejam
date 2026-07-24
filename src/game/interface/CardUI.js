import k from "../../Engine";

export default function createCardUI() {
    const root = k.get("root_ui")[0];
    const gameRoot = k.get("root_game")[0];
    const director = gameRoot.get("director")[0];

    const cardMenuContainer = root.add([
        k.layer("pause"),
        k.pos(k.width() / 2, k.height() / 2),
        k.anchor("center"),
        k.color(0, 0, 0),
        k.opacity(0.6),
        k.scale(1),
        k.fixed(),

        {
            selectedCard: null,
            onCardSelected: null,
            menuActive: false,
        },

        "card_menu",
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

    const titleContainer = cardMenuContainer.add([
        k.pos(0, -240),
        k.anchor("center"),
    ]);

    titleContainer.add([
        k.text("Escolha seu upgrade", {
            size: 32,
        }),
        k.pos(0, 0),
        k.color(255, 200, 100),
        k.anchor("center"),
    ]);

    const cardsContainer = cardMenuContainer.add([
        k.pos(0, 30),
        k.anchor("center"),
        "cards_container",
    ]);


    function renderCard(card, index) {
        const spacing = 120;
        const xPos = (index - 1) * (160 + spacing);

        const cardObj = cardsContainer.add([
            k.sprite("carddd"),
            k.pos(xPos, 0),
            k.area({ isSensor: true }),
            k.anchor("center"),
            k.scale(1),
            {
                cardData: card,
            }
        ]);

        cardObj.add([
            k.text(card.nome, {
                size: 16,
                width: 140,
                align: "center",
            }),
            k.pos(0, -70),
            k.anchor("center"),
            k.color(255, 220, 120),
            k.z(10),
        ]);

        cardObj.add([
            k.text(card.icon, {
                size: 40,
            }),
            k.pos(0, -15),
            k.anchor("center"),
            k.z(10),
        ]);

        cardObj.add([
            k.text(card.descricao, {
                size: 13,
                width: 140,
                align: "center",
            }),
            k.pos(0, 25),
            k.anchor("center"),
            k.color(220, 220, 220),
            k.z(10),
        ]);

        cardObj.onUpdate(() => {
            if (cardObj.isHovering()) {
                cardObj.scale = k.vec2(1.15, 1.15);
            } else {
                cardObj.scale = k.vec2(1, 1);
            }
        });

        cardObj.onClick(() => {
            if (!cardMenuContainer.menuActive)
                return;

            cardMenuContainer.selectedCard = card;

            if (cardMenuContainer.onCardSelected) {
                cardMenuContainer.onCardSelected(card);
            }

            cardMenuContainer.trigger("popupClose");
        });

        return cardObj;
    }

    return {

        hide() {
            cardMenuContainer.hidden = true;
        },

        showCards(cardsArray, onCardSelectedCallback) {
            cardsContainer.removeAll();

            cardsArray.forEach((card, index) => {
                renderCard(card, index);
            });

            cardMenuContainer.onCardSelected = onCardSelectedCallback;
            cardMenuContainer.trigger("popupOpen");
        },

        getContainer() {
            return cardMenuContainer;
        },
    };
}