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

tap.test('should encode an arbitrary array', (test) => {
  const schema: EncodingSchema = {
    type: 'array'
  }

  const result: Encoding = getEncoding(schema)
  test.is(getStates(schema), Infinity)
  test.strictSame(result, {
    type: 'array',
    encoding: 'UNBOUNDED_SEMITYPED__LENGTH_PREFIX',
    options: {
      prefixEncodings: []
    }
  })

  test.end()
})

tap.test('should encode an arbitrary array with minItems', (test) => {
  const schema: EncodingSchema = {
    type: 'array',
    minItems: 10
  }

  const result: Encoding = getEncoding(schema)
  test.is(getStates(schema), Infinity)
  test.strictSame(result, {
    type: 'array',
    encoding: 'FLOOR_SEMITYPED__LENGTH_PREFIX',
    options: {
      minimum: 10,
      prefixEncodings: []
    }
  })

  test.end()
})

tap.test('should encode an arbitrary array with maxItems = 256', (test) => {
  const schema: EncodingSchema = {
    type: 'array',
    maxItems: 256
  }

  const result: Encoding = getEncoding(schema)
  test.is(getStates(schema), Infinity)
  test.strictSame(result, {
    type: 'array',
    encoding: 'ROOF_SEMITYPED__LENGTH_PREFIX',
    options: {
      maximum: 256,
      prefixEncodings: []
    }
  })

  test.end()
})

tap.test('should encode an arbitrary array with maxItems = 255', (test) => {
  const schema: EncodingSchema = {
    type: 'array',
    maxItems: 255
  }

  const result: Encoding = getEncoding(schema)
  test.is(getStates(schema), Infinity)
  test.strictSame(result, {
    type: 'array',
    encoding: 'ROOF_8BITS_SEMITYPED__LENGTH_PREFIX',
    options: {
      maximum: 255,
      prefixEncodings: []
    }
  })

  test.end()
})

tap.test('should encode an arbitrary array with maxItems < 255', (test) => {
  const schema: EncodingSchema = {
    type: 'array',
    maxItems: 10
  }

  const result: Encoding = getEncoding(schema)
  test.is(getStates(schema), Infinity)
  test.strictSame(result, {
    type: 'array',
    encoding: 'ROOF_8BITS_SEMITYPED__LENGTH_PREFIX',
    options: {
      maximum: 10,
      prefixEncodings: []
    }
  })

  test.end()
})

tap.test('should encode an arbitrary array with maxItems - minItems < 255', (test) => {
  const schema: EncodingSchema = {
    type: 'array',
    maxItems: 10,
    minItems: 3
  }

  const result: Encoding = getEncoding(schema)
  test.is(getStates(schema), Infinity)
  test.strictSame(result, {
    type: 'array',
    encoding: 'BOUNDED_8BITS_SEMITYPED__LENGTH_PREFIX',
    options: {
      minimum: 3,
      maximum: 10,
      prefixEncodings: []
    }
  })

  test.end()
})

tap.test('should encode an arbitrary array with maxItems - minItems > 255', (test) => {
  const schema: EncodingSchema = {
    type: 'array',
    maxItems: 450,
    minItems: 30
  }

  const result: Encoding = getEncoding(schema)
  test.is(getStates(schema), Infinity)
  test.strictSame(result, {
    type: 'array',
    encoding: 'BOUNDED_SEMITYPED__LENGTH_PREFIX',
    options: {
      minimum: 30,
      maximum: 450,
      prefixEncodings: []
    }
  })

  test.end()
})

