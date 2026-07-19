import k from "../Engine";
import createPlayer from "../game/objects/Player";
import createUI from "../game/objects/UI";
import createEnemy from "../game/objects/Enemy";
import createVolumeControl from "../game/objects/VolumeControl";  

k.scene("playscene", () => {
    const player = createPlayer();

    // Cria a UI (barra de vida + estamina)
    const ui = createUI(player);

    createEnemy(player, player);

    // Cria o controle de volume  
    const volumeControl = createVolumeControl();

});