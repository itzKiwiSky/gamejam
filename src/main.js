import k from "./Engine";
import "./Loader";

import.meta.glob("./Scenes/*.js", { eager: true });

k.onLoad(() => k.go("playscene"));