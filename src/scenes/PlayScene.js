import k from "../Engine";
import createPlayer from "../game/objects/Player";
import createUI from "../game/objects/UI";
import createEnemy from "../game/objects/Enemy";
import createVolumeControl from "../game/objects/VolumeControl";
import createPauseMenu from "../game/interface/PauseMenu";
import createBigTomate from "../game/objects/BigTomato";
import createCasa from "../game/objects/Casa";
import createConfirmChangeUI from "../game/interface/ConfirmChange";
import createCardSystem from "../game/systems/CardSystem";
import createCardUI from "../game/interface/CardUI";
import createLoja from "../game/objects/Loja";
import createEnemyWaveSystem from "../game/systems/EnemyWaveController";

k.setLayers([
    "background",
    "game",
    "ui",
    "pause",
], "game");


// para melhor visualizacao //
export const DIA = 0;
export const NOITE = 1;

// Aqui a gente define a posicao dos objetos no mapa, isso foi previamente calculado no editor tiled e exportado //
const objects = {
    "casa": {
        "name": "casa",
        "x": 514.6,
        "y": 32
    },
    "loja": {
        "name": "loja",
        "x": 70,
        "y": 200,
    },
    "tomate": {
        "name": "tomate",
        "x": 509.9,
        "y": 399.9
    },
    "player": {
        "name": "player",
        "x": 512,
        "y": 279.3
    }
};


