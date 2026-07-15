import k from "../Engine";
import createPlayer from "../game/Player";

k.scene("playscene", () => {
    const player = createPlayer();

    const text = k.add([
        k.pos(20, 20),
        k.text("Stamina: "),
        k.fixed(),
    ]);

<<<<<<< HEAD
    bean.onUpdate(() => {
        bean.pos.y = k.wave(400, 30, k.time() + 2);
        bean.angle = k.wave(-10, 10, k.time() + 2)
    });
=======
>>>>>>> origin/master

    text.onUpdate(() => {
        text.text = `stamina: ${player.stamina.toFixed(3)}`;
    });
});