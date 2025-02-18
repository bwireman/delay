import delay
import gleam/int
import gleam/io
import gleam/list
import gleam/option
import gleam/string
import gleeunit
import gleeunit/should
import simplifile

const drain_filename = "test/side_effects/drain.test"

const fallthrough_a_filename = "test/side_effects/fallthrough_a.test"

const fallthrough_b_filename = "test/side_effects/fallthrough_b.test"

const fallthrough_c_filename = "test/side_effects/fallthrough_c.test"

const retry_filename = "test/side_effects/retry.test"

const retry_with_backoff_filename = "test/side_effects/retry_with_backof.test"

const join_filename = "test/side_effects/join_filename.test"

const repeat_filename = "test/side_effects/repeat.test"

const every_a_filename = "test/side_effects/every_a.test"

const every_b_filename = "test/side_effects/every_b.test"

fn init_ok(v) {
  fn() { Ok(v) }
}

fn do_ok(v) {
  fn(_) { Ok(v) }
}

fn init_error(v) {
  fn() { Error(v) }
}

fn do_error(v) {
  fn(_) { Error(v) }
}

fn do_panic(_) {
  panic as "Shouldn't be called"
}

@external(erlang, "erlang", "system_time")
@external(javascript, "./test.mjs", "system_time")
fn system_time() -> Int

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
      every_a_filename,
      every_b_filename,
    ])

  gleeunit.main()
}

pub fn build_delay_test() {
  delay.delay_effect(init_ok(1))
  |> delay.run()
  |> should.be_ok()

  delay.delay_effect(init_error(1))
  |> delay.run()
  |> should.be_error()
}

pub fn map_test() {
  delay.delay_effect(init_ok("Hello"))
  |> delay.map(fn(x) { Ok(x <> " World!") })
  |> delay.run()
  |> should.be_ok
  |> should.equal("Hello World!")

  delay.delay_effect(init_ok(1))
  |> delay.map(fn(x) { Ok(x + 1) })
  |> delay.map(fn(x) { Ok(x * 2) })
  |> delay.run()
  |> should.be_ok
  |> should.equal(4)
}

pub fn join_test() {
  let l = delay.delay_effect(init_ok(1))
  let error = delay.delay_effect(init_error(1))
  let r = delay.delay_effect(init_ok(2))

  delay.join(l, r)
  |> delay.run()
  |> should.be_ok()
  |> should.equal(#(1, 2))

  delay.join(error, r)
  |> delay.run()
  |> should.be_error()
  |> should.equal(#(option.Some(1), option.None))

  delay.join(l, error)
  |> delay.run()
  |> should.be_error()
  |> should.equal(#(option.None, option.Some(1)))

  delay.join(error, error)
  |> delay.run()
  |> should.be_error()
  |> should.equal(#(option.Some(1), option.None))

  let d = delay.delay_effect(fn() { simplifile.create_file(join_filename) })

  delay.join(error, d)
  |> delay.run()
  |> should.be_error()
  |> should.equal(#(option.Some(1), option.None))

  let assert Error(simplifile.Enoent) =
    simplifile.read(join_filename)
    |> io.debug
}

pub fn flat_map_test() {
  delay.delay_effect(init_ok("Hello"))
  |> delay.flat_map(fn(x) { Ok(delay.delay_effect(init_ok(x <> " Again!"))) })
  |> delay.run()
  |> should.be_ok
  |> should.equal("Hello Again!")

  delay.delay_effect(init_ok("Hello"))
  |> delay.flat_map(do_ok(delay.delay_effect(init_error("shit!"))))
  |> delay.run()
  |> should.be_error
  |> should.equal("shit!")

  delay.delay_effect(fn() { Ok("Hello") })
  |> delay.flat_map(do_error(delay.delay_effect(init_ok("Nice!"))))
  |> delay.run()
  |> should.be_error
}

pub fn short_circuit_on_errors_test() {
  delay.delay_effect(init_error("ERR"))
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
    |> delay.map(do_error(simplifile.Unknown("")))

  delay.retry(write_fail, 3, 0)
  |> delay.run()
  |> should.be_error()
  // Eexist because subsequent will fail on create
  |> should.equal(simplifile.Eexist)

  // only one because subsequent will fail on create
  let assert Ok("✨") = simplifile.read(retry_filename)
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
    |> delay.map(do_error(simplifile.Unknown("")))

  delay.retry_with_backoff(write_fail, 3)
  |> delay.run()
  |> should.be_error()
  |> should.equal(simplifile.Unknown(""))

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
    delay.delay_effect(init_ok(1))
    |> delay.map(do_panic)

  delay.fallthrough([
    delay.delay_effect(fn() { simplifile.create_file(fallthrough_a_filename) })
      |> delay.map(do_error(simplifile.Unknown(""))),
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

pub fn every_test() {
  let a = delay.delay_effect(init_ok("Nice"))

  delay.every([a, a, a])
  |> list.map(should.be_ok)

  let b = delay.delay_effect(init_error("shit..."))
  delay.every([b, b, b])
  |> list.map(should.be_error)
}

pub fn every_attempts_all_effects_test() {
  let da = delay.delay_effect(fn() { simplifile.create_file(every_a_filename) })
  let db = delay.delay_effect(fn() { simplifile.create_file(every_b_filename) })
  let assert [Error(_), Error(_), Ok(_), Ok(_)] = delay.every([da, db, da, db])
}

pub fn all_test() {
  let a = delay.delay_effect(init_ok("Nice"))
  delay.all([a, a, a])
  |> should.be_true()

  let b = delay.delay_effect(init_error("shit..."))
  delay.all([b, b, b])
  |> should.be_false()

  delay.all([a, b, a])
  |> should.be_false()
}

pub fn any_test() {
  let a = delay.delay_effect(init_ok("Nice"))
  delay.any([a, a, a])
  |> should.be_true()

  let b = delay.delay_effect(init_error("shit..."))
  delay.any([b, b, b])
  |> should.be_false()

  delay.any([a, b, a])
  |> should.be_true()
}
