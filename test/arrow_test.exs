defmodule DelayArrowTest do
  use ExUnit.Case, async: true
  use Delay.Arrows

  test "~>" do
    assert delay(fn -> {:ok, "Hello"} end)
           ~> fn x -> {:ok, x <> " World!"} end
           |> run == {:ok, "Hello World!"}

    assert delay(fn -> {:ok, 1} end)
           ~> fn x -> {:ok, x + 1} end
           ~> fn x -> {:ok, Integer.to_string(x)} end
           |> run == {:ok, "2"}
  end

  test "~>>" do
    assert delay(fn -> {:ok, "Hello"} end)
           ~>> fn x -> {:ok, delay(fn -> {:ok, x <> " Again!"} end)} end
           |> run == {:ok, "Hello Again!"}

    assert delay(fn -> {:ok, "Hello"} end)
           ~>> fn x -> {:ok, delay(fn -> {:error, x <> " oh shit!"} end)} end
           |> run == {:error, "Hello oh shit!"}

    assert {:error, _} =
             delay(fn -> {:ok, "Hello"} end)
             ~>> fn _ -> {:error, delay(fn -> {:ok, "Nice!"} end)} end
             |> run
  end
end
