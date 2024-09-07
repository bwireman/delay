//Code for `delay-gleam` Generated using Gleam & Esbuild
//https://www.npmjs.com/package/delay-gleam
//https://github.com/bwireman/delay
var __defProp = Object.defineProperty
var __name = (target, value) => __defProp(target, "name", { value, configurable: true })

import { Ok as Ok9, Error as Error11, toList as toList9, prepend as listPrepend8 } from "./extras/prelude.mjs"

import { CustomType as $CustomType } from "./extras/prelude.mjs"
var Some = class extends $CustomType {
  static {
    __name(this, "Some")
  }
  constructor(x0) {
    super()
    this[0] = x0
  }
}
var None = class extends $CustomType {
  static {
    __name(this, "None")
  }
}

import { Error as Error5 } from "./extras/prelude.mjs"
function is_ok(result) {
  if (!result.isOk()) {
    return false
  } else {
    return true
  }
}
__name(is_ok, "is_ok")
function try$(result, fun) {
  if (result.isOk()) {
    let x = result[0]
    return fun(x)
  } else {
    let e = result[0]
    return new Error5(e)
  }
}
__name(try$, "try$")
function lazy_or(first, second) {
  if (first.isOk()) {
    return first
  } else {
    return second()
  }
}
__name(lazy_or, "lazy_or")
function all(results) {
  return try_map(results, x => {
    return x
  })
}
__name(all, "all")

var unicode_whitespaces = [
  " ",
  // Space
  "	",
  // Horizontal tab
  "\n",
  // Line feed
  "\v",
  // Vertical tab
  "\f",
  // Form feed
  "\r",
  // Carriage return
  "\x85",
  // Next line
  "\u2028",
  // Line separator
  "\u2029"
  // Paragraph separator
].join("")

function count_length(loop$list, loop$count) {
  while (true) {
    let list = loop$list
    let count = loop$count
    if (list.atLeastLength(1)) {
      let list$1 = list.tail
      loop$list = list$1
      loop$count = count + 1
    } else {
      return count
    }
  }
}
__name(count_length, "count_length")
function length2(list) {
  return count_length(list, 0)
}
__name(length2, "length")
function do_reverse(loop$remaining, loop$accumulator) {
  while (true) {
    let remaining = loop$remaining
    let accumulator = loop$accumulator
    if (remaining.hasLength(0)) {
      return accumulator
    } else {
      let item = remaining.head
      let rest$1 = remaining.tail
      loop$remaining = rest$1
      loop$accumulator = listPrepend8(item, accumulator)
    }
  }
}
__name(do_reverse, "do_reverse")
function reverse(xs) {
  return do_reverse(xs, toList9([]))
}
__name(reverse, "reverse")
function do_filter(loop$list, loop$fun, loop$acc) {
  while (true) {
    let list = loop$list
    let fun = loop$fun
    let acc = loop$acc
    if (list.hasLength(0)) {
      return reverse(acc)
    } else {
      let x = list.head
      let xs = list.tail
      let new_acc = (() => {
        let $ = fun(x)
        if ($) {
          return listPrepend8(x, acc)
        } else {
          return acc
        }
      })()
      loop$list = xs
      loop$fun = fun
      loop$acc = new_acc
    }
  }
}
__name(do_filter, "do_filter")
function filter(list, predicate) {
  return do_filter(list, predicate, toList9([]))
}
__name(filter, "filter")
function do_try_map(loop$list, loop$fun, loop$acc) {
  while (true) {
    let list = loop$list
    let fun = loop$fun
    let acc = loop$acc
    if (list.hasLength(0)) {
      return new Ok9(reverse(acc))
    } else {
      let x = list.head
      let xs = list.tail
      let $ = fun(x)
      if ($.isOk()) {
        let y = $[0]
        loop$list = xs
        loop$fun = fun
        loop$acc = listPrepend8(y, acc)
      } else {
        let error = $[0]
        return new Error11(error)
      }
    }
  }
}
__name(do_try_map, "do_try_map")
function try_map(list, fun) {
  return do_try_map(list, fun, toList9([]))
}
__name(try_map, "try_map")
function do_repeat(loop$a, loop$times, loop$acc) {
  while (true) {
    let a = loop$a
    let times = loop$times
    let acc = loop$acc
    let $ = times <= 0
    if ($) {
      return acc
    } else {
      loop$a = a
      loop$times = times - 1
      loop$acc = listPrepend8(a, acc)
    }
  }
}
__name(do_repeat, "do_repeat")
function repeat3(a, times) {
  return do_repeat(a, times, toList9([]))
}
__name(repeat3, "repeat")

