
/**
* Type representing a delayed effect to be lazily evaluated
*/
export type Delay$<MKH, MKI> = Continue<MKH, MKI> | Stop<MKI>


/**
* Stores an effect to be run later, short circuiting on errors
*/
export function delay_effect<MKJ, MKK>(func: () => Result<MKJ, MKK>): Delay$<MKJ, MKK>


/**
* Chains an operation onto an existing delay. The result of the current delay will be lazily passed to `func`
* `func` will not be called if the delay has already returned an error
*/
export function map<MKP, MKQ, MKT>(delayed: Delay$<MKP, MKQ>, func: (x0: MKP) => Result<MKT, MKQ>): Delay$<MKT, MKQ>


/**
* flatten a nested Delay
*/
export function flatten<MLH, MLI>(delayed: Delay$<Delay$<MLH, MLI>, MLI>): Delay$<MLH, MLI>


/**
* Map and then flatten `delayed`
*/
export function flat_map<MLP, MLQ, MLT>(
  delayed: Delay$<MLP, MLQ>,
  func: (x0: MLP) => Result<Delay$<MLT, MLQ>, MLQ>
): Delay$<MLT, MLQ>


/**
* Run a delayed effect and get the result
* short-circuiting if any in delay in the chain returns an Error
*/
export function run<MNE, MNF>(delayed: Delay$<MNE, MNF>): Result<MNE, MNF>


/**
* returns a delay, that joins two delays. If `left` fails `right` will not be run, if either fails the result will be an Error
*/
export function join<MMA, MMB, MME, MMF>(
  left: Delay$<MMA, MMB>,
  right: Delay$<MME, MMF>
): Delay$<[MMA, MME], [Option$<MMB>, Option$<MMF>]>


/**
* Returns a new Delay that will be re-attempted `retries` times with `delay` ms in-between
* Note: JS uses busy waiting
*/
export function retry<MMM, MMN>(delayed: Delay$<MMM, MMN>, retries: number, delay: number): Delay$<MMM, MMN>


/**
* Returns a new Delay that will be re-attempted `retries` times with `delay` ms in-between
* Note: JS uses busy waiting
*/
export function retry_with_backoff<MMS, MMT>(delayed: Delay$<MMS, MMT>, retries: number): Delay$<MMS, MMT>


/**
* Run a delayed effect and throw away the result
* short-circuiting if any in the chain returns an Error
*/
export function drain(delayed: Delay$<any, any>): undefined


/**
* Run every effect in sequence and get their results
*/
export function every<MNV, MNW>(effects: List<Delay$<MNV, MNW>>): List<Result<MNV, MNW>>


/**
* Repeat a Delay and return the results in a list
*/
export function repeat<MNO, MNP>(delayed: Delay$<MNO, MNP>, repetition: number): List<Result<MNO, MNP>>


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
export function fallthrough<MOY, MOZ>(effects: List<Delay$<MOY, MOZ>>): Result<MOY, MOZ>

export class Continue<MKH, MKI> extends CustomType {
  constructor(effect: () => Result<any, any>)
  effect(): Result<any, any>
}

export class Stop<MKI> extends CustomType {
  constructor(err: MKI)
  err: MKI
}

export class Result<T, E> extends CustomType {
  static isResult(data: unknown): boolean
  isOk(): boolean
}

export type Option$<FQ> = Some<FQ> | None

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

export class Some<FQ> extends CustomType {
  constructor(argument$0: FQ)
  0: FQ
}

export class None extends CustomType {}
