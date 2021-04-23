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
  BooleanCanonicalSchema
} from '../../../lib/canonical-schema'

import {
  BooleanEncoding,
  getBooleanEncoding
} from '../../../lib/types/boolean/mapper'

tap.test('should encode a boolean value', (test) => {
  const schema: BooleanCanonicalSchema = {
    type: 'boolean'
  }

  const result: BooleanEncoding = getBooleanEncoding(schema)
  test.strictSame(result, {
    encoding: 'BOOLEAN_8BITS__ENUM_FIXED',
    options: {}
  })

  test.end()
})