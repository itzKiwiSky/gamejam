import k from "../Engine";
// () => funcao curta

  k.scene("menuscene", () => {
    // Fundo
   k.add([
    k.rect(k.width(), k.height()),
    k.color(10, 10, 35),
    k.fixed(), // fixa o fundo na camera
    // cria um retangulo pra ocupar toda largura e altura da tela
    // e coloca a cor tambem
  ]) // tudo dentro do [] faz parte do retangulo

  // Titulo
    k.add([ // pra adicionar coisas na tela
     k.text("Teste", { size: 64, weight: "bold" }),
      k.pos(k.center().x, 150), // horizontal, centralizado
     k.anchor("center"), // ponto de referencia eh o centro
     k.color(k.Color.fromHex("#dd2100")), // cor vermelha
   ])

  // Botao Play
   const playBtn = k.add([ // cria um botao chamado playBtn e armazena em uma variavel
      k.rect(300, 80, { radius: 10 }), // radius deixa os cantos rendondinhos
     k.pos(k.center().x, 350), // centralizado horizontalmente, 350 do topo
     k.color(k.Color.fromHex("#29e438")), // cor verde
     k.area(), // ativa a deteccao de clique e colisao
      k.anchor("center"),
    ])

    playBtn.add([
      k.text("Play", { size: 40, weight: "bold" }),
      k.anchor("center"),
    ])

    playBtn.onClick(() => {
      k.go("playscene") // vai pra cena "PlayScene"
    })

        // Hover do Play
        playBtn.onHover(() => {
           playBtn.color = k.Color.fromHex("#4ade80") // converte codigo de cor hexadecimal em RGB
    })

        playBtn.onHoverEnd(() => {
          playBtn.color = k.Color.fromHex("#22c55e")
         })

  // Botao sair
    const exitBtn = k.add([
     k.rect(300, 80, { radius: 10 }),
      k.pos(k.center().x, 470),
     k.color(k.Color.fromHex("#a80202")),
     k.area(),
     k.anchor("center"),
    ])

       exitBtn.add([
          k.text("Sair", { size: 40, weight: "bold" }),
          k.anchor("center"),
       ])
  // quando clica em sair

           exitBtn.onClick(() => {
              k.quit() // fecha o jogo
            })

         // Hover do Sair
            exitBtn.onHover(() => {
             exitBtn.color = k.Color.fromHex("#f87171")
           })

             exitBtn.onHoverEnd(() => {
               exitBtn.color = k.Color.fromHex("#dc2626")
              })

    // Botao de configuracoes (som)
    const settingsBtn = k.add([
     k.rect(60, 60, { radius: 5 }),
     k.pos(k.width() - 80, 30),
      k.color(k.Color.fromHex("#646464")),
      k.area(),
     k.anchor("center"),
     k.fixed(),
    ])

        settingsBtn.add([
          k.text("Som", { size: 24 }),
         k.anchor("center"),
        ])

            // Barra de volume
              let volumeAtual = 1
              let barraMostrando = false // controla se a barra ta visivel
              const barraX = k.width() - 250 // posicao X da barra (mais perto do botao)
              const barraLargura = 150 // largura da barra
              const barraY = 30

    // Fundo da barra (preto)
    const volumeBarBg = k.add([
    k.rect(barraLargura, 20),
    k.pos(barraX, barraY),
    k.color(k.Color.fromHex("#1a1a1a")),
    k.area(),
    k.anchor("center"),
    k.fixed(),
    k.opacity(0), // comeca invisivel
  ])

  // Indicador da barra (verde - mostra volume atual)
  const volumeBarFill = k.add([
    k.rect(barraLargura * volumeAtual, 20),
    k.pos(barraX, barraY),
    k.color(k.Color.fromHex("#22c55e")),
    k.anchor("center"),
    k.fixed(),
    k.opacity(0), // comeca invisivel
  ])

  // Texto do percentual
  const volumeText = k.add([
    k.text("100%", { size: 14 }),
    k.pos(barraX + 100, barraY),
    k.anchor("center"),
    k.color(k.WHITE),
    k.fixed(),
    k.opacity(0), // comeca invisivel
  ])

  // Quando clica no botao de som, mostra/esconde a barra
  settingsBtn.onClick(() => {
    barraMostrando = !barraMostrando // inverte o estado
    
    // mostra ou esconde a barra
    if (barraMostrando) {
      volumeBarBg.opacity = 1
      volumeBarFill.opacity = 1
      volumeText.opacity = 1
    } else {
      volumeBarBg.opacity = 0
      volumeBarFill.opacity = 0
      volumeText.opacity = 0
    }
  })

  // Quando clica ou arrasta na barra, muda o volume
  volumeBarBg.onMousePress(() => {
    atualizarVolume()
  })

  // Tambem atualiza enquanto arrasta (drag)
  k.onMouseMove(() => {
    if (barraMostrando && k.isMousePressed()) {
      atualizarVolume()
    }
  })

  // Funcao auxiliar pra calcular e atualizar o volume
  function atualizarVolume() {
    const mousePos = k.mousePos() // pega a posicao do mouse
    const esquerda = barraX - (barraLargura / 2) // comeco da barra
    const direita = barraX + (barraLargura / 2) // final da barra
    const clicX = mousePos.x
    
    // calcula a posicao do clique relativa a barra (0 a 1)
    let novoVolume = (clicX - esquerda) / barraLargura
    novoVolume = Math.max(0, Math.min(1, novoVolume)) // garante que fica entre 0 e 1
    
    volumeAtual = novoVolume
    k.volume(volumeAtual) // aplica o volume
    
    // atualiza a barra visual
    volumeBarFill.width = barraLargura * volumeAtual
    volumeText.text = Math.round(volumeAtual * 100) + "%" // mostra percentual
  }

  // Hover na barra
  volumeBarBg.onHover(() => {
    volumeBarBg.color = k.Color.fromHex("#2a2a2a") // preto mais claro
  })

  volumeBarBg.onHoverEnd(() => {
    volumeBarBg.color = k.Color.fromHex("#1a1a1a") // volta ao preto original
  })

  // Hover no botao de som
  settingsBtn.onHover(() => {
    settingsBtn.color = k.Color.fromHex("#808080") // cinza mais claro ao passar mouse
  })

  settingsBtn.onHoverEnd(() => {
    settingsBtn.color = k.Color.fromHex("#646464") // volta ao cinza original
  })
})