export function rand(a = 0, b = 1) {
    return a + Math.random() * (b - a);
}

export function weightedChoice(t) {
    let sum = 0;
    for (const k in t) {
        const v = t[k];
        if (v < 0) throw new Error("weight value less than zero");
        sum += v;
    }
    if (sum === 0) throw new Error("all weights are zero");

    let rnd = Math.random() * sum; // equivalente ao lume.random(sum)

    for (const k in t) {
        const v = t[k];
        if (rnd < v) return k;
        rnd -= v;
    }
}

export function statAtLevel(level, {
    base = 100,
    linearGrowth = 15,
    growthRate = 1.08,
} = {}) {
    return Math.floor(base + linearGrowth * level * Math.pow(growthRate, level));
}