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
  JSONBoolean
} from '../json'

import {
  ObjectSchema
} from '../jsonschema'

import {
  SimplificationRule
} from './rule'

export const RULES: SimplificationRule[] = [
  {
    id: 'null-as-const',
    condition: (schema: ObjectSchema): JSONBoolean => {
      return schema.type === 'null'
    },
    transform: (_schema: ObjectSchema): ObjectSchema => {
      return {
        const: null
      }
    }
  },
  {
    id: 'exclusive-minimum-to-minimum',
    condition: (schema: ObjectSchema): JSONBoolean => {
      return typeof schema.exclusiveMinimum !== 'undefined'
    },
    transform: (schema: ObjectSchema): ObjectSchema => {
      const minimum: number = Math.max(
        (schema.exclusiveMinimum ?? -Infinity) + 1,
        schema.minimum ?? -Infinity)
      Reflect.deleteProperty(schema, 'exclusiveMinimum')
      return Object.assign(schema, { minimum })
    }
  },
  {
    id: 'exclusive-maximum-to-maximum',
    condition: (schema: ObjectSchema): JSONBoolean => {
      return typeof schema.exclusiveMaximum !== 'undefined'
    },
    transform: (schema: ObjectSchema): ObjectSchema => {
      const maximum: number = Math.max(
        (schema.exclusiveMaximum ?? Infinity) - 1,
        schema.maximum ?? Infinity)
      Reflect.deleteProperty(schema, 'exclusiveMaximum')
      return Object.assign(schema, { maximum })
    }
  }
]
