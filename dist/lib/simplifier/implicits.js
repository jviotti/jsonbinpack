"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RULES = void 0;
var lodash_1 = require("lodash");
exports.RULES = [
    {
        id: 'implicit-type-union',
        condition: function (schema) {
            return lodash_1.intersection(Object.keys(schema), [
                'type', 'const', 'enum',
                'anyOf', 'oneOf', 'allOf', 'not', 'if', 'then', 'else',
                '$ref', '$dynamicRef'
            ]).length === 0;
        },
        transform: function (schema) {
            return Object.assign(schema, {
                type: ['null', 'boolean', 'object', 'array', 'string', 'number', 'integer']
            });
        }
    },
    {
        id: 'implicit-unit-multiple-of',
        condition: function (schema) {
            return Array.isArray(schema.type)
                ? (typeof schema.multipleOf === 'undefined' && schema.type.includes('integer'))
                : (typeof schema.multipleOf === 'undefined' && schema.type === 'integer');
        },
        transform: function (schema) {
            return Object.assign(schema, { multipleOf: 1 });
        }
    },
    {
        id: 'implicit-array-lower-bound',
        condition: function (schema) {
            return schema.type === 'array' && !('minItems' in schema);
        },
        transform: function (schema) {
            return Object.assign(schema, { minItems: 0 });
        }
    }
];
