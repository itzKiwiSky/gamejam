import k from "../Engine";

k.scene("gameoverscene", () => {
    k.add([
        k.pos(k.center().x, 97),
        k.anchor("center"),
        k.text("Game Over!", {
            size: 40,
        }),
    ]);

    const playBtn = k.add([ // cria um botao chamado playBtn e armazena em uma variavel
        k.rect(380, 80, { radius: 10 }), // radius deixa os cantos rendondinhos
        k.pos(k.center().x, 350), // centralizado horizontalmente, 350 do topo
        k.color(k.Color.fromHex("#29e438")), // cor verde
        k.area(), // ativa a deteccao de clique e colisao
        k.anchor("center"),
    ])

    playBtn.add([
        k.text("Jogar de novo", { size: 30, weight: "bold" }),
        k.anchor("center"),
    ])

    playBtn.onClick(() => {
        // vai pra cena "playscene" (a musica para automaticamente)
        k.go("playscene")
    })

    // Hover do Play
    playBtn.onUpdate(() => {
        if (playBtn.isHovering())
            playBtn.color = k.Color.fromHex("#4ade80") // converte codigo de cor hexadecimal em RGB
        else
            playBtn.color = k.Color.fromHex("#22c55e")
    })

    // Botao sair
    const exitBtn = k.add([
        k.rect(470, 80, { radius: 10 }),
        k.pos(k.center().x, 470),
        k.color(k.Color.fromHex("#a80202")),
        k.area(),
        k.anchor("center"),
    ])

    exitBtn.add([
        k.text("Voltar ao menu", { size: 30, weight: "bold" }),
        k.anchor("center"),
    ])
    // quando clica em sair

    exitBtn.onClick(() => {
        k.go("menuscene") // fecha o jogo
    })

    // Hover do Sair
    exitBtn.onUpdate(() => {
        if (exitBtn.isHovering())
            exitBtn.color = k.Color.fromHex("#f87171")
        else
            exitBtn.color = k.Color.fromHex("#dc2626")
    })
});