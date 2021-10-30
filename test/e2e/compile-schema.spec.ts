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
  compileSchema,
  Encoding
} from '../../lib'

tap.test('should compile a string with format: date', async (test) => {
  const encoding: Encoding = await compileSchema({
    type: 'string',
    format: 'date'
  })

  test.strictSame(encoding, {
    type: 'string',
    encoding: 'RFC3339_DATE_INTEGER_TRIPLET',
    options: {}
  })

  test.end()
})

tap.test('should compile a boolean schema true', async (test) => {
  const encoding: Encoding = await compileSchema(true)

  test.strictSame(encoding, {
    type: 'any',
    encoding: 'ANY_PACKED_TYPE_TAG_BYTE_PREFIX',
    options: {}
  })

  test.end()
})

tap.test('should compile a simple oneOf schema', async (test) => {
  const encoding: Encoding = await compileSchema({
    oneOf: [
      {
        type: 'integer'
      },
      {
        minimum: 2
      }
    ]
  })

  test.strictSame(encoding, {
    type: 'oneOf',
    encoding: 'ONEOF_CHOICE_INDEX_PREFIX',
    options: {
      choices: [
        {
          schema: {
            type: 'integer',
            multipleOf: 1
          },
          encoding: {
            type: 'integer',
            encoding: 'ARBITRARY_MULTIPLE_ZIGZAG_VARINT',
            options: {
              multiplier: 1
            }
          }
        },
        {
          schema: {
            anyOf: [
              {
                minimum: 2,
                enum: [ null ]
              },
              {
                minimum: 2,
                enum: [ false, true ]
              },
              {
                type: 'object',
                additionalProperties: {},
                properties: {},
                required: [],
                minProperties: 0
              },
              {
                type: 'array',
                items: {},
                minItems: 0
              },
              {
                type: 'string',
                minLength: 0
              },
              {
                type: 'number',
                minimum: 2
              },
              {
                type: 'integer',
                minimum: 2,
                multipleOf: 1
              }
            ]
          },
          encoding: {
            type: 'any',
            encoding: 'ANY_PACKED_TYPE_TAG_BYTE_PREFIX',
            options: {}
          }
        }
      ]
    }
  })

  test.end()
})
