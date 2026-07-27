import k from "../../Engine";

function createButton(buttonContainer, popupContainer, text, options = {
    clicked: "#679b22",
    normal: "#96f31c",
    hovered: "#bfff00"
}, onClick, isDisabled = () => false) {

    const button = buttonContainer.add([
        k.pos(0, 0),
        k.sprite("btn_base"),
        k.color(options.normal),
        k.anchor("center"),
        k.area({ isSensor: true }),
        k.z(20),
    ]);

    button.width = 96;
    button.height = 48;

    button.onUpdate(() => {
        if (isDisabled()) {
            button.color = k.Color.fromHex("#555555"); // cinza, indicando desabilitado
            return;
        }

        if (button.isClicked()) {
            button.color = k.Color.fromHex(options.clicked);
            onClick();
        }
        else
            button.color = button.isHovering() ? k.Color.fromHex(options.hovered) : k.Color.fromHex(options.normal);
    });

    button.add([
        k.text(text, { size: 22 }),
        k.pos(0, 0),
        k.anchor("center"),
        k.z(20),
    ]);

    return button;
}

export default function createMessagePopup() {
    const root = k.get("root_game")[0];
    const uiLayer = k.get("root_ui")[0];
    const director = root.get("director")[0];

    const popupContainer = uiLayer.add([
        k.pos(k.center()),
        k.rect(0, 0),
        k.scale(1),
        k.anchor("center"),
        k.layer("ui"),
        k.fixed(),

        {
            pages: [],
            currentPageIndex: 0,
        }
    ]);

    popupContainer.on("popupOpen", () => {
        popupContainer.hidden = false;
        director.anyUIActive = true;
        root.paused = true;
        k.tween(0, 1, 0.876, (v) => popupContainer.scaleTo(v), k.easings.easeOutBounce);
    });

    popupContainer.on("popupClose", () => {
        k.tween(1, 0, 0.876, (v) => popupContainer.scaleTo(v), k.easings.easeOutBounce).onEnd(() => {
            director.anyUIActive = false;
            root.paused = false;
            popupContainer.hidden = true;
        });
    });

    const popupSprite = popupContainer.add([
        k.sprite("botao"),
        k.anchor("center"),
    ]);

    const textTitle = popupContainer.add([
        k.pos(0, 0),
        k.text("", { width: popupContainer.w, size: 38 }),
        k.z(10),
        k.color("gold"),
        k.anchor("center"),
    ]);

    const textMain = popupContainer.add([
        k.pos(0, 0),
        k.text("", { width: 200, size: 24, align: "center" }),
        k.z(10),
        k.color("white"),
        k.anchor("topleft"),
    ]);

    // indicador de página, tipo "1 / 3" — só aparece quando tem mais de 1 página
    const pageIndicator = popupContainer.add([
        k.pos(0, 0),
        k.text("", { size: 18 }),
        k.z(10),
        k.color(200, 200, 200),
        k.anchor("center"),
    ]);

    const buttonContainer = popupContainer.add([
        k.rect(0, 64, { fill: false }),
        k.pos(0, 0),
        k.z(12),
        k.anchor("center"),
    ]);

    function renderPage() {
        textMain.text = popupContainer.pages[popupContainer.currentPageIndex] ?? "";

        if (popupContainer.pages.length > 1) {
            pageIndicator.text = `${popupContainer.currentPageIndex + 1} / ${popupContainer.pages.length}`;
        } else {
            pageIndicator.text = "";
        }

        const isLastPage = popupContainer.currentPageIndex === popupContainer.pages.length - 1;

        if (isLastPage && !popupContainer.hasFiredLastPage) {
            popupContainer.hasFiredLastPage = true;
            popupContainer.onLastPage?.();
        } else if (!isLastPage) {
            popupContainer.hasFiredLastPage = false; // reseta se voltar pra trás, permite disparar de novo se chegar na última outra vez
        }
    }

    function layoutButtons(spriteWidth) {
        const spacing = 24;
        const btnWidth = 96;
        const total = buttonContainer.children.length;

        buttonContainer.children.forEach((btn, i) => {
            const totalWidth = total * btnWidth + (total - 1) * spacing;
            const startX = -totalWidth / 2 + btnWidth / 2;
            btn.pos.x = startX + i * (btnWidth + spacing);
        });
    }

    return {
        abrirMensagem(titulo, msg, userOptions = {}) {
            const options = {
                width: 800,
                height: 400,
                buttons: [
                    {
                        text: "OK",
                        action() {
                            popupContainer.trigger("popupClose");
                        }
                    }
                ],
                onLastPage: null,
                ...userOptions, // sobrescreve só o que foi passado, mantém o resto do default
            };

            buttonContainer.children.slice().forEach((child) => k.destroy(child));

            popupContainer.pages = Array.isArray(msg) ? msg : [msg];
            popupContainer.currentPageIndex = 0;
            popupContainer.onLastPage = options.onLastPage ?? null;

            popupSprite.width = options.width;
            popupSprite.height = options.height;


            if (popupContainer.pages.length > 1) {
                createButton(
                    buttonContainer,
                    popupContainer,
                    "<<<",
                    undefined,
                    () => {
                        if (popupContainer.currentPageIndex > 0) {
                            popupContainer.currentPageIndex -= 1;
                            renderPage();
                        }
                    },
                    () => popupContainer.currentPageIndex <= 0
                );

                createButton(
                    buttonContainer,
                    popupContainer,
                    ">>>",
                    undefined,
                    () => {
                        if (popupContainer.currentPageIndex < popupContainer.pages.length - 1) {
                            popupContainer.currentPageIndex += 1;
                            renderPage();
                        }
                    },
                    () => popupContainer.currentPageIndex >= popupContainer.pages.length - 1
                );
            }
            else
                options.buttons.forEach((btn) => {
                    createButton(buttonContainer, popupContainer, btn.text, btn.size ?? undefined, btn.action);
                });

            layoutButtons(popupSprite.width);

            textTitle.text = titulo;
            textTitle.width = popupSprite.width * 0.5;
            textTitle.pos.y = -popupSprite.height * 0.5 + 32;

            textMain.width = popupSprite.width - 32;
            textMain.pos.x = -popupSprite.width * 0.5;
            textMain.pos.y = -popupSprite.height * 0.5 + 96;

            pageIndicator.pos.y = popupSprite.height * 0.5 - 88;

            buttonContainer.width = popupSprite.width - 72;
            buttonContainer.pos.y = popupSprite.height * 0.5 - buttonContainer.height * 0.5;

            renderPage();

            popupContainer.trigger("popupOpen");
        },

        getContainer() {
            return popupContainer;
        }
    }
}