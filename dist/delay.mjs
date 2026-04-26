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
    for (let i = array.length - 1; i >= 0; --i) {
      t = new NonEmpty(array[i], t)
    }
    return t
  }
  [Symbol.iterator]() {
    return new ListIterator(this)
  }
  toArray() {
    return [...this]
  }
  atLeastLength(desired) {
    let current = this
    while (desired-- > 0 && current) current = current.tail
    return current !== void 0
  }
  hasLength(desired) {
    let current = this
    while (desired-- > 0 && current) current = current.tail
    return desired === -1 && current instanceof Empty
  }
  countLength() {
    let current = this
    let length3 = 0
    while (current) {
      current = current.tail
      length3++
    }
    return length3 - 1
  }
}
function prepend(element, tail) {
  return new NonEmpty(element, tail)
}
__name(prepend, "prepend")
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
  static isResult(data2) {
    return data2 instanceof _Result
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
  isOk() {
    return false
  }
}
function makeError(variant, file, module, line, fn, message, extra) {
  let error = new globalThis.Error(message)
  error.gleam_error = variant
  error.file = file
  error.module = module
  error.line = line
  error.function = fn
  error.fn = fn
  for (let k in extra) error[k] = extra[k]
  return error
}
__name(makeError, "makeError")

// build/dev/javascript/gleam_stdlib/dict.mjs
var bits = 5
var mask = (1 << bits) - 1
var noElementMarker = Symbol()
var generationKey = Symbol()

// build/dev/javascript/gleam_stdlib/gleam/option.mjs
var Some = class extends CustomType {
  static {
    __name(this, "Some")
  }
  constructor($0) {
    super()
    this[0] = $0
  }
}
var None = class extends CustomType {
  static {
    __name(this, "None")
  }
}

// build/dev/javascript/gleam_stdlib/gleam_stdlib.mjs
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
var trim_start_regex = /* @__PURE__ */ new RegExp(`^[${unicode_whitespaces}]*`)
var trim_end_regex = /* @__PURE__ */ new RegExp(`[${unicode_whitespaces}]*$`)
var MIN_I32 = -(2 ** 31)
var MAX_I32 = 2 ** 31 - 1
var U32 = 2 ** 32
var MAX_SAFE = Number.MAX_SAFE_INTEGER
var MIN_SAFE = Number.MIN_SAFE_INTEGER

// build/dev/javascript/gleam_stdlib/gleam/list.mjs
function length_loop(loop$list, loop$count) {
  while (true) {
    let list2 = loop$list
    let count = loop$count
    if (list2 instanceof Empty) {
      return count
    } else {
      let list$1 = list2.tail
      loop$list = list$1
      loop$count = count + 1
    }
  }
}
__name(length_loop, "length_loop")
function length2(list2) {
  return length_loop(list2, 0)
}
__name(length2, "length")
function reverse_and_prepend(loop$prefix, loop$suffix) {
  while (true) {
    let prefix = loop$prefix
    let suffix = loop$suffix
    if (prefix instanceof Empty) {
      return suffix
    } else {
      let first$1 = prefix.head
      let rest$1 = prefix.tail
      loop$prefix = rest$1
      loop$suffix = prepend(first$1, suffix)
    }
  }
}
__name(reverse_and_prepend, "reverse_and_prepend")
function reverse(list2) {
  return reverse_and_prepend(list2, toList([]))
}
__name(reverse, "reverse")
function filter_loop(loop$list, loop$fun, loop$acc) {
  while (true) {
    let list2 = loop$list
    let fun = loop$fun
    let acc = loop$acc
    if (list2 instanceof Empty) {
      return reverse(acc)
    } else {
      let first$1 = list2.head
      let rest$1 = list2.tail
      let _block
      let $ = fun(first$1)
      if ($) {
        _block = prepend(first$1, acc)
      } else {
        _block = acc
      }
      let new_acc = _block
      loop$list = rest$1
      loop$fun = fun
      loop$acc = new_acc
    }
  }
}
__name(filter_loop, "filter_loop")
function filter(list2, predicate) {
  return filter_loop(list2, predicate, toList([]))
}
__name(filter, "filter")
function try_map_loop(loop$list, loop$fun, loop$acc) {
  while (true) {
    let list2 = loop$list
    let fun = loop$fun
    let acc = loop$acc
    if (list2 instanceof Empty) {
      return new Ok(reverse(acc))
    } else {
      let first$1 = list2.head
      let rest$1 = list2.tail
      let $ = fun(first$1)
      if ($ instanceof Ok) {
        let first$2 = $[0]
        loop$list = rest$1
        loop$fun = fun
        loop$acc = prepend(first$2, acc)
      } else {
        return $
      }
    }
  }
}
__name(try_map_loop, "try_map_loop")
function try_map(list2, fun) {
  return try_map_loop(list2, fun, toList([]))
}
__name(try_map, "try_map")
function repeat_loop(loop$item, loop$times, loop$acc) {
  while (true) {
    let item = loop$item
    let times = loop$times
    let acc = loop$acc
    let $ = times <= 0
    if ($) {
      return acc
    } else {
      loop$item = item
      loop$times = times - 1
      loop$acc = prepend(item, acc)
    }
  }
}
__name(repeat_loop, "repeat_loop")
function repeat2(a, times) {
  return repeat_loop(a, times, toList([]))
}
__name(repeat2, "repeat")

