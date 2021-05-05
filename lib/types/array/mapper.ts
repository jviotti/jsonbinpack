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
  UINT8_MAX
} from '../../utils/limits'

import {
  ArrayCanonicalSchema,
  CanonicalSchema
} from '../../canonical-schema'

import {
  BaseEncodingDefinition,
  EncodingType
} from '../base'

import {
  Encoding
} from '../../encoder'

import {
  getEncoding
} from '../../mapper'

import {
  SemiTypedOptions,
  SemiTypedFloorOptions,
  SemiTypedRoofOptions,
  SemiTypedBoundedOptions,
  TypedOptions,
  TypedFloorOptions,
  TypedRoofOptions,
  TypedBoundedOptions
} from './options'

export interface BOUNDED_8BITS_SEMITYPED__LENGTH_PREFIX_ENCODING extends BaseEncodingDefinition {
  readonly type: EncodingType.Array;
  readonly encoding: 'BOUNDED_8BITS_SEMITYPED__LENGTH_PREFIX';
  readonly options: SemiTypedBoundedOptions;
}

export interface BOUNDED_SEMITYPED__LENGTH_PREFIX_ENCODING extends BaseEncodingDefinition {
  readonly type: EncodingType.Array;
  readonly encoding: 'BOUNDED_SEMITYPED__LENGTH_PREFIX';
  readonly options: SemiTypedBoundedOptions;
}

export interface FLOOR_SEMITYPED__LENGTH_PREFIX_ENCODING extends BaseEncodingDefinition {
  readonly type: EncodingType.Array;
  readonly encoding: 'FLOOR_SEMITYPED__LENGTH_PREFIX';
  readonly options: SemiTypedFloorOptions;
}

export interface ROOF_8BITS_SEMITYPED__LENGTH_PREFIX_ENCODING extends BaseEncodingDefinition {
  readonly type: EncodingType.Array;
  readonly encoding: 'ROOF_8BITS_SEMITYPED__LENGTH_PREFIX';
  readonly options: SemiTypedRoofOptions;
}

export interface ROOF_SEMITYPED__LENGTH_PREFIX_ENCODING extends BaseEncodingDefinition {
  readonly type: EncodingType.Array;
  readonly encoding: 'ROOF_SEMITYPED__LENGTH_PREFIX';
  readonly options: SemiTypedRoofOptions;
}

export interface UNBOUNDED_SEMITYPED__LENGTH_PREFIX_ENCODING extends BaseEncodingDefinition {
  readonly type: EncodingType.Array;
  readonly encoding: 'UNBOUNDED_SEMITYPED__LENGTH_PREFIX';
  readonly options: SemiTypedOptions;
}

export interface BOUNDED_8BITS_TYPED__LENGTH_PREFIX_ENCODING extends BaseEncodingDefinition {
  readonly type: EncodingType.Array;
  readonly encoding: 'BOUNDED_8BITS_TYPED__LENGTH_PREFIX';
  readonly options: TypedBoundedOptions;
}

export interface BOUNDED_TYPED__LENGTH_PREFIX_ENCODING extends BaseEncodingDefinition {
  readonly type: EncodingType.Array;
  readonly encoding: 'BOUNDED_TYPED__LENGTH_PREFIX';
  readonly options: TypedBoundedOptions;
}

export interface FLOOR_TYPED__LENGTH_PREFIX_ENCODING extends BaseEncodingDefinition {
  readonly type: EncodingType.Array;
  readonly encoding: 'FLOOR_TYPED__LENGTH_PREFIX';
  readonly options: TypedFloorOptions;
}

export interface ROOF_8BITS_TYPED__LENGTH_PREFIX_ENCODING extends BaseEncodingDefinition {
  readonly type: EncodingType.Array;
  readonly encoding: 'ROOF_8BITS_TYPED__LENGTH_PREFIX';
  readonly options: TypedRoofOptions;
}

export interface ROOF_TYPED__LENGTH_PREFIX_ENCODING extends BaseEncodingDefinition {
  readonly type: EncodingType.Array;
  readonly encoding: 'ROOF_TYPED__LENGTH_PREFIX';
  readonly options: TypedRoofOptions;
}

export interface UNBOUNDED_TYPED__LENGTH_PREFIX_ENCODING extends BaseEncodingDefinition {
  readonly type: EncodingType.Array;
  readonly encoding: 'UNBOUNDED_TYPED__LENGTH_PREFIX';
  readonly options: TypedOptions;
}

export type ArrayEncodingNames =
  'BOUNDED_8BITS_SEMITYPED__LENGTH_PREFIX' |
  'BOUNDED_SEMITYPED__LENGTH_PREFIX' |
  'FLOOR_SEMITYPED__LENGTH_PREFIX' |
  'ROOF_8BITS_SEMITYPED__LENGTH_PREFIX' |
  'ROOF_SEMITYPED__LENGTH_PREFIX' |
  'UNBOUNDED_SEMITYPED__LENGTH_PREFIX' |
  'BOUNDED_8BITS_TYPED__LENGTH_PREFIX' |
  'BOUNDED_TYPED__LENGTH_PREFIX' |
  'FLOOR_TYPED__LENGTH_PREFIX' |
  'ROOF_8BITS_TYPED__LENGTH_PREFIX' |
  'ROOF_TYPED__LENGTH_PREFIX' |
  'UNBOUNDED_TYPED__LENGTH_PREFIX'

