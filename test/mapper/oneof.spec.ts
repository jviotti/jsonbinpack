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
  EncodingSchema
} from '../../lib/schema'

import {
  Encoding,
  getStates,
  getEncoding
} from '../../lib/mapper'

tap.test('should encode a oneOf schema with multiple choices', (test) => {
  const schema: EncodingSchema = {
    oneOf: [
      {
        type: 'string'
      },
      {
        type: 'integer',
        maximum: 5
      },
      {
        type: 'array',
        items: {
          type: 'string'
        }
      }
    ]
  }

  const result: Encoding = getEncoding(schema)
  test.is(getStates(schema), Infinity)
  test.strictSame(result, {
    type: 'oneOf',
    encoding: 'ONEOF_CHOICE_INDEX_PREFIX',
    options: {
      schemas: [
        {
          schema: {
            type: 'string'
          },
          encoding: getEncoding({
            type: 'string'
          })
        },
        {
          schema: {
            type: 'integer',
            maximum: 5
          },
          encoding: getEncoding({
            type: 'integer',
            maximum: 5
          })
        },
        {
          schema: {
            type: 'array',
            items: {
              type: 'string'
            }
          },
          encoding: getEncoding({
            type: 'array',
            items: {
              type: 'string'
            }
          })
        }
      ]
    }
  })

  test.end()
})

tap.test('should encode a oneOf schema with multiple boolean choices', (test) => {
  const schema: EncodingSchema = {
    oneOf: [
      {
        type: 'boolean'
      },
      {
        type: 'boolean'
      },
      {
        type: 'boolean'
      }
    ]
  }

  const result: Encoding = getEncoding(schema)
  test.is(getStates(schema), 8)
  test.strictSame(result, {
    type: 'oneOf',
    encoding: 'ONEOF_CHOICE_INDEX_PREFIX',
    options: {
      schemas: [
        {
          schema: {
            type: 'boolean'
          },
          encoding: getEncoding({
            type: 'boolean'
          })
        },
        {
          schema: {
            type: 'boolean'
          },
          encoding: getEncoding({
            type: 'boolean'
          })
        },
        {
          schema: {
            type: 'boolean'
          },
          encoding: getEncoding({
            type: 'boolean'
          })
        }
      ]
    }
  })

  test.end()
})
