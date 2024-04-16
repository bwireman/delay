
/**
* Type representing a delayed effect to be lazily evaluated
*/
export type Delay$<GCD, GCE> = Continue<GCD, GCE> | Stop<GCE>


/**
* Stores an effect to be run later, short circuiting on errors
*/
export function delay_effect<GCF, GCG>(func: () => Result<GCF, GCG>): Delay$<GCF, GCG>


/**
* Chains an operation onto an existing delay. The result of the current delay will be lazily passed to `func`
* `func` will not be called if the delay has already returned an error
*/
export function map<GCL, GCM, GCP>(delayed: Delay$<GCL, GCM>, func: (x0: GCL) => Result<GCP, GCM>): Delay$<GCP, GCM>


/**
* flatten a nested Delay
*/
export function flatten<GDD, GDE>(delayed: Delay$<Delay$<GDD, GDE>, GDE>): Delay$<GDD, GDE>


/**
* Map and then flatten `delayed`
*/
export function flat_map<GDL, GDM, GDP>(
  delayed: Delay$<GDL, GDM>,
  func: (x0: GDL) => Result<Delay$<GDP, GDM>, GDM>
): Delay$<GDP, GDM>


/**
* Run a delayed effect and get the result
* short-circuiting if any in delay in the chain returns an Error
*/
export function run<GFA, GFB>(delayed: Delay$<GFA, GFB>): Result<GFA, GFB>


/**
* returns a delay, that joins two delays. If `left` fails `right` will not be run, if either fails the result will be an Error
*/
export function join<GDW, GDX, GEA, GEB>(
  left: Delay$<GDW, GDX>,
  right: Delay$<GEA, GEB>
): Delay$<[GDW, GEA], [Option$<GDX>, Option$<GEB>]>


/**
* Returns a new Delay that will be re-attempted `retries` times with `delay` ms in-between
* NOTE: `delay` is ignored in JS
*/
export function retry<GEI, GEJ>(delayed: Delay$<GEI, GEJ>, retries: number, delay: number): Delay$<GEI, GEJ>


/**
* Returns a new Delay that will be re-attempted `retries` times with `delay` ms in-between
* NOTE: `delay` is ignored in JS
*/
export function retry_with_backoff<GEO, GEP>(delayed: Delay$<GEO, GEP>, retries: number): Delay$<GEO, GEP>


/**
* Run a delayed effect and throw away the result
* short-circuiting if any in the chain returns an Error
*/
export function drain(delayed: Delay$<any, any>): null


/**
* Run every effect in sequence and get their results
*/
export function every<GFR, GFS>(effects: List<Delay$<GFR, GFS>>): List<Result<GFR, GFS>>


/**
* Repeat a Delay and return the results in a list
*/
export function repeat<GFK, GFL>(delayed: Delay$<GFK, GFL>, repetition: number): List<Result<GFK, GFL>>


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
export function fallthrough<GGU, GGV>(effects: List<Delay$<GGU, GGV>>): Result<GGU, GGV>

export class Continue<GCE, GCD> extends CustomType {
  constructor(effect: () => Result<any, any>)
  effect(): Result<any, any>
}

export class Stop<GCE> extends CustomType {
  constructor(err: GCE)
  err: GCE
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