export type ArrayEncoding =
  BOUNDED_8BITS_SEMITYPED__LENGTH_PREFIX_ENCODING |
  BOUNDED_SEMITYPED__LENGTH_PREFIX_ENCODING |
  FLOOR_SEMITYPED__LENGTH_PREFIX_ENCODING |
  ROOF_8BITS_SEMITYPED__LENGTH_PREFIX_ENCODING |
  ROOF_SEMITYPED__LENGTH_PREFIX_ENCODING |
  UNBOUNDED_SEMITYPED__LENGTH_PREFIX_ENCODING |
  BOUNDED_8BITS_TYPED__LENGTH_PREFIX_ENCODING |
  BOUNDED_TYPED__LENGTH_PREFIX_ENCODING |
  FLOOR_TYPED__LENGTH_PREFIX_ENCODING |
  ROOF_8BITS_TYPED__LENGTH_PREFIX_ENCODING |
  ROOF_TYPED__LENGTH_PREFIX_ENCODING |
  UNBOUNDED_TYPED__LENGTH_PREFIX_ENCODING

export const getArrayEncoding = (schema: ArrayCanonicalSchema): ArrayEncoding => {
  const encodingSchema: CanonicalSchema | undefined = schema.items
  const prefixEncodings: Encoding[] =
    (schema.prefixItems ?? []).map((subschema: CanonicalSchema) => {
      return getEncoding(subschema)
    })

  if (typeof encodingSchema === 'undefined') {
    if (typeof schema.minItems !== 'undefined' &&
      typeof schema.maxItems !== 'undefined') {
      return {
        type: EncodingType.Array,
        encoding: (schema.maxItems - schema.minItems <= UINT8_MAX)
          ? 'BOUNDED_8BITS_SEMITYPED__LENGTH_PREFIX' : 'BOUNDED_SEMITYPED__LENGTH_PREFIX',
        options: {
          minimum: schema.minItems,
          maximum: schema.maxItems,
          prefixEncodings
        }
      }
    } else if (typeof schema.minItems === 'undefined' &&
      typeof schema.maxItems !== 'undefined') {
      return {
        type: EncodingType.Array,
        encoding: (schema.maxItems <= UINT8_MAX)
          ? 'ROOF_8BITS_SEMITYPED__LENGTH_PREFIX' : 'ROOF_SEMITYPED__LENGTH_PREFIX',
        options: {
          maximum: schema.maxItems,
          prefixEncodings
        }
      }
    } else if (typeof schema.minItems !== 'undefined' &&
      typeof schema.maxItems === 'undefined') {
      return {
        type: EncodingType.Array,
        encoding: 'FLOOR_SEMITYPED__LENGTH_PREFIX',
        options: {
          minimum: schema.minItems,
          prefixEncodings
        }
      }
    } else {
      return {
        type: EncodingType.Array,
        encoding: 'UNBOUNDED_SEMITYPED__LENGTH_PREFIX',
        options: {
          prefixEncodings
        }
      }
    }
  }

  if (typeof schema.minItems !== 'undefined' &&
    typeof schema.maxItems !== 'undefined') {
    return {
      type: EncodingType.Array,
      encoding: (schema.maxItems - schema.minItems <= UINT8_MAX)
        ? 'BOUNDED_8BITS_TYPED__LENGTH_PREFIX' : 'BOUNDED_TYPED__LENGTH_PREFIX',
      options: {
        minimum: schema.minItems,
        maximum: schema.maxItems,
        encoding: getEncoding(encodingSchema),
        prefixEncodings
      }
    }
  } else if (typeof schema.minItems === 'undefined' &&
    typeof schema.maxItems !== 'undefined') {
    return {
      type: EncodingType.Array,
      encoding: (schema.maxItems <= UINT8_MAX)
        ? 'ROOF_8BITS_TYPED__LENGTH_PREFIX' : 'ROOF_TYPED__LENGTH_PREFIX',
      options: {
        maximum: schema.maxItems,
        encoding: getEncoding(encodingSchema),
        prefixEncodings
      }
    }
  } else if (typeof schema.minItems !== 'undefined' &&
    typeof schema.maxItems === 'undefined') {
    return {
      type: EncodingType.Array,
      encoding: 'FLOOR_TYPED__LENGTH_PREFIX',
      options: {
        minimum: schema.minItems,
        encoding: getEncoding(encodingSchema),
        prefixEncodings
      }
    }
  } else {
    return {
      type: EncodingType.Array,
      encoding: 'UNBOUNDED_TYPED__LENGTH_PREFIX',
      options: {
        encoding: getEncoding(encodingSchema),
        prefixEncodings
      }
    }
  }
}