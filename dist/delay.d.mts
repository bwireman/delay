
/**
* Type representing a delayed effect to be lazily evaluated
*/
export type Delay$<FXE, FXD> = Continue<FXE, FXD> | Stop<FXE>


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
export function run<GAA, GAB>(delayed: Delay$<GAA, GAB>): Result<GAA, GAB>


/**
* returns a delay, that joins two delays. If `left` fails `right` will not be run, if either fails the result will be an Error
*/
export function join<FYW, FYX, FZA, FZB>(
  left: Delay$<FYW, FYX>,
  right: Delay$<FZA, FZB>
): Delay$<[FYW, FZA], [Option$<FYX>, Option$<FZB>]>


/**
* Returns a new Delay that will be re-attempted `retries` times with `delay` ms in-between
* NOTE: `delay` is ignored in JS
*/
export function retry<FZI, FZJ>(delayed: Delay$<FZI, FZJ>, retries: number, delay: number): Delay$<FZI, FZJ>


/**
* Returns a new Delay that will be re-attempted `retries` times with `delay` ms in-between
* NOTE: `delay` is ignored in JS
*/
export function retry_with_backoff<FZO, FZP>(delayed: Delay$<FZO, FZP>, retries: number): Delay$<FZO, FZP>


/**
* Run a delayed effect and throw away the result
* short-circuiting if any in the chain returns an Error
*/
export function drain(delayed: Delay$<any, any>): null


/**
* Run every effect in sequence and get their results
*/
export function every<GAR, GAS>(effects: List<Delay$<GAR, GAS>>): List<Result<GAR, GAS>>


/**
* Repeat a Delay and return the results in a list
*/
export function repeat<GAK, GAL>(delayed: Delay$<GAK, GAL>, repetition: number): List<Result<GAK, GAL>>


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
export function fallthrough<GBU, GBV>(effects: List<Delay$<GBU, GBV>>): Result<GBU, GBV>

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

export type Option$<GC> = Some<GC> | None

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

export class Some<GC> extends CustomType {
  constructor(argument$0: GC)
  0: GC
}

export class None extends CustomType {}
