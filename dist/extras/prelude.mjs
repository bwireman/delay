// copy of https://github.com/gleam-lang/gleam/blob/v1.5.0/compiler-core/templates/prelude.mjs
// ---
//                                 Apache License
//                           Version 2.0, January 2004
//                        http://www.apache.org/licenses/
//
//   TERMS AND CONDITIONS FOR USE, REPRODUCTION, AND DISTRIBUTION
//
//   1. Definitions.
//
//      "License" shall mean the terms and conditions for use, reproduction,
//      and distribution as defined by Sections 1 through 9 of this document.
//
//      "Licensor" shall mean the copyright owner or entity authorized by
//      the copyright owner that is granting the License.
//
//      "Legal Entity" shall mean the union of the acting entity and all
//      other entities that control, are controlled by, or are under common
//      control with that entity. For the purposes of this definition,
//      "control" means (i) the power, direct or indirect, to cause the
//      direction or management of such entity, whether by contract or
//      otherwise, or (ii) ownership of fifty percent (50%) or more of the
//      outstanding shares, or (iii) beneficial ownership of such entity.
//
//      "You" (or "Your") shall mean an individual or Legal Entity
//      exercising permissions granted by this License.
//
//      "Source" form shall mean the preferred form for making modifications,
//      including but not limited to software source code, documentation
//      source, and configuration files.
//
//      "Object" form shall mean any form resulting from mechanical
//      transformation or translation of a Source form, including but
//      not limited to compiled object code, generated documentation,
//      and conversions to other media types.
//
//      "Work" shall mean the work of authorship, whether in Source or
//      Object form, made available under the License, as indicated by a
//      copyright notice that is included in or attached to the work
//      (an example is provided in the Appendix below).
//
//      "Derivative Works" shall mean any work, whether in Source or Object
//      form, that is based on (or derived from) the Work and for which the
//      editorial revisions, annotations, elaborations, or other modifications
//      represent, as a whole, an original work of authorship. For the purposes
//      of this License, Derivative Works shall not include works that remain
//      separable from, or merely link (or bind by name) to the interfaces of,
//      the Work and Derivative Works thereof.
//
//      "Contribution" shall mean any work of authorship, including
//      the original version of the Work and any modifications or additions
//      to that Work or Derivative Works thereof, that is intentionally
//      submitted to Licensor for inclusion in the Work by the copyright owner
//      or by an individual or Legal Entity authorized to submit on behalf of
//      the copyright owner. For the purposes of this definition, "submitted"
//      means any form of electronic, verbal, or written communication sent
//      to the Licensor or its representatives, including but not limited to
//      communication on electronic mailing lists, source code control systems,
//      and issue tracking systems that are managed by, or on behalf of, the
//      Licensor for the purpose of discussing and improving the Work, but
//      excluding communication that is conspicuously marked or otherwise
//      designated in writing by the copyright owner as "Not a Contribution."
//
//      "Contributor" shall mean Licensor and any individual or Legal Entity
//      on behalf of whom a Contribution has been received by Licensor and
//      subsequently incorporated within the Work.
//
//   2. Grant of Copyright License. Subject to the terms and conditions of
//      this License, each Contributor hereby grants to You a perpetual,
//      worldwide, non-exclusive, no-charge, royalty-free, irrevocable
//      copyright license to reproduce, prepare Derivative Works of,
//      publicly display, publicly perform, sublicense, and distribute the
//      Work and such Derivative Works in Source or Object form.
//
//   3. Grant of Patent License. Subject to the terms and conditions of
//      this License, each Contributor hereby grants to You a perpetual,
//      worldwide, non-exclusive, no-charge, royalty-free, irrevocable
//      (except as stated in this section) patent license to make, have made,
//      use, offer to sell, sell, import, and otherwise transfer the Work,
//      where such license applies only to those patent claims licensable
//      by such Contributor that are necessarily infringed by their
//      Contribution(s) alone or by combination of their Contribution(s)
//      with the Work to which such Contribution(s) was submitted. If You
//      institute patent litigation against any entity (including a
//      cross-claim or counterclaim in a lawsuit) alleging that the Work
//      or a Contribution incorporated within the Work constitutes direct
//      or contributory patent infringement, then any patent licenses
//      granted to You under this License for that Work shall terminate
//      as of the date such litigation is filed.
//
//   4. Redistribution. You may reproduce and distribute copies of the
//      Work or Derivative Works thereof in any medium, with or without
//      modifications, and in Source or Object form, provided that You
//      meet the following conditions:
//
//      (a) You must give any other recipients of the Work or
//          Derivative Works a copy of this License; and
//
//      (b) You must cause any modified files to carry prominent notices
//          stating that You changed the files; and
//
//      (c) You must retain, in the Source form of any Derivative Works
//          that You distribute, all copyright, patent, trademark, and
//          attribution notices from the Source form of the Work,
//          excluding those notices that do not pertain to any part of
//          the Derivative Works; and
//
//      (d) If the Work includes a "NOTICE" text file as part of its
//          distribution, then any Derivative Works that You distribute must
//          include a readable copy of the attribution notices contained
//          within such NOTICE file, excluding those notices that do not
//          pertain to any part of the Derivative Works, in at least one
//          of the following places: within a NOTICE text file distributed
//          as part of the Derivative Works; within the Source form or
//          documentation, if provided along with the Derivative Works; or,
//          within a display generated by the Derivative Works, if and
//          wherever such third-party notices normally appear. The contents
//          of the NOTICE file are for informational purposes only and
//          do not modify the License. You may add Your own attribution
//          notices within Derivative Works that You distribute, alongside
//          or as an addendum to the NOTICE text from the Work, provided
//          that such additional attribution notices cannot be construed
//          as modifying the License.
//
//      You may add Your own copyright statement to Your modifications and
//      may provide additional or different license terms and conditions
//      for use, reproduction, or distribution of Your modifications, or
//      for any such Derivative Works as a whole, provided Your use,
//      reproduction, and distribution of the Work otherwise complies with
//      the conditions stated in this License.
//
//   5. Submission of Contributions. Unless You explicitly state otherwise,
//      any Contribution intentionally submitted for inclusion in the Work
//      by You to the Licensor shall be under the terms and conditions of
//      this License, without any additional terms or conditions.
//      Notwithstanding the above, nothing herein shall supersede or modify
//      the terms of any separate license agreement you may have executed
//      with Licensor regarding such Contributions.
//
//   6. Trademarks. This License does not grant permission to use the trade
//      names, trademarks, service marks, or product names of the Licensor,
//      except as required for reasonable and customary use in describing the
//      origin of the Work and reproducing the content of the NOTICE file.
//
//   7. Disclaimer of Warranty. Unless required by applicable law or
//      agreed to in writing, Licensor provides the Work (and each
//      Contributor provides its Contributions) on an "AS IS" BASIS,
//      WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or
//      implied, including, without limitation, any warranties or conditions
//      of TITLE, NON-INFRINGEMENT, MERCHANTABILITY, or FITNESS FOR A
//      PARTICULAR PURPOSE. You are solely responsible for determining the
//      appropriateness of using or redistributing the Work and assume any
//      risks associated with Your exercise of permissions under this License.
//
//   8. Limitation of Liability. In no event and under no legal theory,
//      whether in tort (including negligence), contract, or otherwise,
//      unless required by applicable law (such as deliberate and grossly
//      negligent acts) or agreed to in writing, shall any Contributor be
//      liable to You for damages, including any direct, indirect, special,
//      incidental, or consequential damages of any character arising as a
//      result of this License or out of the use or inability to use the
//      Work (including but not limited to damages for loss of goodwill,
//      work stoppage, computer failure or malfunction, or any and all
//      other commercial damages or losses), even if such Contributor
//      has been advised of the possibility of such damages.
//
//   9. Accepting Warranty or Additional Liability. While redistributing
//      the Work or Derivative Works thereof, You may choose to offer,
//      and charge a fee for, acceptance of support, warranty, indemnity,
//      or other liability obligations and/or rights consistent with this
//      License. However, in accepting such obligations, You may act only
//      on Your own behalf and on Your sole responsibility, not on behalf
//      of any other Contributor, and only if You agree to indemnify,
//      defend, and hold each Contributor harmless for any liability
//      incurred by, or claims asserted against, such Contributor by reason
//      of your accepting any such warranty or additional liability.
//
//   END OF TERMS AND CONDITIONS
//
//   APPENDIX: How to apply the Apache License to your work.
//
//      To apply the Apache License to your work, attach the following
//      boilerplate notice, with the fields enclosed by brackets "[]"
//      replaced with your own identifying information. (Don't include
//      the brackets!)  The text should be enclosed in the appropriate
//      comment syntax for the file format. We also recommend that a
//      file or class name and description of purpose be included on the
//      same "printed page" as the copyright notice for easier
//      identification within third-party archives.
//
//   Copyright 2016 - present Louis Pilfold
//
//   Licensed under the Apache License, Version 2.0 (the "License");
//   you may not use this file except in compliance with the License.
//   You may obtain a copy of the License at
//
//       http://www.apache.org/licenses/LICENSE-2.0
//
//   Unless required by applicable law or agreed to in writing, software
//   distributed under the License is distributed on an "AS IS" BASIS,
//   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
//   See the License for the specific language governing permissions and
//   limitations under the License.
// Values marked with @internal are not part of the public API and may change
// without notice.

