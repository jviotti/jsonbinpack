"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var tap_1 = __importDefault(require("tap"));
var encode_1 = require("../../../lib/encoder/integer/encode");
var encoder_1 = require("../../../lib/encoder");
tap_1.default.test('BOUNDED_8BITS_ENUM_FIXED: should encode -5 (-5..-1) as 0x00', function (test) {
    var context = encoder_1.getDefaultEncodingContext();
    var buffer = new encoder_1.ResizableBuffer(Buffer.allocUnsafe(1));
    var bytesWritten = encode_1.BOUNDED_8BITS_ENUM_FIXED(buffer, 0, -5, {
        minimum: -5,
        maximum: -1
    }, context);
    test.strictSame(buffer.getBuffer(), Buffer.from([0x00]));
    test.is(bytesWritten, 1);
    test.end();
});
tap_1.default.test('BOUNDED_8BITS_ENUM_FIXED: should encode 2 (-5..5) as 0x07', function (test) {
    var context = encoder_1.getDefaultEncodingContext();
    var buffer = new encoder_1.ResizableBuffer(Buffer.allocUnsafe(1));
    var bytesWritten = encode_1.BOUNDED_8BITS_ENUM_FIXED(buffer, 0, 2, {
        minimum: -5,
        maximum: 5
    }, context);
    test.strictSame(buffer.getBuffer(), Buffer.from([0x07]));
    test.is(bytesWritten, 1);
    test.end();
});
tap_1.default.test('BOUNDED_8BITS_ENUM_FIXED: should encode 5 (2..8) as 0x03', function (test) {
    var context = encoder_1.getDefaultEncodingContext();
    var buffer = new encoder_1.ResizableBuffer(Buffer.allocUnsafe(1));
    var bytesWritten = encode_1.BOUNDED_8BITS_ENUM_FIXED(buffer, 0, 5, {
        minimum: 2,
        maximum: 8
    }, context);
    test.strictSame(buffer.getBuffer(), Buffer.from([0x03]));
    test.is(bytesWritten, 1);
    test.end();
});
tap_1.default.test('BOUNDED_MULTIPLE_8BITS_ENUM_FIXED: should encode 5 (1..19) / 5 as 0x00', function (test) {
    var context = encoder_1.getDefaultEncodingContext();
    var buffer = new encoder_1.ResizableBuffer(Buffer.allocUnsafe(1));
    var bytesWritten = encode_1.BOUNDED_MULTIPLE_8BITS_ENUM_FIXED(buffer, 0, 5, {
        minimum: 1,
        maximum: 19,
        multiplier: 5
    }, context);
    test.strictSame(buffer.getBuffer(), Buffer.from([0x00]));
    test.is(bytesWritten, 1);
    test.end();
});
tap_1.default.test('BOUNDED_MULTIPLE_8BITS_ENUM_FIXED: should encode 15 (1..19) / 5 as 0x02', function (test) {
    var context = encoder_1.getDefaultEncodingContext();
    var buffer = new encoder_1.ResizableBuffer(Buffer.allocUnsafe(1));
    var bytesWritten = encode_1.BOUNDED_MULTIPLE_8BITS_ENUM_FIXED(buffer, 0, 15, {
        minimum: 1,
        maximum: 19,
        multiplier: 5
    }, context);
    test.strictSame(buffer.getBuffer(), Buffer.from([0x02]));
    test.is(bytesWritten, 1);
    test.end();
});
tap_1.default.test('BOUNDED_MULTIPLE_ENUM_VARINT: should encode 5 (1..19) / 5 as 0x00', function (test) {
    var context = encoder_1.getDefaultEncodingContext();
    var buffer = new encoder_1.ResizableBuffer(Buffer.allocUnsafe(1));
    var bytesWritten = encode_1.BOUNDED_MULTIPLE_ENUM_VARINT(buffer, 0, 5, {
        minimum: 1,
        maximum: 19,
        multiplier: 5
    }, context);
    test.strictSame(buffer.getBuffer(), Buffer.from([0x00]));
    test.is(bytesWritten, 1);
    test.end();
});
tap_1.default.test('BOUNDED_MULTIPLE_ENUM_VARINT: should encode 1000 (-2..1500) / 4 as 0xfa 0x01', function (test) {
    var context = encoder_1.getDefaultEncodingContext();
    var buffer = new encoder_1.ResizableBuffer(Buffer.allocUnsafe(2));
    var bytesWritten = encode_1.BOUNDED_MULTIPLE_ENUM_VARINT(buffer, 0, 1000, {
        minimum: -2,
        maximum: 1500,
        multiplier: 4
    }, context);
    test.strictSame(buffer.getBuffer(), Buffer.from([0xfa, 0x01]));
    test.is(bytesWritten, 2);
    test.end();
});
tap_1.default.test('BOUNDED_MULTIPLE_ENUM_VARINT: should encode 15 (1..19) / 5 as 0x02', function (test) {
    var context = encoder_1.getDefaultEncodingContext();
    var buffer = new encoder_1.ResizableBuffer(Buffer.allocUnsafe(1));
    var bytesWritten = encode_1.BOUNDED_MULTIPLE_ENUM_VARINT(buffer, 0, 15, {
        minimum: 1,
        maximum: 19,
        multiplier: 5
    }, context);
    test.strictSame(buffer.getBuffer(), Buffer.from([0x02]));
    test.is(bytesWritten, 1);
    test.end();
});
tap_1.default.test('FLOOR_ENUM_VARINT: should encode -3 (-10..) as 0x07', function (test) {
    var context = encoder_1.getDefaultEncodingContext();
    var buffer = new encoder_1.ResizableBuffer(Buffer.allocUnsafe(1));
    var bytesWritten = encode_1.FLOOR_ENUM_VARINT(buffer, 0, -3, {
        minimum: -10
    }, context);
    test.strictSame(buffer.getBuffer(), Buffer.from([0x07]));
    test.is(bytesWritten, 1);
    test.end();
});
tap_1.default.test('FLOOR_ENUM_VARINT: should encode 5 (2..) as 0x03', function (test) {
    var context = encoder_1.getDefaultEncodingContext();
    var buffer = new encoder_1.ResizableBuffer(Buffer.allocUnsafe(1));
    var bytesWritten = encode_1.FLOOR_ENUM_VARINT(buffer, 0, 5, {
        minimum: 2
    }, context);
    test.strictSame(buffer.getBuffer(), Buffer.from([0x03]));
    test.is(bytesWritten, 1);
    test.end();
});
tap_1.default.test('FLOOR_MULTIPLE_ENUM_VARINT: should encode 10 (5..) / 5 as 0x01', function (test) {
    var context = encoder_1.getDefaultEncodingContext();
    var buffer = new encoder_1.ResizableBuffer(Buffer.allocUnsafe(1));
    var bytesWritten = encode_1.FLOOR_MULTIPLE_ENUM_VARINT(buffer, 0, 10, {
        minimum: 5,
        multiplier: 5
    }, context);
    test.strictSame(buffer.getBuffer(), Buffer.from([0x01]));
    test.is(bytesWritten, 1);
    test.end();
});
tap_1.default.test('FLOOR_MULTIPLE_ENUM_VARINT: should encode 10 (2..) / 5 as 0x01', function (test) {
    var context = encoder_1.getDefaultEncodingContext();
    var buffer = new encoder_1.ResizableBuffer(Buffer.allocUnsafe(1));
    var bytesWritten = encode_1.FLOOR_MULTIPLE_ENUM_VARINT(buffer, 0, 10, {
        minimum: 2,
        multiplier: 5
    }, context);
    test.strictSame(buffer.getBuffer(), Buffer.from([0x01]));
    test.is(bytesWritten, 1);
    test.end();
});
tap_1.default.test('ROOF_MIRROR_ENUM_VARINT: should encode -3 (..-2) as 0x01', function (test) {
    var context = encoder_1.getDefaultEncodingContext();
    var buffer = new encoder_1.ResizableBuffer(Buffer.allocUnsafe(1));
    var bytesWritten = encode_1.ROOF_MIRROR_ENUM_VARINT(buffer, 0, -3, {
        maximum: -2
    }, context);
    test.strictSame(buffer.getBuffer(), Buffer.from([0x01]));
    test.is(bytesWritten, 1);
    test.end();
});
tap_1.default.test('ROOF_MIRROR_ENUM_VARINT: should encode 8 (..10) as 0x02', function (test) {
    var context = encoder_1.getDefaultEncodingContext();
    var buffer = new encoder_1.ResizableBuffer(Buffer.allocUnsafe(1));
    var bytesWritten = encode_1.ROOF_MIRROR_ENUM_VARINT(buffer, 0, 8, {
        maximum: 10
    }, context);
    test.strictSame(buffer.getBuffer(), Buffer.from([0x02]));
    test.is(bytesWritten, 1);
    test.end();
});
tap_1.default.test('ROOF_MULTIPLE_MIRROR_ENUM_VARINT: should encode -15 (..-5) / -5 as 0x02', function (test) {
    var context = encoder_1.getDefaultEncodingContext();
    var buffer = new encoder_1.ResizableBuffer(Buffer.allocUnsafe(1));
    var bytesWritten = encode_1.ROOF_MULTIPLE_MIRROR_ENUM_VARINT(buffer, 0, -15, {
        maximum: -5,
        multiplier: -5
    }, context);
    test.strictSame(buffer.getBuffer(), Buffer.from([0x02]));
    test.is(bytesWritten, 1);
    test.end();
});
tap_1.default.test('ROOF_MULTIPLE_MIRROR_ENUM_VARINT: should encode 5 (..16) / 5 as 0x02', function (test) {
    var context = encoder_1.getDefaultEncodingContext();
    var buffer = new encoder_1.ResizableBuffer(Buffer.allocUnsafe(1));
    var bytesWritten = encode_1.ROOF_MULTIPLE_MIRROR_ENUM_VARINT(buffer, 0, 5, {
        maximum: 16,
        multiplier: 5
    }, context);
    test.strictSame(buffer.getBuffer(), Buffer.from([0x02]));
    test.is(bytesWritten, 1);
    test.end();
});
tap_1.default.test('ROOF_MULTIPLE_MIRROR_ENUM_VARINT: should encode 10 (..15) / 5 as 0x01', function (test) {
    var context = encoder_1.getDefaultEncodingContext();
    var buffer = new encoder_1.ResizableBuffer(Buffer.allocUnsafe(1));
    var bytesWritten = encode_1.ROOF_MULTIPLE_MIRROR_ENUM_VARINT(buffer, 0, 10, {
        maximum: 15,
        multiplier: 5
    }, context);
    test.strictSame(buffer.getBuffer(), Buffer.from([0x01]));
    test.is(bytesWritten, 1);
    test.end();
});
tap_1.default.test('ROOF_MULTIPLE_MIRROR_ENUM_VARINT: should encode 10 (..15) / -5 as 0x01', function (test) {
    var context = encoder_1.getDefaultEncodingContext();
    var buffer = new encoder_1.ResizableBuffer(Buffer.allocUnsafe(1));
    var bytesWritten = encode_1.ROOF_MULTIPLE_MIRROR_ENUM_VARINT(buffer, 0, 10, {
        maximum: 15,
        multiplier: -5
    }, context);
    test.strictSame(buffer.getBuffer(), Buffer.from([0x01]));
    test.is(bytesWritten, 1);
    test.end();
});
tap_1.default.test('ARBITRARY_ZIGZAG_VARINT: should encode -25200 as 0xdf 0x89 0x03', function (test) {
    var context = encoder_1.getDefaultEncodingContext();
    var buffer = new encoder_1.ResizableBuffer(Buffer.allocUnsafe(3));
    var bytesWritten = encode_1.ARBITRARY_ZIGZAG_VARINT(buffer, 0, -25200, {}, context);
    test.strictSame(buffer.getBuffer(), Buffer.from([0xdf, 0x89, 0x03]));
    test.is(bytesWritten, 3);
    test.end();
});
tap_1.default.test('ARBITRARY_MULTIPLE_ZIGZAG_VARINT: should encode 10 / 5  as 0x04', function (test) {
    var context = encoder_1.getDefaultEncodingContext();
    var buffer = new encoder_1.ResizableBuffer(Buffer.allocUnsafe(1));
    var bytesWritten = encode_1.ARBITRARY_MULTIPLE_ZIGZAG_VARINT(buffer, 0, 10, {
        multiplier: 5
    }, context);
    test.strictSame(buffer.getBuffer(), Buffer.from([0x04]));
    test.is(bytesWritten, 1);
    test.end();
});
