"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var tap_1 = __importDefault(require("tap"));
var simplifier_1 = require("../../lib/simplifier");
tap_1.default.test('should convert an integer with equal bounds to enum', function (test) {
    var schema = {
        type: 'integer',
        maximum: 3,
        minimum: 3
    };
    var result = {
        type: 'integer',
        multipleOf: 1,
        enum: [3]
    };
    test.strictSame(simplifier_1.simplifySchema(schema), result);
    test.end();
});
tap_1.default.test('should convert a number with equal bounds to enum', function (test) {
    var schema = {
        type: 'number',
        maximum: 3,
        minimum: 3
    };
    var result = {
        type: 'number',
        enum: [3]
    };
    test.strictSame(simplifier_1.simplifySchema(schema), result);
    test.end();
});
tap_1.default.test('should convert empty string to enum', function (test) {
    var schema = {
        type: 'string',
        maxLength: 0
    };
    var result = {
        type: 'string',
        minLength: 0,
        enum: ['']
    };
    test.strictSame(simplifier_1.simplifySchema(schema), result);
    test.end();
});
tap_1.default.test('should inline true dependent required keys', function (test) {
    var schema = {
        type: 'object',
        required: ['foo', 'bar'],
        dependentRequired: {
            bar: ['baz']
        }
    };
    var result = {
        type: 'object',
        additionalProperties: {},
        properties: {},
        required: ['foo', 'bar', 'baz'],
        dependentRequired: {},
        minProperties: 3
    };
    test.strictSame(simplifier_1.simplifySchema(schema), result);
    test.end();
});
tap_1.default.test('should collapse duplicate allOf branches', function (test) {
    var schema = {
        allOf: [
            {
                type: 'number'
            },
            {
                type: 'string'
            },
            {
                type: 'number'
            }
        ]
    };
    var result = {
        allOf: [
            {
                type: 'number'
            },
            {
                type: 'string',
                minLength: 0
            }
        ]
    };
    test.strictSame(simplifier_1.simplifySchema(schema), result);
    test.end();
});