// build/dev/javascript/delay/delay.mjs
import {
  Ok as Ok10,
  Error as Error12,
  toList as toList10,
  prepend as listPrepend9,
  CustomType as $CustomType9,
  makeError
} from "./extras/prelude.mjs"
var Continue2 = class extends $CustomType9 {
  static {
    __name(this, "Continue")
  }
  constructor(effect) {
    super()
    this.effect = effect
  }
}
var Stop = class extends $CustomType9 {
  static {
    __name(this, "Stop")
  }
  constructor(err) {
    super()
    this.err = err
  }
}

/**
 * Stores an effect to be run later, short circuiting on errors
 */
function delay_effect(func) {
  return new Continue2(func)
}
__name(delay_effect, "delay_effect")
function chain(delayed_func, func) {
  return () => {
    return try$(delayed_func(), func)
  }
}
__name(chain, "chain")

/**
 * Chains an operation onto an existing delay. The result of the current delay will be lazily passed to `func`
 * `func` will not be called if the delay has already returned an error
 */
function map3(delayed, func) {
  if (delayed instanceof Continue2) {
    let delayed_func = delayed.effect
    let _pipe = chain(delayed_func, func)
    return delay_effect(_pipe)
  } else {
    let err = delayed.err
    return new Stop(err)
  }
}
__name(map3, "map")

/**
 * flatten a nested Delay
 */
function flatten(delayed) {
  let _pipe = (() => {
    if (delayed instanceof Continue2) {
      let delayed_func = delayed.effect
      return () => {
        let inner = (() => {
          let $ = delayed_func()
          if ($.isOk()) {
            let inner_delay = $[0]
            return inner_delay
          } else {
            let err = $[0]
            return new Stop(err)
          }
        })()
        if (inner instanceof Continue2) {
          let inner_func = inner.effect
          return inner_func()
        } else {
          let err = inner.err
          return new Error12(err)
        }
      }
    } else {
      let err = delayed.err
      return () => {
        return new Error12(err)
      }
    }
  })()
  return delay_effect(_pipe)
}
__name(flatten, "flatten")

/**
 * Map and then flatten `delayed`
 */
function flat_map(delayed, func) {
  let _pipe = delayed
  let _pipe$1 = map3(_pipe, func)
  return flatten(_pipe$1)
}
__name(flat_map, "flat_map")
function sleep(_) {
  return void 0
}
__name(sleep, "sleep")

/**
 * Run a delayed effect and get the result
 * short-circuiting if any in delay in the chain returns an Error
 */
function run(delayed) {
  if (delayed instanceof Continue2) {
    let func = delayed.effect
    return func()
  } else {
    let err = delayed.err
    return new Error12(err)
  }
}
__name(run, "run")

/**
 * returns a delay, that joins two delays. If `left` fails `right` will not be run, if either fails the result will be an Error
 */
function join2(left, right) {
  let _pipe = /* @__PURE__ */ __name(() => {
    let $ = run(left)
    if (!$.isOk()) {
      let err = $[0]
      return new Error12([new Some(err), new None()])
    } else {
      let left_val = $[0]
      let $1 = run(right)
      if ($1.isOk()) {
        let right_val = $1[0]
        return new Ok10([left_val, right_val])
      } else {
        let err = $1[0]
        return new Error12([new None(), new Some(err)])
      }
    }
  }, "_pipe")
  return delay_effect(_pipe)
}
__name(join2, "join")
function do_retry(delayed, retries, delay, backoff) {
  let delay$1 = (() => {
    if (backoff) {
      return delay + 1e3
    } else {
      return delay
    }
  })()
  if (retries <= 1) {
    return run(delayed)
  } else {
    return lazy_or(run(delayed), () => {
      sleep(delay$1)
      return do_retry(delayed, retries - 1, delay$1, backoff)
    })
  }
}
__name(do_retry, "do_retry")