// build/dev/javascript/gleam_stdlib/gleam/result.mjs
function is_ok(result) {
  if (result instanceof Ok) {
    return true
  } else {
    return false
  }
}
__name(is_ok, "is_ok")
function try$(result, fun) {
  if (result instanceof Ok) {
    let x = result[0]
    return fun(x)
  } else {
    return result
  }
}
__name(try$, "try$")
function lazy_or(first, second) {
  if (first instanceof Ok) {
    return first
  } else {
    return second()
  }
}
__name(lazy_or, "lazy_or")
function all(results) {
  return try_map(results, result => {
    return result
  })
}
__name(all, "all")

// build/dev/javascript/delay/ffi.mjs
function busy_wait(delay) {
  const fin = Date.now() + delay
  while (Date.now() < fin) {}
}
__name(busy_wait, "busy_wait")

// build/dev/javascript/delay/delay.mjs
var FILEPATH = "src/delay.gleam"
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
    let delayed_func = delayed.effect
    let _pipe = chain(delayed_func, func)
    return delay_effect(_pipe)
  } else {
    return delayed
  }
}
__name(map3, "map")

/**
 * flatten a nested Delay
 */
function flatten(delayed) {
  let _block
  if (delayed instanceof Continue) {
    let delayed_func = delayed.effect
    _block = /* @__PURE__ */ __name(() => {
      let _block$1
      let $ = delayed_func()
      if ($ instanceof Ok) {
        let inner_delay = $[0]
        _block$1 = inner_delay
      } else {
        let err = $[0]
        _block$1 = new Stop(err)
      }
      let inner = _block$1
      if (inner instanceof Continue) {
        let inner_func = inner.effect
        return inner_func()
      } else {
        let err = inner.err
        return new Error2(err)
      }
    }, "_block")
  } else {
    let err = delayed.err
    _block = /* @__PURE__ */ __name(() => {
      return new Error2(err)
    }, "_block")
  }
  let _pipe = _block
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

/**
 * Run a delayed effect and get the result
 * short-circuiting if any in delay in the chain returns an Error
 */
function run(delayed) {
  if (delayed instanceof Continue) {
    let func = delayed.effect
    return func()
  } else {
    let err = delayed.err
    return new Error2(err)
  }
}
__name(run, "run")

/**
 * returns a delay, that joins two delays. If `left` fails `right` will not be run, if either fails the result will be an Error
 */
function join(left, right) {
  let _pipe = /* @__PURE__ */ __name(() => {
    let $ = run(left)
    if ($ instanceof Ok) {
      let left_val = $[0]
      let $1 = run(right)
      if ($1 instanceof Ok) {
        let right_val = $1[0]
        return new Ok([left_val, right_val])
      } else {
        let err = $1[0]
        return new Error2([new None(), new Some(err)])
      }
    } else {
      let err = $[0]
      return new Error2([new Some(err), new None()])
    }
  }, "_pipe")
  return delay_effect(_pipe)
}
__name(join, "join")
function do_retry(delayed, retries, delay, backoff) {
  let _block
  if (backoff) {
    _block = delay + 1e3
  } else {
    _block = delay
  }
  let delay$1 = _block
  if (retries <= 1) {
    return run(delayed)
  } else {
    return lazy_or(run(delayed), () => {
      busy_wait(delay$1)
      return do_retry(delayed, retries - 1, delay$1, backoff)
    })
  }
}
__name(do_retry, "do_retry")

/**
 * Returns a new Delay that will be re-attempted `retries` times with `delay` ms in-between
 * Note: JS uses busy waiting
 */
function retry(delayed, retries, delay) {
  return delay_effect(() => {
    return do_retry(delayed, retries, delay, false)
  })
}
__name(retry, "retry")

/**
 * Returns a new Delay that will be re-attempted `retries` times with `delay` ms in-between
 * Note: JS uses busy waiting
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
    if (effects instanceof Empty) {
      throw makeError("panic", FILEPATH, "delay", 196, "do_every", "Empty list", {})
    } else {
      let $ = effects.tail
      if ($ instanceof Empty) {
        let last = effects.head
        return prepend(run(last), results)
      } else {
        let head = effects.head
        let rest = $
        loop$effects = rest
        loop$results = prepend(run(head), results)
      }
    }
  }
}
__name(do_every, "do_every")

/**
 * Run every effect in sequence and get their results
 */
function every(effects) {
  return do_every(effects, toList([]))
}
__name(every, "every")

/**
 * Repeat a Delay and return the results in a list
 */
function repeat3(delayed, repetition) {
  let _pipe = delayed
  let _pipe$1 = repeat2(_pipe, repetition)
  return every(_pipe$1)
}
__name(repeat3, "repeat")

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
  if (effects instanceof Empty) {
    throw makeError("panic", FILEPATH, "delay", 211, "do_fallthrough", "Empty list", {})
  } else {
    let $ = effects.tail
    if ($ instanceof Empty) {
      let last = effects.head
      return run(last)
    } else {
      let head = effects.head
      let rest = $
      return lazy_or(run(head), () => {
        return fallthrough(rest)
      })
    }
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
  join,
  map3 as map,
  repeat3 as repeat,
  retry,
  retry_with_backoff,
  run
}
