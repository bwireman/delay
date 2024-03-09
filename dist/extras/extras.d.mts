import type { Ok, Error } from "./prelude.d.mts"

export function ok<A>(v: A): Ok<A, unknown>

export function error<A>(v: A): Error<unknown, A>

export function get<A, B>(v: Result<A, B>): A | B

export function isOk(v: Result<unknown, unknown>): boolean

export function toList<T>(array: Array<T>): List<T>
