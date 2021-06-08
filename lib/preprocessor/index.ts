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
  EncodingSchema
} from '../schema'

import {
  JSONObject,
  JSONBoolean
} from '../json'

import {
  JSONSchema,
  dereferenceSchema
} from './deref'

import {
  canonicalizeSchema
} from './canonical'

export {
  JSONSchema
} from './deref'

export const preprocessSchema = async (schema: JSONSchema): Promise<EncodingSchema> => {
  const localSchema: JSONSchema = await dereferenceSchema(schema)
  // TODO: Find a way to make this cast in a better way
  // @ts-ignore
  const castedSchema: JSONObject | JSONBoolean = localSchema
  return canonicalizeSchema(castedSchema)
}
