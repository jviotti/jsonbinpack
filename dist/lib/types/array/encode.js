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
Object.defineProperty(exports, "__esModule", { value: true });
exports.UNBOUNDED_SEMITYPED__LENGTH_PREFIX = exports.ROOF_8BITS_SEMITYPED__LENGTH_PREFIX = exports.ROOF_SEMITYPED__LENGTH_PREFIX = exports.FLOOR_SEMITYPED__LENGTH_PREFIX = exports.BOUNDED_SEMITYPED__LENGTH_PREFIX = exports.BOUNDED_8BITS_SEMITYPED__LENGTH_PREFIX = exports.UNBOUNDED_TYPED__LENGTH_PREFIX = exports.FLOOR_TYPED__LENGTH_PREFIX = exports.ROOF_TYPED__LENGTH_PREFIX = exports.ROOF_8BITS_TYPED__LENGTH_PREFIX = exports.BOUNDED_TYPED__LENGTH_PREFIX = exports.BOUNDED_8BITS_TYPED__LENGTH_PREFIX = exports.UNBOUNDED_UNTYPED__LENGTH_PREFIX = exports.ROOF_UNTYPED__LENGTH_PREFIX = exports.ROOF_8BITS_UNTYPED__LENGTH_PREFIX = exports.FLOOR_UNTYPED__LENGTH_PREFIX = exports.BOUNDED_UNTYPED__LENGTH_PREFIX = exports.BOUNDED_8BITS_UNTYPED__LENGTH_PREFIX = void 0;
var assert_1 = require("assert");
var limits_1 = require("../../utils/limits");
var encoder_1 = require("../../encoder");
var encode_1 = require("../integer/encode");
var encode_2 = require("../any/encode");
var BOUNDED_8BITS_UNTYPED__LENGTH_PREFIX = function (buffer, offset, value, options) {
    var e_1, _a;
    assert_1.strict(options.maximum >= 0);
    assert_1.strict(options.minimum >= 0);
    assert_1.strict(options.maximum >= options.minimum);
    assert_1.strict(value.length >= options.minimum);
    assert_1.strict(value.length <= options.maximum);
    assert_1.strict(options.maximum - options.minimum <= limits_1.UINT8_MAX);
    var lengthBytes = encode_1.BOUNDED_8BITS__ENUM_FIXED(buffer, offset, value.length, {
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
exports.BOUNDED_8BITS_UNTYPED__LENGTH_PREFIX = BOUNDED_8BITS_UNTYPED__LENGTH_PREFIX;
var BOUNDED_UNTYPED__LENGTH_PREFIX = function (buffer, offset, value, options) {
    var e_2, _a;
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
exports.BOUNDED_UNTYPED__LENGTH_PREFIX = BOUNDED_UNTYPED__LENGTH_PREFIX;
var FLOOR_UNTYPED__LENGTH_PREFIX = function (buffer, offset, value, options) {
    var e_3, _a;
    assert_1.strict(options.minimum >= 0);
    assert_1.strict(value.length >= options.minimum);
    var lengthBytes = encode_1.FLOOR__ENUM_VARINT(buffer, offset, value.length, options);
    var bytesWritten = lengthBytes;
    try {
        for (var value_3 = __values(value), value_3_1 = value_3.next(); !value_3_1.done; value_3_1 = value_3.next()) {
            var element = value_3_1.value;
            var elementBytes = encode_2.ANY__TYPE_PREFIX(buffer, offset + bytesWritten, element, {});
            bytesWritten += elementBytes;
        }
    }
    catch (e_3_1) { e_3 = { error: e_3_1 }; }
    finally {
        try {
            if (value_3_1 && !value_3_1.done && (_a = value_3.return)) _a.call(value_3);
        }
        finally { if (e_3) throw e_3.error; }
    }
    return bytesWritten;
};
exports.FLOOR_UNTYPED__LENGTH_PREFIX = FLOOR_UNTYPED__LENGTH_PREFIX;
var ROOF_8BITS_UNTYPED__LENGTH_PREFIX = function (buffer, offset, value, options) {
    assert_1.strict(options.maximum >= 0);
    assert_1.strict(value.length <= options.maximum);
    assert_1.strict(options.maximum <= limits_1.UINT8_MAX);
    return exports.BOUNDED_8BITS_UNTYPED__LENGTH_PREFIX(buffer, offset, value, {
        minimum: 0,
        maximum: options.maximum
    });
};
exports.ROOF_8BITS_UNTYPED__LENGTH_PREFIX = ROOF_8BITS_UNTYPED__LENGTH_PREFIX;
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
var BOUNDED_8BITS_TYPED__LENGTH_PREFIX = function (buffer, offset, value, options) {
    var e_4, _a;
    assert_1.strict(options.maximum >= 0);
    assert_1.strict(options.minimum >= 0);
    assert_1.strict(options.maximum >= options.minimum);
    assert_1.strict(value.length >= options.minimum);
    assert_1.strict(value.length <= options.maximum);
    assert_1.strict(options.maximum - options.minimum <= limits_1.UINT8_MAX);
    var lengthBytes = encode_1.BOUNDED_8BITS__ENUM_FIXED(buffer, offset, value.length, {
        minimum: options.minimum,
        maximum: options.maximum
    });
    var bytesWritten = lengthBytes;
    try {
        for (var value_4 = __values(value), value_4_1 = value_4.next(); !value_4_1.done; value_4_1 = value_4.next()) {
            var element = value_4_1.value;
            var elementBytes = encoder_1.encode(buffer, offset + bytesWritten, options.encoding, element);
            bytesWritten += elementBytes;
        }
    }
    catch (e_4_1) { e_4 = { error: e_4_1 }; }
    finally {
        try {
            if (value_4_1 && !value_4_1.done && (_a = value_4.return)) _a.call(value_4);
        }
        finally { if (e_4) throw e_4.error; }
    }
    return bytesWritten;
};
exports.BOUNDED_8BITS_TYPED__LENGTH_PREFIX = BOUNDED_8BITS_TYPED__LENGTH_PREFIX;
var BOUNDED_TYPED__LENGTH_PREFIX = function (buffer, offset, value, options) {
    var e_5, _a;
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
        for (var value_5 = __values(value), value_5_1 = value_5.next(); !value_5_1.done; value_5_1 = value_5.next()) {
            var element = value_5_1.value;
            var elementBytes = encoder_1.encode(buffer, offset + bytesWritten, options.encoding, element);
            bytesWritten += elementBytes;
        }
    }
    catch (e_5_1) { e_5 = { error: e_5_1 }; }
    finally {
        try {
            if (value_5_1 && !value_5_1.done && (_a = value_5.return)) _a.call(value_5);
        }
        finally { if (e_5) throw e_5.error; }
    }
    return bytesWritten;
};
exports.BOUNDED_TYPED__LENGTH_PREFIX = BOUNDED_TYPED__LENGTH_PREFIX;
var ROOF_8BITS_TYPED__LENGTH_PREFIX = function (buffer, offset, value, options) {
    assert_1.strict(options.maximum >= 0);
    assert_1.strict(value.length <= options.maximum);
    assert_1.strict(options.maximum <= limits_1.UINT8_MAX);
    return exports.BOUNDED_8BITS_TYPED__LENGTH_PREFIX(buffer, offset, value, {
        minimum: 0,
        maximum: options.maximum,
        encoding: options.encoding
    });
};
exports.ROOF_8BITS_TYPED__LENGTH_PREFIX = ROOF_8BITS_TYPED__LENGTH_PREFIX;
var ROOF_TYPED__LENGTH_PREFIX = function (buffer, offset, value, options) {
    assert_1.strict(options.maximum >= 0);
    assert_1.strict(value.length <= options.maximum);
    return exports.BOUNDED_TYPED__LENGTH_PREFIX(buffer, offset, value, {
        minimum: 0,
        maximum: options.maximum,
        encoding: options.encoding
    });
};
exports.ROOF_TYPED__LENGTH_PREFIX = ROOF_TYPED__LENGTH_PREFIX;
var FLOOR_TYPED__LENGTH_PREFIX = function (buffer, offset, value, options) {
    var e_6, _a;
    assert_1.strict(options.minimum >= 0);
    assert_1.strict(value.length >= options.minimum);
    var lengthBytes = encode_1.FLOOR__ENUM_VARINT(buffer, offset, value.length, {
        minimum: options.minimum
    });
    var bytesWritten = lengthBytes;
    try {
        for (var value_6 = __values(value), value_6_1 = value_6.next(); !value_6_1.done; value_6_1 = value_6.next()) {
            var element = value_6_1.value;
            var elementBytes = encoder_1.encode(buffer, offset + bytesWritten, options.encoding, element);
            bytesWritten += elementBytes;
        }
    }
    catch (e_6_1) { e_6 = { error: e_6_1 }; }
    finally {
        try {
            if (value_6_1 && !value_6_1.done && (_a = value_6.return)) _a.call(value_6);
        }
        finally { if (e_6) throw e_6.error; }
    }
    return bytesWritten;
};
exports.FLOOR_TYPED__LENGTH_PREFIX = FLOOR_TYPED__LENGTH_PREFIX;
var UNBOUNDED_TYPED__LENGTH_PREFIX = function (buffer, offset, value, options) {
    return exports.FLOOR_TYPED__LENGTH_PREFIX(buffer, offset, value, {
        minimum: 0,
        encoding: options.encoding
    });
};
exports.UNBOUNDED_TYPED__LENGTH_PREFIX = UNBOUNDED_TYPED__LENGTH_PREFIX;
var BOUNDED_8BITS_SEMITYPED__LENGTH_PREFIX = function (buffer, offset, value, options) {
    var e_7, _a;
    var _b;
    assert_1.strict(options.maximum >= 0);
    assert_1.strict(options.minimum >= 0);
    assert_1.strict(options.maximum >= options.minimum);
    assert_1.strict(value.length >= options.minimum);
    assert_1.strict(value.length <= options.maximum);
    assert_1.strict(options.maximum - options.minimum <= limits_1.UINT8_MAX);
    assert_1.strict(options.prefixEncodings.length > 0);
    var lengthBytes = encode_1.BOUNDED_8BITS__ENUM_FIXED(buffer, offset, value.length, {
        minimum: options.minimum,
        maximum: options.maximum
    });
    var bytesWritten = lengthBytes;
    try {
        for (var _c = __values(value.entries()), _d = _c.next(); !_d.done; _d = _c.next()) {
            var _e = __read(_d.value, 2), index = _e[0], element = _e[1];
            var encoding = (_b = options.prefixEncodings[index]) !== null && _b !== void 0 ? _b : null;
            if (encoding === null) {
                var elementBytes = encode_2.ANY__TYPE_PREFIX(buffer, offset + bytesWritten, element, {});
                bytesWritten += elementBytes;
            }
            else {
                var elementBytes = encoder_1.encode(buffer, offset + bytesWritten, encoding, element);
                bytesWritten += elementBytes;
            }
        }
    }
    catch (e_7_1) { e_7 = { error: e_7_1 }; }
    finally {
        try {
            if (_d && !_d.done && (_a = _c.return)) _a.call(_c);
        }
        finally { if (e_7) throw e_7.error; }
    }
    return bytesWritten;
};
exports.BOUNDED_8BITS_SEMITYPED__LENGTH_PREFIX = BOUNDED_8BITS_SEMITYPED__LENGTH_PREFIX;
var BOUNDED_SEMITYPED__LENGTH_PREFIX = function (buffer, offset, value, options) {
    var e_8, _a;
    var _b;
    assert_1.strict(options.maximum >= 0);
    assert_1.strict(options.minimum >= 0);
    assert_1.strict(options.maximum >= options.minimum);
    assert_1.strict(value.length >= options.minimum);
    assert_1.strict(value.length <= options.maximum);
    assert_1.strict(options.maximum - options.minimum <= limits_1.UINT8_MAX);
    assert_1.strict(options.prefixEncodings.length > 0);
    var lengthBytes = encode_1.BOUNDED__ENUM_VARINT(buffer, offset, value.length, {
        minimum: options.minimum,
        maximum: options.maximum
    });
    var bytesWritten = lengthBytes;
    try {
        for (var _c = __values(value.entries()), _d = _c.next(); !_d.done; _d = _c.next()) {
            var _e = __read(_d.value, 2), index = _e[0], element = _e[1];
            var encoding = (_b = options.prefixEncodings[index]) !== null && _b !== void 0 ? _b : null;
            if (encoding === null) {
                var elementBytes = encode_2.ANY__TYPE_PREFIX(buffer, offset + bytesWritten, element, {});
                bytesWritten += elementBytes;
            }
            else {
                var elementBytes = encoder_1.encode(buffer, offset + bytesWritten, encoding, element);
                bytesWritten += elementBytes;
            }
        }
    }
    catch (e_8_1) { e_8 = { error: e_8_1 }; }
    finally {
        try {
            if (_d && !_d.done && (_a = _c.return)) _a.call(_c);
        }
        finally { if (e_8) throw e_8.error; }
    }
    return bytesWritten;
};
exports.BOUNDED_SEMITYPED__LENGTH_PREFIX = BOUNDED_SEMITYPED__LENGTH_PREFIX;
var FLOOR_SEMITYPED__LENGTH_PREFIX = function (buffer, offset, value, options) {
    var e_9, _a;
    var _b;
    assert_1.strict(options.minimum >= 0);
    assert_1.strict(value.length >= options.minimum);
    assert_1.strict(options.prefixEncodings.length > 0);
    var lengthBytes = encode_1.FLOOR__ENUM_VARINT(buffer, offset, value.length, {
        minimum: options.minimum
    });
    var bytesWritten = lengthBytes;
    try {
        for (var _c = __values(value.entries()), _d = _c.next(); !_d.done; _d = _c.next()) {
            var _e = __read(_d.value, 2), index = _e[0], element = _e[1];
            var encoding = (_b = options.prefixEncodings[index]) !== null && _b !== void 0 ? _b : null;
            if (encoding === null) {
                var elementBytes = encode_2.ANY__TYPE_PREFIX(buffer, offset + bytesWritten, element, {});
                bytesWritten += elementBytes;
            }
            else {
                var elementBytes = encoder_1.encode(buffer, offset + bytesWritten, encoding, element);
                bytesWritten += elementBytes;
            }
        }
    }
    catch (e_9_1) { e_9 = { error: e_9_1 }; }
    finally {
        try {
            if (_d && !_d.done && (_a = _c.return)) _a.call(_c);
        }
        finally { if (e_9) throw e_9.error; }
    }
    return bytesWritten;
};
exports.FLOOR_SEMITYPED__LENGTH_PREFIX = FLOOR_SEMITYPED__LENGTH_PREFIX;
var ROOF_SEMITYPED__LENGTH_PREFIX = function (buffer, offset, value, options) {
    assert_1.strict(options.maximum >= 0);
    assert_1.strict(value.length <= options.maximum);
    assert_1.strict(options.prefixEncodings.length > 0);
    return exports.BOUNDED_SEMITYPED__LENGTH_PREFIX(buffer, offset, value, {
        minimum: 0,
        maximum: options.maximum,
        prefixEncodings: options.prefixEncodings
    });
};
exports.ROOF_SEMITYPED__LENGTH_PREFIX = ROOF_SEMITYPED__LENGTH_PREFIX;
var ROOF_8BITS_SEMITYPED__LENGTH_PREFIX = function (buffer, offset, value, options) {
    assert_1.strict(options.maximum >= 0);
    assert_1.strict(value.length <= options.maximum);
    assert_1.strict(options.prefixEncodings.length > 0);
    assert_1.strict(options.maximum <= limits_1.UINT8_MAX);
    return exports.BOUNDED_8BITS_SEMITYPED__LENGTH_PREFIX(buffer, offset, value, {
        minimum: 0,
        maximum: options.maximum,
        prefixEncodings: options.prefixEncodings
    });
};
exports.ROOF_8BITS_SEMITYPED__LENGTH_PREFIX = ROOF_8BITS_SEMITYPED__LENGTH_PREFIX;
var UNBOUNDED_SEMITYPED__LENGTH_PREFIX = function (buffer, offset, value, options) {
    assert_1.strict(options.prefixEncodings.length > 0);
    return exports.FLOOR_SEMITYPED__LENGTH_PREFIX(buffer, offset, value, {
        minimum: 0,
        prefixEncodings: options.prefixEncodings
    });
};
exports.UNBOUNDED_SEMITYPED__LENGTH_PREFIX = UNBOUNDED_SEMITYPED__LENGTH_PREFIX;
