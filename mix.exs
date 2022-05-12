defmodule Delay.MixProject do
  use Mix.Project

  @app :delay

  def project do
    [
      app: @app,
      version: "0.1.0",
      elixir: "~> 1.12",
      start_permanent: Mix.env() == :prod,
      deps: deps(),
      archives: [mix_gleam: "~> 0.4.0"],
      aliases: MixGleam.add_aliases(aliases()),
      erlc_paths: ["build/dev/erlang/#{@app}/build"],
      erlc_include_path: "build/dev/erlang/#{@app}/include",
    ]
  end

  def application, do: []

  def aliases, do: []

  defp deps do
    [
      {:mix_gleam, "~> 0.4.0"},
      {:gleam_stdlib, "~> 0.21.0"}
    ]
  end
end
