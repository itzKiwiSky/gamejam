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


    text.onUpdate(() => {
        text.text = `stamina: ${player.stamina.toFixed(1)}`;
    });
});