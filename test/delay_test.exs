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

  test "error" do
    assert :delay.delay_effect(fn -> {:error, "ERROR"} end)
           |> :delay.map(fn x -> {:ok, x <> " World!"} end)
           |> :delay.map(fn x -> :ets.insert(:tests, {:k1, x}) end)
           |> :delay.run() == {:error, "ERROR"}

    assert :ets.lookup(:tests, :k1) == []
  end

  test "side effects, run" do
    d = :delay.delay_effect(fn -> :ets.insert(:tests, {:k2, :v1}) end)
    assert :ets.lookup(:tests, :k2) == []

    d |> :delay.run()
    assert :ets.lookup(:tests, :k2) == [k2: :v1]
  end

  test "side effects, drain" do
    d =
      :delay.delay_effect(fn ->
        :ets.insert(:tests, {:k3, :v1})
        {:ok, "TEST"}
      end)
      |> :delay.map(fn x -> x end)

    assert :ets.lookup(:tests, :k3) == []

    assert d |> :delay.drain() == nil
    assert :ets.lookup(:tests, :k3) == [k3: :v1]
  end

  test "retry" do
    :ets.insert(:tests, {:k4, 0})

    d =
      :delay.delay_effect(fn ->
        case :ets.lookup(:tests, :k4) do
          [k4: 5] ->
            {:ok, "yay"}

          _ ->
            :ets.update_counter(:tests, :k4, {2, 1})
            {:error, "some error"}
        end
      end)

    assert :ets.lookup(:tests, :k4) == [k4: 0]
    d |> :delay.retry(10, 1)

    assert d |> :delay.run() == {:ok, "yay"}
    assert :ets.lookup(:tests, :k4) == [k4: 5]
  end
end
