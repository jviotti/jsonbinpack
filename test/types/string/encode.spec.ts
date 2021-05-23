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
  BOUNDED__PREFIX_LENGTH_ENUM_VARINT,
  ROOF__PREFIX_LENGTH_8BIT_FIXED,
  ROOF__PREFIX_LENGTH_ENUM_VARINT,
  FLOOR__PREFIX_LENGTH_ENUM_VARINT,
  ARBITRARY__PREFIX_LENGTH_VARINT
} from '../../../lib/types/string/encode'

import {
  EncodingContext,
  getDefaultEncodingContext
} from '../../../lib/context'

import ResizableBuffer from '../../../lib/utils/resizable-buffer'

tap.test('BOUNDED__PREFIX_LENGTH_ENUM_VARINT: should encode "foo" (2..4)', (
  test
) => {
  const context: EncodingContext = getDefaultEncodingContext()
  const buffer: ResizableBuffer = new ResizableBuffer(Buffer.allocUnsafe(4))
  const bytesWritten: number =
    BOUNDED__PREFIX_LENGTH_ENUM_VARINT(buffer, 0, 'foo', {
      minimum: 2,
      maximum: 4
    }, context)
  test.strictSame(buffer.getBuffer(), Buffer.from([ 0x02, 0x66, 0x6f, 0x6f ]))
  test.is(bytesWritten, 4)
  test.end()
})

tap.test('ROOF__PREFIX_LENGTH_8BIT_FIXED: should encode "foo" (..4)', (
  test
) => {
  const context: EncodingContext = getDefaultEncodingContext()
  const buffer: ResizableBuffer = new ResizableBuffer(Buffer.allocUnsafe(4))
  const bytesWritten: number =
    ROOF__PREFIX_LENGTH_8BIT_FIXED(buffer, 0, 'foo', {
      maximum: 4
    }, context)
  test.strictSame(buffer.getBuffer(), Buffer.from([ 0x04, 0x66, 0x6f, 0x6f ]))
  test.is(bytesWritten, 4)
  test.end()
})

tap.test('ROOF__PREFIX_LENGTH_ENUM_VARINT: should encode "foo" (..4)', (
  test
) => {
  const context: EncodingContext = getDefaultEncodingContext()
  const buffer: ResizableBuffer = new ResizableBuffer(Buffer.allocUnsafe(4))
  const bytesWritten: number =
    ROOF__PREFIX_LENGTH_ENUM_VARINT(buffer, 0, 'foo', {
      maximum: 4
    }, context)
  test.strictSame(buffer.getBuffer(), Buffer.from([ 0x02, 0x66, 0x6f, 0x6f ]))
  test.is(bytesWritten, 4)
  test.end()
})

tap.test('ROOF__PREFIX_LENGTH_ENUM_VARINT: should encode "fooo" (..4)', (
  test
) => {
  const context: EncodingContext = getDefaultEncodingContext()
  const buffer: ResizableBuffer = new ResizableBuffer(Buffer.allocUnsafe(4))
  const bytesWritten: number =
    ROOF__PREFIX_LENGTH_ENUM_VARINT(buffer, 0, 'fooo', {
      maximum: 4
    }, context)
  test.strictSame(buffer.getBuffer(), Buffer.from([ 0x01, 0x66, 0x6f, 0x6f, 0x6f ]))
  test.is(bytesWritten, 5)
  test.end()
})

tap.test('FLOOR__PREFIX_LENGTH_ENUM_VARINT: should encode "foo" (3..)', (
  test
) => {
  const context: EncodingContext = getDefaultEncodingContext()
  const buffer: ResizableBuffer = new ResizableBuffer(Buffer.allocUnsafe(4))
  const bytesWritten: number =
    FLOOR__PREFIX_LENGTH_ENUM_VARINT(buffer, 0, 'foo', {
      minimum: 3
    }, context)
  test.strictSame(buffer.getBuffer(), Buffer.from([ 0x01, 0x66, 0x6f, 0x6f ]))
  test.is(bytesWritten, 4)
  test.end()
})

tap.test('ARBITRARY__PREFIX_LENGTH_VARINT: should encode "foo"', (test) => {
  const context: EncodingContext = getDefaultEncodingContext()
  const buffer: ResizableBuffer = new ResizableBuffer(Buffer.allocUnsafe(4))
  const bytesWritten: number =
    ARBITRARY__PREFIX_LENGTH_VARINT(buffer, 0, 'foo', {}, context)
  test.strictSame(buffer.getBuffer(), Buffer.from([ 0x04, 0x66, 0x6f, 0x6f ]))
  test.is(bytesWritten, 4)
  test.end()
})

tap.test('ARBITRARY__PREFIX_LENGTH_VARINT: should encode ""', (test) => {
  const context: EncodingContext = getDefaultEncodingContext()
  const buffer: ResizableBuffer = new ResizableBuffer(Buffer.allocUnsafe(1))
  const bytesWritten: number =
    ARBITRARY__PREFIX_LENGTH_VARINT(buffer, 0, '', {}, context)
  test.strictSame(buffer.getBuffer(), Buffer.from([ 0x01 ]))
  test.is(bytesWritten, 1)
  test.end()
})

tap.test('ARBITRARY__PREFIX_LENGTH_VARINT: should encode " "', (test) => {
  const context: EncodingContext = getDefaultEncodingContext()
  const buffer: ResizableBuffer = new ResizableBuffer(Buffer.allocUnsafe(2))
  const bytesWritten: number =
    ARBITRARY__PREFIX_LENGTH_VARINT(buffer, 0, ' ', {}, context)
  test.strictSame(buffer.getBuffer(), Buffer.from([ 0x02, 0x20 ]))
  test.is(bytesWritten, 2)
  test.end()
})
