import k from "../../Engine";
//esse codigo basicamente existe da mesma forma no menuScene
// funcao que cria o controle de volume (botao + barra)
export default function createVolumeControl() {
    // variaveis de controle
    let volumeAtual = k.volume(); // pega o volume atual do jogo
    let barraMostrando = false; // controla se a barra tá visivel
    
    // posicoes da barra de volume
    const barraX = k.width() - 250; // posicao X (mais pra direita)
    const barraY = 30; // posicao Y (topo)
    const barraLargura = 150; // largura da barra
    
    // variaveis pra armazenar os elementos da barra
    let volumeBarBg = null;
    let volumeBarFill = null;
    let volumeText = null;

    //botao de som
    // botao que fica no canto superior direito
    const settingsBtn = k.add([
        k.rect(60, 60, { radius: 5 }), // retangulo 60x60 com cantos arredondados
        k.pos(k.width() - 80, 30), // posiciona no canto superior direito
        k.color(k.Color.fromHex("#646464")), // cor cinza
        k.area(), // permite detectar cliques
        k.anchor("center"), // ponto de referencia eh o centro
        k.fixed(), // fica fixo na camera
    ]);

    // texto "Som" dentro do botao
    settingsBtn.add([
        k.text("Som", { size: 24 }),
        k.anchor("center"),
    ]);

    // ===== FUNCAO PARA CRIAR/RECRIAR A BARRA =====
    function criarBarraVolume() {
        // remove elementos antigos se existirem
        if (volumeBarBg) k.destroy(volumeBarBg);
        if (volumeBarFill) k.destroy(volumeBarFill);
        if (volumeText) k.destroy(volumeText);

        // fundo da barra (preto)
        volumeBarBg = k.add([
            k.rect(barraLargura, 20),
            k.pos(barraX, barraY),
            k.color(k.Color.fromHex("#1a1a1a")),
            k.area(),
            k.anchor("center"),
            k.fixed(),
            k.opacity(barraMostrando ? 1 : 0), // aparece/desaparece conforme necessario
        ]);

        // barra preenchida (verde, mostra o volume atual)
        volumeBarFill = k.add([
            k.rect(barraLargura * volumeAtual, 20),
            k.pos(barraX, barraY),
            k.color(k.Color.fromHex("#22c55e")),
            k.anchor("center"),
            k.fixed(),
            k.opacity(barraMostrando ? 1 : 0),
        ]);

        // texto mostrando o percentual
        volumeText = k.add([
            k.text(Math.round(volumeAtual * 100) + "%", { size: 14 }),
            k.pos(barraX + 100, barraY),
            k.anchor("center"),
            k.color(k.WHITE),
            k.fixed(),
            k.opacity(barraMostrando ? 1 : 0),
        ]);

        // hover na barra (fica mais clara ao passar mouse)
        volumeBarBg.onHover(() => {
            volumeBarBg.color = k.Color.fromHex("#2a2a2a"); // preto mais claro
        });

        volumeBarBg.onHoverEnd(() => {
            volumeBarBg.color = k.Color.fromHex("#1a1a1a"); // volta ao preto original
        });
    }

    // cria a barra pela primeira vez
    criarBarraVolume();

   //clique no botao de som
    // quando clica, mostra/esconde a barra
    settingsBtn.onClick(() => {
        barraMostrando = !barraMostrando; // inverte o estado
        
        // mostra ou esconde a barra
        if (barraMostrando) {
            volumeBarBg.opacity = 1;
            volumeBarFill.opacity = 1;
            volumeText.opacity = 1;
        } else {
            volumeBarBg.opacity = 0;
            volumeBarFill.opacity = 0;
            volumeText.opacity = 0;
        }
    });

   //clique na barra
    // quando clica na barra, atualiza o volume
    volumeBarBg.onMousePress(() => {
        if (barraMostrando) {
            atualizarVolume();
        }
    });

//arrastar pela barra
    // tambem atualiza enquanto arrasta
    k.onMouseMove(() => {
        if (barraMostrando && k.isMousePressed()) {
            atualizarVolume();
        }
    });

  //atualizar volume
    function atualizarVolume() {
        // pega a posicao atual do mouse
        const mousePos = k.mousePos();
        // comeco e fim da barra
        const esquerda = barraX - (barraLargura / 2);
        const clicX = mousePos.x;
        
        // calcula a posicao do clique relativa a barra (0 a 1)
        let novoVolume = (clicX - esquerda) / barraLargura;
        novoVolume = Math.max(0, Math.min(1, novoVolume)); // garante que fica entre 0 e 1
        
        // atualiza o volume
        volumeAtual = novoVolume;
        k.setVolume(volumeAtual); // aplica o volume no jogo
        
        // atualiza a barra visual
        volumeBarFill.width = barraLargura * volumeAtual;
        volumeText.text = Math.round(volumeAtual * 100) + "%"; // mostra percentual
    }

    //hover
    // quando passa mouse por cima, fica mais claro
    settingsBtn.onHover(() => {
        settingsBtn.color = k.Color.fromHex("#808080"); // cinza mais claro
    });

    settingsBtn.onHoverEnd(() => {
        settingsBtn.color = k.Color.fromHex("#646464"); // volta ao cinza original
    });

    // retorna o botao pra poder usar depois se necessario
    return settingsBtn;
}