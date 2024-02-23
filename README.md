# Delay

A dead simple data-structure for delaying side effects. Written in the excellent [gleam ✨](https://gleam.run/) language. Supporting both Erlang & Javascript targets

[![test](https://github.com/bwireman/delay/actions/workflows/test.yml/badge.svg)](https://github.com/bwireman/delay/actions/workflows/test.yml)
[![commits](https://img.shields.io/github/last-commit/bwireman/delay)](https://github.com/bwireman/delay/commit/main)
[![mit](https://img.shields.io/github/license/bwireman/delay?color=brightgreen)](https://github.com/bwireman/delay/blob/main/LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen)](http://makeapullrequest.com)
[![0.3.0](https://img.shields.io/hexpm/v/delay?color=brightgreen&style=flat)](https://hexdocs.pm/delay/index.html)
[![downloads](https://img.shields.io/hexpm/dt/delay?color=brightgreen)](https://hex.pm/packages/delay/)
[![gleam js](https://img.shields.io/badge/%20gleam%20%E2%9C%A8-js%20%F0%9F%8C%B8-yellow)](https://gleam.run/news/v0.16-gleam-compiles-to-javascript/)
[![gleam erlang](https://img.shields.io/badge/erlang%20%E2%98%8E%EF%B8%8F-red?style=flat&label=gleam%20%E2%9C%A8)](https://gleam.run)


## Basic Usage

```gleam
import gleam/io

let d = delay_effect(fn() {
  io.println("Hello")
  Ok(1)
}) |> delay.map(fn(x) {
  io.println("World")
  Ok(x + 1)
})

let res = delay.run(d)
// Hello
// World
// res = Ok(2)
```

## More info

The result of `delay_effect` is really just a first class function with a nice API wrapper. It isn't executed until put through one of `run/1`, `drain/1` or `fallthrough/1`. And can be called as many times as you want.

```gleam
let d = delay_effect(fn() {
  io.println("Hello")
  Error("bummer")
}) |> delay.map(fn(x) {
  io.println("World")
  Ok(x + 1)
})

let res = delay.run(d)
// Hello
// res = Error("bummer")
```

If one of the functions in the chain fails, the rest will short circuit and the error will be returned.

Effects can be retried as well via `retry/3`

```gleam
// using the same effect `d` from above

let res = delay.retry(d, 3, 200) |> delay.run()
// Hello
// Hello
// Hello
// Hello
// res = Error("bummer")
```

## FAQ

Doesn't the concept of a delayed side effect kind of lose value in the world of actor model concurrency and zero shared memory?!

> A little

Then why did you write this?

> For fun

Is gleam ✨ actually excellent?

> So far
