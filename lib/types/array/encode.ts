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

import {
  strict as assert
} from 'assert'

import {
  JSONValue
} from '../../json'

import {
  UINT8_MAX
} from '../../utils/limits'

import {
  encode,
  Encoding
} from '../../encoder'

import {
  NoOptions,
  RoofOptions,
  FloorOptions,
  BoundedOptions,
  TypedOptions,
  TypedBoundedOptions,
  TypedFloorOptions,
  TypedRoofOptions,
  SemiTypedBoundedOptions,
  SemiTypedFloorOptions,
  SemiTypedRoofOptions
} from './options'

import {
  FLOOR__ENUM_VARINT,
  BOUNDED__ENUM_VARINT,
  BOUNDED_8BITS__ENUM_FIXED
} from '../integer/encode'

import {
  ANY__TYPE_PREFIX
} from '../any/encode'

export const BOUNDED_8BITS_UNTYPED__LENGTH_PREFIX = (
  buffer: Buffer, offset: number, value: JSONValue[], options: BoundedOptions
): number => {
  assert(options.maximum >= 0)
  assert(options.minimum >= 0)
  assert(options.maximum >= options.minimum)
  assert(value.length >= options.minimum)
  assert(value.length <= options.maximum)
  assert(options.maximum - options.minimum <= UINT8_MAX)

  const lengthBytes: number =
    BOUNDED_8BITS__ENUM_FIXED(buffer, offset, value.length, {
      minimum: options.minimum,
      maximum: options.maximum
    })

  let bytesWritten = lengthBytes
  for (const element of value) {
    const elementBytes: number =
      ANY__TYPE_PREFIX(buffer, offset + bytesWritten, element, {})
    bytesWritten += elementBytes
  }

  return bytesWritten
}

export const BOUNDED_UNTYPED__LENGTH_PREFIX = (
  buffer: Buffer, offset: number, value: JSONValue[], options: BoundedOptions
): number => {
  assert(options.maximum >= 0)
  assert(options.minimum >= 0)
  assert(options.maximum >= options.minimum)
  assert(value.length >= options.minimum)
  assert(value.length <= options.maximum)

  const lengthBytes: number =
    BOUNDED__ENUM_VARINT(buffer, offset, value.length, {
      minimum: options.minimum,
      maximum: options.maximum
    })

  let bytesWritten = lengthBytes
  for (const element of value) {
    const elementBytes: number =
      ANY__TYPE_PREFIX(buffer, offset + bytesWritten, element, {})
    bytesWritten += elementBytes
  }

  return bytesWritten
}

export const FLOOR_UNTYPED__LENGTH_PREFIX = (
  buffer: Buffer, offset: number, value: JSONValue[], options: FloorOptions
): number => {
  assert(options.minimum >= 0)
  assert(value.length >= options.minimum)

  const lengthBytes: number =
    FLOOR__ENUM_VARINT(buffer, offset, value.length, options)

  let bytesWritten = lengthBytes
  for (const element of value) {
    const elementBytes: number =
      ANY__TYPE_PREFIX(buffer, offset + bytesWritten, element, {})
    bytesWritten += elementBytes
  }

  return bytesWritten
}

export const ROOF_8BITS_UNTYPED__LENGTH_PREFIX = (
  buffer: Buffer, offset: number, value: JSONValue[], options: RoofOptions
): number => {
  assert(options.maximum >= 0)
  assert(value.length <= options.maximum)
  assert(options.maximum <= UINT8_MAX)

  return BOUNDED_8BITS_UNTYPED__LENGTH_PREFIX(buffer, offset, value, {
    minimum: 0,
    maximum: options.maximum
  })
}

export const ROOF_UNTYPED__LENGTH_PREFIX = (
  buffer: Buffer, offset: number, value: JSONValue[], options: RoofOptions
): number => {
  assert(options.maximum >= 0)
  assert(value.length <= options.maximum)

  return BOUNDED_UNTYPED__LENGTH_PREFIX(buffer, offset, value, {
    minimum: 0,
    maximum: options.maximum
  })
}

