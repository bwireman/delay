
/**
* Type representing a delayed effect to be lazily evaluated
*/
export type Delay$<IKT, IKU> = Continue<IKT, IKU> | Stop<IKU>


/**
* Stores an effect to be run later, short circuiting on errors
*/
export function delay_effect<IKV, IKW>(func: () => Result<IKV, IKW>): Delay$<IKV, IKW>


/**
* Chains an operation onto an existing delay. The result of the current delay will be lazily passed to `func`
* `func` will not be called if the delay has already returned an error
*/
export function map<ILB, ILC, ILF>(delayed: Delay$<ILB, ILC>, func: (x0: ILB) => Result<ILF, ILC>): Delay$<ILF, ILC>


/**
* flatten a nested Delay
*/
export function flatten<ILT, ILU>(delayed: Delay$<Delay$<ILT, ILU>, ILU>): Delay$<ILT, ILU>


/**
* Map and then flatten `delayed`
*/
export function flat_map<IMB, IMC, IMF>(
  delayed: Delay$<IMB, IMC>,
  func: (x0: IMB) => Result<Delay$<IMF, IMC>, IMC>
): Delay$<IMF, IMC>


/**
* Run a delayed effect and get the result
* short-circuiting if any in delay in the chain returns an Error
*/
export function run<INQ, INR>(delayed: Delay$<INQ, INR>): Result<INQ, INR>


/**
* returns a delay, that joins two delays. If `left` fails `right` will not be run, if either fails the result will be an Error
*/
export function join<IMM, IMN, IMQ, IMR>(
  left: Delay$<IMM, IMN>,
  right: Delay$<IMQ, IMR>
): Delay$<[IMM, IMQ], [Option$<IMN>, Option$<IMR>]>


/**
* Returns a new Delay that will be re-attempted `retries` times with `delay` ms in-between
* Note: JS uses busy waiting
*/
export function retry<IMY, IMZ>(delayed: Delay$<IMY, IMZ>, retries: number, delay: number): Delay$<IMY, IMZ>


/**
* Returns a new Delay that will be re-attempted `retries` times with `delay` ms in-between
* Note: JS uses busy waiting
*/
export function retry_with_backoff<INE, INF>(delayed: Delay$<INE, INF>, retries: number): Delay$<INE, INF>


/**
* Run a delayed effect and throw away the result
* short-circuiting if any in the chain returns an Error
*/
export function drain(delayed: Delay$<any, any>): undefined


/**
* Run every effect in sequence and get their results
*/
export function every<IOH, IOI>(effects: List<Delay$<IOH, IOI>>): List<Result<IOH, IOI>>


/**
* Repeat a Delay and return the results in a list
*/
export function repeat<IOA, IOB>(delayed: Delay$<IOA, IOB>, repetition: number): List<Result<IOA, IOB>>


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
export function fallthrough<IPK, IPL>(effects: List<Delay$<IPK, IPL>>): Result<IPK, IPL>

export class Continue<IKT, IKU> extends CustomType {
  constructor(effect: () => Result<IKT, IKU>)
  /**
   * @deprecated
   */
  effect(): Result<IKT, IKU>
}

export class Stop<IKU> extends CustomType {
  constructor(err: IKU)
  /**
   * @deprecated
   */
  err: IKU
}

/**
 * @deprecated
 */
export const Result: {
  new <T, E>(): Result<T, E>
}

export type Option$<EL> = Some<EL> | None

/**
 * @deprecated
 */
export const List: {
  /**
   * @deprecated
   */
  new <T>(): List<T>
  /**
   * @deprecated
   */
  fromArray<T>(array: Array<T>): List<T>
}

export class CustomType {
  /**
   * @deprecated
   */
  withFields<K extends keyof this>(fields: {
    [P in K]: this[P]
  }): this
}

export class Some<EL> extends CustomType {
  constructor(argument$0: EL)
  /**
   * @deprecated
   */
  0: EL
}

export class None extends CustomType {}
