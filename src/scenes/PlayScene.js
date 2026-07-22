import k from "../Engine";
import createPlayer from "../game/objects/Player";
import createUI from "../game/objects/UI";
import createEnemy from "../game/objects/Enemy";
import createVolumeControl from "../game/objects/VolumeControl";
import createPauseMenu from "../game/interface/PauseMenu";
import createBigTomate from "../game/objects/BigTomato";
import createCasa from "../game/objects/Casa";

k.setLayers([
    "background",
    "game",
    "ui",
    "pause",
], "game");


// para melhor visualizacao //
const DIA = 0;
const NOITE = 1;

// Aqui a gente define a posicao dos objetos no mapa, isso foi previamente calculado no editor tiled e exportado //
const objects = {
    "casa": {
        "name": "casa",
        "x": 514.6,
        "y": 32
    },
    "loja": {
        "name": "loja",
        "x": 322.6,
        "y": 218
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
    const gameManager = k.add([
        {
            daysLeft: 3,
            state: DIA,
            killedTotal: 0,

            currency: 0,
        }
    ]);


    // cria a casa 
    const casa = createCasa();
    casa.pos = k.vec2(objects["casa"].x, objects["casa"].y);

    // cria o player
    const player = createPlayer();
    player.pos = k.vec2(objects["player"].x, objects["player"].y);

    // cria a UI (barra de vida + estamina)
    const ui = createUI(player);

    const bigTomate = createBigTomate();
    bigTomate.pos = k.vec2(objects["tomate"].x, objects["tomate"].y);

    // cria o inimigo e guarda em uma variável (pra poder acessar depois)
    const enemy = createEnemy(bigTomate, player);

    // cria o controle de volume  
    const volumeControl = createVolumeControl();

    const pauseMenu = createPauseMenu();
    pauseMenu.hidden = true;

    const map = root.add([
        k.pos(bigTomate.pos.x + 270, bigTomate.pos.y - 16),
        k.sprite("mapa"),
        k.layer("background"),
        k.scale(2.25),
        k.anchor("center")
    ]);

    // Esc pra pausar
    // quando o usuario aperta ESC, pausa o jogo
    k.onKeyPress("escape", () => {
        pauseMenu.enabled = true;
        pauseMenu.hidden = false;
        root.paused = true;
    });

    // scrolling da camera //
    k.onUpdate(() => {
        cameraScroll.x -= (cameraScroll.x - player.pos.x) * 0.03;
        cameraScroll.y -= (cameraScroll.y - player.pos.y) * 0.03;

        k.setCamPos(cameraScroll);
    });
});