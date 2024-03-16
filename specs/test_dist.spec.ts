// smoke tests to establish that the NPM code can be used
// & works as expected
import { delay_effect, map, join, run, repeat, fallthrough, every, any, all } from "../dist/delay.mjs"
import { get, ok, error, isOk, toList } from "../dist/extras/extras.mjs"
import { expect, test } from 'vitest'


test("delay_effect", () => {
    let fin = 0
    const d = delay_effect(() => {
        fin += 1
        return ok(fin)
    })

    expect(fin).toBe(0)

    let res = get(run(d))
    expect(res).toBe(fin)
    expect(fin).toBe(1)

    res = get(run(d))
    expect(res).toBe(fin)
    expect(fin).toBe(2)

    res = get(run(d))
    expect(res).toBe(fin)
    expect(fin).toBe(3)
})

test("map", () => {
    let d1 = delay_effect(() => ok("HELLO"))
    d1 = map(d1, (v) => ok(v + "WORLD"))
    d1 = map(d1, (v) => ok(v + "!"))

    const res1 = get(run(d1))
    expect(res1).toBe("HELLOWORLD!")

    let d2 = delay_effect(() => ok("HELLO"))
    d2 = map(d2, (v) => ok(v + "WORLD"))
    d2 = map(d2, (_) => error("shit!"))

    const res2 = get(run(d2))
    expect(res2).toBe("shit!")
})

test("join", () => {
    let d1 = delay_effect(() => ok(1))
    let d2 = delay_effect(() => ok(2))

    expect(get(run(join(d1, d2)))).toStrictEqual([1, 2])
})

test("repeat", () => {
    let fin = 0
    const d = delay_effect(() => {
        fin += 1
        return ok(fin)
    })

    expect(fin).toBe(0)

    const res = repeat(d, 3)
        .toArray()
        .map((x) => get(x))

    expect(res).toStrictEqual([3, 2, 1])
    expect(fin).toBe(3)
})

test("every, any & all", () => {
    let fin = 0
    const d = delay_effect(() => {
        if (fin > 1) {
            return ok("ok!")
        }

        fin += 1
        return error("err!")
    })

    const res = every(toList([d, d, d]))
        .toArray()

    expect(isOk(res[0])).toBe(true)
    expect(isOk(res[1])).toBe(false)
    expect(isOk(res[2])).toBe(false)

    fin = 0
    expect(any(toList([d, d, d]))).toBe(true)

    fin = 0
    expect(all(toList([d, d, d]))).toBe(false)
})

test("fallthrough", () => {
    let fin = 0
    const d = delay_effect(() => {
        if (fin > 1) {
            return ok("ok!")
        }

        fin += 1
        return error("err!")
    })

    expect(isOk(fallthrough(toList([d])))).toBe(false)
    fin = 0

    expect(isOk(fallthrough(toList([d, d])))).toBe(false)
    fin = 0

    expect(isOk(fallthrough(toList([d, d, d])))).toBe(true)
    expect(isOk(fallthrough(toList([d, d, d, d])))).toBe(true)

    expect(fin).toBe(2)
})

