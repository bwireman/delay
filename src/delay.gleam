import gleam/list
import gleam/result

pub opaque type Delay(val, error) {
  Continue(fn() -> Result(val, error))
  Stop(error)
}

/// store an effect to be run later
/// if `f` returns an Error then chain will stop 
pub fn delay_effect(f: fn() -> Result(val, error)) -> Delay(val, error) {
  Continue(f)
}

/// chains an operation onto an existing delay to be run one then into the next
/// if delayed has already error'd then `f` will be ignored 
pub fn map(
  delayed: Delay(val, error),
  f: fn(val) -> Result(f_res, error),
) -> Delay(f_res, error) {
  case delayed {
    Continue(delayed_f) ->
      chain(delayed_f, f)
      |> delay_effect

    Stop(err) -> Stop(err)
  }
}

fn chain(
  delayed_f: fn() -> Result(val, error),
  f: fn(val) -> Result(f_res, error),
) -> fn() -> Result(f_res, error) {
  fn() {
    case delayed_f() {
      Ok(value) -> f(value)
      Error(err) -> Error(err)
    }
  }
}

/// flatten nested Delay
pub fn flatten(
  delayed: Delay(Delay(inner_res, error), error),
) -> Delay(inner_res, error) {
  case delayed {
    // depending on the state of delayed we either need a fn that returns the stop error
    // or a function that returns inner_res 
    Continue(delayed_f) -> fn() {
      // run delayed_f and get or build a delay
      let inner = case delayed_f() {
        Ok(inner_delay) -> inner_delay
        Error(err) -> Stop(err)
      }
      // get the inner fn's resullt
      case inner {
        Continue(inner_f) -> inner_f()
        Stop(err) -> Error(err)
      }
    }

    // just chain a result fn to delay 
    Stop(err) -> fn() { Error(err) }
  }
  |> delay_effect
}

/// map and then flatten Delay
pub fn flat_map(
  delayed: Delay(val, error),
  f: fn(val) -> Result(Delay(f_res, error), error),
) -> Delay(f_res, error) {
  map(delayed, f)
  |> flatten
}

/// returns a Delay that will be re-attempted `retries` times with `delay` ms in between
/// NOTE: `delay` is ignored in JS
pub fn retry(
  delayed: Delay(val, error),
  retries: Int,
  delay: Int,
) -> Delay(val, error) {
  delay_effect(fn() { do_retry(delayed, retries, delay, False) })
}

/// returns a Delay that will be re-attempted `retries` times with an increasing backoff delay
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
    n if n <= 1 -> run(delayed)
    n ->
      case run(delayed) {
        Ok(res) -> Ok(res)
        Error(_) -> {
          sleep(delay)
          do_retry(delayed, n - 1, delay, backoff)
        }
      }
  }
}

/// run a delayed effect and get the result
/// short-circuiting if any in the chain returns an Error
pub fn run(delayed: Delay(val, error)) -> Result(val, error) {
  case delayed {
    Continue(f) -> f()
    Stop(err) -> Error(err)
  }
}

/// run a delayed effect and throw away the result
/// short-circuiting if any in the chain returns an Error
pub fn drain(delayed: Delay(val, error)) -> Nil {
  let _ = run(delayed)
  Nil
}

/// repeat a Delay and return the results in a list 
pub fn repeat(
  delayed: Delay(val, error),
  repitions: Int,
) -> List(Result(val, error)) {
  do_repeat(delayed, repitions, [])
}

fn do_repeat(
  delayed: Delay(val, error),
  repitions: Int,
  results: List(Result(val, error)),
) -> List(Result(val, error)) {
  case repitions {
    0 -> results
    _ -> do_repeat(delayed, repitions - 1, [run(delayed), ..results])
  }
}

/// run every effect in sequence and get their results
pub fn every(effects: List(Delay(val, err))) -> List(Result(val, err)) {
  do_every(effects, [])
}

/// run all effects in sequence and return True if all succeed
/// note this will _always_ run _every_ effect
pub fn all(effects: List(Delay(val, err))) -> Bool {
  do_every(effects, [])
  |> result.all()
  |> result.is_ok()
}

/// run all effects in sequence and return True if any succeeds
/// note this is different than `fallthrough/1` because it will _always_ run _every_ effect
pub fn any(effects: List(Delay(val, err))) -> Bool {
  do_every(effects, [])
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
    [head, ..rest] ->
      case run(head) {
        Ok(res) -> do_every(rest, [Ok(res), ..results])
        Error(err) -> do_every(rest, [Error(err), ..results])
      }
    [] -> panic as "Empty list"
  }
}

/// attempt multiple Delays until one returns an Ok
/// unlike `any/1` this will short circuit on the first Ok
pub fn fallthrough(effects: List(Delay(val, err))) -> Result(val, err) {
  case effects {
    [last] -> run(last)
    [head, ..rest] ->
      case run(head) {
        Ok(res) -> Ok(res)
        Error(_) -> fallthrough(rest)
      }
    [] -> panic as "Empty list"
  }
}
