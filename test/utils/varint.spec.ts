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
  varintEncode,
  varintDecode,
  VarintDecodeResult
} from '../../lib/utils/varint'

tap.test('should encode 1 as 0x01', (test) => {
  const buffer: Buffer = Buffer.allocUnsafe(1)
  const offset: number = 0
  const bytesWritten: number = varintEncode(buffer, offset, 1)
  test.strictSame(buffer, Buffer.from([ 0x01 ]))
  test.is(bytesWritten, 1)
  test.end()
})

tap.test('should encode 300 as 0xAC 0x02', (test) => {
  const buffer: Buffer = Buffer.allocUnsafe(2)
  const offset: number = 0
  const bytesWritten: number = varintEncode(buffer, offset, 300)
  test.strictSame(buffer, Buffer.from([ 0xAC, 0x02 ]))
  test.is(bytesWritten, 2)
  test.end()
})

tap.test('should encode 50399 as 0xDF 0x89 0x03', (test) => {
  const buffer: Buffer = Buffer.allocUnsafe(3)
  const offset: number = 0
  const bytesWritten: number = varintEncode(buffer, offset, 50399)
  test.strictSame(buffer, Buffer.from([ 0xDF, 0x89, 0x03 ]))
  test.is(bytesWritten, 3)
  test.end()
})

tap.test('should decode 0xAC 0x02 as 300', (test) => {
  const buffer: Buffer = Buffer.from([ 0xAC, 0x02 ])
  const offset: number = 0
  const result: VarintDecodeResult = varintDecode(buffer, offset)
  test.is(result.value, 300)
  test.is(result.bytes, 2)
  test.end()
})

tap.test('should encode and decode 4294967294', (test) => {
  const buffer: Buffer = Buffer.allocUnsafe(5)
  const offset: number = 0
  const bytesWritten: number = varintEncode(buffer, offset, 4294967294)
  test.is(bytesWritten, 5)
  const result: VarintDecodeResult = varintDecode(buffer, offset)
  test.is(result.bytes, 5)
  test.is(result.value, 4294967294)
  test.end()
})

tap.test('should decode a varint encoded unsigned integer', (test) => {
  fc.assert(fc.property(fc.integer({
    min: 0
  }), (value: number): boolean => {
    const buffer: Buffer = Buffer.allocUnsafe(10)
    const offset: number = 0
    const bytesWritten: number = varintEncode(buffer, offset, value)
    const result: VarintDecodeResult = varintDecode(buffer, offset)
    return bytesWritten > 0 && result.bytes === bytesWritten && result.value === value
  }), {
    verbose: false
  })

  test.end()
})