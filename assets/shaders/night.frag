// night.frag
uniform float u_intensity; // 0 = sem efeito, 1 = efeito completo

vec4 frag(vec2 pos, vec2 uv, vec4 color, sampler2D tex) {
    vec4 texColor = texture2D(tex, uv);

    float darkness = mix(1.0, 0.55, u_intensity);
    vec3 darkened = texColor.rgb * darkness;

    vec3 nightTint = mix(vec3(1.0), vec3(0.6, 0.7, 1.1), u_intensity);
    vec3 tinted = darkened * nightTint;

    float dist = distance(uv, vec2(0.5));
    float vignette = smoothstep(0.8, 0.35, dist);
    float vignetteFactor = mix(1.0, mix(0.5, 1.0, vignette), u_intensity);
    tinted *= vignetteFactor;

    return vec4(tinted, texColor.a);
}