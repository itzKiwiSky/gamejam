

export default function ErrorListenerPlugin(k) {
    window.onerror = (msg, src, ln, col, err) => {
        k.debug.error(msg);
    };
}