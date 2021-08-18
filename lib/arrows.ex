defmodule Delay.Arrows do
  defmacro __using__(_) do
    quote do
      import Delay.Arrows, only: [~>: 2, ~>>: 2, run: 1, delay: 1]
      alias :delay, as: Delay
    end
  end

  def ({:continue, _} = l) ~> r when is_function(r) do
    :delay.map(l, r)
  end

  def ({:stop, _} = l) ~> r when is_function(r) do
    :delay.map(l, r)
  end

  def ({:continue, _} = l) ~>> r when is_function(r) do
    :delay.flat_map(l, r)
  end

  def ({:stop, _} = l) ~>> r when is_function(r) do
    :delay.flat_map(l, r)
  end

  def run({:continue, _} = l) do
    :delay.run(l)
  end

  def run({:stop, _} = l) do
    :delay.run(l)
  end

  def delay(f) when is_function(f) do
    :delay.delay_effect(f)
  end
end
