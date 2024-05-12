
/**
* Type representing a delayed effect to be lazily evaluated
*/
export type Delay$<GCV, GCU> = Continue<GCV, GCU> | Stop<GCV>


/**
* Stores an effect to be run later, short circuiting on errors
*/
export function delay_effect<GCW, GCX>(func: () => Result<GCW, GCX>): Delay$<GCW, GCX>


/**
* Chains an operation onto an existing delay. The result of the current delay will be lazily passed to `func`
* `func` will not be called if the delay has already returned an error
*/
export function map<GDC, GDD, GDG>(delayed: Delay$<GDC, GDD>, func: (x0: GDC) => Result<GDG, GDD>): Delay$<GDG, GDD>


/**
* flatten a nested Delay
*/
export function flatten<GDU, GDV>(delayed: Delay$<Delay$<GDU, GDV>, GDV>): Delay$<GDU, GDV>


/**
* Map and then flatten `delayed`
*/
export function flat_map<GEC, GED, GEG>(
  delayed: Delay$<GEC, GED>,
  func: (x0: GEC) => Result<Delay$<GEG, GED>, GED>
): Delay$<GEG, GED>


/**
* Run a delayed effect and get the result
* short-circuiting if any in delay in the chain returns an Error
*/
export function run<GFR, GFS>(delayed: Delay$<GFR, GFS>): Result<GFR, GFS>


/**
* returns a delay, that joins two delays. If `left` fails `right` will not be run, if either fails the result will be an Error
*/
export function join<GEN, GEO, GER, GES>(
  left: Delay$<GEN, GEO>,
  right: Delay$<GER, GES>
): Delay$<[GEN, GER], [Option$<GEO>, Option$<GES>]>


/**
* Returns a new Delay that will be re-attempted `retries` times with `delay` ms in-between
* NOTE: `delay` is ignored in JS
*/
export function retry<GEZ, GFA>(delayed: Delay$<GEZ, GFA>, retries: number, delay: number): Delay$<GEZ, GFA>


/**
* Returns a new Delay that will be re-attempted `retries` times with `delay` ms in-between
* NOTE: `delay` is ignored in JS
*/
export function retry_with_backoff<GFF, GFG>(delayed: Delay$<GFF, GFG>, retries: number): Delay$<GFF, GFG>


/**
* Run a delayed effect and throw away the result
* short-circuiting if any in the chain returns an Error
*/
export function drain(delayed: Delay$<any, any>): null


/**
* Run every effect in sequence and get their results
*/
export function every<GGI, GGJ>(effects: List<Delay$<GGI, GGJ>>): List<Result<GGI, GGJ>>


/**
* Repeat a Delay and return the results in a list
*/
export function repeat<GGB, GGC>(delayed: Delay$<GGB, GGC>, repetition: number): List<Result<GGB, GGC>>


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
export function fallthrough<GHL, GHM>(effects: List<Delay$<GHL, GHM>>): Result<GHL, GHM>

export class Continue<GCV, GCU> extends CustomType {
  constructor(effect: () => Result<any, any>)
  effect(): Result<any, any>
}

export class Stop<GCV> extends CustomType {
  constructor(err: GCV)
  err: GCV
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
