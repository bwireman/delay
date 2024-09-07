
/**
* Type representing a delayed effect to be lazily evaluated
*/
export type Delay$<MDF, MDE> = Continue<MDF, MDE> | Stop<MDF>


/**
* Stores an effect to be run later, short circuiting on errors
*/
export function delay_effect<MDG, MDH>(func: () => Result<MDG, MDH>): Delay$<MDG, MDH>


/**
* Chains an operation onto an existing delay. The result of the current delay will be lazily passed to `func`
* `func` will not be called if the delay has already returned an error
*/
export function map<MDM, MDN, MDQ>(delayed: Delay$<MDM, MDN>, func: (x0: MDM) => Result<MDQ, MDN>): Delay$<MDQ, MDN>


/**
* flatten a nested Delay
*/
export function flatten<MEE, MEF>(delayed: Delay$<Delay$<MEE, MEF>, MEF>): Delay$<MEE, MEF>


/**
* Map and then flatten `delayed`
*/
export function flat_map<MEM, MEN, MEQ>(
  delayed: Delay$<MEM, MEN>,
  func: (x0: MEM) => Result<Delay$<MEQ, MEN>, MEN>
): Delay$<MEQ, MEN>


/**
* Run a delayed effect and get the result
* short-circuiting if any in delay in the chain returns an Error
*/
export function run<MGB, MGC>(delayed: Delay$<MGB, MGC>): Result<MGB, MGC>


/**
* returns a delay, that joins two delays. If `left` fails `right` will not be run, if either fails the result will be an Error
*/
export function join<MEX, MEY, MFB, MFC>(
  left: Delay$<MEX, MEY>,
  right: Delay$<MFB, MFC>
): Delay$<[MEX, MFB], [Option$<MEY>, Option$<MFC>]>


/**
* Returns a new Delay that will be re-attempted `retries` times with `delay` ms in-between
* NOTE: `delay` is ignored in JS
*/
export function retry<MFJ, MFK>(delayed: Delay$<MFJ, MFK>, retries: number, delay: number): Delay$<MFJ, MFK>


/**
* Returns a new Delay that will be re-attempted `retries` times with `delay` ms in-between
* NOTE: `delay` is ignored in JS
*/
export function retry_with_backoff<MFP, MFQ>(delayed: Delay$<MFP, MFQ>, retries: number): Delay$<MFP, MFQ>


/**
* Run a delayed effect and throw away the result
* short-circuiting if any in the chain returns an Error
*/
export function drain(delayed: Delay$<any, any>): undefined


/**
* Run every effect in sequence and get their results
*/
export function every<MGS, MGT>(effects: List<Delay$<MGS, MGT>>): List<Result<MGS, MGT>>


/**
* Repeat a Delay and return the results in a list
*/
export function repeat<MGL, MGM>(delayed: Delay$<MGL, MGM>, repetition: number): List<Result<MGL, MGM>>


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
export function fallthrough<MHV, MHW>(effects: List<Delay$<MHV, MHW>>): Result<MHV, MHW>

export class Continue<MDE, MDF> extends CustomType {
  constructor(effect: () => Result<any, any>)
  effect(): Result<any, any>
}

export class Stop<MDF> extends CustomType {
  constructor(err: MDF)
  err: MDF
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
