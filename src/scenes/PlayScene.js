import k from "../Engine";
import createPlayer from "../game/Player";

k.scene("playscene", () => {
    const player = createPlayer();

    const text = k.add([
        k.pos(20, 20),
        k.text("Stamina: "),
        k.fixed(),
    ]);


    text.onUpdate(() => {
        text.text = `stamina: ${player.stamina.toFixed(3)}`;
    });
});