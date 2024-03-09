import { Ok, Error, toList } from "./prelude.mjs"

function ok(v) {
  return new Ok(v)
}

function error(v) {
  return new Error(v)
}

function get(res) {
  return res[0]
}

function isOk(v) {
  return v instanceof Ok
}

export { ok, error, get, isOk, toList }
