import k from "../../Engine";

export default function createLojaUI() {
    const root = k.get("root_ui")[0];
    const gameRoot = k.get("root_game")[0];
    const director = gameRoot.get("director")[0];

    const lojaMenuContainer = root.add([
        k.layer("pause"),
        k.sprite("btn_base"),
        k.pos(k.center().x, k.center().y),
        k.color(k.WHITE),
        k.anchor("center"),
        k.scale(1),
        k.fixed(),
        {
            onAction() { },
        },
        "loja_menu",
    ]);

<<<<<<< HEAD
=======
    lojaMenuContainer.width = 600;
    lojaMenuContainer.height = 400;

>>>>>>> master
    lojaMenuContainer.hidden = true;


    lojaMenuContainer.on("popupOpen", () => {
        lojaMenuContainer.hidden = false;
        director.anyUIActive = true;
        root.paused = true;
        k.tween(0, 1, 0.876, (v) => lojaMenuContainer.scaleTo(v), k.easings.easeOutBounce);
    });

    lojaMenuContainer.on("popupClose", () => {
        k.tween(1, 0, 0.876, (v) => lojaMenuContainer.scaleTo(v), k.easings.easeOutBounce).onEnd(() => {
            director.anyUIActive = false;
            root.paused = false;
            lojaMenuContainer.hidden = true;
        });
    });

    // Título
    lojaMenuContainer.add([
        k.text("LOJA", { size: 40 }),
        k.pos(0, -150),
        k.color(255, 200, 100),
        k.anchor("center"),
        k.fixed(),
    ]);

    // Mostrar quantidade de adubo
    const manureDisplay = lojaMenuContainer.add([
        k.text("", { size: 24 }),
        k.pos(0, -80),
        k.color(200, 200, 200),
        k.anchor("center"),
        k.fixed(),
    ]);

    manureDisplay.onUpdate(() => {
        manureDisplay.text = `Adubo disponível: ${director.manureCount}`;
    })

    // Opção 1: Vender Adubo por Carta
    const btnVenderAdubo = lojaMenuContainer.add([
        k.sprite("btn_base"),
        k.pos(0, -20),
        k.color(60, 60, 100),
        k.outline(2, new k.Color(100, 200, 255)),
        k.area({ isSensor: true }),
        k.anchor("center"),
<<<<<<< HEAD
        { 
            isHovered: false,
            textContent: null,
            descContent: null
        }
    ]);

    const btnVenderText = btnVenderAdubo.add([
        k.text("Vender 4 Adubo -> Pegar Carta de Upgrade", { size: 16 }),
=======
        k.fixed(),
    ]);

    btnVenderAdubo.width = 550;
    btnVenderAdubo.height = 80;

    btnVenderAdubo.add([
        k.text("[4 Adubos] -> Pegar Carta de Upgrade", { size: 16 }),
>>>>>>> master
        k.pos(0, -10),
        k.anchor("center"),
        k.fixed(),
    ]);
    btnVenderAdubo.textContent = btnVenderText;

    const btnVenderDesc = btnVenderAdubo.add([
        k.text("(Ganha 1 chance de escolher upgrade)", { size: 12 }),
        k.pos(0, 15),
        k.color(150, 150, 200),
        k.anchor("center"),
        k.fixed(),
    ]);
    btnVenderAdubo.descContent = btnVenderDesc;


    btnVenderAdubo.onUpdate(() => {
        if (btnVenderAdubo.isHovering())
            btnVenderAdubo.color = new k.Color(80, 120, 80);
        else
            btnVenderAdubo.color = new k.Color(60, 100, 60);
    })

    btnVenderAdubo.onClick(() => {
        if (lojaMenuContainer.onAction) {
            lojaMenuContainer.onAction("vender_carta");
        }
    });

    // Opção 2: Usar Adubo para Curar
    const btnCurar = lojaMenuContainer.add([
        k.sprite("btn_base"),
        k.pos(0, 80),
        k.color(60, 100, 60),
        k.outline(2, new k.Color(100, 255, 100)),
        k.area({ isSensor: true }),
        k.anchor("center"),
    ]);

    btnCurar.width = 550;
    btnCurar.height = 80;

    btnCurar.add([
        k.text("[2 Adubos] -> Curar Tomate (25%)", { size: 16 }),
        k.pos(0, -10),
        k.anchor("center"),
    ]);
    btnCurar.textContent = btnCurarText;

    const btnCurarDesc = btnCurar.add([
        k.text("(Restaura ate 25% da vida)", { size: 12 }),
        k.pos(0, 15),
        k.color(150, 200, 150),
        k.anchor("center"),
    ]);
    btnCurar.descContent = btnCurarDesc;

    btnCurar.onUpdate(() => {
        if (btnCurar.isHovering())
            btnCurar.color = new k.Color(80, 120, 80);
        else
            btnCurar.color = new k.Color(60, 100, 60);
    })

    btnCurar.onClick(() => {
        if (lojaMenuContainer.onAction) {
            lojaMenuContainer.onAction("curar_tomate");
        }
    });

    // Botão Sair
    const btnSair = lojaMenuContainer.add([
        k.sprite("btn_base"),
        k.pos(0, 170),
        k.color(80, 40, 40),
        k.outline(2, new k.Color(200, 100, 100)),
        k.area({ isSensor: true }),
        k.anchor("center"),
        k.fixed(),
    ]);

    btnSair.width = 150;
    btnSair.height = 40;

    btnSair.add([
        k.text("Sair", { size: 16 }),
        k.pos(0, 0),
        k.color(200, 100, 100),
        k.anchor("center"),
        k.fixed(),
    ]);


    btnSair.onUpdate(() => {
        if (btnSair.isHovering())
            btnSair.color = new k.Color(120, 60, 60);
        else
            btnSair.color = new k.Color(80, 40, 40);
    })

    btnSair.onClick(() => {
        lojaMenuContainer.trigger("popupClose");
    });



    return {
        show(onAction) {
            lojaMenuContainer.onAction = onAction;

            lojaMenuContainer.trigger("popupOpen");

            manureDisplay.text = `Adubo disponível: ${director.manureCount}`;

            if (director.manureCount < 4) {
                btnVenderAdubo.color = new k.Color(40, 40, 60);
                btnVenderAdubo.children[0].color = new k.Color(100, 100, 150);
            } else {
                btnVenderAdubo.color = new k.Color(60, 60, 100);
                btnVenderAdubo.children[0].color = new k.Color(100, 200, 255);
            }

            if (director.manureCount < 2) {
                btnCurar.color = new k.Color(40, 60, 40);
                btnCurar.children[0].color = new k.Color(100, 150, 100);
            } else {
                btnCurar.color = new k.Color(60, 100, 60);
                btnCurar.children[0].color = new k.Color(100, 255, 100);
            }
        },

        hide() {
            lojaMenuContainer.trigger("popupClose");
        },
    };
}