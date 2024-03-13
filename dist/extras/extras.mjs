import { Ok, Error, toList } from "./prelude.mjs"

/**
 * wraps the value in an Ok, indicating the the function succeeded
 * @param {any} v
 * @returns Ok<v, unknown>
 */
function ok(v) {
  return new Ok(v)
}

/**
 * wraps the value in an Error, indicating the the function failed
 * @param {any} v
 * @returns Error<unknown, v>
 */
function error(v) {
  return new Error(v)
}

/**
 * Extracts the value from a result
 * @param {Result<any, any>} result
 * @returns any
 */
function get(result) {
  return result[0]
}

/**
 * Returns true when result is an instance of Ok<any, any>
 * @param {Result<any, any>} result
 * @returns boolean
 */
function isOk(result) {
  return result instanceof Ok
}

export { ok, error, get, isOk, toList }
