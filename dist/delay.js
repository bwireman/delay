//Code for `delay-gleam` Generated using Gleam & Esbuild
//https://www.npmjs.com/package/delay-gleam
//https://github.com/bwireman/delay
var __defProp = Object.defineProperty
var __name = (target, value) => __defProp(target, "name", { value, configurable: true })

// build/dev/javascript/prelude.mjs
var CustomType = class {
  static {
    __name(this, "CustomType")
  }
  withFields(fields) {
    let properties = Object.keys(this).map(label => (label in fields ? fields[label] : this[label]))
    return new this.constructor(...properties)
  }
}
var List = class {
  static {
    __name(this, "List")
  }
  static fromArray(array, tail) {
    let t = tail || new Empty()
    return array.reduceRight((xs, x) => new NonEmpty(x, xs), t)
  }
  [Symbol.iterator]() {
    return new ListIterator(this)
  }
  toArray() {
    return [...this]
  }
  // @internal
  atLeastLength(desired) {
    for (let _ of this) {
      if (desired <= 0) return true
      desired--
    }
    return desired <= 0
  }
  // @internal
  hasLength(desired) {
    for (let _ of this) {
      if (desired <= 0) return false
      desired--
    }
    return desired === 0
  }
  countLength() {
    let length3 = 0
    for (let _ of this) length3++
    return length3
  }
}
function toList(elements, tail) {
  return List.fromArray(elements, tail)
}
__name(toList, "toList")
var ListIterator = class {
  static {
    __name(this, "ListIterator")
  }
  #current
  constructor(current) {
    this.#current = current
  }
  next() {
    if (this.#current instanceof Empty) {
      return { done: true }
    } else {
      let { head, tail } = this.#current
      this.#current = tail
      return { value: head, done: false }
    }
  }
}
var Empty = class extends List {
  static {
    __name(this, "Empty")
  }
}
var NonEmpty = class extends List {
  static {
    __name(this, "NonEmpty")
  }
  constructor(head, tail) {
    super()
    this.head = head
    this.tail = tail
  }
}
var Result = class _Result extends CustomType {
  static {
    __name(this, "Result")
  }
  // @internal
  static isResult(data) {
    return data instanceof _Result
  }
}
var Ok = class extends Result {
  static {
    __name(this, "Ok")
  }
  constructor(value) {
    super()
    this[0] = value
  }
  // @internal
  isOk() {
    return true
  }
}
var Error2 = class extends Result {
  static {
    __name(this, "Error")
  }
  constructor(detail) {
    super()
    this[0] = detail
  }
  // @internal
  isOk() {
    return false
  }
}
function makeError(variant, module, line, fn, message, extra) {
  let error = new globalThis.Error(message)
  error.gleam_error = variant
  error.module = module
  error.line = line
  error.fn = fn
  for (let k in extra) error[k] = extra[k]
  return error
}
__name(makeError, "makeError")

// build/dev/javascript/gleam_stdlib/gleam/result.mjs
function is_ok(result) {
  if (!result.isOk()) {
    return false
  } else {
    return true
  }
}
__name(is_ok, "is_ok")
function all(results) {
  return try_map(results, x => {
    return x
  })
}
__name(all, "all")

// build/dev/javascript/gleam_stdlib/dict.mjs
var tempDataView = new DataView(new ArrayBuffer(8))
var SHIFT = 5
var BUCKET_SIZE = Math.pow(2, SHIFT)
var MASK = BUCKET_SIZE - 1
var MAX_INDEX_NODE = BUCKET_SIZE / 2
var MIN_ARRAY_NODE = BUCKET_SIZE / 4

// build/dev/javascript/gleam_stdlib/gleam/list.mjs
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
      loop$accumulator = toList([item], accumulator)
    }
  }
}
__name(do_reverse_acc, "do_reverse_acc")
function do_reverse(list) {
  return do_reverse_acc(list, toList([]))
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
          return toList([x], acc)
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
  return do_filter(list, predicate, toList([]))
}
__name(filter, "filter")
function do_try_map(loop$list, loop$fun, loop$acc) {
  while (true) {
    let list = loop$list
    let fun = loop$fun
    let acc = loop$acc
    if (list.hasLength(0)) {
      return new Ok(reverse(acc))
    } else {
      let x = list.head
      let xs = list.tail
      let $ = fun(x)
      if ($.isOk()) {
        let y = $[0]
        loop$list = xs
        loop$fun = fun
        loop$acc = toList([y], acc)
      } else {
        let error = $[0]
        return new Error2(error)
      }
    }
  }
}
__name(do_try_map, "do_try_map")
function try_map(list, fun) {
  return do_try_map(list, fun, toList([]))
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
      loop$acc = toList([a], acc)
    }
  }
}
__name(do_repeat, "do_repeat")
function repeat(a, times) {
  return do_repeat(a, times, toList([]))
}
__name(repeat, "repeat")

