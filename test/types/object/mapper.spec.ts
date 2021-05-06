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
  ObjectCanonicalSchema
} from '../../../lib/canonical-schema'

import {
  ObjectEncoding,
  getObjectEncoding
} from '../../../lib/types/object/mapper'

tap.test('should encode a bounded object with only required names', (test) => {
  const schema: ObjectCanonicalSchema = {
    type: 'object',
    additionalProperties: false,
    required: [ 'foo', 'bar' ]
  }

  const result: ObjectEncoding = getObjectEncoding(schema)
  test.strictSame(result, {
    type: 'object',
    encoding: 'REQUIRED_ONLY_BOUNDED_TYPED_OBJECT',
    options: {
      propertyEncodings: {},
      encoding: {
        type: 'any',
        encoding: 'ANY__TYPE_PREFIX',
        options: {}
      },
      requiredProperties: [ 'bar', 'foo' ]
    }
  })

  test.end()
})

tap.test('should encode a bounded object with partially defined required names', (test) => {
  const schema: ObjectCanonicalSchema = {
    type: 'object',
    additionalProperties: false,
    required: [ 'foo', 'bar' ],
    properties: {
      foo: {
        type: 'string',
        maxLength: 5
      }
    }
  }

  const result: ObjectEncoding = getObjectEncoding(schema)
  test.strictSame(result, {
    type: 'object',
    encoding: 'REQUIRED_ONLY_BOUNDED_TYPED_OBJECT',
    options: {
      propertyEncodings: {
        foo: {
          type: 'string',
          encoding: 'ROOF__PREFIX_LENGTH_8BIT_FIXED',
          options: {
            maximum: 5
          }
        }
      },
      encoding: {
        type: 'any',
        encoding: 'ANY__TYPE_PREFIX',
        options: {}
      },
      requiredProperties: [ 'bar', 'foo' ]
    }
  })

  test.end()
})

tap.test('should encode a bounded object with fully defined required names', (test) => {
  const schema: ObjectCanonicalSchema = {
    type: 'object',
    additionalProperties: false,
    required: [ 'foo', 'bar' ],
    properties: {
      bar: {
        type: 'string'
      },
      foo: {
        type: 'string',
        maxLength: 5
      }
    }
  }

  const result: ObjectEncoding = getObjectEncoding(schema)
  test.strictSame(result, {
    type: 'object',
    encoding: 'REQUIRED_ONLY_BOUNDED_TYPED_OBJECT',
    options: {
      propertyEncodings: {
        foo: {
          type: 'string',
          encoding: 'ROOF__PREFIX_LENGTH_8BIT_FIXED',
          options: {
            maximum: 5
          }
        },
        bar: {
          type: 'string',
          encoding: 'ARBITRARY__PREFIX_LENGTH_VARINT',
          options: {}
        }
      },
      encoding: {
        type: 'any',
        encoding: 'ANY__TYPE_PREFIX',
        options: {}
      },
      requiredProperties: [ 'bar', 'foo' ]
    }
  })

  test.end()
})
