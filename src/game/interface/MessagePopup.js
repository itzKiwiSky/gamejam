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
        k.fixed(),

        {
            onClose() { }
        }
    ]);

    popupContainer.on("popupOpen", () => {

        popupContainer.hidden = false;
        director.anyUIActive = true;
        k.tween(0, 1, 0.876, (v) => popupContainer.scaleTo(v), k.easings.easeOutBounce);
    });

    popupContainer.on("popupClose", () => {
        k.tween(1, 0, 0.876, (v) => popupContainer.scaleTo(v), k.easings.easeOutBounce).onEnd(() => {
            director.anyUIActive = false;
            popupContainer.hidden = true;
        });
    });

    const popupSprite = popupContainer.add([
        k.sprite("botao"),
        k.anchor("center"),
    ])

    return {
        abrirMensagem(titulo, msg, options = {
            width: 800,
            height: 400,
            buttons: [],
        }) {
            popupContainer.w = options.width;
            popupContainer.h = options.height;
            popupSprite.width = popupContainer.w;
            popupSprite.height = popupContainer.h;
        },

        getContainer() {
            return popupContainer;
        }
    }
}