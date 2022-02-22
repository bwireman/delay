# Delay

A dead simple data-structure for delaying side effects. Written in the excellent [gleam ✨](https://gleam.run/) language.

## Basic Usage

```gleam
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

The result of `delay_effect` is really just a first class function with a nice API wrapper. It isn't executed until put through one of `run/1`, `drain/1` or `fallthrough/1`. And can be called as many times as you want.

```gleam
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

```gleam
/// gleam
// using the same effect `d` from above

let res = delay.retry(d, 3, 200) |> delay.run()
// Hello
// Hello
// Hello
// Hello
// res = Error("bummer")
```

## Operators

```elixir
defmodule Foo do
  use Delay.Arrows

...

end
```

provides some conveniences

| operator | usage                   |
| -------- | ----------------------- |
| `~>`     | `:delay.map/2`          |
| `~>>`    | `:delay.flat_map/2`     |
| `delay`  | `:delay.delay_effect/1` |
| `run`    | `:delay.run/1`          |

### Example

```elixir
defmodule Foo do
  use Delay.Arrows

  # returns {:ok, "Hello World!"}
  def bar() do
    delay(fn -> {:ok, "Hello"} end)
    ~> fn x -> {:ok, x <> " World!"} end
    |> run
  end

  # returns {:ok, "Hello Again!"}
  def baz() do
    delay(fn -> {:ok, "Hello"} end)
    ~>> fn x -> {:ok, delay(fn -> {:ok, x <> " Again!"} end)} end
    |> run
  end
end
```

## FAQ

Doesn't the concept of a delayed side effect kind of lose value in the world of actor model concurrency and zero shared memory?!

> A little

Then why did you write this?

> For fun

Is gleam ✨ actually excellent?

> So far
