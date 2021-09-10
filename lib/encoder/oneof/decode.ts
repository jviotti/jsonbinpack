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
  JSONValue
} from '../../json'

import {
  SchemasOptions
} from './options'

import {
  DecodeResult
} from '../base'

import {
  IntegerResult,
  FLOOR_MULTIPLE_ENUM_VARINT
} from '../integer/decode'

import {
  decode
} from '../index'

import ResizableBuffer from '../resizable-buffer'

export interface OneOfResult extends DecodeResult {
  readonly value: JSONValue;
  readonly bytes: number;
}

export const ONEOF_CHOICE_INDEX_PREFIX = (
  buffer: ResizableBuffer, offset: number, options: SchemasOptions
): OneOfResult => {
  const index: IntegerResult = FLOOR_MULTIPLE_ENUM_VARINT(buffer, offset, {
    minimum: 0,
    multiplier: 1
  })

  const result: DecodeResult = decode(
    buffer, offset + index.bytes,
    options.choices[index.value].encoding)

  return {
    value: result.value,
    bytes: index.bytes + result.bytes
  }
}
