import k from "../../Engine";


export default function createPauseMenu() {
    // Fundo Escuro
    // fundo semi-transparente que escurece a tela
    const menuPauseContainer = k.add([
        k.rect(k.width(), k.height()), // retangulo que cobre toda a tela
        k.color(0, 0, 0), // cor preta
        k.opacity(0.7), // 70% transparente (deixa a tela atrás visivel mas escura)
        k.fixed(), // fica fixo na camera

        {
            enabled: false,
        }
    ]);

    // Tituloo
    // texto "PAUSADO" no topo
    menuPauseContainer.add([
        k.text("PAUSADO", { size: 64, weight: "bold" }), // texto grande e grosso
        k.pos(k.center().x, k.center().y - 150), // posiciona no centro da tela
        k.anchor("center"), // ponto de referencia eh o centro
        k.color(k.WHITE), // cor branca
        k.fixed(), // fica fixo na camera
    ]);

    // ===== BOTAO CONTINUAR =====
    // botao verde pra voltar ao jogo
    const btnContinuar = menuPauseContainer.add([
        k.rect(300, 80, { radius: 10 }), // retangulo 300x80 com cantos arredondados
        k.pos(k.center().x, k.center().y - 20), // posiciona no centro
        k.color(k.Color.fromHex("#22c55e")), // cor verde
        k.area(), // permite detectar cliques
        k.anchor("center"), // ponto de referencia eh o centro
        k.fixed(), // fica fixo na camera
    ]);

    // texto "Continuar" dentro do botao
    btnContinuar.add([
        k.text("Continuar", { size: 40, weight: "bold" }),
        k.anchor("center"),
    ]);

    // quando clica no botao continuar
    btnContinuar.onClick(() => {
        menuPauseContainer.enabled = false;
    });

    // ===== HOVER DO BOTAO CONTINUAR =====
    // quando passa mouse por cima, botao fica mais claro
    btnContinuar.onHover(() => {
        btnContinuar.color = k.Color.fromHex("#4ade80"); // verde mais claro
    });

    // quando tira mouse, volta ao normal
    btnContinuar.onHoverEnd(() => {
        btnContinuar.color = k.Color.fromHex("#22c55e"); // volta ao verde original
    });

    // Botao Menu
    // botao vermelho pra voltar ao menu principal
    const btnMenu = menuPauseContainer.add([
        k.rect(300, 80, { radius: 10 }), // retangulo 300x80 com cantos arredondados
        k.pos(k.center().x, k.center().y + 100), // posiciona abaixo do botao continuar
        k.color(k.Color.fromHex("#a80202")), // cor vermelha
        k.area(), // permite detectar cliques
        k.anchor("center"), // ponto de referencia eh o centro
        k.fixed(), // fica fixo na camera
    ]);

    // texto "Menu" dentro do botao
    btnMenu.add([
        k.text("Menu", { size: 40, weight: "bold" }),
        k.anchor("center"),
    ]);

    // quando clica no botao menu
    btnMenu.onClick(() => {
        // vai pro menu principal
        k.go("menuscene");
    });

    // Hover do botao de menu
    // quando passa mouse por cima, botao fica mais claro
    btnMenu.onHover(() => {
        btnMenu.color = k.Color.fromHex("#f87171"); // vermelho mais claro
    });

    // quando tira mouse, volta ao normal
    btnMenu.onHoverEnd(() => {
        btnMenu.color = k.Color.fromHex("#a80202"); // volta ao vermelho original
    });

    return menuPauseContainer;
}