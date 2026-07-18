import k from "../Engine";
import createBigTomate from "../game/objects/BigTomato";
import createEnemy from "../game/objects/Enemy";
import createPlayer from "../game/objects/Player";

k.scene("playscene", () => {
    const player = createPlayer();

    const bigTomate = createBigTomate();

    createEnemy(bigTomate, player);

    const text = k.add([
        k.pos(20, 20),
        k.text("Stamina: "),
        k.fixed(),
    ]);


    text.onUpdate(() => {
        text.text = `stamina: ${player.stamina.toFixed(3)}`;
    });
});