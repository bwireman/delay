# Delay

A dead simple data-structure for delaying side effects. Written in the excellent [gleam ✨](https://gleam.run/) language.

## Basic Usage

```rust
/// gleam
let d = delay_effect(fn() {
  gleam.io.println("Hello")
  Ok(1)
}) |> delay.map(fn(x) {
  gleam.io.println("World")
  Ok(x + 1)
})

let res = delay.run(d)
// Hello
// World
// res = Ok(2)
```

```elixir
# elixir
d = :delay.delay_effect(fn -> 
  IO.puts "Hello"
  {:ok, 1}
end) |> :delay.map(fn x -> 
  IO.puts "World"
  {:ok, x + 1}
end)

res = :delay.run(d)
# Hello
# World
# res = {:ok, 2}
```

## More info

The result of `delay_effect` is really just a first class function with a nice API wrapper. It isn't executed until put through one of `run/1`, `drain/1` or `retry/3`. And can be called as many times as you want.

```rust
/// gleam
let d = delay_effect(fn() {
  gleam.io.println("Hello")
  Error("bummer")
}) |> delay.map(fn(x) {
  gleam.io.println("World")
  Ok(x + 1)
})

let res = delay.run(d)
// Hello
// res = Error("bummer")
```

If one of the functions in the chain fails, the rest will short circuit and the error will be returned.

Effects can be retried as well via `retry/3`

```rust
/// gleam
// using the same effect `d` from above

let res = delay.retry(d, 3, 200)
// Hello
// Hello
// Hello
// Hello
// res = Error("bummer")
```

## FAQ

> Doesn't the concept of a delayed side effect kind of lose value in the world of actor model concurrency and zero shared memory?!

A little

> Then why did you write this?

For fun

> Is gleam ✨ actually excellent?

So far
