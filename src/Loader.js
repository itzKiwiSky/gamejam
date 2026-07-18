import k from "./Engine";
import { assets, happyData } from "@kaplayjs/crew";

k.loadRoot("./");

k.loadSprite("nd", "sprites/nd.jpg");

//k.loadAseprite("tomaicon", "sprites/tomaicon.png", "sprites/tomaicon.json");

k.loadSprite("tomaicon", "sprites/tomaicon.png", {
    sliceX: 19,
    sliceY: 1,

    anims: {
        "idle": {
            from: 0,
            to: 3,
            speed: 3,
            loop: true,
        },
        "walk": {
            from: 4,
            to: 7,
            speed: 3,
            loop: true,
        },
        "death": {
            from: 8,
            to: 14,
            speed: 3,
            loop: true,
        },
        "attack": {
            from: 15,
            to: 19,
            speed: 3,
            loop: true,
        },
    }
})

k.loadBitmapFont("happy-o", happyData.outlined, happyData.width_o, happyData.height_o);