import k from "./Engine";
import "./Loader";
import "./scenes/EndingScene.js";
import "./scenes/IntroScene.js";       
import "./scenes/PlayScene.js";
import.meta.glob("./scenes/*.js", { eager: true });

k.onLoad(() => k.go("menuscene"));