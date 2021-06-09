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

import ResizableBuffer from '../resizable-buffer'

import {
  JSONString
} from '../../json'

import {
  IntegerResult,
  BOUNDED_8BITS__ENUM_FIXED,
  BOUNDED__ENUM_VARINT,
  FLOOR__ENUM_VARINT,
  ROOF__MIRROR_ENUM_VARINT
} from '../integer/decode'

import {
  NoOptions,
  BoundedOptions,
  RoofOptions,
  FloorOptions
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
  const pointer: IntegerResult = FLOOR__ENUM_VARINT(buffer, pointerOffset, {
    minimum: 0
  })

  const stringOffset: number = pointerOffset - pointer.value
  return {
    value: buffer.toString(
      STRING_ENCODING, stringOffset, stringOffset + length.value + delta),
    bytes: prefix.bytes + length.bytes + pointer.bytes
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

export const BOUNDED__PREFIX_LENGTH_8BIT_FIXED = (
  buffer: ResizableBuffer, offset: number, options: BoundedOptions
): StringResult => {
  assert(options.minimum >= 0)
  assert(options.maximum >= options.minimum)
  assert(options.maximum - options.minimum <= UINT8_MAX)
  const prefix: IntegerResult = BOUNDED_8BITS__ENUM_FIXED(buffer, offset, {
    minimum: options.minimum,
    maximum: options.maximum + 1
  })

  if (prefix.value === Type.SharedString) {
    const length: IntegerResult = BOUNDED_8BITS__ENUM_FIXED(
      buffer, offset + prefix.bytes, {
        minimum: options.minimum,
        maximum: options.maximum + 1
      })

    return readSharedString(buffer, offset, prefix, length, -1)
  }

  return {
    value: buffer.toString(
      STRING_ENCODING, offset + prefix.bytes, offset + prefix.bytes + prefix.value - 1),
    bytes: prefix.bytes + prefix.value - 1
  }
}

export const BOUNDED__PREFIX_LENGTH_ENUM_VARINT = (
  buffer: ResizableBuffer, offset: number, options: BoundedOptions
): StringResult => {
  assert(options.minimum >= 0)
  assert(options.maximum >= options.minimum)
  const prefix: IntegerResult = BOUNDED__ENUM_VARINT(buffer, offset, {
    minimum: options.minimum,
    maximum: options.maximum + 1
  })

  if (prefix.value === Type.SharedString) {
    const length: IntegerResult = BOUNDED__ENUM_VARINT(
      buffer, offset + prefix.bytes, {
        minimum: options.minimum,
        maximum: options.maximum + 1
      })

    return readSharedString(buffer, offset, prefix, length, -1)
  }

  return {
    value: buffer.toString(
      STRING_ENCODING, offset + prefix.bytes, offset + prefix.bytes + prefix.value - 1),
    bytes: prefix.bytes + prefix.value - 1
  }
}

export const ROOF__PREFIX_LENGTH_8BIT_FIXED = (
  buffer: ResizableBuffer, offset: number, options: RoofOptions
): StringResult => {
  assert(options.maximum >= 0)
  assert(options.maximum <= UINT8_MAX)
  return BOUNDED__PREFIX_LENGTH_8BIT_FIXED(buffer, offset, {
    minimum: 0,
    maximum: options.maximum
  })
}

export const ROOF__PREFIX_LENGTH_ENUM_VARINT = (
  buffer: ResizableBuffer, offset: number, options: RoofOptions
): StringResult => {
  assert(options.maximum >= 0)
  const prefix: IntegerResult = ROOF__MIRROR_ENUM_VARINT(buffer, offset, options)

  if (prefix.value === options.maximum) {
    const length: IntegerResult = ROOF__MIRROR_ENUM_VARINT(
      buffer, offset + prefix.bytes, options)
    return readSharedString(buffer, offset, prefix, length, 1)
  }

  return {
    value: buffer.toString(
      STRING_ENCODING, offset + prefix.bytes, offset + prefix.bytes + prefix.value + 1),
    bytes: prefix.bytes + prefix.value + 1
  }
}

export const FLOOR__PREFIX_LENGTH_ENUM_VARINT = (
  buffer: ResizableBuffer, offset: number, options: FloorOptions
): StringResult => {
  assert(options.minimum >= 0)
  const prefix: IntegerResult = FLOOR__ENUM_VARINT(buffer, offset, options)

  if (prefix.value === options.minimum) {
    const length: IntegerResult = FLOOR__ENUM_VARINT(
      buffer, offset + prefix.bytes, options)
    return readSharedString(buffer, offset, prefix, length, -1)
  }

  return {
    value: buffer.toString(
      STRING_ENCODING, offset + prefix.bytes, offset + prefix.bytes + prefix.value - 1),
    bytes: prefix.bytes + prefix.value - 1
  }
}

export const ARBITRARY__PREFIX_LENGTH_VARINT = (
  buffer: ResizableBuffer, offset: number, _options: NoOptions
): StringResult => {
  return FLOOR__PREFIX_LENGTH_ENUM_VARINT(buffer, offset, {
    minimum: 0
  })
}
