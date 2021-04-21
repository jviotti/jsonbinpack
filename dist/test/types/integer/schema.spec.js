"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var tap_1 = __importDefault(require("tap"));
var schema_1 = require("../../../lib/types/integer/schema");
var ENCODE_FUNCTIONS = __importStar(require("../../../lib/types/integer/encode"));
var DECODE_FUNCTIONS = __importStar(require("../../../lib/types/integer/decode"));
tap_1.default.test('the encoding enum should include all encoding functions', function (test) {
    test.strictSame(Object.values(schema_1.EncodingInteger).sort(), Object.keys(ENCODE_FUNCTIONS).sort());
    test.strictSame(Object.values(schema_1.EncodingInteger).sort(), Object.keys(DECODE_FUNCTIONS).sort());
    test.end();
});
tap_1.default.test('should encode an arbitrary integer', function (test) {
    var schema = {
        type: 'integer'
    };
    var encoding = schema_1.getIntegerEncoding(schema);
    test.is(encoding, schema_1.EncodingInteger.ARBITRARY__ZIGZAG_VARINT);
    test.end();
});
tap_1.default.test('should encode an arbitrary integer with multipleOf', function (test) {
    var schema = {
        type: 'integer',
        multipleOf: 5
    };
    var encoding = schema_1.getIntegerEncoding(schema);
    test.is(encoding, schema_1.EncodingInteger.ARBITRARY_MULTIPLE__ZIGZAG_VARINT);
    test.end();
});
tap_1.default.test('should encode an integer with minimum', function (test) {
    var schema = {
        type: 'integer',
        minimum: 0
    };
    var encoding = schema_1.getIntegerEncoding(schema);
    test.is(encoding, schema_1.EncodingInteger.FLOOR__ENUM_VARINT);
    test.end();
});
tap_1.default.test('should encode an integer with minimum and multipleOf', function (test) {
    var schema = {
        type: 'integer',
        minimum: 0,
        multipleOf: 5
    };
    var encoding = schema_1.getIntegerEncoding(schema);
    test.is(encoding, schema_1.EncodingInteger.FLOOR_MULTIPLE__ENUM_VARINT);
    test.end();
});
tap_1.default.test('should encode an integer with maximum', function (test) {
    var schema = {
        type: 'integer',
        maximum: 100
    };
    var encoding = schema_1.getIntegerEncoding(schema);
    test.is(encoding, schema_1.EncodingInteger.ROOF__MIRROR_ENUM_VARINT);
    test.end();
});
tap_1.default.test('should encode an integer with maximum and multipleOf', function (test) {
    var schema = {
        type: 'integer',
        maximum: 100,
        multipleOf: 5
    };
    var encoding = schema_1.getIntegerEncoding(schema);
    test.is(encoding, schema_1.EncodingInteger.ROOF_MULTIPLE__MIRROR_ENUM_VARINT);
    test.end();
});
tap_1.default.test('should encode an 8-bit integer with minimum and maximum', function (test) {
    var schema = {
        type: 'integer',
        minimum: -100,
        maximum: 100
    };
    var encoding = schema_1.getIntegerEncoding(schema);
    test.is(encoding, schema_1.EncodingInteger.BOUNDED_8BITS__ENUM_FIXED);
    test.end();
});
tap_1.default.test('should encode an >8-bit integer with minimum and maximum', function (test) {
    var schema = {
        type: 'integer',
        minimum: -100,
        maximum: 100000
    };
    var encoding = schema_1.getIntegerEncoding(schema);
    test.is(encoding, schema_1.EncodingInteger.BOUNDED__ENUM_VARINT);
    test.end();
});