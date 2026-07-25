import k from "../../Engine";

export default function createLojaUI() {
    const root = k.get("root_ui")[0];
    const gameRoot = k.get("root_game")[0];
    const director = gameRoot.get("director")[0];

    const lojaMenuContainer = root.add([
        k.layer("pause"),
        k.pos(k.center().x, k.center().y),
        k.anchor("center"),
        k.rect(600, 400),
        k.color(20, 20, 20),
        k.opacity(0.95),
        k.fixed(),  
        {
            manureCount: 0,
            onAction: null,
        },
        "loja_menu",
    ]);

     
    lojaMenuContainer.hidden = true;

    // Borda
    lojaMenuContainer.add([
        k.rect(600, 400),
        k.pos(0, 0),
        k.outline(4, k.color(200, 150, 100)),
        k.anchor("center"),
    ]);

    // Título
    lojaMenuContainer.add([
        k.text("LOJA", { size: 40 }),
        k.pos(0, -150),
        k.color(255, 200, 100),
        k.anchor("center"),
    ]);

    // Mostrar quantidade de adubo
    const manureDisplay = lojaMenuContainer.add([
        k.text("", { size: 24 }),
        k.pos(0, -80),
        k.color(200, 200, 200),
        k.anchor("center"),
    ]);

    // Opção 1: Vender Adubo por Carta
    const btnVenderAdubo = lojaMenuContainer.add([
        k.rect(500, 70),
        k.pos(0, -20),
        k.color(60, 60, 100),
        k.outline(2, k.color(100, 200, 255)),
        k.area({ isSensor: true }),
        k.anchor("center"),
        { isHovered: false }
    ]);

    btnVenderAdubo.add([
        k.text("Vender 4 Adubo -> Pegar Carta de Upgrade", { size: 16 }),
        k.pos(0, -10),
        k.color(100, 200, 255),
        k.anchor("center"),
    ]);

    btnVenderAdubo.add([
        k.text("(Ganha 1 chance de escolher upgrade)", { size: 12 }),
        k.pos(0, 15),
        k.color(150, 150, 200),
        k.anchor("center"),
    ]);

    btnVenderAdubo.onHover(() => {
        btnVenderAdubo.color = k.color(80, 80, 120);
        btnVenderAdubo.isHovered = true;
    });

    btnVenderAdubo.onHoverEnd(() => {
        btnVenderAdubo.color = k.color(60, 60, 100);
        btnVenderAdubo.isHovered = false;
    });

    btnVenderAdubo.onClick(() => {
        if (lojaMenuContainer.onAction) {
            lojaMenuContainer.onAction("vender_carta");
        }
    });

    // Opção 2: Usar Adubo para Curar
    const btnCurar = lojaMenuContainer.add([
        k.rect(500, 70),
        k.pos(0, 80),
        k.color(60, 100, 60),
        k.outline(2, k.color(100, 255, 100)),
        k.area({ isSensor: true }),
        k.anchor("center"),
        { isHovered: false }
    ]);

    btnCurar.add([
        k.text("Usar 2 Adubo -> Curar Tomate (25%)", { size: 16 }),
        k.pos(0, -10),
        k.color(100, 255, 100),
        k.anchor("center"),
    ]);

    btnCurar.add([
        k.text("(Restaura ate 25% da vida)", { size: 12 }),
        k.pos(0, 15),
        k.color(150, 200, 150),
        k.anchor("center"),
    ]);

    btnCurar.onHover(() => {
        btnCurar.color = k.color(80, 120, 80);
        btnCurar.isHovered = true;
    });

    btnCurar.onHoverEnd(() => {
        btnCurar.color = k.color(60, 100, 60);
        btnCurar.isHovered = false;
    });

    btnCurar.onClick(() => {
        if (lojaMenuContainer.onAction) {
            lojaMenuContainer.onAction("curar_tomate");
        }
    });

    // Botão Sair
    const btnSair = lojaMenuContainer.add([
        k.rect(150, 50),
        k.pos(0, 170),
        k.color(80, 40, 40),
        k.outline(2, k.color(200, 100, 100)),
        k.area({ isSensor: true }),
        k.anchor("center"),
        { isHovered: false }
    ]);

    btnSair.add([
        k.text("Sair", { size: 16 }),
        k.pos(0, 0),
        k.color(200, 100, 100),
        k.anchor("center"),
    ]);

    btnSair.onHover(() => {
        btnSair.color = k.color(120, 60, 60);
    });

    btnSair.onHoverEnd(() => {
        btnSair.color = k.color(80, 40, 40);
    });

    btnSair.onClick(() => {
        lojaMenuContainer.hidden = true; // Esconde com hidden nativo
        director.anyUIActive = false;
    });

    return {
        show(manureCount, onAction) {
            lojaMenuContainer.manureCount = manureCount;
            lojaMenuContainer.onAction = onAction;
            
            lojaMenuContainer.hidden = false; // Mostra a UI
            director.anyUIActive = true;

            manureDisplay.text = `Adubo disponível: ${manureCount}`;

            if (manureCount < 4) {
                btnVenderAdubo.color = k.color(40, 40, 60);
                btnVenderAdubo.children[0].color = k.color(100, 100, 150);
            } else {
                btnVenderAdubo.color = k.color(60, 60, 100);
                btnVenderAdubo.children[0].color = k.color(100, 200, 255);
            }

            if (manureCount < 2) {
                btnCurar.color = k.color(40, 60, 40);
                btnCurar.children[0].color = k.color(100, 150, 100);
            } else {
                btnCurar.color = k.color(60, 100, 60);
                btnCurar.children[0].color = k.color(100, 255, 100);
            }
        },

        hide() {
            lojaMenuContainer.hidden = true; // Esconde com hidden nativo
            director.anyUIActive = false;
        },
    };
}