tap.test('should encode an semi-typed scalar heterogeneous array', (test) => {
  const schema: EncodingSchema = {
    type: 'array',
    prefixItems: [
      {
        type: 'integer'
      },
      {
        type: 'string',
        maxLength: 5
      }
    ]
  }

  const result: Encoding = getEncoding(schema)
  test.is(getStates(schema), Infinity)
  test.strictSame(result, {
    type: 'array',
    encoding: 'UNBOUNDED_SEMITYPED__LENGTH_PREFIX',
    options: {
      prefixEncodings: [
        {
          type: 'integer',
          encoding: 'ARBITRARY__ZIGZAG_VARINT',
          options: {}
        },
        {
          type: 'string',
          encoding: 'ROOF__PREFIX_LENGTH_8BIT_FIXED',
          options: {
            maximum: 5
          }
        }
      ]
    }
  })

  test.end()
})

tap.test('should encode an semi-typed array with minItems', (test) => {
  const schema: EncodingSchema = {
    type: 'array',
    minItems: 5,
    prefixItems: [
      {
        type: 'integer'
      },
      {
        type: 'string',
        maxLength: 5
      }
    ]
  }

  const result: Encoding = getEncoding(schema)
  test.is(getStates(schema), Infinity)
  test.strictSame(result, {
    type: 'array',
    encoding: 'FLOOR_SEMITYPED__LENGTH_PREFIX',
    options: {
      minimum: 5,
      prefixEncodings: [
        {
          type: 'integer',
          encoding: 'ARBITRARY__ZIGZAG_VARINT',
          options: {}
        },
        {
          type: 'string',
          encoding: 'ROOF__PREFIX_LENGTH_8BIT_FIXED',
          options: {
            maximum: 5
          }
        }
      ]
    }
  })

  test.end()
})

tap.test('should encode an semi + fully typed array with minItems', (test) => {
  const schema: EncodingSchema = {
    type: 'array',
    minItems: 5,
    items: {
      type: 'array'
    },
    prefixItems: [
      {
        type: 'integer'
      },
      {
        type: 'string',
        maxLength: 5
      }
    ]
  }

  const result: Encoding = getEncoding(schema)
  test.is(getStates(schema), Infinity)
  test.strictSame(result, {
    type: 'array',
    encoding: 'FLOOR_TYPED__LENGTH_PREFIX',
    options: {
      minimum: 5,
      encoding: {
        type: 'array',
        encoding: 'UNBOUNDED_SEMITYPED__LENGTH_PREFIX',
        options: {
          prefixEncodings: []
        }
      },
      prefixEncodings: [
        {
          type: 'integer',
          encoding: 'ARBITRARY__ZIGZAG_VARINT',
          options: {}
        },
        {
          type: 'string',
          encoding: 'ROOF__PREFIX_LENGTH_8BIT_FIXED',
          options: {
            maximum: 5
          }
        }
      ]
    }
  })

  test.end()
})

tap.test('should encode an a bounded array with bounded items', (test) => {
  const schema: EncodingSchema = {
    type: 'array',
    maxItems: 2,
    minItems: 1,
    items: {
      type: 'boolean'
    }
  }

  const result: Encoding = getEncoding(schema)
  test.is(getStates(schema), 4)
  test.strictSame(result, {
    type: 'array',
    encoding: 'BOUNDED_8BITS_TYPED__LENGTH_PREFIX',
    options: {
      minimum: 1,
      maximum: 2,
      encoding: getEncoding({
        type: 'boolean'
      }),
      prefixEncodings: []
    }
  })

  test.end()
})

tap.test('should encode an a bounded array with total prefix items', (test) => {
  const schema: EncodingSchema = {
    type: 'array',
    maxItems: 2,
    minItems: 1,
    prefixItems: [
      {
        type: 'boolean'
      },
      {
        type: 'boolean'
      }
    ]
  }

  const result: Encoding = getEncoding(schema)
  test.is(getStates(schema), 4)
  test.strictSame(result, {
    type: 'array',
    encoding: 'BOUNDED_8BITS_SEMITYPED__LENGTH_PREFIX',
    options: {
      minimum: 1,
      maximum: 2,
      prefixEncodings: [
        getEncoding({
          type: 'boolean'
        }),
        getEncoding({
          type: 'boolean'
        })
      ]
    }
  })

  test.end()
})
