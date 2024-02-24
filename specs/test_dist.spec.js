import { run, delay_effect, map, repeat } from "../dist/delay"
import { Ok, Error } from "./prelude.mjs"

test('delay_effect', () => {
    let fin = 0;
    const d = delay_effect(() => {
        fin += 1;
        return new Ok(fin)
    })

    expect(fin).toBe(0);

    let res = run(d)[0]
    expect(res).toBe(fin);
    expect(fin).toBe(1);

    res = run(d)[0]
    expect(res).toBe(fin);
    expect(fin).toBe(2);

    res = run(d)[0]
    expect(res).toBe(fin);
    expect(fin).toBe(3);
});

test('delay_effect map', () => {
    let d1 = delay_effect(() => new Ok("HELLO"))
    d1 = map(d1, (v) => new Ok(v + "WORLD"))
    d1 = map(d1, (v) => new Ok(v + "!"))

    const res1 = run(d1)[0]
    expect(res1).toBe("HELLOWORLD!")

    let d2 = delay_effect(() => new Ok("HELLO"))
    d2 = map(d2, (v) => new Ok(v + "WORLD"))
    d2 = map(d2, (v) => new Error("shit!"))

    const res2 = run(d2)[0]
    expect(res2).toBe("shit!")
});

test('delay_effect repeat', () => {
    let fin = 0;
    const d = delay_effect(() => {
        fin += 1;
        return new Ok(fin)
    })

    expect(fin).toBe(0);

    const res = repeat(d, 3)
        .toArray()
        .map((x) => x[0]);

    expect(res).toStrictEqual([3, 2, 1])
    expect(fin).toBe(3);
});

