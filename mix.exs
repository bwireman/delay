defmodule Delay.MixProject do
  use Mix.Project

  def project do
    [
      app: :delay,
      version: "0.1.0",
      elixir: "~> 1.12",
      start_permanent: Mix.env() == :prod,
      deps: deps(),
      erlc_paths: ["src", "gen"],
      compilers: [:gleam | Mix.compilers()]
    ]
  end

  def application, do: []

  defp deps do
    [
      {:mix_gleam, "~> 0.1.0"},
      {:gleam_stdlib, "~> 0.16.0"}
    ]
  end
end
