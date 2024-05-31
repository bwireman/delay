
/**
* Type representing a delayed effect to be lazily evaluated
*/
export type Delay$<MTO, MTP> = Continue<MTP, MTO> | Stop<MTP>


/**
* Stores an effect to be run later, short circuiting on errors
*/
export function delay_effect<MTQ, MTR>(func: () => Result<MTQ, MTR>): Delay$<MTQ, MTR>


/**
* Chains an operation onto an existing delay. The result of the current delay will be lazily passed to `func`
* `func` will not be called if the delay has already returned an error
*/
export function map<MTW, MTX, MUA>(delayed: Delay$<MTW, MTX>, func: (x0: MTW) => Result<MUA, MTX>): Delay$<MUA, MTX>


/**
* flatten a nested Delay
*/
export function flatten<MUO, MUP>(delayed: Delay$<Delay$<MUO, MUP>, MUP>): Delay$<MUO, MUP>


/**
* Map and then flatten `delayed`
*/
export function flat_map<MUW, MUX, MVA>(
  delayed: Delay$<MUW, MUX>,
  func: (x0: MUW) => Result<Delay$<MVA, MUX>, MUX>
): Delay$<MVA, MUX>


/**
* Run a delayed effect and get the result
* short-circuiting if any in delay in the chain returns an Error
*/
export function run<MWL, MWM>(delayed: Delay$<MWL, MWM>): Result<MWL, MWM>


/**
* returns a delay, that joins two delays. If `left` fails `right` will not be run, if either fails the result will be an Error
*/
export function join<MVH, MVI, MVL, MVM>(
  left: Delay$<MVH, MVI>,
  right: Delay$<MVL, MVM>
): Delay$<[MVH, MVL], [Option$<MVI>, Option$<MVM>]>


/**
* Returns a new Delay that will be re-attempted `retries` times with `delay` ms in-between
* NOTE: `delay` is ignored in JS
*/
export function retry<MVT, MVU>(delayed: Delay$<MVT, MVU>, retries: number, delay: number): Delay$<MVT, MVU>


/**
* Returns a new Delay that will be re-attempted `retries` times with `delay` ms in-between
* NOTE: `delay` is ignored in JS
*/
export function retry_with_backoff<MVZ, MWA>(delayed: Delay$<MVZ, MWA>, retries: number): Delay$<MVZ, MWA>


/**
* Run a delayed effect and throw away the result
* short-circuiting if any in the chain returns an Error
*/
export function drain(delayed: Delay$<any, any>): undefined


/**
* Run every effect in sequence and get their results
*/
export function every<MXC, MXD>(effects: List<Delay$<MXC, MXD>>): List<Result<MXC, MXD>>


/**
* Repeat a Delay and return the results in a list
*/
export function repeat<MWV, MWW>(delayed: Delay$<MWV, MWW>, repetition: number): List<Result<MWV, MWW>>


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
export function fallthrough<MYF, MYG>(effects: List<Delay$<MYF, MYG>>): Result<MYF, MYG>

export class Continue<MTO, MTP> extends CustomType {
  constructor(effect: () => Result<any, any>)
  effect(): Result<any, any>
}

export class Stop<MTP> extends CustomType {
  constructor(err: MTP)
  err: MTP
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
