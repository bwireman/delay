
/**
* Type representing a delayed effect to be lazily evaluated
*/
export type Delay$<MMM, MML> = Continue<MMM, MML> | Stop<MMM>


/**
* Stores an effect to be run later, short circuiting on errors
*/
export function delay_effect<MMN, MMO>(func: () => Result<MMN, MMO>): Delay$<MMN, MMO>


/**
* Chains an operation onto an existing delay. The result of the current delay will be lazily passed to `func`
* `func` will not be called if the delay has already returned an error
*/
export function map<MMT, MMU, MMX>(delayed: Delay$<MMT, MMU>, func: (x0: MMT) => Result<MMX, MMU>): Delay$<MMX, MMU>


/**
* flatten a nested Delay
*/
export function flatten<MNL, MNM>(delayed: Delay$<Delay$<MNL, MNM>, MNM>): Delay$<MNL, MNM>


/**
* Map and then flatten `delayed`
*/
export function flat_map<MNT, MNU, MNX>(
  delayed: Delay$<MNT, MNU>,
  func: (x0: MNT) => Result<Delay$<MNX, MNU>, MNU>
): Delay$<MNX, MNU>


/**
* Run a delayed effect and get the result
* short-circuiting if any in delay in the chain returns an Error
*/
export function run<MPI, MPJ>(delayed: Delay$<MPI, MPJ>): Result<MPI, MPJ>


/**
* returns a delay, that joins two delays. If `left` fails `right` will not be run, if either fails the result will be an Error
*/
export function join<MOE, MOF, MOI, MOJ>(
  left: Delay$<MOE, MOF>,
  right: Delay$<MOI, MOJ>
): Delay$<[MOE, MOI], [Option$<MOF>, Option$<MOJ>]>


/**
* Returns a new Delay that will be re-attempted `retries` times with `delay` ms in-between
* Note: JS uses busy waiting
*/
export function retry<MOQ, MOR>(delayed: Delay$<MOQ, MOR>, retries: number, delay: number): Delay$<MOQ, MOR>


/**
* Returns a new Delay that will be re-attempted `retries` times with `delay` ms in-between
* Note: JS uses busy waiting
*/
export function retry_with_backoff<MOW, MOX>(delayed: Delay$<MOW, MOX>, retries: number): Delay$<MOW, MOX>


/**
* Run a delayed effect and throw away the result
* short-circuiting if any in the chain returns an Error
*/
export function drain(delayed: Delay$<any, any>): undefined


/**
* Run every effect in sequence and get their results
*/
export function every<MPZ, MQA>(effects: List<Delay$<MPZ, MQA>>): List<Result<MPZ, MQA>>


/**
* Repeat a Delay and return the results in a list
*/
export function repeat<MPS, MPT>(delayed: Delay$<MPS, MPT>, repetition: number): List<Result<MPS, MPT>>


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
export function fallthrough<MRC, MRD>(effects: List<Delay$<MRC, MRD>>): Result<MRC, MRD>

export class Continue<MMM, MML> extends CustomType {
  constructor(effect: () => Result<any, any>)
  effect(): Result<any, any>
}

export class Stop<MMM> extends CustomType {
  constructor(err: MMM)
  err: MMM
}

export class Result<T, E> extends CustomType {
  static isResult(data: unknown): boolean
  isOk(): boolean
}

export type Option$<FV> = Some<FV> | None

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

export class Some<FV> extends CustomType {
  constructor(argument$0: FV)
  0: FV
}

export class None extends CustomType {}
