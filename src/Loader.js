import k from "./Engine";
import { assets, happyData } from "@kaplayjs/crew";

k.loadRoot("./");

k.loadSprite("nd", "sprites/nd.jpg");

k.loadAseprite("tomaicon", "sprites/tomaicon.png", "sprites/tomaicon.json");

k.loadBitmapFont("happy-o", happyData.outlined, happyData.width_o, happyData.height_o);