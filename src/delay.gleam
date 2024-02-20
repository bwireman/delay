pub opaque type Delay(val, error) {
  Continue(fn() -> Result(val, error))
  Stop(error)
}

// api
pub fn delay_effect(f: fn() -> Result(val, error)) -> Delay(val, error) {
  Continue(f)
}

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

pub fn flat_map(
  delayed: Delay(val, error),
  f: fn(val) -> Result(Delay(f_res, error), error),
) -> Delay(f_res, error) {
  map(delayed, f)
  |> flatten
}

// delay is a noop in JS
pub fn retry(
  delayed: Delay(val, error),
  retries: Int,
  delay: Int,
) -> Delay(val, error) {
  delay_effect(fn() { do_retry(delayed, retries, delay, False) })
}

// there is no backoff in JS
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

pub fn run(delayed: Delay(val, error)) -> Result(val, error) {
  case delayed {
    Continue(f) -> f()
    Stop(err) -> Error(err)
  }
}

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

pub fn drain(delayed: Delay(val, error)) -> Nil {
  let _ = run(delayed)
  Nil
}

pub fn fallthrough(options: List(Delay(val, err))) -> Result(val, err) {
  case options {
    [last] -> run(last)
    [head, ..rest] ->
      case run(head) {
        Ok(res) -> Ok(res)
        Error(_) -> fallthrough(rest)
      }
    [] -> panic("Empty list")
  }
}
