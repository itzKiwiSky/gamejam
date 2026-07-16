

export default function ErrorListenerPlugin(k) {
    window.onerror = (msg, src, ln, col, err) => {
        throw new Error(msg);
    };
}