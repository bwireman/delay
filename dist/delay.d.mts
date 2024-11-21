
/**
* Type representing a delayed effect to be lazily evaluated
*/
export type Delay$<MMK, MMJ> = Continue<MMJ, MMK> | Stop<MMK>


/**
* Stores an effect to be run later, short circuiting on errors
*/
export function delay_effect<MML, MMM>(func: () => Result<MML, MMM>): Delay$<MML, MMM>


/**
* Chains an operation onto an existing delay. The result of the current delay will be lazily passed to `func`
* `func` will not be called if the delay has already returned an error
*/
export function map<MMR, MMS, MMV>(delayed: Delay$<MMR, MMS>, func: (x0: MMR) => Result<MMV, MMS>): Delay$<MMV, MMS>


/**
* flatten a nested Delay
*/
export function flatten<MNJ, MNK>(delayed: Delay$<Delay$<MNJ, MNK>, MNK>): Delay$<MNJ, MNK>


/**
* Map and then flatten `delayed`
*/
export function flat_map<MNR, MNS, MNV>(
  delayed: Delay$<MNR, MNS>,
  func: (x0: MNR) => Result<Delay$<MNV, MNS>, MNS>
): Delay$<MNV, MNS>


/**
* Run a delayed effect and get the result
* short-circuiting if any in delay in the chain returns an Error
*/
export function run<MPG, MPH>(delayed: Delay$<MPG, MPH>): Result<MPG, MPH>


/**
* returns a delay, that joins two delays. If `left` fails `right` will not be run, if either fails the result will be an Error
*/
export function join<MOC, MOD, MOG, MOH>(
  left: Delay$<MOC, MOD>,
  right: Delay$<MOG, MOH>
): Delay$<[MOC, MOG], [Option$<MOD>, Option$<MOH>]>


/**
* Returns a new Delay that will be re-attempted `retries` times with `delay` ms in-between
* Note: JS uses busy waiting
*/
export function retry<MOO, MOP>(delayed: Delay$<MOO, MOP>, retries: number, delay: number): Delay$<MOO, MOP>


/**
* Returns a new Delay that will be re-attempted `retries` times with `delay` ms in-between
* Note: JS uses busy waiting
*/
export function retry_with_backoff<MOU, MOV>(delayed: Delay$<MOU, MOV>, retries: number): Delay$<MOU, MOV>


/**
* Run a delayed effect and throw away the result
* short-circuiting if any in the chain returns an Error
*/
export function drain(delayed: Delay$<any, any>): undefined


/**
* Run every effect in sequence and get their results
*/
export function every<MPX, MPY>(effects: List<Delay$<MPX, MPY>>): List<Result<MPX, MPY>>


/**
* Repeat a Delay and return the results in a list
*/
export function repeat<MPQ, MPR>(delayed: Delay$<MPQ, MPR>, repetition: number): List<Result<MPQ, MPR>>


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
export function fallthrough<MRA, MRB>(effects: List<Delay$<MRA, MRB>>): Result<MRA, MRB>

export class Continue<MMJ, MMK> extends CustomType {
  constructor(effect: () => Result<any, any>)
  effect(): Result<any, any>
}

export class Stop<MMK> extends CustomType {
  constructor(err: MMK)
  err: MMK
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