export class CustomType {
  withFields(fields) {
    let properties = Object.keys(this).map(label => (label in fields ? fields[label] : this[label]))
    return new this.constructor(...properties)
  }
}

export class List {
  static fromArray(array, tail) {
    let t = tail || new Empty()
    for (let i = array.length - 1; i >= 0; --i) {
      t = new NonEmpty(array[i], t)
    }
    return t
  }

  [Symbol.iterator]() {
    return new ListIterator(this)
  }

  toArray() {
    return [...this]
  }

  // @internal
  atLeastLength(desired) {
    for (let _ of this) {
      if (desired <= 0) return true
      desired--
    }
    return desired <= 0
  }

  // @internal
  hasLength(desired) {
    for (let _ of this) {
      if (desired <= 0) return false
      desired--
    }
    return desired === 0
  }

  // @internal
  countLength() {
    let length = 0
    for (let _ of this) length++
    return length
  }
}

// @internal
export function prepend(element, tail) {
  return new NonEmpty(element, tail)
}

export function toList(elements, tail) {
  return List.fromArray(elements, tail)
}

// @internal
class ListIterator {
  #current

  constructor(current) {
    this.#current = current
  }

  next() {
    if (this.#current instanceof Empty) {
      return { done: true }
    } else {
      let { head, tail } = this.#current
      this.#current = tail
      return { value: head, done: false }
    }
  }
}

