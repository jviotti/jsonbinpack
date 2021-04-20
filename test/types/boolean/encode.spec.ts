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

import {
  BOOLEAN_8BITS__ENUM_FIXED
} from '../../../lib/types/boolean/encode'

tap.test('BOOLEAN_8BITS__ENUM_FIXED: should encode false as 0x00', (test) => {
  const buffer: Buffer = Buffer.allocUnsafe(1)
  const bytesWritten: number = BOOLEAN_8BITS__ENUM_FIXED(buffer, 0, false)
  test.strictSame(buffer, Buffer.from([ 0x00 ]))
  test.is(bytesWritten, 1)
  test.end()
})

tap.test('BOOLEAN_8BITS__ENUM_FIXED: should encode true as 0x01', (test) => {
  const buffer: Buffer = Buffer.allocUnsafe(1)
  const bytesWritten: number = BOOLEAN_8BITS__ENUM_FIXED(buffer, 0, true)
  test.strictSame(buffer, Buffer.from([ 0x01 ]))
  test.is(bytesWritten, 1)
  test.end()
})
