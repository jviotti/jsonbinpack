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
  JSONObject
} from '../../json'

import {
  encode,
  Encoding
} from '../../encoder'

import {
  bitsetEncode
} from '../../utils/bitset'

import {
  EncodingType
} from '../base'

import {
  TypedKeysOptions,
  BoundedOptions,
  OptionalBoundedTypedOptions,
  RequiredBoundedTypedOptions
} from './options'

import {
  FLOOR__ENUM_VARINT
} from '../integer/encode'

import {
  ANY__TYPE_PREFIX
} from '../any/encode'

export const REQUIRED_BOUNDED_TYPED_OBJECT = (
  buffer: Buffer, offset: number, value: JSONObject, options: RequiredBoundedTypedOptions
): number => {
  assert(options.requiredProperties.length > 0)
  let cursor: number = offset
  for (const key of options.requiredProperties) {
    const encoding: Encoding = options.propertyEncodings[key] ?? options.encoding
    cursor += encode(buffer, cursor, encoding, value[key])
  }

  return cursor - offset
}

export const NON_REQUIRED_BOUNDED_TYPED_OBJECT = (
  buffer: Buffer, offset: number, value: JSONObject, options: OptionalBoundedTypedOptions
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
    const encoding: Encoding = options.propertyEncodings[key] ?? options.encoding
    const bytesWritten: number = encode(buffer, cursor, encoding, value[key])
    cursor += bytesWritten
  }

  return cursor - offset
}











export const BOUNDED_TYPED_OBJECT = (
  buffer: Buffer, offset: number, value: JSONObject, options: BoundedOptions
): number => {
  assert(Object.keys(value).length ===
    options.requiredProperties.length + options.optionalProperties.length)

  const requiredSubset: JSONObject = {}
  for (const key of options.requiredProperties) {
    Reflect.set(requiredSubset, key, value[key])
  }

  const optionalSubset: JSONObject = {}
  for (const key of options.optionalProperties) {
    Reflect.set(optionalSubset, key, value[key])
  }

  const requiredBytes: number = REQUIRED_BOUNDED_TYPED_OBJECT(
    buffer, offset, requiredSubset, {
      propertyEncodings: options.propertyEncodings,
      requiredProperties: options.requiredProperties,
      encoding: {
        type: EncodingType.Any,
        encoding: 'ANY__TYPE_PREFIX',
        options: {}
      }
    })

  return NON_REQUIRED_BOUNDED_TYPED_OBJECT(
    buffer, offset + requiredBytes, optionalSubset, {
      propertyEncodings: options.propertyEncodings,
      optionalProperties: options.optionalProperties,
      encoding: {
        type: EncodingType.Any,
        encoding: 'ANY__TYPE_PREFIX',
        options: {}
      }
    })
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