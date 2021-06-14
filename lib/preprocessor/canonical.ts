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
  pick,
  omit,
  merge,
  uniqWith,
  isEqual,
  concat,
  cloneDeep
} from 'lodash'

import {
  JSONValue,
  JSONObject,
  JSONBoolean
} from '../json'

import {
  EncodingSchema,
  BooleanEncodingSchema,
  IntegerEncodingSchema,
  NullEncodingSchema,
  NumberEncodingSchema,
  StringEncodingSchema,
  ArrayEncodingSchema,
  ObjectEncodingSchema
} from '../schema'

const SCHEMA_BOOLEAN_KEYS: Array<keyof BooleanEncodingSchema> = [ 'type' ]
const SCHEMA_INTEGER_KEYS: Array<keyof IntegerEncodingSchema> =
  [ 'type', 'minimum', 'maximum', 'multipleOf' ]
const SCHEMA_NULL_KEYS: Array<keyof NullEncodingSchema> = [ 'type' ]
const SCHEMA_NUMBER_KEYS: Array<keyof NumberEncodingSchema> = [ 'type' ]
const SCHEMA_STRING_KEYS: Array<keyof StringEncodingSchema> =
  [ 'type', 'maxLength', 'minLength', 'format', 'contentEncoding', 'contentMediaType', 'contentSchema' ]
const SCHEMA_ARRAY_KEYS: Array<keyof ArrayEncodingSchema> =
  [ 'type', 'maxItems', 'minItems', 'items', 'prefixItems' ]
const SCHEMA_OBJECT_KEYS: Array<keyof ObjectEncodingSchema> =
  [ 'type', 'additionalProperties', 'required', 'propertyNames', 'properties', 'maxProperties' ]

const SCHEMA_KEYS: Array<
  keyof BooleanEncodingSchema |
  keyof IntegerEncodingSchema |
  keyof NullEncodingSchema |
  keyof NumberEncodingSchema |
  keyof StringEncodingSchema |
  keyof ArrayEncodingSchema |
  keyof ObjectEncodingSchema
> = concat(
  SCHEMA_BOOLEAN_KEYS,
  SCHEMA_INTEGER_KEYS,
  SCHEMA_NULL_KEYS,
  SCHEMA_NUMBER_KEYS,
  SCHEMA_STRING_KEYS,
  SCHEMA_ARRAY_KEYS,
  SCHEMA_OBJECT_KEYS
)

export const canonicalizeSchema = (schema: JSONObject | JSONBoolean): EncodingSchema => {
  // We can assume this is a truthy schema as otherwise nothing
  // will match, and therefore nothing could have been encoded
  if (typeof schema === 'boolean') {
    return {}
  }

  if (typeof schema.const !== 'undefined') {
    return {
      const: schema.const
    }
  } else if (Array.isArray(schema.enum)) {
    return {
      enum: schema.enum
    }
  }

  if (Array.isArray(schema.allOf)) {
    return canonicalizeSchema(merge({}, ...schema.allOf))
  } else if (Array.isArray(schema.oneOf)) {
    const branches: EncodingSchema[] = schema.oneOf.map((choice: JSONValue) => {
      return canonicalizeSchema(merge(cloneDeep(choice), omit(schema, [ 'oneOf' ])))
    })

    // Attempt to collapse the oneOf as much as possible
    const uniqueBranches: EncodingSchema[] = uniqWith(branches, isEqual)
    if (uniqueBranches.length === 1) {
      return uniqueBranches[0]
    }

    return {
      oneOf: uniqueBranches
    }
  }

  if (Array.isArray(schema.type)) {
    return {
      oneOf: schema.type.map((type: JSONValue) => {
        return canonicalizeSchema({
          ...schema,
          type
        })
      })
    }
  }

  switch (schema.type) {
    case 'boolean': return pick(schema, SCHEMA_BOOLEAN_KEYS)
    case 'integer': return pick(schema, SCHEMA_INTEGER_KEYS)
    case 'null': return pick(schema, SCHEMA_NULL_KEYS)
    case 'number': return pick(schema, SCHEMA_NUMBER_KEYS)
    case 'string': return pick(schema, SCHEMA_STRING_KEYS)
    case 'array': return pick(schema, SCHEMA_ARRAY_KEYS)
    case 'object': return pick(schema, SCHEMA_OBJECT_KEYS)

    // The any type
    default:
      if (Object.keys(schema).length > 0) {
        const result = Object.assign({}, pick(schema, SCHEMA_KEYS), {
          type: [
            'boolean',
            'integer',
            'null',
            'number',
            'string',
            'array',
            'object'
          ]
        })

        // TODO: Workaround the canonical procedures to relax
        // additionalProperties if patternProperties is
        // defined until we properly support patternProperties
        if (typeof schema.patternProperties !== 'undefined' &&
          (typeof result.additionalProperties !== 'boolean' ||
          result.additionalProperties === false)) {
          result.additionalProperties = true
        }

        return result
      }

      return {}
  }
}
