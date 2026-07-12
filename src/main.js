import kaplay from "kaplay";

const k = kaplay();

k.loadRoot("./"); // A good idea for Itch.io publishing later

k.loadSprite("bean", "sprites/bean.png");

k.add([
    k.pos(120, 80), 
    k.sprite("bean")
]);

const obj = ([
    k.pos(120, 80), 
    k.sprite("bean")
]);