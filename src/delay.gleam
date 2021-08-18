pub opaque type Delay(delayed_res, error) {
  Continue(f: fn() -> Result(delayed_res, error))
  Stop(error)
}

// api
pub fn delay_effect(
  f: fn() -> Result(delayed_res, error),
) -> Delay(delayed_res, error) {
  Continue(f)
}

pub fn map(
  delayed: Delay(delayed_res, error),
  f: fn(delayed_res) -> Result(f_res, error),
) -> Delay(f_res, error) {
  case delayed {
    Continue(delayed_f) ->
      chain(delayed_f, f)
      |> delay_effect

    Stop(err) -> Stop(err)
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
  delayed: Delay(delayed_res, error),
  f: fn(delayed_res) -> Result(Delay(f_res, error), error),
) -> Delay(f_res, error) {
  map(delayed, f)
  |> flatten
}

pub fn run(delayed: Delay(delayed_res, error)) -> Result(delayed_res, error) {
  case delayed {
    Continue(f) -> f()
    Stop(err) -> Error(err)
  }
}

pub fn drain(delayed: Delay(delayed_res, error)) -> Nil {
  let _ = run(delayed)
  Nil
}

pub fn retry(
  delayed: Delay(delayed_res, error),
  retries: Int,
  delay: Int,
) -> Result(delayed_res, error) {
  case retries {
    n if n <= 1 -> run(delayed)
    n ->
      case run(delayed) {
        Ok(res) -> Ok(res)
        Error(_) -> {
          sleep(delay)
          retry(delayed, n - 1, delay)
        }
      }
  }
}

// priv
fn chain(
  delayed_f: fn() -> Result(delayed_res, error),
  f: fn(delayed_res) -> Result(f_res, error),
) -> fn() -> Result(f_res, error) {
  fn() {
    case delayed_f() {
      Ok(value) -> f(value)
      Error(err) -> Error(err)
    }
  }
}

external fn sleep(time: Int) -> Nil =
  "timer" "sleep"
