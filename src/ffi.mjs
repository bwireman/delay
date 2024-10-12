export function busy_wait(delay) {
    const fin = Date.now() + delay;

    while (Date.now() < fin) {
        // busy wait
    }
}

