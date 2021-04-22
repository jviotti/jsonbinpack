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
var mapper_1 = require("../../../lib/types/string/mapper");
var ENCODE_FUNCTIONS = __importStar(require("../../../lib/types/string/encode"));
var DECODE_FUNCTIONS = __importStar(require("../../../lib/types/string/decode"));
tap_1.default.test('the encoding enum should include all encoding functions', function (test) {
    test.strictSame(Object.values(mapper_1.StringEncoding).sort(), Object.keys(ENCODE_FUNCTIONS).sort());
    test.strictSame(Object.values(mapper_1.StringEncoding).sort(), Object.keys(DECODE_FUNCTIONS).sort());
    test.end();
});
tap_1.default.test('should encode a simple string', function (test) {
    var schema = {
        type: 'string'
    };
    var encoding = mapper_1.getStringEncoding(schema);
    test.is(encoding, mapper_1.StringEncoding.ARBITRARY__PREFIX_LENGTH_VARINT);
    test.end();
});
tap_1.default.test('should encode a string with minLength', function (test) {
    var schema = {
        type: 'string',
        minLength: 5
    };
    var encoding = mapper_1.getStringEncoding(schema);
    test.is(encoding, mapper_1.StringEncoding.FLOOR__PREFIX_LENGTH_ENUM_VARINT);
    test.end();
});
tap_1.default.test('should encode a string with maxLength >= 255', function (test) {
    var schema = {
        type: 'string',
        maxLength: 256
    };
    var encoding = mapper_1.getStringEncoding(schema);
    test.is(encoding, mapper_1.StringEncoding.ROOF__PREFIX_LENGTH_ENUM_VARINT);
    test.end();
});
tap_1.default.test('should encode a string with maxLength < 255', function (test) {
    var schema = {
        type: 'string',
        maxLength: 254
    };
    var encoding = mapper_1.getStringEncoding(schema);
    test.is(encoding, mapper_1.StringEncoding.ROOF__PREFIX_LENGTH_8BIT_FIXED);
    test.end();
});
tap_1.default.test('should encode a string with maxLength = 255', function (test) {
    var schema = {
        type: 'string',
        maxLength: 255
    };
    var encoding = mapper_1.getStringEncoding(schema);
    test.is(encoding, mapper_1.StringEncoding.ROOF__PREFIX_LENGTH_8BIT_FIXED);
    test.end();
});
tap_1.default.test('should encode a string with minLength and maxLength < 255', function (test) {
    var schema = {
        type: 'string',
        minLength: 100,
        maxLength: 300
    };
    var encoding = mapper_1.getStringEncoding(schema);
    test.is(encoding, mapper_1.StringEncoding.BOUNDED__PREFIX_LENGTH_8BIT_FIXED);
    test.end();
});
tap_1.default.test('should encode a string with minLength and maxLength > 255', function (test) {
    var schema = {
        type: 'string',
        minLength: 100,
        maxLength: 600
    };
    var encoding = mapper_1.getStringEncoding(schema);
    test.is(encoding, mapper_1.StringEncoding.BOUNDED__PREFIX_LENGTH_ENUM_VARINT);
    test.end();
});
