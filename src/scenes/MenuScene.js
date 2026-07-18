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
  let barraMostrando = false // controla se a barra esta visivel

  // Fundo da barra (preto)
  const volumeBarBg = k.add([
    k.rect(200, 20),
    k.pos(k.width() - 380, 30), // mais pra esquerda
    k.color(k.Color.fromHex("#1a1a1a")),
    k.area(),
    k.anchor("center"),
    k.fixed(),
    k.opacity(0), // comeca invisivel
  ])

  // Indicador da barra (verde - mostra volume atual)
  const volumeBarFill = k.add([
    k.rect(200 * volumeAtual, 20),
    k.pos(k.width() - 380, 30), // mais pra esquerda
    k.color(k.Color.fromHex("#22c55e")),
    k.anchor("center"),
    k.fixed(),
    k.opacity(0), // comeca invisivel
  ])

  // Texto do percentual
  const volumeText = k.add([
    k.text("100%", { size: 16 }),
    k.pos(k.width() - 550, 30), // muito mais pra esquerda
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

  // Quando clica na barra, muda o volume
  volumeBarBg.onMousePress(() => {
    const mousePos = k.mousePos() // pega a posicao do mouse
    const barX = k.width() - 380
    const barWidth = 200
    const clicX = mousePos.x
    
    // calcula a posicao do clique relativa a barra
    const novoVolume = Math.max(0, Math.min(1, (clicX - (barX - barWidth / 2)) / barWidth))
    
    volumeAtual = novoVolume
    k.volume(volumeAtual) // aplica o volume
    
    // atualiza a barra visual
    volumeBarFill.width = 200 * volumeAtual
    volumeText.text = Math.round(volumeAtual * 100) + "%" // mostra percentual
  })

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