//Sistema visual das cartas

import k from "../../Engine";
export default function createCardUI() {


    //Container Principal
    const root = k.get("root_ui")[0];
    const gameRoot = k.get("root_game")[0];

    const cardMenuContainer = gameRoot.add([
        k.layer("pause"),
        k.fixed(),
        "card_menu",                         // Tag 
        {
            visible: false,                  // Começa escondido
            selectedCard: null,              // Nenhuma carta selecionada ainda
            onCardSelected: null,            // Callback  
        },
    ]);


    //Background     
    // 0.6 = 60% opacidade
    cardMenuContainer.add([
        k.rect(k.width(), k.height()),      // Retângulo do tamanho da tela
        k.color(0, 0, 0, 0.6),              // Preto com 60% transparência
        k.layer("pause"),
    ]);

    /**
     //Painel Principal
       900 pixels de largura
       400 pixels de altura
       Centralizado: (width/2 - 450) pra x, (height/2 - 200) pra y
     */
    const cardPanel = cardMenuContainer.add([
        k.rect(900, 400),                   // Retângulo 900x400
        k.pos(
            k.width() / 2 - 450,             // Centraliza em X
            k.height() / 2 - 200             // Centraliza em Y
        ),
        k.color(20, 20, 20),                // Fundo cinza
        k.anchor("topleft"),                // Âncora 
        "card_panel",                       // Tag
    ]);

    //Titulo do Menu
    cardPanel.add([
        k.text("Escolha seu upgrade", {
            size: 28,
            font: "monospace",
            width: 900,
        }),
        k.pos(450, 20),                      // Posição: meio horizontal, 20px do topo
        k.anchor("top"),
        k.color(255, 200, 100),              // Amarelo 
    ]);



    //Container

    const cardsContainer = cardPanel.add([
        k.pos(30, 80),                       // Começa 30px da esquerda, 80px do topo
        "cards_container",                   // Tag
    ]);


    //Renderizar carta

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
            k.anchor("topleft"),
            {
                cardData: card,              // Guarda referência pra carta
                isHovered: false,            // Controla estado de hover
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

        cardObj.onHover(() => {
            cardObj.color = k.color(60, 60, 80); // Fica mais clara (ilumina)
            cardObj.isHovered = true;
        });

        //final do hover
        cardObj.onHoverEnd(() => {
            cardObj.color = k.color(40, 40, 50); // Volta pro cinza original
            cardObj.isHovered = false;
        });

        //click

        cardObj.onClick(() => {
            cardMenuContainer.selectedCard = card;

            // Chama o callback se existir
            if (cardMenuContainer.onCardSelected) {
                cardMenuContainer.onCardSelected(card);
            }

            // Fecha o menu
            cardMenuContainer.visible = false;
        });

        return cardObj; // Retorna a carta (por enquanto não usa)
    }

    return {

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
            cardMenuContainer.visible = true;
        },


        hide() {
            cardMenuContainer.visible = false;
        },

        getContainer() {
            return cardMenuContainer;
        },
    };
}