export class Empty extends List {}

export class NonEmpty extends List {
  constructor(head, tail) {
    super()
    this.head = head
    this.tail = tail
  }
}

export class BitArray {
  constructor(buffer) {
    if (!(buffer instanceof Uint8Array)) {
      throw "BitArray can only be constructed from a Uint8Array"
    }
    this.buffer = buffer
  }

  // @internal
  get length() {
    return this.buffer.length
  }

  // @internal
  byteAt(index) {
    return this.buffer[index]
  }

  // @internal
  floatFromSlice(start, end, isBigEndian) {
    return byteArrayToFloat(this.buffer, start, end, isBigEndian)
  }

  // @internal
  intFromSlice(start, end, isBigEndian, isSigned) {
    return byteArrayToInt(this.buffer, start, end, isBigEndian, isSigned)
  }

  // @internal
  binaryFromSlice(start, end) {
    return new BitArray(this.buffer.slice(start, end))
  }

  // @internal
  sliceAfter(index) {
    return new BitArray(this.buffer.slice(index))
  }
}

export class UtfCodepoint {
  constructor(value) {
    this.value = value
  }
}

// @internal
export function toBitArray(segments) {
  let size = segment => (segment instanceof Uint8Array ? segment.byteLength : 1)
  let bytes = segments.reduce((acc, segment) => acc + size(segment), 0)
  let view = new DataView(new ArrayBuffer(bytes))
  let cursor = 0
  for (let segment of segments) {
    if (segment instanceof Uint8Array) {
      new Uint8Array(view.buffer).set(segment, cursor)
      cursor += segment.byteLength
    } else {
      view.setInt8(cursor, segment)
      cursor++
    }
  }
  return new BitArray(new Uint8Array(view.buffer))
}

// @internal
// Derived from this answer https://stackoverflow.com/questions/8482309/converting-javascript-integer-to-byte-array-and-back
export function sizedInt(value, size, isBigEndian) {
  if (size < 0) {
    return new Uint8Array()
  }
  if (size % 8 != 0) {
    const msg = `Bit arrays must be byte aligned on JavaScript, got size of ${size} bits`
    throw new globalThis.Error(msg)
  }

  const byteArray = new Uint8Array(size / 8)

  // Convert negative number to two's complement representation
  if (value < 0) {
    value = 2 ** size + value
  }

  if (isBigEndian) {
    for (let i = byteArray.length - 1; i >= 0; i--) {
      const byte = value % 256
      byteArray[i] = byte
      value = (value - byte) / 256
    }
  } else {
    for (let i = 0; i < byteArray.length; i++) {
      const byte = value % 256
      byteArray[i] = byte
      value = (value - byte) / 256
    }
  }

  return byteArray
}

// @internal
export function byteArrayToInt(byteArray, start, end, isBigEndian, isSigned) {
  let value = 0

  // Read bytes as an unsigned integer value
  if (isBigEndian) {
    for (let i = start; i < end; i++) {
      value = value * 256 + byteArray[i]
    }
  } else {
    for (let i = end - 1; i >= start; i--) {
      value = value * 256 + byteArray[i]
    }
  }

  if (isSigned) {
    const byteSize = end - start

    const highBit = 2 ** (byteSize * 8 - 1)

    // If the high bit is set and this is a signed integer, reinterpret as
    // two's complement
    if (value >= highBit) {
      value -= highBit * 2
    }
  }

  return value
}

