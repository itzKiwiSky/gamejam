import k from "../Engine";

k.scene("intro", () => {
    
    const root = k.add([
        k.layer("ui"),
        "intro_root",
    ]);

    // Fundo preto
    root.add([
        k.rect(k.width(), k.height()),
        k.color(0, 0, 0),
        k.layer("background"),
    ]);

    // dados array
    const introTexts = [
        {
            text: "Você é um fazendeiro que vem se dedicando há meses no plantio de seus tomates, para uma competição que acontece uma vez ao ano",
            duration: 5,
            fadeInDuration: 1,
            fadeOutDuration: 1,
        },
        {
            text: "As coisas pareciam estar dando certo, mas...",
            duration: 3,
            fadeInDuration: 0.8,
            fadeOutDuration: 0.8,
        },
        {
            text: "Durante a noite, tomates estragados começaram a invadir sua fazenda, invejados da saúde e da beleza de seus preciosos tomates",
            duration: 5,
            fadeInDuration: 1,
            fadeOutDuration: 1,
        },
        {
            text: "Você só precisa defendê-los mais um pouco, você tem três dias até a competição.",
            duration: 4,
            fadeInDuration: 0.8,
            fadeOutDuration: 0.8,
        },
    ];

    let currentTextIndex = 0;
    let canSkip = true;
    let introFinished = false;

    // container de texto
    const textContainer = root.add([
        k.pos(k.width() / 2, k.height() / 2),
        k.anchor("center"),
        "text_container",
        {
            currentTextObject: null,
        }
    ]);

    /**
     * FADE IN 
     * Só muda opacity gradualmente usando k.wait
     */
    function fadeIn(textObj, duration) {
        const startTime = k.time();
        const totalTime = duration;

        // Atualiza cada frame
        textObj.onUpdate(() => {
            const elapsed = k.time() - startTime;
            const progress = Math.min(elapsed / totalTime, 1);
            textObj.opacity = progress;
        });
    }

    /**
     * FADE OUT 
     */
    function fadeOut(textObj, duration) {
        const startTime = k.time();
        const totalTime = duration;

        // Atualiza cada frame
        textObj.onUpdate(() => {
            const elapsed = k.time() - startTime;
            const progress = Math.min(elapsed / totalTime, 1);
            textObj.opacity = 1 - progress;
        });
    }

    // mostrar proximo texto
    function showNextText() {
        // Se acabou todos os textos
        if (currentTextIndex >= introTexts.length) {
            introFinished = true;
            finishIntro();
            return;
        }

        // Pega o texto atual
        const currentText = introTexts[currentTextIndex];

        // Remove o texto anterior (se houver)
        if (textContainer.currentTextObject) {
            textContainer.currentTextObject.destroy();
        }

        // Cria novo texto
        const textObj = textContainer.add([
            k.text(currentText.text, {
                size: 32,
                font: "monospace",
                width: 1000,
                align: "center",
            }),
            k.anchor("center"),
            k.color(255, 255, 255),
            {
                opacity: 0,
            }
        ]);

        // Salva referência
        textContainer.currentTextObject = textObj;

        // animação

        // 1. FADE IN: o texto aparece
        fadeIn(textObj, currentText.fadeInDuration);

        // 2. ESPERA: texto fica visível, depois fade out
        k.wait(
            currentText.fadeInDuration + currentText.duration,
            () => {
                // 3. FADE OUT: texto desaparece
                fadeOut(textObj, currentText.fadeOutDuration);

                // 4. MOSTRA PRÓXIMO: chama a função de novo
                k.wait(currentText.fadeOutDuration, () => {
                    currentTextIndex++;
                    showNextText();
                });
            }
        );
    }

    // finalizar intro
    function finishIntro() {
        console.log(" Intro concluída");
        k.go("playscene");
    }

    // botao de pular
    const skipButtonBg = root.add([
        k.rect(150, 40),
        k.pos(k.width() - 170, k.height() - 60),
        k.color(100, 100, 100),
        k.area(),
        k.layer("ui"),
    ]);

    skipButtonBg.add([
        k.text("PULAR (ESC)", {
            size: 14,
            font: "monospace",
        }),
        k.pos(75, 20),
        k.anchor("center"),
        k.color(255, 255, 255),
    ]);

    skipButtonBg.onClick(() => {
        if (canSkip && !introFinished) {
            skipIntro();
        }
    });

    k.onKeyPress("escape", () => {
        if (canSkip && !introFinished) {
            skipIntro();
        }
    });

    function skipIntro() {
        console.log(" Intro pulada");
        canSkip = false;
        introFinished = true;

        if (textContainer.currentTextObject) {
            textContainer.currentTextObject.destroy();
        }

        k.go("playscene");
    }

    // Inicia a intro
    showNextText();
});