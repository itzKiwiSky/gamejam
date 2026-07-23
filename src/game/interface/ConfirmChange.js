import k from "../../Engine";
import { NOITE } from "../../scenes/PlayScene";


export default function createConfirmChangeUI() {
    const uiLayer = k.get("root_ui")[0];
    const root = k.get("root_game")[0];
    const director = root.get("director")[0];

    const container = uiLayer.add([
        k.pos(k.center()),
        k.rect(640, 240, {
            radius: 10,
        }),
        k.color(k.BLACK),
        k.opacity(0.45),
        k.anchor("center"),
        k.scale(0),
        k.fixed(),

        "confirmUIChange",
    ]);

    container.on("popupOpen", () => {

        container.hidden = false;
        director.anyUIActive = true;
        k.tween(0, 1, 0.876, (v) => container.scaleTo(v), k.easings.easeOutBounce);
    });

    container.on("popupClose", () => {

        k.tween(1, 0, 0.876, (v) => container.scaleTo(v), k.easings.easeOutBounce).onEnd(() => {
            director.anyUIActive = false;
            container.hidden = true;
        });
    });

    container.onUpdate(() => {

    });

    container.add([
        k.rect(640, 240, {
            radius: 10,
            fill: false,
        }),
        k.outline(4, k.WHITE, 1, "bevel"),
        k.anchor("center"),
    ]);

    container.add([
        k.pos(0, -64),
        k.text("Deseja Iniciar uma noite?", {
            size: 25
        }),
        k.anchor("center"),
    ]);

    // ===== BOTAO CONTINUAR =====
    // botao verde pra voltar ao jogo
    const confirmBtn = container.add([
        k.rect(128, 64, { radius: 10 }), // retangulo 300x80 com cantos arredondados
        k.pos(-128, 32), // posiciona no centro
        k.color(k.Color.fromHex("#22c55e")), // cor verde
        k.area(), // permite detectar cliques
        k.anchor("center"), // ponto de referencia eh o centro
        k.outline(4, k.Color.fromHex("#4cf357"), 1, "bevel")
    ]);

    // texto "Continuar" dentro do botao
    confirmBtn.add([
        k.text("Sim", { size: 24, weight: "bold" }),
        k.anchor("center"),
    ]);

    // quando clica no botao continuar
    confirmBtn.onClick(() => {
        director.state = NOITE;
        director.trigger("noite");
        container.trigger("popupClose");
    });

    confirmBtn.onUpdate(() => {
        confirmBtn.color = confirmBtn.isHovering() ? k.Color.fromHex("#4ade80") : k.Color.fromHex("#22c55e");
    });


    const cancelBtn = container.add([
        k.rect(128, 64, { radius: 10 }), // retangulo 300x80 com cantos arredondados
        k.pos(128, 32), // posiciona no centro
        k.color(k.Color.fromHex("#a80202")), // cor verde
        k.area(), // permite detectar cliques
        k.anchor("center"), // ponto de referencia eh o centro
        k.outline(4, k.Color.fromHex("#f24b3f"), 1, "bevel")
    ]);

    cancelBtn.add([
        k.text("Nao", { size: 24, weight: "bold" }),
        k.anchor("center"),
    ]);

    cancelBtn.onClick(() => {
        container.trigger("popupClose");
    });

    cancelBtn.onUpdate(() => {
        cancelBtn.color = cancelBtn.isHovering() ? k.Color.fromHex("#f87171") : k.Color.fromHex("#a80202");
    });
}