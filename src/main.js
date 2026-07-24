import k from "./Engine";
import "./Loader";
import "./scenes/EndingScene.js";
import.meta.glob("./scenes/*.js", { eager: true });

k.onLoad(() => k.go("playscene"));