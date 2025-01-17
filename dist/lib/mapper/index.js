"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getStates = exports.getEncoding = void 0;
var assert_1 = require("assert");
var number_1 = require("./number");
var integer_1 = require("./integer");
var string_1 = require("./string");
var any_1 = require("./any");
var array_1 = require("./array");
var object_1 = require("./object");
var enum_1 = require("./enum");
var oneof_1 = require("./oneof");
var getEncoding = function (schema, level) {
    assert_1.strict(typeof schema !== 'boolean');
    if ('enum' in schema) {
        return enum_1.getEnumEncoding(schema, level);
    }
    else if ('oneOf' in schema) {
        return oneof_1.getOneOfEncoding(schema, level);
    }
    else if (!('type' in schema)) {
        return any_1.getAnyEncoding(schema, level);
    }
    else if (schema.type === 'boolean') {
        return enum_1.getEnumEncoding({
            enum: [false, true]
        }, level);
    }
    else if (schema.type === 'integer') {
        return integer_1.getIntegerEncoding(schema, level);
    }
    else if (schema.type === 'number') {
        return number_1.getNumberEncoding(schema, level);
    }
    else if (schema.type === 'string') {
        return string_1.getStringEncoding(schema, level);
    }
    else if (schema.type === 'array') {
        return array_1.getArrayEncoding(schema, level);
    }
    return object_1.getObjectEncoding(schema, level);
};
exports.getEncoding = getEncoding;
var getStates = function (schema) {
    if ('enum' in schema) {
        return enum_1.getEnumStates(schema);
    }
    else if ('oneOf' in schema) {
        return oneof_1.getOneOfStates(schema);
    }
    else if (!('type' in schema)) {
        return any_1.getAnyStates(schema);
    }
    else if (schema.type === 'boolean') {
        return enum_1.getEnumStates({
            enum: [false, true]
        });
    }
    else if (schema.type === 'integer') {
        return integer_1.getIntegerStates(schema);
    }
    else if (schema.type === 'number') {
        return number_1.getNumberStates(schema);
    }
    else if (schema.type === 'string') {
        return string_1.getStringStates(schema);
    }
    else if (schema.type === 'array') {
        return array_1.getArrayStates(schema);
    }
    return object_1.getObjectStates(schema);
};
exports.getStates = getStates;
