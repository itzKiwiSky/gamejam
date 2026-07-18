
import k from "../Engine";
// () => função curta
k.scene("menuscene", () => {
  // Fundo
  k.add([
    k.rect(k.width(), k.height()),
    k.color(10, 10, 35),
    k.fixed(), // fixa o fundo na câmera
    //cria um retangulo pra ocupar toda largura e altura da tela, tbm é o fundo
    //e coloca a cor também
  ]) // tudo dentro do [] faz parte do retangulo

  // Título
  k.add([ //pra adicionar coisas na tela
    k.text("Teste", { size: 64, weight: "bold" }),
    k.pos(k.center().x, 150), //horizontal, centralizado
    k.anchor("center"), //ponto de referencia é o centro
    k.color(k.Color.fromHex("#dd2100")), //cor branca
  ])

  // Botão Play
  const playBtn = k.add([ //cria um botao chamado playBtn e armazena em uma variavel
    k.rect(300, 80, { radius: 10 }), //radius deixa os cantos rendondinhos
    k.pos(k.center().x, 350), //centralizado horizontalmente, recua 150 pra ficar no meio  e 350 do topo
  k.color(k.Color.fromHex("#29e438")),
    k.area(), //ativa a detecção de clique e colisão
    k.anchor("center"),
  ])

  playBtn.add([
    k.text("Play", { size: 40, weight: "bold" }),
    k.anchor("center"),
  ])

  playBtn.onClick(() => {
    k.go("playscene") //vai pra cena "PlayScene"
  })

  // Hover do Play
  playBtn.onHover(() => {
    playBtn.color = k.Color.fromHex("#4ade80") //converte codigo de cor hexadecimal em RGB
  })

  playBtn.onHoverEnd(() => {
    playBtn.color = k.Color.fromHex("#22c55e")
  })

  // Botão sair
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
  //quando clica em sair

  exitBtn.onClick(() => {
    k.quit() //fecha o jogo
  })

  // Hover do Sair
  exitBtn.onHover(() => {
    exitBtn.color = k.Color.fromHex("#f87171")
  })

  exitBtn.onHoverEnd(() => {
    exitBtn.color = k.Color.fromHex("#dc2626")
  })
})
