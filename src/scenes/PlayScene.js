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

    const root = k.add([
        k.layer("game"),
        "root_game",
    ]);

    const uiObjects = k.add([
        k.layer("ui"),
        "root_ui", 
    ]);

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

    const casa = createCasa();
    casa.pos = k.vec2(objects["casa"].x, objects["casa"].y);

    const player = createPlayer();
    player.pos = k.vec2(objects["player"].x, objects["player"].y);
    
    // 
    player.manure = 0;

    const ui = createUI(player);
    const confirmUI = createConfirmChangeUI();

    const bigTomate = createBigTomate();
    bigTomate.pos = k.vec2(objects["tomate"].x, objects["tomate"].y);

    function finishGame() {
        const currentHealth = bigTomate.hp;
        const maxHealth = 100; 

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

    //sistema de loja
    const lojaUI = createLojaUI();
    let cartasDisponiveisHoje = 0;
    
   // Busca a área de colisão da loja (caixa azul)
    const areaAcao = loja.get("areaAcao")[0];

    if (areaAcao) {
        // onCollideUpdate dispara todo frame que o player estiver ENCIMA da areaAcao
        areaAcao.onCollideUpdate("player", () => {
            // Se já tiver um menu aberto, ignora
            if (director.anyUIActive) return;

            // Se apertar E enquanto está na área...
            if (k.isKeyPressed("e")) {
                lojaUI.show(player.manure, (acao) => {
                    
                    if (acao === "vender_carta") {
                        if (player.manure >= 4) {
                            player.manure -= 4;
                            cartasDisponiveisHoje++;

                            if (cartasDisponiveisHoje <= 2) {
                                const drawnCards = cardSystem.drawThreeCards();
                                
                                cardUI.getContainer().trigger("popupOpen");
                                root.paused = true;

                                cardUI.showCards(drawnCards, (chosenCard) => {
                                    cardSystem.applyCardUpgrade(chosenCard);
                                    console.log(`Carta obtida: ${chosenCard.nome}`);
                                    
                                    cardUI.getContainer().trigger("closePopup");
                                    root.paused = false;
                                    lojaUI.hide();
                                });
                            } else {
                                console.log("Você já pegou o máximo de cartas hoje!");
                                lojaUI.hide();
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
                        }
                    }
                });
            }
        });
    }
    // Controle de Ondas
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
        })
    });

    director.on("noite", () => {
        console.log("noite");
        waveController.start(10);
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