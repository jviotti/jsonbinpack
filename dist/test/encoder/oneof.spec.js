"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var tap_1 = __importDefault(require("tap"));
var encode_1 = require("../../lib/encoder/oneof/encode");
var decode_1 = require("../../lib/encoder/oneof/decode");
var context_1 = require("../../lib/encoder/context");
var oneof_1 = require("../../lib/mapper/oneof");
var resizable_buffer_1 = __importDefault(require("../../lib/utils/resizable-buffer"));
tap_1.default.test('ONEOF_CHOICE_INDEX_PREFIX: 1/3 string encoding', function (test) {
    var context = context_1.getDefaultEncodingContext();
    var buffer = new resizable_buffer_1.default(Buffer.allocUnsafe(8));
    var schema = {
        oneOf: [
            {
                type: 'string'
            },
            {
                type: 'integer',
                maximum: 5
            },
            {
                type: 'array',
                items: {
                    type: 'string'
                }
            }
        ]
    };
    var encoding = oneof_1.getOneOfEncoding(schema);
    var options = encoding.options;
    var value = 'foobar';
    var bytesWritten = encode_1.ONEOF_CHOICE_INDEX_PREFIX(buffer, 0, value, options, context);
    var result = decode_1.ONEOF_CHOICE_INDEX_PREFIX(buffer, 0, options);
    test.is(bytesWritten, 8);
    test.is(result.bytes, bytesWritten);
    test.is(result.value, value);
    test.end();
});
tap_1.default.test('ONEOF_CHOICE_INDEX_PREFIX: 2/3 number encoding', function (test) {
    var context = context_1.getDefaultEncodingContext();
    var buffer = new resizable_buffer_1.default(Buffer.allocUnsafe(2));
    var schema = {
        oneOf: [
            {
                type: 'string'
            },
            {
                type: 'integer',
                maximum: 5
            },
            {
                type: 'array',
                items: {
                    type: 'string'
                }
            }
        ]
    };
    var encoding = oneof_1.getOneOfEncoding(schema);
    var options = encoding.options;
    var value = 4;
    var bytesWritten = encode_1.ONEOF_CHOICE_INDEX_PREFIX(buffer, 0, value, options, context);
    var result = decode_1.ONEOF_CHOICE_INDEX_PREFIX(buffer, 0, options);
    test.is(bytesWritten, 2);
    test.is(result.bytes, bytesWritten);
    test.is(result.value, value);
    test.end();
});
tap_1.default.test('ONEOF_CHOICE_INDEX_PREFIX: 3/3 array encoding', function (test) {
    var context = context_1.getDefaultEncodingContext();
    var buffer = new resizable_buffer_1.default(Buffer.allocUnsafe(9));
    var schema = {
        oneOf: [
            {
                type: 'string'
            },
            {
                type: 'integer',
                maximum: 5
            },
            {
                type: 'array',
                items: {
                    type: 'string'
                }
            }
        ]
    };
    var encoding = oneof_1.getOneOfEncoding(schema);
    var options = encoding.options;
    var value = ['foobar'];
    var bytesWritten = encode_1.ONEOF_CHOICE_INDEX_PREFIX(buffer, 0, value, options, context);
    var result = decode_1.ONEOF_CHOICE_INDEX_PREFIX(buffer, 0, options);
    test.is(bytesWritten, 9);
    test.is(result.bytes, bytesWritten);
    test.strictSame(result.value, value);
    test.end();
});
