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
import getEndingType from "../scenes/EndingScene";
import createEnemyWaveSystem from "../game/systems/EnemyWaveController";
import createMessagePopup from "../game/interface/MessagePopup";
import createLojaUI from "../game/interface/LojaUI";

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
    "casa": { "name": "casa", "x": 514.6, "y": 32 },
    "loja": { "name": "loja", "x": 70, "y": 200 },
    "tomate": { "name": "tomate", "x": 509.9, "y": 399.9 },
    "player": { "name": "player", "x": 512, "y": 279.3 }
};

// cena principal do jogo
k.scene("playscene", () => {
    let cameraScroll = k.getCamPos();

    const gameCanvas = k.makeCanvas(k.width(), k.height());
    const uiCanvas = k.makeCanvas(k.width(), k.height());
    let nightIntensity = 0;


    // função pra transicionar suavemente
    function setNightIntensity(target, duration = 2) {
        k.tween(
            nightIntensity,
            target,
            duration,
            (val) => {
                nightIntensity = val;
            },
            k.easings.linear
        );
    }

    const root = k.add([
        k.layer("game"),
        k.drawon(gameCanvas.fb),
        "root_game",
    ]);

    const uiObjects = k.add([
        k.layer("ui"),
        "root_ui",
    ]);

    k.add([ //objeto renderer //
        k.pos(0, 0),
        k.fixed(),
        k.z(-100),
        {
            draw() {
                k.drawUVQuad({
                    width: gameCanvas.width,
                    height: gameCanvas.height,
                    tex: gameCanvas.fb.tex,
                    flipY: true,
                    shader: "night",
                    uniform: { u_intensity: nightIntensity },
                });
            },
        },
    ]);

    const director = root.add([
        {
            diasJogados: 1,
            diasSobrevividos: 0,
            state: DIA,
            killedTotal: 0,
            currency: 0,
            manureCount: 0,
            anyUIActive: false,
            aliveInBatch: 0,
            enemiesRemainingTotal: 0,

            waveList: [ // indica quantos inimigos seram gerados em uma wave em cada dia
                k.randi(13, 16),
                k.randi(20, 27),
                k.randi(30, 32),
            ]
        },
        "director"
    ]);

    const casa = createCasa();
    casa.pos = k.vec2(objects["casa"].x, objects["casa"].y);

    const player = createPlayer();
    player.pos = k.vec2(objects["player"].x, objects["player"].y);

    const ui = createUI(player);
    const confirmUI = createConfirmChangeUI();

    const bigTomate = createBigTomate();
    bigTomate.pos = k.vec2(objects["tomate"].x, objects["tomate"].y);

    function finishGame() {
        const currentHealth = bigTomate.hp;
        const maxHealth = bigTomate.maxHP; // A vida máxima do tomate (conforme criado em BigTomato.js)

        const endingType = getEndingType(currentHealth, maxHealth);

        k.go("ending", {
            endingType: endingType,
            tomatoHealth: currentHealth,
        });
    }

    k.onKeyPress("r", () => {
        finishGame();
    });

    const loja = createLoja();
    loja.pos = k.vec2(objects["loja"].x, objects["loja"].y);

    // Sistema de Cartas
    const cardSystem = createCardSystem(player, player.gun || null);
    const cardUI = createCardUI();
    cardUI.hide();

    k.onKeyPress("c", () => {
        if (!cardUI.getContainer().menuActive && !director.anyUIActive) {
            cardUI.getContainer().trigger("popupOpen");
            root.paused = true;

            const drawnCards = cardSystem.drawThreeCards();

            cardUI.showCards(drawnCards, (chosenCard) => {
                cardSystem.applyCardUpgrade(chosenCard);
                console.log(` Carta escolhida: ${chosenCard.nome}`);

                cardUI.getContainer().trigger("closePopup");
                root.paused = false;
            });
        }
    });

    // Sistema de loja
    const lojaUI = createLojaUI();
    let cartasDisponiveisHoje = 0;
    // Busca a área de colisão da loja (caixa azul)
    const areaAcao = loja.get("areaAcao")[0];
 
    if (areaAcao) {
        // onCollideUpdate dispara todo frame que o player estiver ENCIMA da areaAcao
        areaAcao.onCollideUpdate("player", () => {
            // Se já tiver um menu aberto, ignora
            if (director.anyUIActive) return;
 
            // Se apertar E enquanto está na área da loja
            if (k.isKeyPressed("e")) {
                //  
                director.anyUIActive = true;
                root.paused = true;
 
                lojaUI.show(player.manure, (acao) => {

                    if (acao === "vender_carta") {
                        if (player.manure >= 4) {
                            player.manure -= 4;
                            cartasDisponiveisHoje++;
 
                            if (cartasDisponiveisHoje <= 2) {
                                const drawnCards = cardSystem.drawThreeCards();

                                cardUI.getContainer().trigger("popupOpen");
 
                                cardUI.showCards(drawnCards, (chosenCard) => {
                                    cardSystem.applyCardUpgrade(chosenCard);
                                    console.log(`Carta obtida: ${chosenCard.nome}`);

                                    cardUI.getContainer().trigger("closePopup");
                                    lojaUI.hide();
                                    root.paused = false;
                                });
                            } else {
                                console.log("Você já pegou o máximo de cartas hoje!");
                                lojaUI.hide();
                                director.anyUIActive = false;
                                root.paused = false;
                            }
                        }
                    } else if (acao === "curar_tomate") {
                        if (player.manure >= 2) {
                            player.manure -= 2;

                            if (typeof bigTomate.heal === "function") {
                                const curaAmount = bigTomate.maxHp() * 0.25;
                                bigTomate.heal(curaAmount);
                                console.log(`Tomate curado! Vida atual: ${bigTomate.hp()}`);
                            } else {
                                bigTomate.hp += 25;
                                if (bigTomate.hp > 100) bigTomate.hp = 100;
                                console.log(`Tomate curado manualmente! Vida atual: ${bigTomate.hp}`);
                            }

                            lojaUI.hide();
                            director.anyUIActive = false;
                            root.paused = false;
                        }
                    } else if (acao === "sair") {
                        lojaUI.hide();
                        director.anyUIActive = false;
                        root.paused = false;
                    }
                });
            }
        });
    }
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
            director.state = DIA;
            director.diasJogados++;

            // Reseta as cartas da loja pro próximo dia
            cartasDisponiveisHoje = 0;
        },
    });

    const messagePopup = createMessagePopup();
    messagePopup.getContainer().hidden = true;

    director.on("dia", () => {
        k.wait(2, () => {
            messagePopup.abrirMensagem("Bem vindo (a)", "Imagine que aqui esta um tutorial muito bem escrito ta eu to com muita preguiça de escrever algo concreto ksksksksks!!!");
        });

        setNightIntensity(0, 2);
    });

    director.on("noite", () => {
        setNightIntensity(1, 2);
        waveController.start(director.waveList[director.diasSobrevividos]);
    });

    root.get("player")[0].onDeath(() => {
        k.go("gameoverscene");
    });

    // Proteção marota aqui pro objetivo não quebrar se morrer
    const objectiveList = root.get("objective");
    if (objectiveList.length > 0) {
        objectiveList[0].onDeath(() => {
            k.go("gameoverscene");
        });
    }

    const pauseMenu = createPauseMenu();
    pauseMenu.hidden = true;

    k.onKeyPress("escape", () => {
        pauseMenu.enabled = true;
        pauseMenu.hidden = false;
        root.paused = true;
    });

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

    function clampCam(val, min, max) {
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

    director.trigger("dia");
});