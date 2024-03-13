import type { Ok, Error } from "./prelude.d.mts"

/**
 * wraps the value in an Ok, indicating the the function succeeded
 * @param {any} v
 * @returns Ok<v, unknown>
 */
export function ok<A>(v: A): Ok<A, unknown>

/**
 * wraps the value in an Error, indicating the the function failed
 * @param {any} v
 * @returns Error<unknown, v>
 */
export function error<A>(v: A): Error<unknown, A>

/**
 * Extracts the value from a result
 * @param {Result<any, any>} result
 * @returns any
 */
export function get<A, B>(result: Result<A, B>): A | B

/**
 * Returns true when result is an instance of Ok<any, any>
 * @param {Result<any, any>} result
 * @returns boolean
 */
export function isOk(result: Result<unknown, unknown>): boolean

/**
 * Converts an array to a list for use with delay
 * @param array
 * @returns List<T>
 */
export function toList<T>(array: Array<T>): List<T>
