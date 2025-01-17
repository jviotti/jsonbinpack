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

import ResizableBuffer from '../resizable-buffer'

import {
  JSONValue
} from '../../json'

import {
  UINT8_MIN,
  UINT8_MAX,
  UINT5_MAX
} from '../../utils/limits'

import {
  NoOptions
} from './options'

import {
  DecodeResult
} from '../base'

import {
  EncodingType
} from '../encoding-type'

import {
  IntegerResult,
  BOUNDED_MULTIPLE_8BITS_ENUM_FIXED,
  FLOOR_MULTIPLE_ENUM_VARINT
} from '../integer/decode'

import {
  StringResult,
  UTF8_STRING_NO_LENGTH,
  SHARED_STRING_POINTER_RELATIVE_OFFSET,
  FLOOR_PREFIX_LENGTH_ENUM_VARINT
} from '../string/decode'

import {
  NumberResult,
  DOUBLE_VARINT_TUPLE
} from '../number/decode'

import {
  ObjectResult,
  ARBITRARY_TYPED_KEYS_OBJECT,
  ARBITRARY_TYPED_KEYS_OBJECT_WITHOUT_LENGTH
} from '../object/decode'

import {
  ArrayResult,
  FLOOR_TYPED_LENGTH_PREFIX,
  FIXED_TYPED_ARRAY
} from '../array/decode'

import {
  Type,
  Subtype,
  isTrue,
  isFalse,
  isNull,
  isType,
  isNumber,
  isPositiveInteger,
  isNegativeInteger,
  getMetadata
} from './types'

export interface AnyResult extends DecodeResult {
  readonly value: JSONValue;
  readonly bytes: number;
}

