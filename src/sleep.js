export function sleep(time) {
    await new Promise(r => setTimeout(r, time));
}
