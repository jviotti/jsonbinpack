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

export const BOUNDED = (
  buffer: Buffer, offset: number,
  value: number, minimum: number, maximum: number
): void => {
  const range: number = maximum - minimum
  const bits: number = Math.ceil(Math.log(range + 1) / Math.log(2))
  const bytes: number = Math.floor((bits + 7) / 8)
  if (bytes > 0) {
    buffer.writeUIntLE(value - minimum, offset, bytes)
  }
}

export const BOUNDED_MULTIPLE = (
  buffer: Buffer, offset: number,
  value: number, minimum: number, maximum: number, multiplier: number
): void => {
  const positiveMultiplier: number = Math.abs(multiplier)
  BOUNDED(buffer, offset,
    value / positiveMultiplier,
    Math.floor(minimum / positiveMultiplier),
    Math.ceil(maximum / positiveMultiplier))
}

export const ROOF = (
  buffer: Buffer, offset: number,
  value: number, maximum: number
): void => {
  // TODO: Is this the right theoretical minumum?
  const minimum: number = -Math.pow(2, 31)
  BOUNDED(buffer, offset, value, minimum, maximum)
}

export const ROOF_MULTIPLE = (
  buffer: Buffer, offset: number,
  value: number, maximum: number, multiplier: number
): void => {
  // TODO: Is this the right theoretical minumum?
  const minimum: number = -Math.pow(2, 31)
  BOUNDED_MULTIPLE(buffer, offset, value, minimum, maximum, multiplier)
}

// export const FLOOR_POSITIVE = (value: number, minimum: number): Buffer => {

// }

// export const FLOOR_NEGATIVE = (value: number, minimum: number): Buffer => {

// }

// export const FLOOR_POSITIVE_MULTIPLE = (value: number, minimum: number, multiplier: number): Buffer => {

// }
//
// export const FLOOR_NEGATIVE_MULTIPLE = (value: number, minimum: number, multiplier: number): Buffer => {

// }

// export const ARBITRARY_MULTIPLE = (value: number, multiplier: number): Buffer => {

// }

// export const ARBITRARY = (value: number): Buffer => {

// }