/**
 * Returns a new Delay that will be re-attempted `retries` times with `delay` ms in-between
 * NOTE: `delay` is ignored in JS
 */
function retry(delayed, retries, delay) {
  return delay_effect(() => {
    return do_retry(delayed, retries, delay, false)
  })
}
__name(retry, "retry")

/**
 * Returns a new Delay that will be re-attempted `retries` times with `delay` ms in-between
 * NOTE: `delay` is ignored in JS
 */
function retry_with_backoff(delayed, retries) {
  return delay_effect(() => {
    return do_retry(delayed, retries, 0, true)
  })
}
__name(retry_with_backoff, "retry_with_backoff")

/**
 * Run a delayed effect and throw away the result
 * short-circuiting if any in the chain returns an Error
 */
function drain(delayed) {
  let $ = run(delayed)
  return void 0
}
__name(drain, "drain")
function do_every(loop$effects, loop$results) {
  while (true) {
    let effects = loop$effects
    let results = loop$results
    if (effects.hasLength(1)) {
      let last = effects.head
      return listPrepend9(run(last), results)
    } else if (effects.atLeastLength(1)) {
      let head = effects.head
      let rest = effects.tail
      loop$effects = rest
      loop$results = listPrepend9(run(head), results)
    } else {
      throw makeError("panic", "delay", 198, "do_every", "Empty list", {})
    }
  }
}
__name(do_every, "do_every")

/**
 * Run every effect in sequence and get their results
 */
function every(effects) {
  return do_every(effects, toList10([]))
}
__name(every, "every")

/**
 * Repeat a Delay and return the results in a list
 */
function repeat4(delayed, repetition) {
  let _pipe = delayed
  let _pipe$1 = repeat3(_pipe, repetition)
  return every(_pipe$1)
}
__name(repeat4, "repeat")

/**
 * Run all effects in sequence and return True if all succeed
 * NOTE: this will _always_ run _every_ effect
 */
function all2(effects) {
  let _pipe = effects
  let _pipe$1 = every(_pipe)
  let _pipe$2 = all(_pipe$1)
  return is_ok(_pipe$2)
}
__name(all2, "all")

/**
 * Run all effects in sequence and return True if any succeeds
 * NOTE: this is different than `fallthrough/1` because it will _always_ run _every_ effect
 */
function any(effects) {
  return (
    (() => {
      let _pipe = effects
      let _pipe$1 = every(_pipe)
      let _pipe$2 = filter(_pipe$1, is_ok)
      return length2(_pipe$2)
    })() > 0
  )
}
__name(any, "any")
function do_fallthrough(effects) {
  if (effects.hasLength(1)) {
    let last = effects.head
    return run(last)
  } else if (effects.atLeastLength(1)) {
    let head = effects.head
    let rest = effects.tail
    return lazy_or(run(head), () => {
      return fallthrough(rest)
    })
  } else {
    throw makeError("panic", "delay", 213, "do_fallthrough", "Empty list", {})
  }
}
__name(do_fallthrough, "do_fallthrough")

/**
 * Attempt multiple Delays until one returns an Ok
 * unlike `any/1` this will short circuit on the first Ok
 */
function fallthrough(effects) {
  return do_fallthrough(effects)
}
__name(fallthrough, "fallthrough")
export {
  all2 as all,
  any,
  delay_effect,
  drain,
  every,
  fallthrough,
  flat_map,
  flatten,
  join2 as join,
  map3 as map,
  repeat4 as repeat,
  retry,
  retry_with_backoff,
  run
}
