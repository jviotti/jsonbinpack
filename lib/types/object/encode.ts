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
  JSONObject,
  JSONValue
} from '../../json'

import {
  encode,
  Encoding
} from '../../encoder'

import {
  bitsetEncode
} from '../../utils/bitset'

import {
  TypedKeysOptions,
  OptionalBoundedOptions,
  RequiredBoundedOptions
} from './options'

import {
  FLOOR__ENUM_VARINT
} from '../integer/encode'

import {
  ANY__TYPE_PREFIX
} from '../any/encode'

export const REQUIRED_BOUNDED_TYPED_OBJECT = (
  buffer: Buffer, offset: number, value: JSONObject, options: RequiredBoundedOptions
): number => {
  assert(Object.keys(value).length === options.requiredProperties.length)

  let cursor: number = offset
  for (const key of options.requiredProperties) {
    const objectValue: JSONValue = value[key]
    const encoding: Encoding = options.propertyEncodings[key]
    cursor += encode(buffer, cursor, encoding, objectValue)
  }

  return cursor - offset
}

export const OPTIONAL_BOUNDED_TYPED_OBJECT = (
  buffer: Buffer, offset: number, value: JSONObject, options: OptionalBoundedOptions
): number => {
  assert(Object.keys(value).length <= options.optionalProperties.length)

  const lengthBytes: number = FLOOR__ENUM_VARINT(
    buffer, offset, options.optionalProperties.length, {
      minimum: 0
    })

  const keys: string[] = []
  const bitset: boolean[] = []
  for (const property of options.optionalProperties) {
    const isPropertySet: boolean = typeof value[property] !== 'undefined'
    bitset.push(isPropertySet)
    if (isPropertySet) {
      keys.push(property)
    }
  }

  const bitsetBytes: number = bitsetEncode(buffer, offset + lengthBytes, bitset)
  let cursor = offset + lengthBytes + bitsetBytes
  for (const key of keys) {
    const encoding: Encoding = options.propertyEncodings[key]
    const bytesWritten: number = encode(buffer, cursor, encoding, value[key])
    cursor += bytesWritten
  }

  return cursor - offset
}

export const ARBITRARY_TYPED_KEYS_OBJECT = (
  buffer: Buffer, offset: number, value: JSONObject, options: TypedKeysOptions
): number => {
  let cursor: number = FLOOR__ENUM_VARINT(
    buffer, offset, Object.keys(value).length, {
      minimum: 0
    })

  for (const [ key, objectValue ] of Object.entries(value)) {
    cursor += encode(buffer, cursor, options.keyEncoding, key)
    cursor += ANY__TYPE_PREFIX(buffer, cursor, objectValue, {})
  }

  return cursor - offset
}
