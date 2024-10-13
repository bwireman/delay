// smoke tests to establish that the NPM code can be used
// & works as expected
import { delay_effect, map, join, run, repeat, fallthrough, every, any, all } from "../dist/delay.mjs"
import { get, ok, error, isOk, toList } from "../dist/extras/extras.mjs"
import { test } from "@cross/test";
import { assertEquals } from "@std/assert";

test("delay_effect", () => {
    let fin = 0
    const d = delay_effect(() => {
        fin += 1
        return ok(fin)
    })

    assertEquals(fin, 0)

    let res = get(run(d))
    assertEquals(res, fin)
    assertEquals(fin, 1)

    res = get(run(d))
    assertEquals(res, fin)
    assertEquals(fin, 2)

    res = get(run(d))
    assertEquals(res, fin)
    assertEquals(fin, 3)
})

test("map", () => {
    let d1 = delay_effect(() => ok("HELLO"))
    d1 = map(d1, (v) => ok(v + "WORLD"))
    d1 = map(d1, (v) => ok(v + "!"))

    const res1 = get(run(d1))
    assertEquals(res1, "HELLOWORLD!")

    let d2 = delay_effect(() => ok("HELLO"))
    d2 = map(d2, (v) => ok(v + "WORLD"))
    d2 = map(d2, (_) => error("shit!"))

    const res2 = get(run(d2))
    assertEquals(res2, "shit!")
})

test("join", () => {
    let d1 = delay_effect(() => ok(1))
    let d2 = delay_effect(() => ok(2))

    assertEquals(get(run(join(d1, d2))), [1, 2])
})

test("repeat", () => {
    let fin = 0
    const d = delay_effect(() => {
        fin += 1
        return ok(fin)
    })

    assertEquals(fin, 0)

    const res = repeat(d, 3)
        .toArray()
        .map((x) => get(x))

    assertEquals(res, [3, 2, 1])
    assertEquals(fin, 3)
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

    assertEquals(isOk(res[0]), true)
    assertEquals(isOk(res[1]), false)
    assertEquals(isOk(res[2]), false)

    fin = 0
    assertEquals(any(toList([d, d, d])), true)

    fin = 0
    assertEquals(all(toList([d, d, d])), false)
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

    assertEquals(isOk(fallthrough(toList([d]))), false)
    fin = 0

    assertEquals(isOk(fallthrough(toList([d, d]))), false)
    fin = 0

    assertEquals(isOk(fallthrough(toList([d, d, d]))), true)
    assertEquals(isOk(fallthrough(toList([d, d, d, d]))), true)

    assertEquals(fin, 2)
})