// cena principal do jogo
k.scene("playscene", () => {

    let cameraScroll = k.getCamPos();

    const root = k.add([
        k.layer("game"),
        "root_game",
    ]);

    const uiObjects = k.add([
        k.layer("ui"),
        "root_ui", // strings na lista de componentes sao tratados como tags, essas tags pode ser usada para busca de objetos //
    ]);

    // um objeto invisivel, vai servir somente para guardar dados sobre o jogo e dirigir como o loop funciona //
    const director = root.add([
        {
            diasJogados: 1,
            state: DIA,
            killedTotal: 0,

            currency: 0,

            anyUIActive: false,

            aliveInBatch: 0,
            enemiesRemainingTotal: 0
        },

        "director"
    ]);


    // cria a casa 
    const casa = createCasa();
    casa.pos = k.vec2(objects["casa"].x, objects["casa"].y);

    // cria o player
    const player = createPlayer();
    player.pos = k.vec2(objects["player"].x, objects["player"].y);

    // cria a UI (barra de vida + estamina)
    const ui = createUI(player);

    const confirmUI = createConfirmChangeUI();

    const bigTomate = createBigTomate();
    bigTomate.pos = k.vec2(objects["tomate"].x, objects["tomate"].y);

    const loja = createLoja();
    loja.pos = k.vec2(objects["loja"].x, objects["loja"].y);

    // cria o inimigo e guarda em uma variável (pra poder acessar depois)
    //const enemy = createEnemy(bigTomate, player);

    // Sistema de Cartas
    const cardSystem = createCardSystem(player, player.gun || null);
    const cardUI = createCardUI();
    cardUI.hide();

    // Abre o menu de cartas ao apertar C
    k.onKeyPress("c", () => {

        if (!cardUI.getContainer().menuActive && !director.anyUIActive) {
            cardUI.getContainer().trigger("popupOpen");
            root.paused = true;

            const drawnCards = cardSystem.drawThreeCards(); // Sorteia 3 cartas

            cardUI.showCards(drawnCards, (chosenCard) => { // Mostra as cartas
                cardSystem.applyCardUpgrade(chosenCard); // Aplica o upgrade
                console.log(` Carta escolhida: ${chosenCard.nome}`);

                cardUI.getContainer().trigger("closePopup");

                root.paused = false; // 
            });

            /*director.anyUIActive = true;
            cardMenuActive = true;
            root.paused = true;

            const drawnCards = cardSystem.drawThreeCards(); // Sorteia 3 cartas

            cardUI.showCards(drawnCards, (chosenCard) => { // Mostra as cartas
                cardSystem.applyCardUpgrade(chosenCard); // Aplica o upgrade
                console.log(` Carta escolhida: ${chosenCard.nome}`);

                cardMenuActive = false;
                director.anyUIActive = false;
                root.paused = false; // 
            });*/
        }
    });

    const waveController = createEnemyWaveSystem({
        batchSize: 6,
        batchSizeMax: 7,
        player: player,
        spawnFn: (pos) => {
            const enemy = createEnemy(bigTomate, player);
            enemy.pos = pos;
            return enemy;
        },
        onAllDefeated: () => {
            console.log("Wave atual concluída!");
            // ex: gameManager.state = DIA; ou mostra tela de "próximo dia"
            director.state = DIA;
            director.diasJogados++;
        },
    });

    // logica do loop //
    director.on("dia", () => {

    });

    director.on("night", () => {
        console.log("noite");
        waveController.start(10);
    });

    // inicia o menu como escondido //
    const pauseMenu = createPauseMenu();
    pauseMenu.hidden = true;

    // Esc pra pausar
    // quando o usuario aperta ESC, pausa o jogo
    k.onKeyPress("escape", () => {
        pauseMenu.enabled = true;
        pauseMenu.hidden = false;
        root.paused = true;
    });


    // mapa e camera bounds //
    const map = root.add([
        k.pos(bigTomate.pos.x + 16, bigTomate.pos.y + 16),
        k.sprite("mapa"),
        k.layer("background"),
        k.scale(2.25),
        k.anchor("center")
    ]);

    const bounds = {
        top: k.vec2(-map.width * 0.5, -map.height * 0.5),
        bottom: k.vec2(-map.width * 0.5, map.height * 0.5),
        left: k.vec2(-map.width * 0.5, -map.height * 0.5),
        right: k.vec2(map.width * 0.5, -map.height * 0.5),
    };

    // bounds // (paredes físicas, sem alteração)
    map.add([k.pos(bounds.top), k.rect(map.width, 4), k.area({ collisionIgnore: ["enemy"] }), k.body({ isStatic: true })]);
    map.add([k.pos(bounds.bottom), k.rect(map.width, 4), k.area({ collisionIgnore: ["enemy"] }), k.body({ isStatic: true })]);
    map.add([k.pos(bounds.left), k.rect(4, map.height), k.area({ collisionIgnore: ["enemy"] }), k.body({ isStatic: true })]);
    map.add([k.pos(bounds.right), k.rect(4, map.height), k.area({ collisionIgnore: ["enemy"] }), k.body({ isStatic: true })]);

    function toWorldBound(localVec) {
        return map.pos.add(k.vec2(
            localVec.x * map.scale.x,
            localVec.y * map.scale.y
        ));
    }

    const rawCamBounds = {
        left: toWorldBound(bounds.left).x,
        right: toWorldBound(bounds.right).x,
        top: toWorldBound(bounds.top).y,
        bottom: toWorldBound(bounds.bottom).y,
    };

    const halfViewW = k.width() * 0.5;
    const halfViewH = k.height() * 0.5;

    // scrolling da camera //
    function clampCam(val, min, max) {
        // se o mapa for menor que a tela, os bounds invertem (min > max) — sem isso o clamp quebra
        if (min > max) return (min + max) / 2;
        return k.clamp(val, min, max);
    }

    k.onUpdate(() => {
        cameraScroll.x -= (cameraScroll.x - player.pos.x) * 0.03;
        cameraScroll.y -= (cameraScroll.y - player.pos.y) * 0.03;

        const cameraBounds = {
            left: rawCamBounds.left + halfViewW,
            right: rawCamBounds.right - halfViewW,
            top: rawCamBounds.top + halfViewH,
            bottom: rawCamBounds.bottom - halfViewH,
        };

        const clampedPos = k.vec2(
            clampCam(cameraScroll.x, cameraBounds.left, cameraBounds.right),
            clampCam(cameraScroll.y, cameraBounds.top, cameraBounds.bottom)
        );

        k.setCamPos(clampedPos);
    });
});