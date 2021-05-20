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
  BOUNDED_CHOICE_INDEX,
  LARGE_BOUNDED_CHOICE_INDEX
} from '../../../lib/types/enum/encode'

import ResizableBuffer from '../../../lib/utils/resizable-buffer'

tap.test('BOUNDED_CHOICE_INDEX: should encode 1 of [ 1, 0, 0 ]', (test) => {
  const buffer: ResizableBuffer = new ResizableBuffer(Buffer.allocUnsafe(1))
  const bytesWritten: number = BOUNDED_CHOICE_INDEX(buffer, 0, 1, {
    choices: [ 1, 0, 0 ]
  })

  test.strictSame(buffer.getBuffer(), Buffer.from([ 0x00 ]))
  test.is(bytesWritten, 1)
  test.end()
})

tap.test('BOUNDED_CHOICE_INDEX: should encode 1 of [ 0, 0, 1 ]', (test) => {
  const buffer: ResizableBuffer = new ResizableBuffer(Buffer.allocUnsafe(1))
  const bytesWritten: number = BOUNDED_CHOICE_INDEX(buffer, 0, 1, {
    choices: [ 0, 0, 1 ]
  })

  test.strictSame(buffer.getBuffer(), Buffer.from([ 0x02 ]))
  test.is(bytesWritten, 1)
  test.end()
})

tap.test('BOUNDED_CHOICE_INDEX: should encode "bar" of [ foo, bar, bar ]', (test) => {
  const buffer: ResizableBuffer = new ResizableBuffer(Buffer.allocUnsafe(1))
  const bytesWritten: number = BOUNDED_CHOICE_INDEX(buffer, 0, 'bar', {
    choices: [ 'foo', 'bar', 'bar' ]
  })

  test.strictSame(buffer.getBuffer(), Buffer.from([ 0x01 ]))
  test.is(bytesWritten, 1)
  test.end()
})

tap.test('BOUNDED_CHOICE_INDEX: should encode handle objects', (test) => {
  const buffer: ResizableBuffer = new ResizableBuffer(Buffer.allocUnsafe(1))
  const bytesWritten: number = BOUNDED_CHOICE_INDEX(buffer, 0, {
    foo: 1
  }, {
    choices: [
      {
        foo: 2
      },
      {},
      [ 1, 2, 3 ],
      {
        foo: 1
      },
      {
        bar: 1
      }
    ]
  })

  test.strictSame(buffer.getBuffer(), Buffer.from([ 0x03 ]))
  test.is(bytesWritten, 1)
  test.end()
})

tap.test('LARGE_BOUNDED_CHOICE_INDEX: should encode 1 of [ 1, 0, 0 ]', (test) => {
  const buffer: ResizableBuffer = new ResizableBuffer(Buffer.allocUnsafe(1))
  const bytesWritten: number = LARGE_BOUNDED_CHOICE_INDEX(buffer, 0, 1, {
    choices: [ 1, 0, 0 ]
  })

  test.strictSame(buffer.getBuffer(), Buffer.from([ 0x00 ]))
  test.is(bytesWritten, 1)
  test.end()
})

tap.test('LARGE_BOUNDED_CHOICE_INDEX: should encode 1 of [ 0, 0, 1 ]', (test) => {
  const buffer: ResizableBuffer = new ResizableBuffer(Buffer.allocUnsafe(1))
  const bytesWritten: number = LARGE_BOUNDED_CHOICE_INDEX(buffer, 0, 1, {
    choices: [ 0, 0, 1 ]
  })

  test.strictSame(buffer.getBuffer(), Buffer.from([ 0x02 ]))
  test.is(bytesWritten, 1)
  test.end()
})

tap.test('LARGE_BOUNDED_CHOICE_INDEX: should encode "bar" of [ foo, bar, bar ]', (test) => {
  const buffer: ResizableBuffer = new ResizableBuffer(Buffer.allocUnsafe(1))
  const bytesWritten: number = LARGE_BOUNDED_CHOICE_INDEX(buffer, 0, 'bar', {
    choices: [ 'foo', 'bar', 'bar' ]
  })

  test.strictSame(buffer.getBuffer(), Buffer.from([ 0x01 ]))
  test.is(bytesWritten, 1)
  test.end()
})

tap.test('LARGE_BOUNDED_CHOICE_INDEX: should encode handle objects', (test) => {
  const buffer: ResizableBuffer = new ResizableBuffer(Buffer.allocUnsafe(1))
  const bytesWritten: number = LARGE_BOUNDED_CHOICE_INDEX(buffer, 0, {
    foo: 1
  }, {
    choices: [
      {
        foo: 2
      },
      {},
      [ 1, 2, 3 ],
      {
        foo: 1
      },
      {
        bar: 1
      }
    ]
  })

  test.strictSame(buffer.getBuffer(), Buffer.from([ 0x03 ]))
  test.is(bytesWritten, 1)
  test.end()
})