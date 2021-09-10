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
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var tap_1 = __importDefault(require("tap"));
var fc = __importStar(require("fast-check"));
var encode_1 = require("../../lib/encoder/integer/encode");
var decode_1 = require("../../lib/encoder/integer/decode");
var limits_1 = require("../../lib/utils/limits");
var encoder_1 = require("../../lib/encoder");
tap_1.default.test('BOUNDED_MULTIPLE_8BITS_ENUM_FIXED', function (test) {
    var arbitrary = fc.integer().chain(function (minimum) {
        return fc.tuple(fc.nat(10), fc.constant(minimum), fc.integer(minimum, minimum + limits_1.UINT8_MAX), fc.integer(minimum, minimum + limits_1.UINT8_MAX));
    });
    fc.assert(fc.property(arbitrary, function (_a) {
        var _b = __read(_a, 4), offset = _b[0], minimum = _b[1], maximum = _b[2], value = _b[3];
        fc.pre(value <= maximum);
        var context = encoder_1.getDefaultEncodingContext();
        var buffer = new encoder_1.ResizableBuffer(Buffer.allocUnsafe(offset + 1));
        var bytesWritten = encode_1.BOUNDED_MULTIPLE_8BITS_ENUM_FIXED(buffer, offset, value, {
            minimum: minimum, maximum: maximum,
            multiplier: 1
        }, context);
        var result = decode_1.BOUNDED_MULTIPLE_8BITS_ENUM_FIXED(buffer, offset, {
            minimum: minimum, maximum: maximum,
            multiplier: 1
        });
        return bytesWritten === 1 && result.bytes === bytesWritten && result.value === value;
    }), {
        verbose: false
    });
    test.end();
});
tap_1.default.test('BOUNDED_MULTIPLE_8BITS_ENUM_FIXED', function (test) {
    var arbitrary = fc.integer().chain(function (minimum) {
        return fc.integer(minimum, minimum + limits_1.UINT8_MAX).chain(function (maximum) {
            return fc.tuple(fc.nat(10), fc.constant(minimum), fc.constant(maximum), fc.integer(minimum, maximum), fc.integer(minimum, maximum));
        });
    });
    fc.assert(fc.property(arbitrary, function (_a) {
        var _b = __read(_a, 5), offset = _b[0], minimum = _b[1], maximum = _b[2], value = _b[3], multiplier = _b[4];
        fc.pre(value % multiplier === 0);
        var context = encoder_1.getDefaultEncodingContext();
        var buffer = new encoder_1.ResizableBuffer(Buffer.allocUnsafe(offset + 1));
        var bytesWritten = encode_1.BOUNDED_MULTIPLE_8BITS_ENUM_FIXED(buffer, offset, value, {
            minimum: minimum, maximum: maximum, multiplier: multiplier
        }, context);
        var result = decode_1.BOUNDED_MULTIPLE_8BITS_ENUM_FIXED(buffer, offset, {
            minimum: minimum, maximum: maximum, multiplier: multiplier
        });
        return bytesWritten > 0 && result.bytes === bytesWritten && result.value === value;
    }), {
        verbose: false
    });
    test.end();
});
tap_1.default.test('FLOOR_MULTIPLE_ENUM_VARINT: should encode 696667952522107300000', function (test) {
    var context = encoder_1.getDefaultEncodingContext();
    var buffer = new encoder_1.ResizableBuffer(Buffer.allocUnsafe(60));
    var value = 696667952522107300000;
    var bytesWritten = encode_1.FLOOR_MULTIPLE_ENUM_VARINT(buffer, 0, value, {
        minimum: 0,
        multiplier: 1
    }, context);
    var result = decode_1.FLOOR_MULTIPLE_ENUM_VARINT(buffer, 0, {
        minimum: 0,
        multiplier: 1
    });
    test.is(bytesWritten, result.bytes);
    test.is(result.value, value);
    test.end();
});
tap_1.default.test('FLOOR_MULTIPLE_ENUM_VARINT', function (test) {
    fc.assert(fc.property(fc.nat(10), fc.integer(), fc.integer(), function (offset, value, minimum) {
        fc.pre(value >= minimum);
        var context = encoder_1.getDefaultEncodingContext();
        var buffer = new encoder_1.ResizableBuffer(Buffer.allocUnsafe(offset + 8));
        var bytesWritten = encode_1.FLOOR_MULTIPLE_ENUM_VARINT(buffer, offset, value, {
            minimum: minimum,
            multiplier: 1
        }, context);
        var result = decode_1.FLOOR_MULTIPLE_ENUM_VARINT(buffer, offset, {
            minimum: minimum,
            multiplier: 1
        });
        return bytesWritten > 0 && result.bytes === bytesWritten && result.value === value;
    }), {
        verbose: false
    });
    test.end();
});
tap_1.default.test('FLOOR_MULTIPLE_ENUM_VARINT', function (test) {
    var arbitrary = fc.integer().chain(function (minimum) {
        return fc.tuple(fc.nat(10), fc.constant(minimum), fc.integer({
            min: minimum
        }), fc.integer({
            min: minimum
        }));
    });
    fc.assert(fc.property(arbitrary, function (_a) {
        var _b = __read(_a, 4), offset = _b[0], minimum = _b[1], value = _b[2], multiplier = _b[3];
        fc.pre(value % multiplier === 0);
        var context = encoder_1.getDefaultEncodingContext();
        var buffer = new encoder_1.ResizableBuffer(Buffer.allocUnsafe(offset + 8));
        var bytesWritten = encode_1.FLOOR_MULTIPLE_ENUM_VARINT(buffer, offset, value, {
            minimum: minimum, multiplier: multiplier
        }, context);
        var result = decode_1.FLOOR_MULTIPLE_ENUM_VARINT(buffer, offset, {
            minimum: minimum, multiplier: multiplier
        });
        return bytesWritten > 0 && result.bytes === bytesWritten && result.value === value;
    }), {
        verbose: false
    });
    test.end();
});
tap_1.default.test('ROOF_MULTIPLE_MIRROR_ENUM_VARINT', function (test) {
    fc.assert(fc.property(fc.nat(10), fc.integer(), fc.integer(), function (offset, value, maximum) {
        fc.pre(value <= maximum);
        var context = encoder_1.getDefaultEncodingContext();
        var buffer = new encoder_1.ResizableBuffer(Buffer.allocUnsafe(offset + 8));
        var bytesWritten = encode_1.ROOF_MULTIPLE_MIRROR_ENUM_VARINT(buffer, offset, value, {
            maximum: maximum,
            multiplier: 1
        }, context);
        var result = decode_1.ROOF_MULTIPLE_MIRROR_ENUM_VARINT(buffer, offset, {
            maximum: maximum,
            multiplier: 1
        });
        return bytesWritten > 0 && result.bytes === bytesWritten && result.value === value;
    }), {
        verbose: false
    });
    test.end();
});
tap_1.default.test('ROOF_MULTIPLE_MIRROR_ENUM_VARINT', function (test) {
    var arbitrary = fc.integer().chain(function (maximum) {
        return fc.tuple(fc.nat(10), fc.constant(maximum), fc.integer({
            max: maximum
        }), fc.integer({
            max: maximum
        }));
    });
    fc.assert(fc.property(arbitrary, function (_a) {
        var _b = __read(_a, 4), offset = _b[0], maximum = _b[1], value = _b[2], multiplier = _b[3];
        fc.pre(value % multiplier === 0);
        var context = encoder_1.getDefaultEncodingContext();
        var buffer = new encoder_1.ResizableBuffer(Buffer.allocUnsafe(offset + 8));
        var bytesWritten = encode_1.ROOF_MULTIPLE_MIRROR_ENUM_VARINT(buffer, offset, value, {
            maximum: maximum, multiplier: multiplier
        }, context);
        var result = decode_1.ROOF_MULTIPLE_MIRROR_ENUM_VARINT(buffer, offset, {
            maximum: maximum, multiplier: multiplier
        });
        return bytesWritten > 0 && result.bytes === bytesWritten && result.value === value;
    }), {
        verbose: false
    });
    test.end();
});
tap_1.default.test('ARBITRARY_MULTIPLE_ZIGZAG_VARINT with multiplier 1', function (test) {
    fc.assert(fc.property(fc.nat(10), fc.integer(), function (offset, value) {
        var context = encoder_1.getDefaultEncodingContext();
        var buffer = new encoder_1.ResizableBuffer(Buffer.allocUnsafe(offset + 8));
        var bytesWritten = encode_1.ARBITRARY_MULTIPLE_ZIGZAG_VARINT(buffer, offset, value, { multiplier: 1 }, context);
        var result = decode_1.ARBITRARY_MULTIPLE_ZIGZAG_VARINT(buffer, offset, { multiplier: 1 });
        return bytesWritten > 0 && result.bytes === bytesWritten && result.value === value;
    }), {
        verbose: false
    });
    test.end();
});
tap_1.default.test('ARBITRARY_MULTIPLE_ZIGZAG_VARINT', function (test) {
    fc.assert(fc.property(fc.nat(10), fc.integer(), fc.integer(), function (offset, value, multiplier) {
        fc.pre(value % multiplier === 0);
        var context = encoder_1.getDefaultEncodingContext();
        var buffer = new encoder_1.ResizableBuffer(Buffer.allocUnsafe(offset + 8));
        var bytesWritten = encode_1.ARBITRARY_MULTIPLE_ZIGZAG_VARINT(buffer, offset, value, {
            multiplier: multiplier
        }, context);
        var result = decode_1.ARBITRARY_MULTIPLE_ZIGZAG_VARINT(buffer, offset, {
            multiplier: multiplier
        });
        return bytesWritten > 0 && result.bytes === bytesWritten && result.value === value;
    }), {
        verbose: false
    });
    test.end();
});
