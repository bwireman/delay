import gleeunit
import gleeunit/should
import delay
import gleam/list
import gleam/int
import gleam/string
import simplifile

const drain_filename = "test/side_effects/drain.test"

const fallthrough_a_filename = "test/side_effects/fallthrough_a.test"

const fallthrough_b_filename = "test/side_effects/fallthrough_b.test"

const fallthrough_c_filename = "test/side_effects/fallthrough_c.test"

const retry_filename = "test/side_effects/retry.test"

const retry_with_backoff_filename = "test/side_effects/retry_with_backof.test"

const repeat_filename = "test/side_effects/repeat.test"

fn do_panic(_) {
  panic("Shouldn't be called")
}

fn do_error() {
  Error("ERR")
}

fn do_ok() {
  Ok("k")
}

pub fn main() {
  let assert Ok(Nil) =
    simplifile.delete_all([
      drain_filename,
      fallthrough_a_filename,
      fallthrough_b_filename,
      fallthrough_c_filename,
      retry_filename,
      repeat_filename,
      retry_with_backoff_filename,
    ])
  gleeunit.main()
}

pub fn build_delay_test() {
  delay.delay_effect(do_ok)
  |> delay.run()
  |> should.be_ok()

  delay.delay_effect(do_error)
  |> delay.run()
  |> should.be_error()
}

pub fn map_test() {
  delay.delay_effect(fn() { Ok("Hello") })
  |> delay.map(fn(x) { Ok(x <> " World!") })
  |> delay.run()
  |> should.be_ok
  |> should.equal("Hello World!")

  delay.delay_effect(fn() { Ok(1) })
  |> delay.map(fn(x) { Ok(x + 1) })
  |> delay.map(fn(x) { Ok(x * 2) })
  |> delay.run()
  |> should.be_ok
  |> should.equal(4)
}

pub fn flat_map_test() {
  delay.delay_effect(fn() { Ok("Hello") })
  |> delay.flat_map(fn(x) {
    Ok(delay.delay_effect(fn() { Ok(x <> " Again!") }))
  })
  |> delay.run()
  |> should.be_ok
  |> should.equal("Hello Again!")

  delay.delay_effect(fn() { Ok("Hello") })
  |> delay.flat_map(fn(_) { Ok(delay.delay_effect(fn() { Error("shit!") })) })
  |> delay.run()
  |> should.be_error
  |> should.equal("shit!")

  delay.delay_effect(fn() { Ok("Hello") })
  |> delay.flat_map(fn(_) { Error(delay.delay_effect(fn() { Ok("Nice!") })) })
  |> delay.run()
  |> should.be_error
}

pub fn short_circuit_on_errors_test() {
  delay.delay_effect(do_error)
  |> delay.map(do_panic)
  |> delay.run()
  |> should.be_error
  |> should.equal("ERR")
}

pub fn drain_test() {
  let d =
    delay.delay_effect(fn() { simplifile.create_file(drain_filename) })
    |> delay.map(fn(_) { simplifile.append("123", to: drain_filename) })

  should.be_error(simplifile.read(drain_filename))

  delay.drain(d)

  simplifile.read(drain_filename)
  |> should.be_ok()
  |> should.equal("123")
}

pub fn retry_test() {
  let write_fail =
    delay.delay_effect(fn() { simplifile.create_file(retry_filename) })
    |> delay.map(fn(_) { simplifile.append("✨", to: retry_filename) })
    |> delay.map(fn(_) { Error(simplifile.Unknown) })

  delay.retry(write_fail, 3, 0)
  |> delay.run()
  |> should.be_error()
  // Eexist because subsequent will fail on create
  |> should.equal(simplifile.Eexist)

  // only one because subsequent will fail on create
  let assert Ok("✨") = simplifile.read(retry_filename)
}

@external(erlang, "erlang", "system_time")
fn system_time() -> Int {
  0
}

pub fn retry_with_backoff_test() {
  let assert Ok(Nil) = simplifile.create_file(retry_with_backoff_filename)

  let write_fail =
    delay.delay_effect(fn() {
      simplifile.append(
        int.to_string(system_time()) <> ":",
        to: retry_with_backoff_filename,
      )
    })
    |> delay.map(fn(_) { Error(simplifile.Unknown) })

  delay.retry_with_backoff(write_fail, 3)
  |> delay.run()
  |> should.be_error()
  |> should.equal(simplifile.Unknown)

  let assert [x, y, z] =
    simplifile.read(retry_with_backoff_filename)
    |> should.be_ok()
    |> string.split(on: ":")
    |> list.filter(fn(x) { !string.is_empty(x) })
    |> list.map(fn(v) { int.base_parse(v, 10) })
    |> list.map(should.be_ok)

  should.be_true(x < y)
  should.be_true(y < z)
}

pub fn repeat_test() {
  delay.delay_effect(fn() { simplifile.create_file(repeat_filename) })
  |> delay.repeat(3)
  |> should.equal([Error(simplifile.Eexist), Error(simplifile.Eexist), Ok(Nil)])
}

pub fn fallthrough_test() {
  let p =
    delay.delay_effect(do_ok)
    |> delay.map(do_panic)

  delay.fallthrough([
    delay.delay_effect(fn() { simplifile.create_file(fallthrough_a_filename) })
    |> delay.map(fn(_) { Error(simplifile.Unknown) }),
    delay.delay_effect(fn() { simplifile.create_file(fallthrough_b_filename) }),
    delay.delay_effect(fn() { simplifile.create_file(fallthrough_c_filename) }),
    p,
  ])
  |> should.be_ok()
  |> should.equal(Nil)

  let assert Ok(_) = simplifile.read(fallthrough_a_filename)
  let assert Ok(_) = simplifile.read(fallthrough_b_filename)
  let assert Error(simplifile.Enoent) = simplifile.read(fallthrough_c_filename)
}
