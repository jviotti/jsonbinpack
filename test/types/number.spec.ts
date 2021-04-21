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

import tap from 'tap'
import * as fc from 'fast-check'

import {
  DOUBLE__IEEE764_LE as ENCODE_DOUBLE__IEEE764_LE
} from '../../lib/types/number/encode'

import {
  NumberResult,
  DOUBLE__IEEE764_LE as DECODE_DOUBLE__IEEE764_LE
} from '../../lib/types/number/decode'

tap.test('DOUBLE__IEEE764_LE', (test) => {
  fc.assert(fc.property(fc.double(), (value: number): boolean => {
    const buffer: Buffer = Buffer.allocUnsafe(8)
    const bytesWritten: number = ENCODE_DOUBLE__IEEE764_LE(buffer, 0, value)
    const result: NumberResult = DECODE_DOUBLE__IEEE764_LE(buffer, 0)
    return bytesWritten === 8 && result.bytes === bytesWritten && result.value === value
  }), {
    verbose: false
  })

  test.end()
})