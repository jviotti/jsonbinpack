"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var tap_1 = __importDefault(require("tap"));
var encode_1 = require("../../../lib/types/enum/encode");
var context_1 = require("../../../lib/context");
var resizable_buffer_1 = __importDefault(require("../../../lib/utils/resizable-buffer"));
tap_1.default.test('BOUNDED_CHOICE_INDEX: should encode 1 of [ 1, 0, 0 ]', function (test) {
    var context = context_1.getDefaultEncodingContext();
    var buffer = new resizable_buffer_1.default(Buffer.allocUnsafe(1));
    var bytesWritten = encode_1.BOUNDED_CHOICE_INDEX(buffer, 0, 1, {
        choices: [1, 0, 0]
    }, context);
    test.strictSame(buffer.getBuffer(), Buffer.from([0x00]));
    test.is(bytesWritten, 1);
    test.end();
});
tap_1.default.test('BOUNDED_CHOICE_INDEX: should encode 1 of [ 0, 0, 1 ]', function (test) {
    var context = context_1.getDefaultEncodingContext();
    var buffer = new resizable_buffer_1.default(Buffer.allocUnsafe(1));
    var bytesWritten = encode_1.BOUNDED_CHOICE_INDEX(buffer, 0, 1, {
        choices: [0, 0, 1]
    }, context);
    test.strictSame(buffer.getBuffer(), Buffer.from([0x02]));
    test.is(bytesWritten, 1);
    test.end();
});
tap_1.default.test('BOUNDED_CHOICE_INDEX: should encode "bar" of [ foo, bar, bar ]', function (test) {
    var context = context_1.getDefaultEncodingContext();
    var buffer = new resizable_buffer_1.default(Buffer.allocUnsafe(1));
    var bytesWritten = encode_1.BOUNDED_CHOICE_INDEX(buffer, 0, 'bar', {
        choices: ['foo', 'bar', 'bar']
    }, context);
    test.strictSame(buffer.getBuffer(), Buffer.from([0x01]));
    test.is(bytesWritten, 1);
    test.end();
});
tap_1.default.test('BOUNDED_CHOICE_INDEX: should encode handle objects', function (test) {
    var context = context_1.getDefaultEncodingContext();
    var buffer = new resizable_buffer_1.default(Buffer.allocUnsafe(1));
    var bytesWritten = encode_1.BOUNDED_CHOICE_INDEX(buffer, 0, {
        foo: 1
    }, {
        choices: [
            {
                foo: 2
            },
            {},
            [1, 2, 3],
            {
                foo: 1
            },
            {
                bar: 1
            }
        ]
    }, context);
    test.strictSame(buffer.getBuffer(), Buffer.from([0x03]));
    test.is(bytesWritten, 1);
    test.end();
});
tap_1.default.test('LARGE_BOUNDED_CHOICE_INDEX: should encode 1 of [ 1, 0, 0 ]', function (test) {
    var context = context_1.getDefaultEncodingContext();
    var buffer = new resizable_buffer_1.default(Buffer.allocUnsafe(1));
    var bytesWritten = encode_1.LARGE_BOUNDED_CHOICE_INDEX(buffer, 0, 1, {
        choices: [1, 0, 0]
    }, context);
    test.strictSame(buffer.getBuffer(), Buffer.from([0x00]));
    test.is(bytesWritten, 1);
    test.end();
});
tap_1.default.test('LARGE_BOUNDED_CHOICE_INDEX: should encode 1 of [ 0, 0, 1 ]', function (test) {
    var context = context_1.getDefaultEncodingContext();
    var buffer = new resizable_buffer_1.default(Buffer.allocUnsafe(1));
    var bytesWritten = encode_1.LARGE_BOUNDED_CHOICE_INDEX(buffer, 0, 1, {
        choices: [0, 0, 1]
    }, context);
    test.strictSame(buffer.getBuffer(), Buffer.from([0x02]));
    test.is(bytesWritten, 1);
    test.end();
});
tap_1.default.test('LARGE_BOUNDED_CHOICE_INDEX: should encode "bar" of [ foo, bar, bar ]', function (test) {
    var context = context_1.getDefaultEncodingContext();
    var buffer = new resizable_buffer_1.default(Buffer.allocUnsafe(1));
    var bytesWritten = encode_1.LARGE_BOUNDED_CHOICE_INDEX(buffer, 0, 'bar', {
        choices: ['foo', 'bar', 'bar']
    }, context);
    test.strictSame(buffer.getBuffer(), Buffer.from([0x01]));
    test.is(bytesWritten, 1);
    test.end();
});
tap_1.default.test('LARGE_BOUNDED_CHOICE_INDEX: should encode handle objects', function (test) {
    var context = context_1.getDefaultEncodingContext();
    var buffer = new resizable_buffer_1.default(Buffer.allocUnsafe(1));
    var bytesWritten = encode_1.LARGE_BOUNDED_CHOICE_INDEX(buffer, 0, {
        foo: 1
    }, {
        choices: [
            {
                foo: 2
            },
            {},
            [1, 2, 3],
            {
                foo: 1
            },
            {
                bar: 1
            }
        ]
    }, context);
    test.strictSame(buffer.getBuffer(), Buffer.from([0x03]));
    test.is(bytesWritten, 1);
    test.end();
});
