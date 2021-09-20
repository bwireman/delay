defmodule Delay.Arrows do
  defmacro __using__(_) do
    quote do
      import Delay.Arrows, only: [~>: 2, ~>>: 2, run: 1, delay: 1]
      alias :delay, as: Delay
    end
  end

  def ({:continue, lf} = l) ~> r when is_function(r) and is_function(lf), do: :delay.map(l, r)

  def ({:stop, _} = l) ~> r when is_function(r), do: :delay.map(l, r)

  def ({:continue, lf} = l) ~>> r when is_function(r) and is_function(lf),
    do: :delay.flat_map(l, r)

  def ({:stop, _} = l) ~>> r when is_function(r), do: :delay.flat_map(l, r)

  def run({:continue, lf} = l) when is_function(lf), do: :delay.run(l)

  def run({:stop, _} = l), do: :delay.run(l)

  def delay(f) when is_function(f), do: :delay.delay_effect(f)
end
