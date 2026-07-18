import k from "../Engine";
import createPlayer from "../game/objects/Player";
import createUI from "../game/objects/UI";
import createEnemy from "../game/objects/Enemy";

k.scene("playscene", () => {
    const player = createPlayer();

    // Cria a UI (barra de vida + estamina)
    const ui = createUI(player);

     
    createEnemy(player, player);
});