import kaplay from "kaplay";
import { crew } from "@kaplayjs/crew";

const k = kaplay({
    width: 1280,
    height: 768,
    letterbox: true,
    stretch: false,
    debug: true,
    crisp: true,
    plugins: [crew],
    font: "happy-o"
});

export default k;