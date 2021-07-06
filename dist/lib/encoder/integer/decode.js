"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ARBITRARY_MULTIPLE_ZIGZAG_VARINT = exports.ARBITRARY_ZIGZAG_VARINT = exports.ROOF_MULTIPLE_MIRROR_ENUM_VARINT = exports.ROOF_MIRROR_ENUM_VARINT = exports.FLOOR_MULTIPLE_ENUM_VARINT = exports.FLOOR_ENUM_VARINT = exports.BOUNDED_MULTIPLE_ENUM_VARINT = exports.BOUNDED_ENUM_VARINT = exports.BOUNDED_MULTIPLE_8BITS_ENUM_FIXED = exports.BOUNDED_8BITS_ENUM_FIXED = void 0;
var assert_1 = require("assert");
var limits_1 = require("../../utils/limits");
var zigzag_1 = require("./zigzag");
var varint_1 = require("./varint");
var BOUNDED_8BITS_ENUM_FIXED = function (buffer, offset, options) {
    assert_1.strict(options.maximum >= options.minimum);
    assert_1.strict(options.maximum - options.minimum <= limits_1.UINT8_MAX);
    return {
        value: buffer.readUInt8(offset) + options.minimum,
        bytes: 1
    };
};
exports.BOUNDED_8BITS_ENUM_FIXED = BOUNDED_8BITS_ENUM_FIXED;
var BOUNDED_MULTIPLE_8BITS_ENUM_FIXED = function (buffer, offset, options) {
    assert_1.strict(options.maximum >= options.minimum);
    assert_1.strict(options.multiplier >= options.minimum);
    assert_1.strict(options.multiplier <= options.maximum);
    var absoluteMultiplier = Math.abs(options.multiplier);
    var closestMinimumMultiple = Math.ceil(options.minimum / absoluteMultiplier) * absoluteMultiplier;
    return {
        value: (buffer.readUInt8(offset) * absoluteMultiplier) + closestMinimumMultiple,
        bytes: 1
    };
};
exports.BOUNDED_MULTIPLE_8BITS_ENUM_FIXED = BOUNDED_MULTIPLE_8BITS_ENUM_FIXED;
var BOUNDED_ENUM_VARINT = function (buffer, offset, options) {
    assert_1.strict(options.maximum >= options.minimum);
    var result = varint_1.varintDecode(buffer, offset);
    return {
        value: Number(result.value) + options.minimum,
        bytes: result.bytes
    };
};
exports.BOUNDED_ENUM_VARINT = BOUNDED_ENUM_VARINT;
var BOUNDED_MULTIPLE_ENUM_VARINT = function (buffer, offset, options) {
    assert_1.strict(options.maximum >= options.minimum);
    assert_1.strict(options.multiplier >= options.minimum);
    assert_1.strict(options.multiplier <= options.maximum);
    var absoluteMultiplier = Math.abs(options.multiplier);
    var closestMinimumMultiple = Math.ceil(options.minimum / absoluteMultiplier) * absoluteMultiplier;
    var result = varint_1.varintDecode(buffer, offset);
    return {
        value: (Number(result.value) * absoluteMultiplier) + closestMinimumMultiple,
        bytes: result.bytes
    };
};
exports.BOUNDED_MULTIPLE_ENUM_VARINT = BOUNDED_MULTIPLE_ENUM_VARINT;
var FLOOR_ENUM_VARINT = function (buffer, offset, options) {
    var result = varint_1.varintDecode(buffer, offset);
    return {
        value: Number(result.value) + options.minimum,
        bytes: result.bytes
    };
};
exports.FLOOR_ENUM_VARINT = FLOOR_ENUM_VARINT;
var FLOOR_MULTIPLE_ENUM_VARINT = function (buffer, offset, options) {
    assert_1.strict(options.multiplier >= options.minimum);
    var absoluteMultiplier = Math.abs(options.multiplier);
    var closestMinimumMultiple = Math.ceil(options.minimum / absoluteMultiplier) * absoluteMultiplier;
    var result = varint_1.varintDecode(buffer, offset);
    return {
        value: (Number(result.value) * absoluteMultiplier) + closestMinimumMultiple,
        bytes: result.bytes
    };
};
exports.FLOOR_MULTIPLE_ENUM_VARINT = FLOOR_MULTIPLE_ENUM_VARINT;
var ROOF_MIRROR_ENUM_VARINT = function (buffer, offset, options) {
    var result = varint_1.varintDecode(buffer, offset);
    return {
        value: -1 * (Number(result.value) - options.maximum),
        bytes: result.bytes
    };
};
exports.ROOF_MIRROR_ENUM_VARINT = ROOF_MIRROR_ENUM_VARINT;
var ROOF_MULTIPLE_MIRROR_ENUM_VARINT = function (buffer, offset, options) {
    assert_1.strict(options.maximum >= options.multiplier);
    var absoluteMultiplier = Math.abs(options.multiplier);
    var closestMaximumMultiple = Math.ceil(options.maximum / -absoluteMultiplier) * -absoluteMultiplier;
    var result = varint_1.varintDecode(buffer, offset);
    return {
        value: -1 * ((Number(result.value) * absoluteMultiplier) - closestMaximumMultiple),
        bytes: result.bytes
    };
};
exports.ROOF_MULTIPLE_MIRROR_ENUM_VARINT = ROOF_MULTIPLE_MIRROR_ENUM_VARINT;
var ARBITRARY_ZIGZAG_VARINT = function (buffer, offset, _options) {
    var result = varint_1.varintDecode(buffer, offset);
    return {
        value: Number(zigzag_1.zigzagDecode(result.value)),
        bytes: result.bytes
    };
};
exports.ARBITRARY_ZIGZAG_VARINT = ARBITRARY_ZIGZAG_VARINT;
var ARBITRARY_MULTIPLE_ZIGZAG_VARINT = function (buffer, offset, options) {
    var result = exports.ARBITRARY_ZIGZAG_VARINT(buffer, offset, {});
    return {
        value: result.value * Math.abs(options.multiplier),
        bytes: result.bytes
    };
};
exports.ARBITRARY_MULTIPLE_ZIGZAG_VARINT = ARBITRARY_MULTIPLE_ZIGZAG_VARINT;
