import k from "../Engine";
import createPlayer from "../game/objects/Player";
import createUI from "../game/objects/UI";
import createEnemy from "../game/objects/Enemy";
import createVolumeControl from "../game/objects/VolumeControl";
import createPauseMenu from "../game/interface/PauseMenu";

k.setLayers([
    "background",
    "game",
    "ui",
    "pause",
], "game");



// cena principal do jogo
k.scene("playscene", () => {
    const root = k.add([
        k.layer("game"),
        "root_game",
    ]);

    const uiObjects = k.add([
        k.layer("ui"),
        "root_ui", // strings na lista de componentes sao tratados como tags, essas tags pode ser usada para busca de objetos //
    ]);


    // cria o player
    const player = createPlayer(root);

    // cria a UI (barra de vida + estamina)
    const ui = createUI(player);

    // cria o inimigo e guarda em uma variável (pra poder acessar depois)
    let enemy = createEnemy(player, player);

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
});