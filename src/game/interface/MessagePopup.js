import k from "../../Engine";

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
            buttons: []
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
            root.paused = true;
            popupContainer.hidden = true;
        });
    });

    const popupSprite = popupContainer.add([
        k.sprite("botao"),
        k.anchor("center"),
    ]);

    const textTitle = popupContainer.add([
        k.pos(0, 0),
        k.text("", {
            width: popupContainer.w,
            size: 38,
        }),
        k.z(10),
        k.color("gold"),
        k.anchor("center"),
    ]);

    const textMain = popupContainer.add([
        k.pos(0, 0),
        k.text("", {
            width: 200,
            size: 24,
            align: "center"
        }),
        k.z(10),
        k.color("white"),
        k.anchor("topleft"),
    ]);

    const buttonContainer = popupContainer.add([
        k.rect(0, 64, {
            fill: false,
        }),
        k.pos(0, 0),
        k.z(12),
        k.anchor("center"),
    ]);

    function createButton(text, options = {
        clicked: "#679b22",
        normal: "#96f31c",
        hovered: "#bfff00"
    }, onClick) {

        console.log(options);
        const spacing = 120;
        const xPos = (popupContainer.buttons.length - 1) * (160 + spacing);
        const baseSize = 96;
        const baseHeight = 48;

        const button = buttonContainer.add([
            k.pos(0, 0),
            k.sprite("btn_base"),
            k.color(options.normal),
            k.anchor("center"),
            k.area({ isSensor: true }),
            k.z(20),
        ]);

        button.width = baseSize;
        button.height = baseHeight;

        button.onUpdate(() => {
            if (button.isClicked()) {
                button.color = k.Color.fromHex(options.clicked);
                onClick();
            }
            else
                button.color = button.isHovering() ? k.Color.fromHex(options.hovered) : k.Color.fromHex(options.normal);
        });

        const btnText = button.add([
            k.text(text, {
                size: 22,
            }),
            k.pos(0, 0),
            k.anchor("center"),
            k.z(20),
        ]);
    }

    return {
        abrirMensagem(titulo, msg, options = {
            width: 800,
            height: 400,
            buttons: [
                createButton("OK", undefined, () => {
                    popupContainer.trigger("popupClose");
                })
            ],
        }) {
            popupSprite.width = options.width;
            popupSprite.height = options.height;

            textTitle.text = titulo;
            textTitle.width = popupSprite.width * 0.5;
            textTitle.pos.y = -popupSprite.height * 0.5 + 32;

            textMain.text = msg;
            textMain.width = popupSprite.width - 32;
            textMain.pos.x = -popupSprite.width * 0.5;
            textMain.pos.y = -popupSprite.height * 0.5 + 96;

            buttonContainer.width = popupSprite.width - 72;
            buttonContainer.pos.y = popupSprite.height * 0.5 - buttonContainer.height * 0.5;

            popupContainer.trigger("popupOpen");
        },

        getContainer() {
            return popupContainer;
        }
    }
}