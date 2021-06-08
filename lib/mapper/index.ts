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
  BooleanEncodingNames,
  BooleanEncoding,
  getBooleanEncoding
} from './boolean'

import {
  NullEncodingNames,
  NullEncoding,
  getNullEncoding
} from './null'

import {
  NumberEncodingNames,
  NumberEncoding,
  getNumberEncoding
} from './number'

import {
  IntegerEncodingNames,
  IntegerEncoding,
  getIntegerEncoding
} from './integer'

import {
  StringEncodingNames,
  StringEncoding,
  getStringEncoding
} from './string'

import {
  AnyEncodingNames,
  AnyEncoding,
  getAnyEncoding
} from './any'

import {
  ArrayEncodingNames,
  ArrayEncoding,
  getArrayEncoding
} from './array'

import {
  ObjectEncodingNames,
  ObjectEncoding,
  getObjectEncoding
} from './object'

import {
  EnumEncodingNames,
  EnumEncoding,
  getEnumEncoding
} from './enum'

import {
  OneOfEncodingNames,
  OneOfEncoding,
  getOneOfEncoding
} from './oneof'

import {
  ConstEncodingNames,
  ConstEncoding,
  getConstEncoding
} from './const'

import {
  EncodingSchema
} from '../schema'

export {
  BooleanEncoding
} from './boolean'

export {
  NullEncoding
} from './null'

export {
  NumberEncoding
} from './number'

export {
  IntegerEncoding
} from './integer'

export {
  StringEncoding
} from './string'

export {
  AnyEncoding
} from './any'

export {
  ArrayEncoding
} from './array'

export {
  ObjectEncoding
} from './object'

export {
  EnumEncoding
} from './enum'

export {
  OneOfEncoding
} from './oneof'

export {
  ConstEncoding
} from './const'

export type EncodingNames =
  BooleanEncodingNames |
  NullEncodingNames |
  NumberEncodingNames |
  IntegerEncodingNames |
  StringEncodingNames |
  AnyEncodingNames |
  ArrayEncodingNames |
  ObjectEncodingNames |
  EnumEncodingNames |
  OneOfEncodingNames |
  ConstEncodingNames

// The union of all possible encodings
export type Encoding =
  BooleanEncoding |
  NullEncoding |
  NumberEncoding |
  IntegerEncoding |
  StringEncoding |
  AnyEncoding |
  ArrayEncoding |
  ObjectEncoding |
  EnumEncoding |
  OneOfEncoding |
  ConstEncoding

export const getEncoding = (schema: EncodingSchema): Encoding => {
  if ('enum' in schema) {
    return getEnumEncoding(schema)
  } else if ('const' in schema) {
    return getConstEncoding(schema)
  } else if ('oneOf' in schema) {
    return getOneOfEncoding(schema)
  } else if (!('type' in schema)) {
    return getAnyEncoding(schema)
  } else if (schema.type === 'boolean') {
    return getBooleanEncoding(schema)
  } else if (schema.type === 'integer') {
    return getIntegerEncoding(schema)
  } else if (schema.type === 'null') {
    return getNullEncoding(schema)
  } else if (schema.type === 'number') {
    return getNumberEncoding(schema)
  } else if (schema.type === 'string') {
    return getStringEncoding(schema)
  } else if (schema.type === 'array') {
    return getArrayEncoding(schema)
  }
  return getObjectEncoding(schema)
}
