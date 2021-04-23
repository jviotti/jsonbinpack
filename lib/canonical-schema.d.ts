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

export interface BooleanCanonicalSchema {
  readonly type: 'boolean';
}

export interface IntegerCanonicalSchema {
  readonly type: 'integer';

  // The exclusiveMinimum and exclusiveMaximum keywords
  // should be transformed to minimum and maximum
  readonly minimum?: number;
  readonly maximum?: number;

  readonly multipleOf?: number;
}

export interface NullCanonicalSchema {
  readonly type: 'null';
}

export interface NumberCanonicalSchema {
  readonly type: 'number';

  /*
   * For now we don't take these schema arguments into
   * consideration, but we might in the future if we
   * implement different real number encodings.
   */

  // The exclusiveMinimum and exclusiveMaximum keywords
  // should be transformed to minimum and maximum
  readonly minimum?: number;
  readonly maximum?: number;

  readonly multipleOf?: number;
}

export interface StringCanonicalSchema {
  readonly type: 'string';
  readonly maxLength?: number;
  readonly minLength?: number;

  // See http://json-schema.org/draft/2020-12/json-schema-validation.html#rfc.section.7.3
  // TODO: We can use these in the future to apply more clever encodings
  readonly format?:
    'date-time' | 'date' | 'time' | 'duration' |
    'email' | 'idn-email' |
    'hostname' | 'idn-hostname' |
    'ipv4' | 'ipv6' |
    'uri' | 'uri-reference' | 'iri' | 'iri-reference' | 'uuid' |
    'uri-template' |
    'json-pointer' | 'relative-json-pointer' |
    'regex';

  readonly pattern?: string;

  // TODO: We can use these in the future to apply more clever encodings
  readonly contentEncoding?: string;
  readonly contentMediaType?: string;
  readonly contentSchema?: CanonicalSchema;
}

export type CanonicalSchema =
  BooleanCanonicalSchema |
  IntegerCanonicalSchema |
  NullCanonicalSchema |
  NumberCanonicalSchema |
  StringCanonicalSchema