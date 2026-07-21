import k from "./Engine";
import { assets, happyData } from "@kaplayjs/crew";

k.loadRoot("./");

k.loadSprite("nd", "sprites/nd.jpg");

Object.keys(assets).forEach((key) => {
    const asset = assets[key];
    if (asset.kind == "Sprite") {
        k.loadSprite(`@${key.toLowerCase()}`, asset.sprite);
        k.loadSprite(`@${key.toLowerCase()}-o`, asset.outlined);
    }
});

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
            loop: false,
        },
        "attack": {
            from: 15,
            to: 18,
            speed: 3,
            loop: false,
        },
    }
});

k.loadSprite("player", "sprites/player.png", {
    sliceX: 12,
    sliceY: 2,

    anims: {
        "idle": {
            from: 0,
            to: 3,
            speed: 3,
            loop: true,
        },
        "walk": {
            from: 4,
            to: 11,
            speed: 3,
            loop: true,
        },
        "idle_carry": {
            from: 12,
            to: 15,
            speed: 3,
            loop: true,
        },
        "walk_carry": {
            from: 16,
            to: 23,
            speed: 3,
            loop: true,
        },
    }
});

k.loadSprite("pulver", "sprites/borrifador.png");

k.loadSprite("smokeFX", "sprites/smokes.png", { sliceX: 3, sliceY: 1 });

k.loadSprite("casa", "sprites/casa.png");

k.loadMusic("menuMusic", "sounds/blossom.wav");

k.loadBitmapFont("happy-o", happyData.outlined, happyData.width_o, happyData.height_o);