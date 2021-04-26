"use strict";
var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UNBOUNDED_UNTYPED__LENGTH_PREFIX = exports.ROOF_UNTYPED__LENGTH_PREFIX = exports.FLOOR_UNTYPED__LENGTH_PREFIX = exports.BOUNDED_UNTYPED__LENGTH_PREFIX = void 0;
var assert_1 = require("assert");
var encode_1 = require("../integer/encode");
var encode_2 = require("../any/encode");
var BOUNDED_UNTYPED__LENGTH_PREFIX = function (buffer, offset, value, options) {
    var e_1, _a;
    assert_1.strict(options.maximum >= 0);
    assert_1.strict(options.minimum >= 0);
    assert_1.strict(options.maximum >= options.minimum);
    assert_1.strict(value.length >= options.minimum);
    assert_1.strict(value.length <= options.maximum);
    var lengthBytes = encode_1.BOUNDED__ENUM_VARINT(buffer, offset, value.length, {
        minimum: options.minimum,
        maximum: options.maximum
    });
    var bytesWritten = lengthBytes;
    try {
        for (var value_1 = __values(value), value_1_1 = value_1.next(); !value_1_1.done; value_1_1 = value_1.next()) {
            var element = value_1_1.value;
            var elementBytes = encode_2.ANY__TYPE_PREFIX(buffer, offset + bytesWritten, element, {});
            bytesWritten += elementBytes;
        }
    }
    catch (e_1_1) { e_1 = { error: e_1_1 }; }
    finally {
        try {
            if (value_1_1 && !value_1_1.done && (_a = value_1.return)) _a.call(value_1);
        }
        finally { if (e_1) throw e_1.error; }
    }
    return bytesWritten;
};
exports.BOUNDED_UNTYPED__LENGTH_PREFIX = BOUNDED_UNTYPED__LENGTH_PREFIX;
var FLOOR_UNTYPED__LENGTH_PREFIX = function (buffer, offset, value, options) {
    var e_2, _a;
    assert_1.strict(options.minimum >= 0);
    assert_1.strict(value.length >= options.minimum);
    var lengthBytes = encode_1.FLOOR__ENUM_VARINT(buffer, offset, value.length, options);
    var bytesWritten = lengthBytes;
    try {
        for (var value_2 = __values(value), value_2_1 = value_2.next(); !value_2_1.done; value_2_1 = value_2.next()) {
            var element = value_2_1.value;
            var elementBytes = encode_2.ANY__TYPE_PREFIX(buffer, offset + bytesWritten, element, {});
            bytesWritten += elementBytes;
        }
    }
    catch (e_2_1) { e_2 = { error: e_2_1 }; }
    finally {
        try {
            if (value_2_1 && !value_2_1.done && (_a = value_2.return)) _a.call(value_2);
        }
        finally { if (e_2) throw e_2.error; }
    }
    return bytesWritten;
};
exports.FLOOR_UNTYPED__LENGTH_PREFIX = FLOOR_UNTYPED__LENGTH_PREFIX;
var ROOF_UNTYPED__LENGTH_PREFIX = function (buffer, offset, value, options) {
    assert_1.strict(options.maximum >= 0);
    assert_1.strict(value.length <= options.maximum);
    return exports.BOUNDED_UNTYPED__LENGTH_PREFIX(buffer, offset, value, {
        minimum: 0,
        maximum: options.maximum
    });
};
exports.ROOF_UNTYPED__LENGTH_PREFIX = ROOF_UNTYPED__LENGTH_PREFIX;
var UNBOUNDED_UNTYPED__LENGTH_PREFIX = function (buffer, offset, value, _options) {
    return exports.FLOOR_UNTYPED__LENGTH_PREFIX(buffer, offset, value, {
        minimum: 0
    });
};
exports.UNBOUNDED_UNTYPED__LENGTH_PREFIX = UNBOUNDED_UNTYPED__LENGTH_PREFIX;
