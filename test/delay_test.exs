defmodule DelayTest do
  use ExUnit.Case, async: true

  setup do
    :ets.new(:tests, [:set, :named_table])
    %{}
  end

  test "map" do
    assert :delay.delay_effect(fn -> {:ok, "Hello"} end)
           |> :delay.map(fn x -> {:ok, x <> " World!"} end)
           |> :delay.run() == {:ok, "Hello World!"}

    assert :delay.delay_effect(fn -> {:ok, 1} end)
           |> :delay.map(fn x -> {:ok, x + 1} end)
           |> :delay.map(fn x -> {:ok, Integer.to_string(x)} end)
           |> :delay.run() == {:ok, "2"}
  end

  test "flat_map" do
    assert :delay.delay_effect(fn -> {:ok, "Hello"} end)
           |> :delay.flat_map(fn x ->
             {:ok, :delay.delay_effect(fn -> {:ok, x <> " Again!"} end)}
           end)
           |> :delay.run() == {:ok, "Hello Again!"}

    assert :delay.delay_effect(fn -> {:ok, "Hello"} end)
           |> :delay.flat_map(fn x ->
             {:ok, :delay.delay_effect(fn -> {:error, x <> " oh shit!"} end)}
           end)
           |> :delay.run() == {:error, "Hello oh shit!"}

    assert {:error, _} =
             :delay.delay_effect(fn -> {:ok, "Hello"} end)
             |> :delay.flat_map(fn _ ->
               {:error, :delay.delay_effect(fn -> {:ok, "Nice!"} end)}
             end)
             |> :delay.run()
  end

  test "short circuit on errors" do
    assert :delay.delay_effect(fn -> {:error, "ERROR"} end)
           |> :delay.map(fn x -> {:ok, x <> " World!"} end)
           |> :delay.map(fn x -> :ets.insert(:tests, {:short_circuit, x}) end)
           |> :delay.run() == {:error, "ERROR"}

    assert :ets.lookup(:tests, :short_circuit) == []
  end

  test "side effects, run" do
    d = :delay.delay_effect(fn -> :ets.insert(:tests, {:side_effects, :v1}) end)
    assert :ets.lookup(:tests, :side_effects) == []

    d |> :delay.run()
    assert :ets.lookup(:tests, :side_effects) == [side_effects: :v1]
  end

  test "side effects, drain" do
    d =
      :delay.delay_effect(fn ->
        :ets.insert(:tests, {:drain, :v1})
        {:ok, "TEST"}
      end)
      |> :delay.map(fn x -> x end)

    assert :ets.lookup(:tests, :drain) == []

    assert d |> :delay.drain() == nil
    assert :ets.lookup(:tests, :drain) == [drain: :v1]
  end

  test "retry" do
    :ets.insert(:tests, {:retry, 0})

    d =
      :delay.delay_effect(fn ->
        case :ets.lookup(:tests, :retry) do
          [retry: 5] ->
            {:ok, "yay"}

          _ ->
            :ets.update_counter(:tests, :retry, {2, 1})
            {:error, "some error"}
        end
      end)

    assert :ets.lookup(:tests, :retry) == [retry: 0]
    d |> :delay.retry(10, 0) |> :delay.run()

    assert d |> :delay.run() == {:ok, "yay"}
    assert :ets.lookup(:tests, :retry) == [retry: 5]
  end

  test "repeat" do
    assert :delay.repeat(:delay.delay_effect(fn -> {:ok, 1} end), 2) == [{:ok, 1}, {:ok, 1}]
  end

  test "fallthrough" do
    :ets.insert(:tests, {:fallthrough, 0})

    failing =
      :delay.delay_effect(fn ->
        :ets.update_counter(:tests, :fallthrough, {2, 1})
        {:error, "ERROR"}
      end)

    passing = :delay.delay_effect(fn -> {:ok, "passed!"} end)
    skipped = :delay.delay_effect(fn -> {:error, "shouldn't show up"} end)

    assert :delay.fallthrough([failing, failing, passing, failing, skipped]) == {:ok, "passed!"}
    assert :ets.lookup(:tests, :fallthrough) == [fallthrough: 2]
  end
end