// @internal
export function byteArrayToFloat(byteArray, start, end, isBigEndian) {
  const view = new DataView(byteArray.buffer)

  const byteSize = end - start

  if (byteSize === 8) {
    return view.getFloat64(start, !isBigEndian)
  } else if (byteSize === 4) {
    return view.getFloat32(start, !isBigEndian)
  } else {
    const msg = `Sized floats must be 32-bit or 64-bit on JavaScript, got size of ${byteSize * 8} bits`
    throw new globalThis.Error(msg)
  }
}

// @internal
export function stringBits(string) {
  return new TextEncoder().encode(string)
}

// @internal
export function codepointBits(codepoint) {
  return stringBits(String.fromCodePoint(codepoint.value))
}

// @internal
export function sizedFloat(float, size, isBigEndian) {
  if (size !== 32 && size !== 64) {
    const msg = `Sized floats must be 32-bit or 64-bit on JavaScript, got size of ${size} bits`
    throw new globalThis.Error(msg)
  }

  const byteArray = new Uint8Array(size / 8)

  const view = new DataView(byteArray.buffer)

  if (size == 64) {
    view.setFloat64(0, float, !isBigEndian)
  } else if (size === 32) {
    view.setFloat32(0, float, !isBigEndian)
  }

  return byteArray
}

export class Result extends CustomType {
  // @internal
  static isResult(data) {
    return data instanceof Result
  }
}

export class Ok extends Result {
  constructor(value) {
    super()
    this[0] = value
  }

  // @internal
  isOk() {
    return true
  }
}

export class Error extends Result {
  constructor(detail) {
    super()
    this[0] = detail
  }

  // @internal
  isOk() {
    return false
  }
}

export function isEqual(x, y) {
  let values = [x, y]

  while (values.length) {
    let a = values.pop()
    let b = values.pop()
    if (a === b) continue

    if (!isObject(a) || !isObject(b)) return false
    let unequal =
      !structurallyCompatibleObjects(a, b) ||
      unequalDates(a, b) ||
      unequalBuffers(a, b) ||
      unequalArrays(a, b) ||
      unequalMaps(a, b) ||
      unequalSets(a, b) ||
      unequalRegExps(a, b)
    if (unequal) return false

    const proto = Object.getPrototypeOf(a)
    if (proto !== null && typeof proto.equals === "function") {
      try {
        if (a.equals(b)) continue
        else return false
      } catch {}
    }

    let [keys, get] = getters(a)
    for (let k of keys(a)) {
      values.push(get(a, k), get(b, k))
    }
  }

  return true
}

function getters(object) {
  if (object instanceof Map) {
    return [x => x.keys(), (x, y) => x.get(y)]
  } else {
    let extra = object instanceof globalThis.Error ? ["message"] : []
    return [x => [...extra, ...Object.keys(x)], (x, y) => x[y]]
  }
}

function unequalDates(a, b) {
  return a instanceof Date && (a > b || a < b)
}

function unequalBuffers(a, b) {
  return (
    a.buffer instanceof ArrayBuffer &&
    a.BYTES_PER_ELEMENT &&
    !(a.byteLength === b.byteLength && a.every((n, i) => n === b[i]))
  )
}

function unequalArrays(a, b) {
  return Array.isArray(a) && a.length !== b.length
}

function unequalMaps(a, b) {
  return a instanceof Map && a.size !== b.size
}

function unequalSets(a, b) {
  return a instanceof Set && (a.size != b.size || [...a].some(e => !b.has(e)))
}

function unequalRegExps(a, b) {
  return a instanceof RegExp && (a.source !== b.source || a.flags !== b.flags)
}

function isObject(a) {
  return typeof a === "object" && a !== null
}

function structurallyCompatibleObjects(a, b) {
  if (typeof a !== "object" && typeof b !== "object" && (!a || !b)) return false

  let nonstructural = [Promise, WeakSet, WeakMap, Function]
  if (nonstructural.some(c => a instanceof c)) return false

  return a.constructor === b.constructor
}

// @internal
export function remainderInt(a, b) {
  if (b === 0) {
    return 0
  } else {
    return a % b
  }
}

// @internal
export function divideInt(a, b) {
  return Math.trunc(divideFloat(a, b))
}

// @internal
export function divideFloat(a, b) {
  if (b === 0) {
    return 0
  } else {
    return a / b
  }
}

// @internal
export function makeError(variant, module, line, fn, message, extra) {
  let error = new globalThis.Error(message)
  error.gleam_error = variant
  error.module = module
  error.line = line
  error.function = fn
  // TODO: Remove this with Gleam v2.0.0
  error.fn = fn
  for (let k in extra) error[k] = extra[k]
  return error
}
