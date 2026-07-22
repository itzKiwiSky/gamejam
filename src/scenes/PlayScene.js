import k from "../Engine";
import createPlayer from "../game/objects/Player";
import createUI from "../game/objects/UI";
import createEnemy from "../game/objects/Enemy";
import createVolumeControl from "../game/objects/VolumeControl";
import createPauseMenu from "../game/interface/PauseMenu";
import createBigTomate from "../game/objects/BigTomato";
import createCasa from "../game/objects/Casa";
import level from "../../assets/data/mapa.json";

k.setLayers([
    "background",
    "game",
    "ui",
    "pause",
], "game");


// para melhor visualizacao //
const DIA = 0;
const NOITE = 1;


// cena principal do jogo
k.scene("playscene", () => {

    let cameraScroll = k.getCamPos();

    k.onLoad(() => {
        k.addTiledMap(level, {
            sprite: "tileset",
            tiles: [
                {
                    comps: (tile) => [
                        k.scale(2),
                    ],
                    match: {
                        properties: {}
                    }
                }
            ]
        });
    });



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
        }
    ]);


    // cria a casa 
    const casa = createCasa();

    // cria o player
    const player = createPlayer();

    // cria a UI (barra de vida + estamina)
    const ui = createUI(player);

    const bigTomate = createBigTomate();

    // cria o inimigo e guarda em uma variável (pra poder acessar depois)
    const enemy = createEnemy(bigTomate, player);

    // cria o controle de volume  
    const volumeControl = createVolumeControl();

    const pauseMenu = createPauseMenu();
    pauseMenu.hidden = true

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