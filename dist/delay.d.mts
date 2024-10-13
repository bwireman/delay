
/**
* Type representing a delayed effect to be lazily evaluated
*/
export type Delay$<MGE, MGD> = Continue<MGE, MGD> | Stop<MGE>


/**
* Stores an effect to be run later, short circuiting on errors
*/
export function delay_effect<MGF, MGG>(func: () => Result<MGF, MGG>): Delay$<MGF, MGG>


/**
* Chains an operation onto an existing delay. The result of the current delay will be lazily passed to `func`
* `func` will not be called if the delay has already returned an error
*/
export function map<MGL, MGM, MGP>(delayed: Delay$<MGL, MGM>, func: (x0: MGL) => Result<MGP, MGM>): Delay$<MGP, MGM>


/**
* flatten a nested Delay
*/
export function flatten<MHD, MHE>(delayed: Delay$<Delay$<MHD, MHE>, MHE>): Delay$<MHD, MHE>


/**
* Map and then flatten `delayed`
*/
export function flat_map<MHL, MHM, MHP>(
  delayed: Delay$<MHL, MHM>,
  func: (x0: MHL) => Result<Delay$<MHP, MHM>, MHM>
): Delay$<MHP, MHM>


/**
* Run a delayed effect and get the result
* short-circuiting if any in delay in the chain returns an Error
*/
export function run<MJA, MJB>(delayed: Delay$<MJA, MJB>): Result<MJA, MJB>


/**
* returns a delay, that joins two delays. If `left` fails `right` will not be run, if either fails the result will be an Error
*/
export function join<MHW, MHX, MIA, MIB>(
  left: Delay$<MHW, MHX>,
  right: Delay$<MIA, MIB>
): Delay$<[MHW, MIA], [Option$<MHX>, Option$<MIB>]>


/**
* Returns a new Delay that will be re-attempted `retries` times with `delay` ms in-between
* Note: JS uses busy waiting
*/
export function retry<MII, MIJ>(delayed: Delay$<MII, MIJ>, retries: number, delay: number): Delay$<MII, MIJ>


/**
* Returns a new Delay that will be re-attempted `retries` times with `delay` ms in-between
* Note: JS uses busy waiting
*/
export function retry_with_backoff<MIO, MIP>(delayed: Delay$<MIO, MIP>, retries: number): Delay$<MIO, MIP>


/**
* Run a delayed effect and throw away the result
* short-circuiting if any in the chain returns an Error
*/
export function drain(delayed: Delay$<any, any>): undefined


/**
* Run every effect in sequence and get their results
*/
export function every<MJR, MJS>(effects: List<Delay$<MJR, MJS>>): List<Result<MJR, MJS>>


/**
* Repeat a Delay and return the results in a list
*/
export function repeat<MJK, MJL>(delayed: Delay$<MJK, MJL>, repetition: number): List<Result<MJK, MJL>>


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
export function fallthrough<MKU, MKV>(effects: List<Delay$<MKU, MKV>>): Result<MKU, MKV>

export class Continue<MGD, MGE> extends CustomType {
  constructor(effect: () => Result<any, any>)
  effect(): Result<any, any>
}

export class Stop<MGE> extends CustomType {
  constructor(err: MGE)
  err: MGE
}

export class Result<T, E> extends CustomType {
  static isResult(data: unknown): boolean
  isOk(): boolean
}

export type Option$<I> = Some<I> | None

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

export class Some<I> extends CustomType {
  constructor(argument$0: I)
  0: I
}

export class None extends CustomType {}
