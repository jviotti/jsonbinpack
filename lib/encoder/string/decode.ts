/*
 * Copyright 2021 Juan Cruz Viotti
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import {
  strict as assert
} from 'assert'

import {
  brotliDecompressSync
} from 'zlib'

import ResizableBuffer from '../resizable-buffer'

import {
  JSONString
} from '../../json'

import {
  IntegerResult,
  BOUNDED_MULTIPLE_8BITS_ENUM_FIXED,
  FLOOR_MULTIPLE_ENUM_VARINT,
  ARBITRARY_MULTIPLE_ZIGZAG_VARINT,
  ROOF_MULTIPLE_MIRROR_ENUM_VARINT
} from '../integer/decode'

import {
  NoOptions,
  BoundedOptions,
  RoofOptions,
  FloorOptions,
  SizeOptions,
  DictionaryOptions
} from './options'

import {
  UINT8_MAX
} from '../../utils/limits'

import {
  Type
} from '../any/types'

import {
  DecodeResult
} from '../base'

export interface StringResult extends DecodeResult {
  readonly value: JSONString;
  readonly bytes: number;
}

const STRING_ENCODING: BufferEncoding = 'utf8'

const readSharedString = (
  buffer: ResizableBuffer, offset: number, prefix: IntegerResult, length: IntegerResult, delta: number
): StringResult => {
  const pointerOffset: number = offset + prefix.bytes + length.bytes
  const pointer: IntegerResult = FLOOR_MULTIPLE_ENUM_VARINT(buffer, pointerOffset, {
    minimum: 0,
    multiplier: 1
  })

  const stringOffset: number = pointerOffset - pointer.value
  return {
    value: buffer.toString(
      STRING_ENCODING, stringOffset, stringOffset + length.value + delta),
    bytes: prefix.bytes + length.bytes + pointer.bytes
  }
}

export const STRING_BROTLI = (
  buffer: ResizableBuffer, offset: number, _options: NoOptions
): StringResult => {
  const length: IntegerResult = FLOOR_MULTIPLE_ENUM_VARINT(buffer, offset, {
    minimum: 0,
    multiplier: 1
  })

  const slice: Buffer = buffer.slice(
    offset + length.bytes, offset + length.bytes + length.value)
  return {
    value: brotliDecompressSync(slice).toString(STRING_ENCODING),
    bytes: length.bytes + length.value
  }
}

export const STRING_DICTIONARY_COMPRESSOR = (
  buffer: ResizableBuffer, offset: number, options: DictionaryOptions
): StringResult => {
  const length: IntegerResult = FLOOR_MULTIPLE_ENUM_VARINT(buffer, offset, {
    minimum: 0,
    multiplier: 1
  })

  let cursor: number = offset + length.bytes
  let result: string = ''

  while (Buffer.byteLength(result, STRING_ENCODING) < length.value) {
    const prefix: string = result.length === 0 ? '' : ' '
    const markerResult: IntegerResult =
      ARBITRARY_MULTIPLE_ZIGZAG_VARINT(buffer, cursor, { multiplier: 1 })
    cursor += markerResult.bytes

    // Read a fragment from the dictionary
    if (markerResult.value > 0) {
      const fragment: string | undefined = options.index[markerResult.value - 1]
      assert(typeof fragment === 'string')
      result += prefix + fragment

    // Read a raw fragment
    } else if (markerResult.value < 0) {
      const fragmentLength: number = -markerResult.value - 1
      assert(fragmentLength >= 0)
      const fragment: string =
        buffer.toString(STRING_ENCODING, cursor, cursor + fragmentLength)
      result += prefix + fragment
      cursor += fragmentLength

    // Read a shared string
    } else {
      const lengthMarker: IntegerResult =
        FLOOR_MULTIPLE_ENUM_VARINT(buffer, cursor, {
          minimum: 0,
          multiplier: 1
        })
      const fragment: StringResult = readSharedString(
        buffer, cursor - markerResult.bytes, markerResult, lengthMarker, 0)
      result += prefix + fragment.value
      cursor += fragment.bytes - 1
    }
  }

  return {
    value: result,
    bytes: cursor - offset
  }
}

export const RFC3339_DATE_INTEGER_TRIPLET = (
  buffer: ResizableBuffer, offset: number, _options: NoOptions
): StringResult => {
  const year: number = buffer.readUInt16LE(offset)
  const month: number = buffer.readUInt8(offset + 2)
  const day: number = buffer.readUInt8(offset + 3)

  assert(year <= 9999)
  assert(month >= 1 && month <= 12)
  assert(day >= 1 && day <= 31)

  const yearString: string = String(year).padStart(4, '0')
  const monthString: string = String(month).padStart(2, '0')
  const dayString: string = String(day).padStart(2, '0')

  return {
    value: `${yearString}-${monthString}-${dayString}`,
    bytes: 4
  }
}

export const BOUNDED_PREFIX_LENGTH_8BIT_FIXED = (
  buffer: ResizableBuffer, offset: number, options: BoundedOptions
): StringResult => {
  assert(options.minimum >= 0)
  assert(options.maximum >= options.minimum)
  assert(options.maximum - options.minimum <= UINT8_MAX)
  const prefix: IntegerResult = BOUNDED_MULTIPLE_8BITS_ENUM_FIXED(buffer, offset, {
    minimum: options.minimum,
    maximum: options.maximum + 1,
    multiplier: 1
  })

  if (prefix.value === Type.SharedString) {
    const length: IntegerResult = BOUNDED_MULTIPLE_8BITS_ENUM_FIXED(
      buffer, offset + prefix.bytes, {
        minimum: options.minimum,
        maximum: options.maximum + 1,
        multiplier: 1
      })

    return readSharedString(buffer, offset, prefix, length, -1)
  }

  return {
    value: buffer.toString(
      STRING_ENCODING, offset + prefix.bytes, offset + prefix.bytes + prefix.value - 1),
    bytes: prefix.bytes + prefix.value - 1
  }
}

export const ROOF_PREFIX_LENGTH_ENUM_VARINT = (
  buffer: ResizableBuffer, offset: number, options: RoofOptions
): StringResult => {
  assert(options.maximum >= 0)
  const prefix: IntegerResult = ROOF_MULTIPLE_MIRROR_ENUM_VARINT(buffer, offset, {
    maximum: options.maximum,
    multiplier: 1
  })

  if (prefix.value === options.maximum) {
    const length: IntegerResult = ROOF_MULTIPLE_MIRROR_ENUM_VARINT(
      buffer, offset + prefix.bytes, {
        maximum: options.maximum,
        multiplier: 1
      })
    return readSharedString(buffer, offset, prefix, length, 1)
  }

  return {
    value: buffer.toString(
      STRING_ENCODING, offset + prefix.bytes, offset + prefix.bytes + prefix.value + 1),
    bytes: prefix.bytes + prefix.value + 1
  }
}

export const UTF8_STRING_NO_LENGTH = (
  buffer: ResizableBuffer, offset: number, options: SizeOptions
): StringResult => {
  assert(options.size >= 0)
  return {
    value: buffer.toString(
      STRING_ENCODING, offset, offset + options.size),
    bytes: options.size
  }
}

export const SHARED_STRING_POINTER_RELATIVE_OFFSET = (
  buffer: ResizableBuffer, offset: number, options: SizeOptions
): StringResult => {
  return readSharedString(buffer, offset, {
    value: 0,
    bytes: 0
  }, {
    value: options.size,
    bytes: 0
  }, 0)
}

export const FLOOR_PREFIX_LENGTH_ENUM_VARINT = (
  buffer: ResizableBuffer, offset: number, options: FloorOptions
): StringResult => {
  assert(options.minimum >= 0)
  const prefix: IntegerResult = FLOOR_MULTIPLE_ENUM_VARINT(buffer, offset, {
    minimum: options.minimum,
    multiplier: 1
  })

  if (prefix.value === options.minimum) {
    const length: IntegerResult = FLOOR_MULTIPLE_ENUM_VARINT(
      buffer, offset + prefix.bytes, {
        minimum: options.minimum,
        multiplier: 1
      })
    return readSharedString(buffer, offset, prefix, length, -1)
  }

  const result: StringResult = UTF8_STRING_NO_LENGTH(buffer, offset + prefix.bytes, {
    size: prefix.value - 1
  })

  return {
    value: result.value,
    bytes: result.bytes + prefix.bytes
  }
}

export const STRING_UNBOUNDED_SCOPED_PREFIX_LENGTH = (
  buffer: ResizableBuffer, offset: number, options: NoOptions
): StringResult => {
  const prefix: IntegerResult = FLOOR_MULTIPLE_ENUM_VARINT(buffer, offset, {
    minimum: 0,
    multiplier: 1
  })

  if (prefix.value === 0) {
    const pointer: IntegerResult = FLOOR_MULTIPLE_ENUM_VARINT(buffer, offset + prefix.bytes, {
      minimum: 0,
      multiplier: 1
    })

    const cursor: number = offset + prefix.bytes - pointer.value

    const length: IntegerResult = FLOOR_MULTIPLE_ENUM_VARINT(buffer, cursor, {
      minimum: 0,
      multiplier: 1
    })

    // Recurse to the nested pointer in this case to keep pointers low
    // TODO: We should try to do the same for non-keys for locality
    // purposes too?
    if (length.value === 0) {
      const result: StringResult = STRING_UNBOUNDED_SCOPED_PREFIX_LENGTH(buffer, cursor, options)
      return {
        value: result.value,
        bytes: prefix.bytes + pointer.bytes
      }
    }

    const result: StringResult = UTF8_STRING_NO_LENGTH(buffer, cursor + length.bytes, {
      size: length.value - 1
    })

    return {
      value: result.value,
      bytes: prefix.bytes + pointer.bytes
    }
  }

  const result: StringResult = UTF8_STRING_NO_LENGTH(buffer, offset + prefix.bytes, {
    size: prefix.value - 1
  })

  return {
    value: result.value,
    bytes: result.bytes + prefix.bytes
  }
}

export const URL_PROTOCOL_HOST_REST = (
  buffer: ResizableBuffer, offset: number, _options: NoOptions
): StringResult => {
  const protocol: StringResult =
    FLOOR_PREFIX_LENGTH_ENUM_VARINT(buffer, offset, {
      minimum: 0
    })
  const host: StringResult =
    FLOOR_PREFIX_LENGTH_ENUM_VARINT(buffer, offset + protocol.bytes, {
      minimum: 0
    })
  const rest: StringResult =
    FLOOR_PREFIX_LENGTH_ENUM_VARINT(buffer, offset + protocol.bytes + host.bytes, {
      minimum: 0
    })

  return {
    value: `${protocol.value}://${host.value}${rest.value}`,
    bytes: protocol.bytes + host.bytes + rest.bytes
  }
}
