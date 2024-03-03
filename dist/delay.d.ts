
/**
* Type representing a delayed effect to be lazily evaluated
*/
export type Delay$<FXD, FXE> = Continue<FXD, FXE> | Stop<FXE>


/**
* store an effect to be run later
* if `f` returns an Error then chain will stop
*/
export function delay_effect<FXF, FXG>(f: () => Result<FXF, FXG>): Delay$<FXF, FXG>


/**
* chains an operation onto an existing delay to be run one then into the next
* if delayed has already error'd then `f` will be ignored
*/
export function map<FXL, FXM, FXP>(delayed: Delay$<FXL, FXM>, f: (x0: FXL) => Result<FXP, FXM>): Delay$<FXP, FXM>


/**
* flatten nested Delay
*/
export function flatten<FYD, FYE>(delayed: Delay$<Delay$<FYD, FYE>, FYE>): Delay$<FYD, FYE>


/**
* map and then flatten Delay
*/
export function flat_map<FYL, FYM, FYP>(
  delayed: Delay$<FYL, FYM>,
  f: (x0: FYL) => Result<Delay$<FYP, FYM>, FYM>
): Delay$<FYP, FYM>


/**
* run a delayed effect and get the result
* short-circuiting if any in the chain returns an Error
*/
export function run<FZO, FZP>(delayed: Delay$<FZO, FZP>): Result<FZO, FZP>


/**
* returns a Delay that will be re-attempted `retries` times with `delay` ms in between
* NOTE: `delay` is ignored in JS
*/
export function retry<FYW, FYX>(delayed: Delay$<FYW, FYX>, retries: number, delay: number): Delay$<FYW, FYX>


/**
* returns a Delay that will be re-attempted `retries` times with `delay` ms in between
* NOTE: `delay` is ignored in JS
*/
export function retry_with_backoff<FZC, FZD>(delayed: Delay$<FZC, FZD>, retries: number): Delay$<FZC, FZD>


/**
* run a delayed effect and throw away the result
* short-circuiting if any in the chain returns an Error
*/
export function drain(delayed: Delay$<any, any>): null


/**
* run every effect in sequence and get their results
*/
export function every<GAF, GAG>(effects: List<Delay$<GAF, GAG>>): List<Result<GAF, GAG>>


/**
* repeat a Delay and return the results in a list
*/
export function repeat<FZY, FZZ>(delayed: Delay$<FZY, FZZ>, repetition: number): List<Result<FZY, FZZ>>


/**
* run all effects in sequence and return True if all succeed
* note this will _always_ run _every_ effect
*/
export function all(effects: List<Delay$<any, any>>): boolean


/**
* run all effects in sequence and return True if any succeeds
* note this is different than `fallthrough/1` because it will _always_ run _every_ effect
*/
export function any(effects: List<Delay$<any, any>>): boolean


/**
* attempt multiple Delays until one returns an Ok
* unlike `any/1` this will short circuit on the first Ok
*/
export function fallthrough<GBI, GBJ>(effects: List<Delay$<GBI, GBJ>>): Result<GBI, GBJ>

export class CustomType {
  withFields<K extends keyof this>(fields: {
    [P in K]: this[P]
  }): this
}

export class List<T> implements any {
  head: T
  tail: List<T>
  static fromArray<T>(array: Array<T>): List<T>
  toArray(): Array<T>
  atLeastLength(desired: number): boolean
  hasLength(desired: number): boolean
  countLength(): number
  [Symbol.iterator](): Iterator<T>
}

export function toList<T>(array: Array<T>): List<T>

export class Empty<T = never> extends List<T> {}

export class NonEmpty<T> extends List<T> {}

export class BitArray {
  buffer: Uint8Array
  get length(): number
  byteAt(index: number): number
  floatAt(index: number): number
  intFromSlice(start: number, end: number): number
  binaryFromSlice(state: number, end: number): BitArray
  sliceAfter(index: number): BitArray
}

export class UtfCodepoint {
  value: string
}

export function toBitArray(segments: Array<number | Uint8Array>): BitArray

export function sizedInt(int: number, size: number): Uint8Array

export function byteArrayToInt(byteArray: Uint8Array): number

export function byteArrayToFloat(byteArray: Uint8Array): number

export function stringBits(string: string): Uint8Array

export function codepointBits(codepoint: UtfCodepoint): Uint8Array

export function float64Bits(float: number): Uint8Array

export class Result<T, E> extends CustomType {
  static isResult(data: unknown): boolean
  isOk(): boolean
}

export class Ok<T, E> extends Result<T, E> {
  0: T
  constructor(value: T)
}

export class Error<T, E> extends Result<T, E> {
  0: E
  constructor(value: E)
}

export function isEqual(a: any, b: any): boolean

export function remainderInt(a: number, b: number): number

export function divideInt(a: number, b: number): number

export function divideFloat(a: number, b: number): number

export class Continue<FXD, FXE> extends CustomType {
  constructor(effect: () => Result<any, any>)
  effect(): Result<any, any>
}

export class Stop<FXE> extends CustomType {
  constructor(err: FXE)
  err: FXE
}