export const ANY_PACKED_TYPE_TAG_BYTE_PREFIX = (
  buffer: ResizableBuffer, offset: number, _options: NoOptions
): AnyResult => {
  const tag: IntegerResult = BOUNDED_MULTIPLE_8BITS_ENUM_FIXED(buffer, offset, {
    minimum: UINT8_MIN,
    maximum: UINT8_MAX,
    multiplier: 1
  })

  if (isType(Type.Array, tag.value)) {
    const size: number = getMetadata(tag.value)
    const result: ArrayResult = size === 0
      ? FLOOR_TYPED_LENGTH_PREFIX(buffer, offset + tag.bytes, {
        minimum: 0,
        prefixEncodings: [],
        encoding: {
          type: EncodingType.Any,
          encoding: 'ANY_PACKED_TYPE_TAG_BYTE_PREFIX',
          options: {}
        }
      })
      : FIXED_TYPED_ARRAY(buffer, offset + tag.bytes, {
        size: size - 1,
        prefixEncodings: [],
        encoding: {
          type: EncodingType.Any,
          encoding: 'ANY_PACKED_TYPE_TAG_BYTE_PREFIX',
          options: {}
        }
      })

    return {
      value: result.value,
      bytes: tag.bytes + result.bytes
    }
  } else if (isType(Type.Object, tag.value)) {
    const size: number = getMetadata(tag.value)

    const result: ObjectResult = size === 0
      ? ARBITRARY_TYPED_KEYS_OBJECT(buffer, offset + tag.bytes, {
        keyEncoding: {
          type: EncodingType.String,
          encoding: 'STRING_UNBOUNDED_SCOPED_PREFIX_LENGTH',
          options: {}
        },
        encoding: {
          type: EncodingType.Any,
          encoding: 'ANY_PACKED_TYPE_TAG_BYTE_PREFIX',
          options: {}
        }
      })
      : ARBITRARY_TYPED_KEYS_OBJECT_WITHOUT_LENGTH(buffer, offset + tag.bytes, {
        size: size - 1,
        keyEncoding: {
          type: EncodingType.String,
          encoding: 'STRING_UNBOUNDED_SCOPED_PREFIX_LENGTH',
          options: {}
        },
        encoding: {
          type: EncodingType.Any,
          encoding: 'ANY_PACKED_TYPE_TAG_BYTE_PREFIX',
          options: {}
        }
      })

    return {
      value: result.value,
      bytes: tag.bytes + result.bytes
    }
  } else if (isNull(tag.value)) {
    return {
      value: null,
      bytes: tag.bytes
    }
  } else if (isTrue(tag.value)) {
    return {
      value: true,
      bytes: tag.bytes
    }
  } else if (isFalse(tag.value)) {
    return {
      value: false,
      bytes: tag.bytes
    }
  } else if (isType(Type.SharedString, tag.value)) {
    const size: number = getMetadata(tag.value)
    if (size === 0) {
      const result: StringResult =
        FLOOR_PREFIX_LENGTH_ENUM_VARINT(buffer, offset, {
          minimum: 0
        })
      return {
        value: result.value,
        bytes: result.bytes
      }
    }

    const result: StringResult = SHARED_STRING_POINTER_RELATIVE_OFFSET(
      buffer, offset + tag.bytes, {
        size: size - 1
      })

    return {
      value: result.value,
      bytes: result.bytes + tag.bytes
    }
  } else if (isType(Type.String, tag.value)) {
    const size: number = getMetadata(tag.value)
    if (size === 0) {
      const result: StringResult =
        FLOOR_PREFIX_LENGTH_ENUM_VARINT(buffer, offset + tag.bytes, {
          minimum: 0
        })
      return {
        value: result.value,
        bytes: tag.bytes + result.bytes
      }
    }

    const result: StringResult = UTF8_STRING_NO_LENGTH(
      buffer, offset + tag.bytes, {
        size: size - 1
      })

    return {
      value: result.value,
      bytes: result.bytes + tag.bytes
    }
  } else if (isType(Type.LongString, tag.value)) {
    const size: number = getMetadata(tag.value) + UINT5_MAX
    const result: StringResult = UTF8_STRING_NO_LENGTH(
      buffer, offset + tag.bytes, {
        size
      })

    return {
      value: result.value,
      bytes: result.bytes + tag.bytes
    }
  } else if (isType(Type.Other, tag.value) && (
    getMetadata(tag.value) === Subtype.LongStringBaseExponent7 ||
    getMetadata(tag.value) === Subtype.LongStringBaseExponent8 ||
    getMetadata(tag.value) === Subtype.LongStringBaseExponent9 ||
    getMetadata(tag.value) === Subtype.LongStringBaseExponent10
  )) {
    const size: IntegerResult =
      FLOOR_MULTIPLE_ENUM_VARINT(buffer, offset + tag.bytes, {
        minimum: Math.pow(2, getMetadata(tag.value)),
        multiplier: 1
      })

    const result: StringResult = UTF8_STRING_NO_LENGTH(
      buffer, offset + tag.bytes + size.bytes, {
        size: size.value
      })

    return {
      value: result.value,
      bytes: result.bytes + tag.bytes + size.bytes
    }
  } else if (isPositiveInteger(tag.value)) {
    const result: IntegerResult =
      FLOOR_MULTIPLE_ENUM_VARINT(buffer, offset + tag.bytes, {
        minimum: 0,
        multiplier: 1
      })
    return {
      value: result.value,
      bytes: tag.bytes + result.bytes
    }
  } else if (isNegativeInteger(tag.value)) {
    const result: IntegerResult =
      FLOOR_MULTIPLE_ENUM_VARINT(buffer, offset + tag.bytes, {
        minimum: 0,
        multiplier: 1
      })
    return {
      value: (result.value + 1) * -1,
      bytes: tag.bytes + result.bytes
    }
  } else if (isType(Type.PositiveIntegerByte, tag.value)) {
    const metadata: number = getMetadata(tag.value)
    if (metadata > 0) {
      return {
        value: metadata - 1,
        bytes: tag.bytes
      }
    }

    const result: IntegerResult =
      BOUNDED_MULTIPLE_8BITS_ENUM_FIXED(buffer, offset + tag.bytes, {
        minimum: UINT8_MIN,
        maximum: UINT8_MAX,
        multiplier: 1
      })
    return {
      value: result.value,
      bytes: tag.bytes + result.bytes
    }
  } else if (isType(Type.NegativeIntegerByte, tag.value)) {
    const metadata: number = getMetadata(tag.value)
    if (metadata > 0) {
      return {
        value: ((metadata - 1) + 1) * -1,
        bytes: tag.bytes
      }
    }

    const result: IntegerResult =
      BOUNDED_MULTIPLE_8BITS_ENUM_FIXED(buffer, offset + tag.bytes, {
        minimum: UINT8_MIN,
        maximum: UINT8_MAX,
        multiplier: 1
      })
    return {
      value: (result.value + 1) * -1,
      bytes: tag.bytes + result.bytes
    }
  } else if (isNumber(tag.value)) {
    const result: NumberResult =
        DOUBLE_VARINT_TUPLE(buffer, offset + tag.bytes, {})
    return {
      value: result.value,
      bytes: tag.bytes + result.bytes
    }
  }

  throw new Error(`Unrecognized type: ${tag.value}`)
}
