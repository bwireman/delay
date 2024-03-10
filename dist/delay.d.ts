
/**
* Type representing a delayed effect to be lazily evaluated
*/
export type Delay$<FXD, FXE> = Continue<FXD, FXE> | Stop<FXE>


/**
* Stores an effect to be run later, short circuiting on errors
*/
export function delay_effect<FXF, FXG>(func: () => Result<FXF, FXG>): Delay$<FXF, FXG>


/**
* Chains an operation onto an existing delay. The result of the current delay will be lazily passed to `func`
* `func` will not be called if the delay has already returned an error
*/
export function map<FXL, FXM, FXP>(delayed: Delay$<FXL, FXM>, func: (x0: FXL) => Result<FXP, FXM>): Delay$<FXP, FXM>


/**
* flatten a nested Delay
*/
export function flatten<FYD, FYE>(delayed: Delay$<Delay$<FYD, FYE>, FYE>): Delay$<FYD, FYE>


/**
* Map and then flatten `delayed`
*/
export function flat_map<FYL, FYM, FYP>(
  delayed: Delay$<FYL, FYM>,
  func: (x0: FYL) => Result<Delay$<FYP, FYM>, FYM>
): Delay$<FYP, FYM>


/**
* Run a delayed effect and get the result
* short-circuiting if any in delay in the chain returns an Error
*/
export function run<FZO, FZP>(delayed: Delay$<FZO, FZP>): Result<FZO, FZP>


/**
* Returns a new Delay that will be re-attempted `retries` times with `delay` ms in-between
* NOTE: `delay` is ignored in JS
*/
export function retry<FYW, FYX>(delayed: Delay$<FYW, FYX>, retries: number, delay: number): Delay$<FYW, FYX>


/**
* Returns a new Delay that will be re-attempted `retries` times with `delay` ms in-between
* NOTE: `delay` is ignored in JS
*/
export function retry_with_backoff<FZC, FZD>(delayed: Delay$<FZC, FZD>, retries: number): Delay$<FZC, FZD>


/**
* Run a delayed effect and throw away the result
* short-circuiting if any in the chain returns an Error
*/
export function drain(delayed: Delay$<any, any>): null


/**
* Run every effect in sequence and get their results
*/
export function every<GAF, GAG>(effects: List<Delay$<GAF, GAG>>): List<Result<GAF, GAG>>


/**
* Repeat a Delay and return the results in a list
*/
export function repeat<FZY, FZZ>(delayed: Delay$<FZY, FZZ>, repetition: number): List<Result<FZY, FZZ>>


/**
* Run all effects in sequence and return True if all succeed
* NOTE: this will _always_ run _every_ effect
*/
export function all(effects: List<Delay$<any, any>>): boolean


/**
* Run all effects in sequence and return True if any succeeds
* NOTE: this is different than `fallthrough/1` because it will _always_ run _every_ effect
*/
export function any(effects: List<Delay$<any, any>>): boolean


/**
* Attempt multiple Delays until one returns an Ok
* unlike `any/1` this will short circuit on the first Ok
*/
export function fallthrough<GBI, GBJ>(effects: List<Delay$<GBI, GBJ>>): Result<GBI, GBJ>

export class Continue<FXD, FXE> extends CustomType {
  constructor(effect: () => Result<any, any>)
  effect(): Result<any, any>
}

export class Stop<FXE> extends CustomType {
  constructor(err: FXE)
  err: FXE
}

export class Result<T, E> extends CustomType {
  static isResult(data: unknown): boolean
  isOk(): boolean
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

export class CustomType {
  withFields<K extends keyof this>(fields: {
    [P in K]: this[P]
  }): this
}