export const UNBOUNDED_UNTYPED__LENGTH_PREFIX = (
  buffer: Buffer, offset: number, value: JSONValue[], _options: NoOptions
): number => {
  return FLOOR_UNTYPED__LENGTH_PREFIX(buffer, offset, value, {
    minimum: 0
  })
}

export const BOUNDED_8BITS_TYPED__LENGTH_PREFIX = (
  buffer: Buffer, offset: number, value: JSONValue[], options: TypedBoundedOptions
): number => {
  assert(options.maximum >= 0)
  assert(options.minimum >= 0)
  assert(options.maximum >= options.minimum)
  assert(value.length >= options.minimum)
  assert(value.length <= options.maximum)
  assert(options.maximum - options.minimum <= UINT8_MAX)

  const lengthBytes: number =
    BOUNDED_8BITS__ENUM_FIXED(buffer, offset, value.length, {
      minimum: options.minimum,
      maximum: options.maximum
    })

  let bytesWritten = lengthBytes
  for (const element of value) {
    const elementBytes: number =
      encode(buffer, offset + bytesWritten, options.encoding, element)
    bytesWritten += elementBytes
  }

  return bytesWritten
}

export const BOUNDED_TYPED__LENGTH_PREFIX = (
  buffer: Buffer, offset: number, value: JSONValue[], options: TypedBoundedOptions
): number => {
  assert(options.maximum >= 0)
  assert(options.minimum >= 0)
  assert(options.maximum >= options.minimum)
  assert(value.length >= options.minimum)
  assert(value.length <= options.maximum)

  const lengthBytes: number =
    BOUNDED__ENUM_VARINT(buffer, offset, value.length, {
      minimum: options.minimum,
      maximum: options.maximum
    })

  let bytesWritten = lengthBytes
  for (const element of value) {
    const elementBytes: number =
      encode(buffer, offset + bytesWritten, options.encoding, element)
    bytesWritten += elementBytes
  }

  return bytesWritten
}

export const ROOF_8BITS_TYPED__LENGTH_PREFIX = (
  buffer: Buffer, offset: number, value: JSONValue[], options: TypedRoofOptions
): number => {
  assert(options.maximum >= 0)
  assert(value.length <= options.maximum)
  assert(options.maximum <= UINT8_MAX)

  return BOUNDED_8BITS_TYPED__LENGTH_PREFIX(buffer, offset, value, {
    minimum: 0,
    maximum: options.maximum,
    encoding: options.encoding
  })
}

export const ROOF_TYPED__LENGTH_PREFIX = (
  buffer: Buffer, offset: number, value: JSONValue[], options: TypedRoofOptions
): number => {
  assert(options.maximum >= 0)
  assert(value.length <= options.maximum)

  return BOUNDED_TYPED__LENGTH_PREFIX(buffer, offset, value, {
    minimum: 0,
    maximum: options.maximum,
    encoding: options.encoding
  })
}

export const FLOOR_TYPED__LENGTH_PREFIX = (
  buffer: Buffer, offset: number, value: JSONValue[], options: TypedFloorOptions
): number => {
  assert(options.minimum >= 0)
  assert(value.length >= options.minimum)

  const lengthBytes: number =
    FLOOR__ENUM_VARINT(buffer, offset, value.length, {
      minimum: options.minimum
    })

  let bytesWritten = lengthBytes
  for (const element of value) {
    const elementBytes: number =
      encode(buffer, offset + bytesWritten, options.encoding, element)
    bytesWritten += elementBytes
  }

  return bytesWritten
}

export const UNBOUNDED_TYPED__LENGTH_PREFIX = (
  buffer: Buffer, offset: number, value: JSONValue[], options: TypedOptions
): number => {
  return FLOOR_TYPED__LENGTH_PREFIX(buffer, offset, value, {
    minimum: 0,
    encoding: options.encoding
  })
}

