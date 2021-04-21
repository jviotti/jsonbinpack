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
  SchemaNull,
  EncodingNull,
  getNullEncoding
} from '../../../lib/types/null/schema'

import * as ENCODE_FUNCTIONS from '../../../lib/types/null/encode'
import * as DECODE_FUNCTIONS from '../../../lib/types/null/decode'

tap.test('the encoding enum should include all encoding functions', (test) => {
  test.strictSame(Object.values(EncodingNull).sort(), Object.keys(ENCODE_FUNCTIONS).sort())
  test.strictSame(Object.values(EncodingNull).sort(), Object.keys(DECODE_FUNCTIONS).sort())
  test.end()
})

tap.test('should encode a null value', (test) => {
  const schema: SchemaNull = {
    type: 'null'
  }

  const encoding: EncodingNull = getNullEncoding(schema)
  test.is(encoding, EncodingNull.NULL_8BITS__ENUM_FIXED)
  test.end()
})
