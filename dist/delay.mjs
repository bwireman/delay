//Code for `delay-gleam` Generated using Gleam & Esbuild
//https://www.npmjs.com/package/delay-gleam
//https://github.com/bwireman/delay
var __defProp = Object.defineProperty
var __name = (target, value) => __defProp(target, "name", { value, configurable: true })

import { Ok as Ok7, Error as Error9, toList as toList7 } from "./extras/prelude.mjs"

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

function do_length_acc(loop$list, loop$count) {
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
__name(do_length_acc, "do_length_acc")
function do_length(list) {
  return do_length_acc(list, 0)
}
__name(do_length, "do_length")
function length2(list) {
  return do_length(list)
}
__name(length2, "length")
function do_reverse_acc(loop$remaining, loop$accumulator) {
  while (true) {
    let remaining = loop$remaining
    let accumulator = loop$accumulator
    if (remaining.hasLength(0)) {
      return accumulator
    } else {
      let item = remaining.head
      let rest$1 = remaining.tail
      loop$remaining = rest$1
      loop$accumulator = toList7([item], accumulator)
    }
  }
}
__name(do_reverse_acc, "do_reverse_acc")
function do_reverse(list) {
  return do_reverse_acc(list, toList7([]))
}
__name(do_reverse, "do_reverse")
function reverse(xs) {
  return do_reverse(xs)
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
          return toList7([x], acc)
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
  return do_filter(list, predicate, toList7([]))
}
__name(filter, "filter")
function do_try_map(loop$list, loop$fun, loop$acc) {
  while (true) {
    let list = loop$list
    let fun = loop$fun
    let acc = loop$acc
    if (list.hasLength(0)) {
      return new Ok7(reverse(acc))
    } else {
      let x = list.head
      let xs = list.tail
      let $ = fun(x)
      if ($.isOk()) {
        let y = $[0]
        loop$list = xs
        loop$fun = fun
        loop$acc = toList7([y], acc)
      } else {
        let error = $[0]
        return new Error9(error)
      }
    }
  }
}
__name(do_try_map, "do_try_map")
function try_map(list, fun) {
  return do_try_map(list, fun, toList7([]))
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
      loop$acc = toList7([a], acc)
    }
  }
}
__name(do_repeat, "do_repeat")
function repeat(a, times) {
  return do_repeat(a, times, toList7([]))
}
__name(repeat, "repeat")

// build/dev/javascript/delay/delay.mjs
import { Error as Error10, toList as toList8, CustomType as $CustomType7, makeError } from "./extras/prelude.mjs"
var Continue = class extends $CustomType7 {
  static {
    __name(this, "Continue")
  }
  constructor(effect) {
    super()
    this.effect = effect
  }
}
var Stop = class extends $CustomType7 {
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
  return new Continue(func)
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
  if (delayed instanceof Continue) {
    let delayed_f = delayed.effect
    let _pipe = chain(delayed_f, func)
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
    if (delayed instanceof Continue) {
      let delayed_f = delayed.effect
      return () => {
        let inner = (() => {
          let $ = delayed_f()
          if ($.isOk()) {
            let inner_delay = $[0]
            return inner_delay
          } else {
            let err = $[0]
            return new Stop(err)
          }
        })()
        if (inner instanceof Continue) {
          let inner_f = inner.effect
          return inner_f()
        } else {
          let err = inner.err
          return new Error10(err)
        }
      }
    } else {
      let err = delayed.err
      return () => {
        return new Error10(err)
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
  if (delayed instanceof Continue) {
    let f = delayed.effect
    return f()
  } else {
    let err = delayed.err
    return new Error10(err)
  }
}
__name(run, "run")
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
  run(delayed)
  return void 0
}
__name(drain, "drain")
function do_every(loop$effects, loop$results) {
  while (true) {
    let effects = loop$effects
    let results = loop$results
    if (effects.hasLength(1)) {
      let last = effects.head
      return toList8([run(last)], results)
    } else if (effects.atLeastLength(1)) {
      let head = effects.head
      let rest = effects.tail
      loop$effects = rest
      loop$results = toList8([run(head)], results)
    } else {
      throw makeError("todo", "delay", 176, "do_every", "Empty list", {})
    }
  }
}
__name(do_every, "do_every")

/**
 * Run every effect in sequence and get their results
 */
function every(effects) {
  return do_every(effects, toList8([]))
}
__name(every, "every")

/**
 * Repeat a Delay and return the results in a list
 */
function repeat2(delayed, repetition) {
  let _pipe = delayed
  let _pipe$1 = repeat(_pipe, repetition)
  return every(_pipe$1)
}
__name(repeat2, "repeat")

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
    throw makeError("todo", "delay", 191, "do_fallthrough", "Empty list", {})
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
  map3 as map,
  repeat2 as repeat,
  retry,
  retry_with_backoff,
  run
}