export const BOUNDED_8BITS_SEMITYPED__LENGTH_PREFIX = (
  buffer: Buffer, offset: number, value: JSONValue[], options: SemiTypedBoundedOptions
): number => {
  assert(options.maximum >= 0)
  assert(options.minimum >= 0)
  assert(options.maximum >= options.minimum)
  assert(value.length >= options.minimum)
  assert(value.length <= options.maximum)
  assert(options.maximum - options.minimum <= UINT8_MAX)
  assert(options.prefixEncodings.length > 0)

  const lengthBytes: number =
    BOUNDED_8BITS__ENUM_FIXED(buffer, offset, value.length, {
      minimum: options.minimum,
      maximum: options.maximum
    })

  let bytesWritten = lengthBytes
  for (const [ index, element ] of value.entries()) {
    const encoding: Encoding | null = options.prefixEncodings[index] ?? null
    if (encoding === null) {
      const elementBytes: number =
        ANY__TYPE_PREFIX(buffer, offset + bytesWritten, element, {})
      bytesWritten += elementBytes
    } else {
      const elementBytes: number =
        encode(buffer, offset + bytesWritten, encoding, element)
      bytesWritten += elementBytes
    }
  }

  return bytesWritten
}

export const BOUNDED_SEMITYPED__LENGTH_PREFIX = (
  buffer: Buffer, offset: number, value: JSONValue[], options: SemiTypedBoundedOptions
): number => {
  assert(options.maximum >= 0)
  assert(options.minimum >= 0)
  assert(options.maximum >= options.minimum)
  assert(value.length >= options.minimum)
  assert(value.length <= options.maximum)
  assert(options.maximum - options.minimum <= UINT8_MAX)
  assert(options.prefixEncodings.length > 0)

  const lengthBytes: number =
    BOUNDED__ENUM_VARINT(buffer, offset, value.length, {
      minimum: options.minimum,
      maximum: options.maximum
    })

  let bytesWritten = lengthBytes
  for (const [ index, element ] of value.entries()) {
    const encoding: Encoding | null = options.prefixEncodings[index] ?? null
    if (encoding === null) {
      const elementBytes: number =
        ANY__TYPE_PREFIX(buffer, offset + bytesWritten, element, {})
      bytesWritten += elementBytes
    } else {
      const elementBytes: number =
        encode(buffer, offset + bytesWritten, encoding, element)
      bytesWritten += elementBytes
    }
  }

  return bytesWritten
}

export const FLOOR_SEMITYPED__LENGTH_PREFIX = (
  buffer: Buffer, offset: number, value: JSONValue[], options: SemiTypedFloorOptions
): number => {
  assert(options.minimum >= 0)
  assert(value.length >= options.minimum)
  assert(options.prefixEncodings.length > 0)

  const lengthBytes: number =
    FLOOR__ENUM_VARINT(buffer, offset, value.length, {
      minimum: options.minimum
    })

  let bytesWritten = lengthBytes
  for (const [ index, element ] of value.entries()) {
    const encoding: Encoding | null = options.prefixEncodings[index] ?? null
    if (encoding === null) {
      const elementBytes: number =
        ANY__TYPE_PREFIX(buffer, offset + bytesWritten, element, {})
      bytesWritten += elementBytes
    } else {
      const elementBytes: number =
        encode(buffer, offset + bytesWritten, encoding, element)
      bytesWritten += elementBytes
    }
  }

  return bytesWritten
}

export const ROOF_SEMITYPED__LENGTH_PREFIX = (
  buffer: Buffer, offset: number, value: JSONValue[], options: SemiTypedRoofOptions
): number => {
  assert(options.maximum >= 0)
  assert(value.length <= options.maximum)
  assert(options.prefixEncodings.length > 0)

  return BOUNDED_SEMITYPED__LENGTH_PREFIX(buffer, offset, value, {
    minimum: 0,
    maximum: options.maximum,
    prefixEncodings: options.prefixEncodings
  })
}

export const ROOF_8BITS_SEMITYPED__LENGTH_PREFIX = (
  buffer: Buffer, offset: number, value: JSONValue[], options: SemiTypedRoofOptions
): number => {
  assert(options.maximum >= 0)
  assert(value.length <= options.maximum)
  assert(options.prefixEncodings.length > 0)
  assert(options.maximum <= UINT8_MAX)

  return BOUNDED_8BITS_SEMITYPED__LENGTH_PREFIX(buffer, offset, value, {
    minimum: 0,
    maximum: options.maximum,
    prefixEncodings: options.prefixEncodings
  })
}
