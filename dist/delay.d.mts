
/**
* Type representing a delayed effect to be lazily evaluated
*/
export type Delay$<MKO, MKN> = Continue<MKN, MKO> | Stop<MKO>


/**
* Stores an effect to be run later, short circuiting on errors
*/
export function delay_effect<MKP, MKQ>(func: () => Result<MKP, MKQ>): Delay$<MKP, MKQ>


/**
* Chains an operation onto an existing delay. The result of the current delay will be lazily passed to `func`
* `func` will not be called if the delay has already returned an error
*/
export function map<MKV, MKW, MKZ>(delayed: Delay$<MKV, MKW>, func: (x0: MKV) => Result<MKZ, MKW>): Delay$<MKZ, MKW>


/**
* flatten a nested Delay
*/
export function flatten<MLN, MLO>(delayed: Delay$<Delay$<MLN, MLO>, MLO>): Delay$<MLN, MLO>


/**
* Map and then flatten `delayed`
*/
export function flat_map<MLV, MLW, MLZ>(
  delayed: Delay$<MLV, MLW>,
  func: (x0: MLV) => Result<Delay$<MLZ, MLW>, MLW>
): Delay$<MLZ, MLW>


/**
* Run a delayed effect and get the result
* short-circuiting if any in delay in the chain returns an Error
*/
export function run<MNK, MNL>(delayed: Delay$<MNK, MNL>): Result<MNK, MNL>


/**
* returns a delay, that joins two delays. If `left` fails `right` will not be run, if either fails the result will be an Error
*/
export function join<MMG, MMH, MMK, MML>(
  left: Delay$<MMG, MMH>,
  right: Delay$<MMK, MML>
): Delay$<[MMG, MMK], [Option$<MMH>, Option$<MML>]>


/**
* Returns a new Delay that will be re-attempted `retries` times with `delay` ms in-between
* Note: JS uses busy waiting
*/
export function retry<MMS, MMT>(delayed: Delay$<MMS, MMT>, retries: number, delay: number): Delay$<MMS, MMT>


/**
* Returns a new Delay that will be re-attempted `retries` times with `delay` ms in-between
* Note: JS uses busy waiting
*/
export function retry_with_backoff<MMY, MMZ>(delayed: Delay$<MMY, MMZ>, retries: number): Delay$<MMY, MMZ>


/**
* Run a delayed effect and throw away the result
* short-circuiting if any in the chain returns an Error
*/
export function drain(delayed: Delay$<any, any>): undefined


/**
* Run every effect in sequence and get their results
*/
export function every<MOB, MOC>(effects: List<Delay$<MOB, MOC>>): List<Result<MOB, MOC>>


/**
* Repeat a Delay and return the results in a list
*/
export function repeat<MNU, MNV>(delayed: Delay$<MNU, MNV>, repetition: number): List<Result<MNU, MNV>>


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
export function fallthrough<MPE, MPF>(effects: List<Delay$<MPE, MPF>>): Result<MPE, MPF>

export class Continue<MKO, MKN> extends CustomType {
  constructor(effect: () => Result<any, any>)
  effect(): Result<any, any>
}

export class Stop<MKO> extends CustomType {
  constructor(err: MKO)
  err: MKO
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