// build/dev/javascript/delay/delay.mjs
var Continue = class extends CustomType {
  static {
    __name(this, "Continue")
  }
  constructor(effect) {
    super()
    this.effect = effect
  }
}
var Stop = class extends CustomType {
  static {
    __name(this, "Stop")
  }
  constructor(err) {
    super()
    this.err = err
  }
}

/**
 * store an effect to be run later
 * if `f` returns an Error then chain will stop
 */
function delay_effect(f) {
  return new Continue(f)
}
__name(delay_effect, "delay_effect")
function chain(delayed_f, f) {
  return () => {
    let $ = delayed_f()
    if ($.isOk()) {
      let value = $[0]
      return f(value)
    } else {
      let err = $[0]
      return new Error2(err)
    }
  }
}
__name(chain, "chain")

/**
 * chains an operation onto an existing delay to be run one then into the next
 * if delayed has already error'd then `f` will be ignored
 */
function map3(delayed, f) {
  if (delayed instanceof Continue) {
    let delayed_f = delayed.effect
    let _pipe = chain(delayed_f, f)
    return delay_effect(_pipe)
  } else {
    let err = delayed.err
    return new Stop(err)
  }
}
__name(map3, "map")

/**
 * flatten nested Delay
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
          return new Error2(err)
        }
      }
    } else {
      let err = delayed.err
      return () => {
        return new Error2(err)
      }
    }
  })()
  return delay_effect(_pipe)
}
__name(flatten, "flatten")

/**
 * map and then flatten Delay
 */
function flat_map(delayed, f) {
  let _pipe = delayed
  let _pipe$1 = map3(_pipe, f)
  return flatten(_pipe$1)
}
__name(flat_map, "flat_map")
function sleep(_) {
  return void 0
}
__name(sleep, "sleep")

/**
 * run a delayed effect and get the result
 * short-circuiting if any in the chain returns an Error
 */
function run(delayed) {
  if (delayed instanceof Continue) {
    let f = delayed.effect
    return f()
  } else {
    let err = delayed.err
    return new Error2(err)
  }
}
__name(run, "run")
function do_retry(loop$delayed, loop$retries, loop$delay, loop$backoff) {
  while (true) {
    let delayed = loop$delayed
    let retries = loop$retries
    let delay = loop$delay
    let backoff = loop$backoff
    let delay$1 = (() => {
      if (backoff) {
        return delay + 1e3
      } else {
        return delay
      }
    })()
    if (retries <= 1) {
      let n = retries
      return run(delayed)
    } else {
      let $ = run(delayed)
      if ($.isOk()) {
        let res = $[0]
        return new Ok(res)
      } else {
        sleep(delay$1)
        loop$delayed = delayed
        loop$retries = retries - 1
        loop$delay = delay$1
        loop$backoff = backoff
      }
    }
  }
}
__name(do_retry, "do_retry")

/**
 * returns a Delay that will be re-attempted `retries` times with `delay` ms in between
 * NOTE: `delay` is ignored in JS
 */
function retry(delayed, retries, delay) {
  return delay_effect(() => {
    return do_retry(delayed, retries, delay, false)
  })
}
__name(retry, "retry")

/**
 * returns a Delay that will be re-attempted `retries` times with `delay` ms in between
 * NOTE: `delay` is ignored in JS
 */
function retry_with_backoff(delayed, retries) {
  return delay_effect(() => {
    return do_retry(delayed, retries, 0, true)
  })
}
__name(retry_with_backoff, "retry_with_backoff")

/**
 * run a delayed effect and throw away the result
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
      return toList([run(last)], results)
    } else if (effects.atLeastLength(1)) {
      let head = effects.head
      let rest = effects.tail
      loop$effects = rest
      loop$results = toList([run(head)], results)
    } else {
      throw makeError("todo", "delay", 185, "do_every", "Empty list", {})
    }
  }
}
__name(do_every, "do_every")

/**
 * run every effect in sequence and get their results
 */
function every(effects) {
  return do_every(effects, toList([]))
}
__name(every, "every")

/**
 * repeat a Delay and return the results in a list
 */
function repeat2(delayed, repetition) {
  let _pipe = delayed
  let _pipe$1 = repeat(_pipe, repetition)
  return every(_pipe$1)
}
__name(repeat2, "repeat")

/**
 * run all effects in sequence and return True if all succeed
 * note this will _always_ run _every_ effect
 */
function all2(effects) {
  let _pipe = effects
  let _pipe$1 = every(_pipe)
  let _pipe$2 = all(_pipe$1)
  return is_ok(_pipe$2)
}
__name(all2, "all")

/**
 * run all effects in sequence and return True if any succeeds
 * note this is different than `fallthrough/1` because it will _always_ run _every_ effect
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
    let $ = run(head)
    if ($.isOk()) {
      let res = $[0]
      return new Ok(res)
    } else {
      return fallthrough(rest)
    }
  } else {
    throw makeError("todo", "delay", 204, "do_fallthrough", "Empty list", {})
  }
}
__name(do_fallthrough, "do_fallthrough")

/**
 * attempt multiple Delays until one returns an Ok
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
