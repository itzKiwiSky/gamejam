import k from "../Engine";
import createBigTomate from "../game/objects/BigTomato";
import createEnemy from "../game/objects/Enemy";
import createPlayer from "../game/objects/Player";

k.scene("playscene", () => {
    const player = createPlayer();

    createBigTomate();

    createEnemy();

    const text = k.add([
        k.pos(20, 20),
        k.text("Stamina: "),
        k.fixed(),
    ]);


    text.onUpdate(() => {
        text.text = `stamina: ${player.stamina.toFixed(3)}`;
    });
});