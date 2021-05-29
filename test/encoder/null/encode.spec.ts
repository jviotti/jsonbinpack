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
  NULL_8BITS__ENUM_FIXED
} from '../../../lib/encoder/null/encode'

import ResizableBuffer from '../../../lib/utils/resizable-buffer'

import {
  EncodingContext,
  getDefaultEncodingContext
} from '../../../lib/encoder'

tap.test('NULL_8BITS__ENUM_FIXED: should encode null as 0x00', (test) => {
  const context: EncodingContext = getDefaultEncodingContext()
  const buffer: ResizableBuffer = new ResizableBuffer(Buffer.allocUnsafe(0))
  const bytesWritten: number = NULL_8BITS__ENUM_FIXED(buffer, 0, null, {}, context)
  test.strictSame(buffer.getBuffer(), Buffer.from([]))
  test.is(bytesWritten, 0)
  test.end()
})
