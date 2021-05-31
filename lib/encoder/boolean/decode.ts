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

import ResizableBuffer from '../../utils/resizable-buffer'

import {
  strict as assert
} from 'assert'

import {
  JSONBoolean
} from '../../json'

import {
  IntegerResult,
  BOUNDED_8BITS__ENUM_FIXED
} from '../integer/decode'

import {
  NoOptions
} from './options'

import {
  DecodeResult
} from '../base'

export interface BooleanResult extends DecodeResult {
  readonly value: JSONBoolean;
  readonly bytes: number;
}

export const BOOLEAN_8BITS__ENUM_FIXED = (
  buffer: ResizableBuffer, offset: number, _options: NoOptions
): BooleanResult => {
  const result: IntegerResult = BOUNDED_8BITS__ENUM_FIXED(buffer, offset, {
    minimum: 0,
    maximum: 1
  })

  assert(result.value >= 0)
  assert(result.value <= 1)

  return {
    value: Boolean(result.value),
    bytes: result.bytes
  }
}