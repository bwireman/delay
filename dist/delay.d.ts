export type Delay$<FWW, FWX> = Continue<FWX, FWW> | Stop<FWX>

export function delay_effect<FWY, FWZ>(f: () => Result<FWY, FWZ>): Delay$<FWY, FWZ>

export function map<FXE, FXF, FXI>(delayed: Delay$<FXE, FXF>, f: (x0: FXE) => Result<FXI, FXF>): Delay$<FXI, FXF>

export function flatten<FXW, FXX>(delayed: Delay$<Delay$<FXW, FXX>, FXX>): Delay$<FXW, FXX>

export function flat_map<FYE, FYF, FYI>(
  delayed: Delay$<FYE, FYF>,
  f: (x0: FYE) => Result<Delay$<FYI, FYF>, FYF>
): Delay$<FYI, FYF>

export function run<FZH, FZI>(delayed: Delay$<FZH, FZI>): Result<FZH, FZI>

export function retry<FYP, FYQ>(delayed: Delay$<FYP, FYQ>, retries: number, delay: number): Delay$<FYP, FYQ>

export function retry_with_backoff<FYV, FYW>(delayed: Delay$<FYV, FYW>, retries: number): Delay$<FYV, FYW>

export function drain(delayed: Delay$<any, any>): null

export function every<FZY, FZZ>(effects: List<Delay$<FZY, FZZ>>): List<Result<FZY, FZZ>>

export function repeat<FZR, FZS>(delayed: Delay$<FZR, FZS>, repetition: number): List<Result<FZR, FZS>>

export function all(effects: List<Delay$<any, any>>): boolean

export function any(effects: List<Delay$<any, any>>): boolean

export function fallthrough<GBB, GBC>(effects: List<Delay$<GBB, GBC>>): Result<GBB, GBC>

export class CustomType {
  withFields<K extends keyof this>(fields: {
    [P in K]: this[P]
  }): this
}

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

export function toList<T>(array: Array<T>): List<T>

export class Empty<T = never> extends List<T> {}

export class NonEmpty<T> extends List<T> {}

export class BitArray {
  buffer: Uint8Array
  get length(): number
  byteAt(index: number): number
  floatAt(index: number): number
  intFromSlice(start: number, end: number): number
  binaryFromSlice(state: number, end: number): BitArray
  sliceAfter(index: number): BitArray
}

export class UtfCodepoint {
  value: string
}

export function toBitArray(segments: Array<number | Uint8Array>): BitArray

export function sizedInt(int: number, size: number): Uint8Array

export function byteArrayToInt(byteArray: Uint8Array): number

export function byteArrayToFloat(byteArray: Uint8Array): number

export function stringBits(string: string): Uint8Array

export function codepointBits(codepoint: UtfCodepoint): Uint8Array

export function float64Bits(float: number): Uint8Array

export class Result<T, E> extends CustomType {
  static isResult(data: unknown): boolean
  isOk(): boolean
}

export class Ok<T, E> extends Result<T, E> {
  0: T
  constructor(value: T)
}

export class Error<T, E> extends Result<T, E> {
  0: E
  constructor(value: E)
}

export function isEqual(a: any, b: any): boolean

export function remainderInt(a: number, b: number): number

export function divideInt(a: number, b: number): number

export function divideFloat(a: number, b: number): number

export class Continue<FWW, FWX> extends CustomType {
  constructor(effect: () => Result<any, any>)
  effect(): Result<any, any>
}

export class Stop<FWX> extends CustomType {
  constructor(err: FWX)
  err: FWX
}
