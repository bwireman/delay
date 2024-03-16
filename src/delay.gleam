import gleam/list
import gleam/result
import gleam/option

/// Type representing a delayed effect to be lazily evaluated
pub opaque type Delay(val, error) {
  Continue(effect: fn() -> Result(val, error))
  Stop(err: error)
}

/// Stores an effect to be run later, short circuiting on errors
pub fn delay_effect(func: fn() -> Result(val, error)) -> Delay(val, error) {
  Continue(effect: func)
}

/// Chains an operation onto an existing delay. The result of the current delay will be lazily passed to `func`
/// `func` will not be called if the delay has already returned an error
pub fn map(
  delayed: Delay(val, error),
  func: fn(val) -> Result(f_res, error),
) -> Delay(f_res, error) {
  case delayed {
    Continue(effect: delayed_func) ->
      chain(delayed_func, func)
      |> delay_effect

    Stop(err) -> Stop(err)
  }
}

fn chain(
  delayed_func: fn() -> Result(val, error),
  func: fn(val) -> Result(f_res, error),
) -> fn() -> Result(f_res, error) {
  fn() { result.try(delayed_func(), func) }
}

/// flatten a nested Delay
pub fn flatten(
  delayed: Delay(Delay(inner_res, error), error),
) -> Delay(inner_res, error) {
  case delayed {
    // depending on the state of delayed we either need a fn that returns the stop error
    // or a function that returns inner_res 
    Continue(effect: delayed_func) -> fn() {
      // run delayed_f and get or build a delay
      let inner = case delayed_func() {
        Ok(inner_delay) -> inner_delay
        Error(err) -> Stop(err)
      }
      // get the inner fn's resullt
      case inner {
        Continue(effect: inner_func) -> inner_func()
        Stop(err) -> Error(err)
      }
    }

    // just chain a result fn to delay 
    Stop(err) -> fn() { Error(err) }
  }
  |> delay_effect
}

/// Map and then flatten `delayed`
pub fn flat_map(
  delayed: Delay(val, error),
  func: fn(val) -> Result(Delay(f_res, error), error),
) -> Delay(f_res, error) {
  delayed
  |> map(func)
  |> flatten
}

/// returns a delay, that joins two delays. If `left` fails right will not be run, if either fails the result will be an Error
pub fn join(
  left: Delay(left_val, left_error),
  right: Delay(right_val, right_error),
) -> Delay(
  #(left_val, right_val),
  #(option.Option(left_error), option.Option(right_error)),
) {
  fn() {
    case run(left) {
      Error(err) -> Error(#(option.Some(err), option.None))
      Ok(left_val) ->
        case run(right) {
          Ok(right_val) -> Ok(#(left_val, right_val))
          Error(err) -> Error(#(option.None, option.Some(err)))
        }
    }
  }
  |> delay_effect
}

/// Returns a new Delay that will be re-attempted `retries` times with `delay` ms in-between
/// NOTE: `delay` is ignored in JS
pub fn retry(
  delayed: Delay(val, error),
  retries: Int,
  delay: Int,
) -> Delay(val, error) {
  delay_effect(fn() { do_retry(delayed, retries, delay, False) })
}

/// Returns a Delay that will be re-attempted `retries` times with an increasing backoff delay
/// NOTE: there is no backoff in JS
pub fn retry_with_backoff(
  delayed: Delay(val, error),
  retries: Int,
) -> Delay(val, error) {
  delay_effect(fn() { do_retry(delayed, retries, 0, True) })
}

@external(erlang, "timer", "sleep")
fn sleep(_: Int) -> Nil {
  // JS sleep is a noop
  Nil
}

fn do_retry(
  delayed: Delay(val, error),
  retries: Int,
  delay: Int,
  backoff: Bool,
) -> Result(val, error) {
  let delay = case backoff {
    True -> delay + 1000
    False -> delay
  }

  case retries {
    _ if retries <= 1 -> run(delayed)
    _ ->
      result.lazy_or(run(delayed), fn() {
        sleep(delay)
        do_retry(delayed, retries - 1, delay, backoff)
      })
  }
}

/// Run a delayed effect and get the result
/// short-circuiting if any in delay in the chain returns an Error
pub fn run(delayed: Delay(val, error)) -> Result(val, error) {
  case delayed {
    Continue(effect: func) -> func()
    Stop(err) -> Error(err)
  }
}

/// Run a delayed effect and throw away the result
/// short-circuiting if any in the chain returns an Error
pub fn drain(delayed: Delay(val, error)) -> Nil {
  let _ = run(delayed)
  Nil
}

/// Repeat a Delay and return the results in a list 
pub fn repeat(
  delayed: Delay(val, error),
  repetition: Int,
) -> List(Result(val, error)) {
  delayed
  |> list.repeat(repetition)
  |> every
}

/// Run every effect in sequence and get their results
pub fn every(effects: List(Delay(val, err))) -> List(Result(val, err)) {
  do_every(effects, [])
}

/// Run all effects in sequence and return True if all succeed
/// NOTE: this will _always_ run _every_ effect
pub fn all(effects: List(Delay(val, err))) -> Bool {
  effects
  |> every()
  |> result.all()
  |> result.is_ok()
}

/// Run all effects in sequence and return True if any succeeds
/// NOTE: this is different than `fallthrough/1` because it will _always_ run _every_ effect
pub fn any(effects: List(Delay(val, err))) -> Bool {
  effects
  |> every()
  |> list.filter(result.is_ok)
  |> list.length()
  > 0
}

fn do_every(
  effects: List(Delay(val, err)),
  results: List(Result(val, err)),
) -> List(Result(val, err)) {
  case effects {
    [last] -> [run(last), ..results]
    [head, ..rest] -> do_every(rest, [run(head), ..results])
    [] -> panic as "Empty list"
  }
}

/// Attempt multiple Delays until one returns an Ok
/// unlike `any/1` this will short circuit on the first Ok
pub fn fallthrough(effects: List(Delay(val, err))) -> Result(val, err) {
  do_fallthrough(effects)
}

// exists to keep the exposed fallthrough functions paramter names the same in JS
fn do_fallthrough(effects: List(Delay(val, err))) -> Result(val, err) {
  case effects {
    [last] -> run(last)
    [head, ..rest] -> result.lazy_or(run(head), fn() { fallthrough(rest) })
    [] -> panic as "Empty list"
  }
}
