
/**
* Type representing a delayed effect to be lazily evaluated
*/
export type Delay$<JAJ, JAI> = Continue<JAJ, JAI> | Stop<JAJ>


/**
* Stores an effect to be run later, short circuiting on errors
*/
export function delay_effect<JAK, JAL>(func: () => Result<JAK, JAL>): Delay$<JAK, JAL>


/**
* Chains an operation onto an existing delay. The result of the current delay will be lazily passed to `func`
* `func` will not be called if the delay has already returned an error
*/
export function map<JAQ, JAR, JAU>(delayed: Delay$<JAQ, JAR>, func: (x0: JAQ) => Result<JAU, JAR>): Delay$<JAU, JAR>


/**
* flatten a nested Delay
*/
export function flatten<JBI, JBJ>(delayed: Delay$<Delay$<JBI, JBJ>, JBJ>): Delay$<JBI, JBJ>


/**
* Map and then flatten `delayed`
*/
export function flat_map<JBQ, JBR, JBU>(
  delayed: Delay$<JBQ, JBR>,
  func: (x0: JBQ) => Result<Delay$<JBU, JBR>, JBR>
): Delay$<JBU, JBR>


/**
* Run a delayed effect and get the result
* short-circuiting if any in delay in the chain returns an Error
*/
export function run<JDF, JDG>(delayed: Delay$<JDF, JDG>): Result<JDF, JDG>


/**
* returns a delay, that joins two delays. If `left` fails `right` will not be run, if either fails the result will be an Error
*/
export function join<JCB, JCC, JCF, JCG>(
  left: Delay$<JCB, JCC>,
  right: Delay$<JCF, JCG>
): Delay$<[JCB, JCF], [Option$<JCC>, Option$<JCG>]>


/**
* Returns a new Delay that will be re-attempted `retries` times with `delay` ms in-between
* Note: JS uses busy waiting
*/
export function retry<JCN, JCO>(delayed: Delay$<JCN, JCO>, retries: number, delay: number): Delay$<JCN, JCO>


/**
* Returns a new Delay that will be re-attempted `retries` times with `delay` ms in-between
* Note: JS uses busy waiting
*/
export function retry_with_backoff<JCT, JCU>(delayed: Delay$<JCT, JCU>, retries: number): Delay$<JCT, JCU>


/**
* Run a delayed effect and throw away the result
* short-circuiting if any in the chain returns an Error
*/
export function drain(delayed: Delay$<any, any>): undefined


/**
* Run every effect in sequence and get their results
*/
export function every<JDW, JDX>(effects: List<Delay$<JDW, JDX>>): List<Result<JDW, JDX>>


/**
* Repeat a Delay and return the results in a list
*/
export function repeat<JDP, JDQ>(delayed: Delay$<JDP, JDQ>, repetition: number): List<Result<JDP, JDQ>>


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
export function fallthrough<JEZ, JFA>(effects: List<Delay$<JEZ, JFA>>): Result<JEZ, JFA>

export class Continue<JAJ, JAI> extends CustomType {
  constructor(effect: () => Result<any, any>)
  effect(): Result<any, any>
}

export class Stop<JAJ> extends CustomType {
  constructor(err: JAJ)
  err: JAJ
}

export class Result<T, E> extends CustomType {
  static isResult(data: unknown): boolean
  isOk(): boolean
}

export type Option$<GA> = Some<GA> | None

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

export class Some<GA> extends CustomType {
  constructor(argument$0: GA)
  0: GA
}

export class None extends CustomType {}
