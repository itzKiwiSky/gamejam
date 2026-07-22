import kaplay from "kaplay";
import { crew } from "@kaplayjs/crew";
import ErrorListenerPlugin from "./plugins/ErrorTrigger";
import { tiledPlugin } from "kaplay-plugin-tiled";

const k = kaplay({
    width: 1280,
    height: 768,
    letterbox: true,
    stretch: false,
    debug: true,
    crisp: true,
    plugins: [crew, ErrorListenerPlugin, tiledPlugin],
    font: "happy-o"
});

export default k;