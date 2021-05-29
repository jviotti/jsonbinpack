"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var tap_1 = __importDefault(require("tap"));
var encode_1 = require("../../../lib/types/oneof/encode");
var resizable_buffer_1 = __importDefault(require("../../../lib/utils/resizable-buffer"));
var context_1 = require("../../../lib/context");
var oneof_1 = require("../../../lib/mapper/oneof");
tap_1.default.test('ONEOF_CHOICE_INDEX_PREFIX: should encode a value matching choice 1 of 3', function (test) {
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
    test.is(bytesWritten, 8);
    test.strictSame(buffer.getBuffer(), Buffer.from([
        0x00,
        0x07,
        0x66, 0x6f, 0x6f, 0x62, 0x61, 0x72
    ]));
    test.end();
});
tap_1.default.test('ONEOF_CHOICE_INDEX_PREFIX: should encode a value matching choice 2 of 3', function (test) {
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
    test.is(bytesWritten, 2);
    test.strictSame(buffer.getBuffer(), Buffer.from([
        0x01,
        0x01
    ]));
    test.end();
});
tap_1.default.test('ONEOF_CHOICE_INDEX_PREFIX: should encode a value matching choice 3 of 3', function (test) {
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
    test.is(bytesWritten, 9);
    test.strictSame(buffer.getBuffer(), Buffer.from([
        0x02,
        0x01,
        0x07,
        0x66, 0x6f, 0x6f, 0x62, 0x61, 0x72
    ]));
    test.end();
});
