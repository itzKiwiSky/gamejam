export default function ErrorListenerPlugin(k) {
    window.addEventListener("error", (event) => {
        const { message, filename, lineno, colno, error } = event;

        const text = `
[ERROR]
${message}
(${filename}:${lineno}:${colno})
${error?.stack ?? "sem stack disponível"}
        `;

        k.debug.error(text);
    });

    // opcional: também captura erros do próprio loop interno do Kaplay
    k.onError((err) => {
        k.debug.error(`[KAPLAY ERROR]\n${err.message}\n${err.stack ?? ""}`);
    });

    return {}; // plugins do Kaplay devem retornar um objeto (mesmo que vazio, se não expõe API nova)
}