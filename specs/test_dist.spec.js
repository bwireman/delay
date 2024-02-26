// smoke tests to establish that the NPM code can be used
// & works as expected
import { delay_effect, map, run, repeat, fallthrough, every, any, all } from "../dist/delay"
import { expect, test } from '@jest/globals';
import { Ok, Error, List } from "./prelude.mjs"

test("delay_effect", () => {
    let fin = 0
    const d = delay_effect(() => {
        fin += 1
        return new Ok(fin)
    })

    expect(fin).toBe(0)

    let res = run(d)[0]
    expect(res).toBe(fin)
    expect(fin).toBe(1)

    res = run(d)[0]
    expect(res).toBe(fin)
    expect(fin).toBe(2)

    res = run(d)[0]
    expect(res).toBe(fin)
    expect(fin).toBe(3)
})

test("map", () => {
    let d1 = delay_effect(() => new Ok("HELLO"))
    d1 = map(d1, (v) => new Ok(v + "WORLD"))
    d1 = map(d1, (v) => new Ok(v + "!"))

    const res1 = run(d1)[0]
    expect(res1).toBe("HELLOWORLD!")

    let d2 = delay_effect(() => new Ok("HELLO"))
    d2 = map(d2, (v) => new Ok(v + "WORLD"))
    d2 = map(d2, (_) => new Error("shit!"))

    const res2 = run(d2)[0]
    expect(res2).toBe("shit!")
})

test("repeat", () => {
    let fin = 0
    const d = delay_effect(() => {
        fin += 1
        return new Ok(fin)
    })

    expect(fin).toBe(0)

    const res = repeat(d, 3)
        .toArray()
        .map((x) => x[0])

    expect(res).toStrictEqual([3, 2, 1])
    expect(fin).toBe(3)
})

test("every, any & all", () => {
    let fin = 0
    const d = delay_effect(() => {
        if (fin > 1) {
            return new Ok("ok!")
        }

        fin += 1
        return new Error("err!")
    })

    const res = every(List.fromArray([d, d, d]))
        .toArray()

    expect(res[0].isOk()).toBe(true)
    expect(res[1].isOk()).toBe(false)
    expect(res[2].isOk()).toBe(false)

    fin = 0
    expect(any(List.fromArray([d, d, d]))).toBe(true)

    fin = 0
    expect(all(List.fromArray([d, d, d]))).toBe(false)
})



test("fallthrough", () => {
    let fin = 0
    const d = delay_effect(() => {
        if (fin > 1) {
            return new Ok("ok!")
        }

        fin += 1
        return new Error("err!")
    })

    expect(fallthrough(List.fromArray([d])).isOk()).toBe(false)
    fin = 0

    expect(fallthrough(List.fromArray([d, d])).isOk()).toBe(false)
    fin = 0

    expect(fallthrough(List.fromArray([d, d, d])).isOk()).toBe(true)
    expect(fallthrough(List.fromArray([d, d, d, d])).isOk()).toBe(true)

    expect(fin).toBe(2)
})

