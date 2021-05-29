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
exports.MIXED_UNBOUNDED_TYPED_OBJECT = exports.OPTIONAL_UNBOUNDED_TYPED_OBJECT = exports.REQUIRED_UNBOUNDED_TYPED_OBJECT = exports.ARBITRARY_TYPED_KEYS_OBJECT = exports.MIXED_BOUNDED_TYPED_OBJECT = exports.NON_REQUIRED_BOUNDED_TYPED_OBJECT = exports.REQUIRED_ONLY_BOUNDED_TYPED_OBJECT = void 0;
var assert_1 = require("assert");
var bitset_1 = require("./bitset");
var decode_1 = require("../integer/decode");
var index_1 = require("../index");
var REQUIRED_ONLY_BOUNDED_TYPED_OBJECT = function (buffer, offset, options) {
    var e_1, _a;
    var result = {};
    var cursor = offset;
    try {
        for (var _b = __values(options.requiredProperties), _c = _b.next(); !_c.done; _c = _b.next()) {
            var key = _c.value;
            var encoding = options.propertyEncodings[key];
            assert_1.strict(typeof encoding !== 'undefined');
            var propertyResult = index_1.decode(buffer, cursor, encoding);
            assert_1.strict(propertyResult.bytes >= 0);
            Reflect.set(result, key, propertyResult.value);
            cursor += propertyResult.bytes;
        }
    }
    catch (e_1_1) { e_1 = { error: e_1_1 }; }
    finally {
        try {
            if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
        }
        finally { if (e_1) throw e_1.error; }
    }
    return {
        value: result,
        bytes: cursor - offset
    };
};
exports.REQUIRED_ONLY_BOUNDED_TYPED_OBJECT = REQUIRED_ONLY_BOUNDED_TYPED_OBJECT;
var NON_REQUIRED_BOUNDED_TYPED_OBJECT = function (buffer, offset, options) {
    var e_2, _a;
    var bitsetLength = decode_1.FLOOR__ENUM_VARINT(buffer, offset, {
        minimum: 0
    });
    assert_1.strict(bitsetLength.value >= 0);
    var bitsetResult = bitset_1.bitsetDecode(buffer, offset + bitsetLength.bytes, bitsetLength.value);
    assert_1.strict(bitsetResult.value.length === bitsetLength.value);
    var result = {};
    var cursor = offset + bitsetLength.bytes + bitsetResult.bytes;
    try {
        for (var _b = __values(bitsetResult.value.entries()), _c = _b.next(); !_c.done; _c = _b.next()) {
            var _d = __read(_c.value, 2), index = _d[0], value = _d[1];
            if (!value) {
                continue;
            }
            var key = options.optionalProperties[index];
            var encoding = options.propertyEncodings[key];
            assert_1.strict(typeof encoding !== 'undefined');
            var propertyResult = index_1.decode(buffer, cursor, encoding);
            assert_1.strict(propertyResult.bytes >= 0);
            Reflect.set(result, key, propertyResult.value);
            cursor += propertyResult.bytes;
        }
    }
    catch (e_2_1) { e_2 = { error: e_2_1 }; }
    finally {
        try {
            if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
        }
        finally { if (e_2) throw e_2.error; }
    }
    return {
        value: result,
        bytes: cursor - offset
    };
};
exports.NON_REQUIRED_BOUNDED_TYPED_OBJECT = NON_REQUIRED_BOUNDED_TYPED_OBJECT;
var MIXED_BOUNDED_TYPED_OBJECT = function (buffer, offset, options) {
    var requiredResult = exports.REQUIRED_ONLY_BOUNDED_TYPED_OBJECT(buffer, offset, {
        propertyEncodings: options.propertyEncodings,
        requiredProperties: options.requiredProperties
    });
    var optionalResult = exports.NON_REQUIRED_BOUNDED_TYPED_OBJECT(buffer, offset + requiredResult.bytes, {
        propertyEncodings: options.propertyEncodings,
        optionalProperties: options.optionalProperties
    });
    return {
        bytes: requiredResult.bytes + optionalResult.bytes,
        value: Object.assign(requiredResult.value, optionalResult.value)
    };
};
exports.MIXED_BOUNDED_TYPED_OBJECT = MIXED_BOUNDED_TYPED_OBJECT;
var ARBITRARY_TYPED_KEYS_OBJECT = function (buffer, offset, options) {
    var result = decode_1.FLOOR__ENUM_VARINT(buffer, offset, {
        minimum: 0
    });
    assert_1.strict(result.value >= 0);
    var count = 0;
    var cursor = offset + result.bytes;
    var value = {};
    while (count < result.value) {
        var keyResult = index_1.decode(buffer, cursor, options.keyEncoding);
        assert_1.strict(typeof keyResult.value === 'string');
        assert_1.strict(keyResult.bytes >= 0);
        cursor += keyResult.bytes;
        var valueResult = index_1.decode(buffer, cursor, options.encoding);
        assert_1.strict(valueResult.bytes >= 0);
        cursor += valueResult.bytes;
        Reflect.set(value, keyResult.value, valueResult.value);
        count += 1;
    }
    return {
        value: value,
        bytes: cursor - offset
    };
};
exports.ARBITRARY_TYPED_KEYS_OBJECT = ARBITRARY_TYPED_KEYS_OBJECT;
var REQUIRED_UNBOUNDED_TYPED_OBJECT = function (buffer, offset, options) {
    var requiredResult = exports.REQUIRED_ONLY_BOUNDED_TYPED_OBJECT(buffer, offset, {
        propertyEncodings: options.propertyEncodings,
        requiredProperties: options.requiredProperties
    });
    var arbitraryResult = exports.ARBITRARY_TYPED_KEYS_OBJECT(buffer, offset + requiredResult.bytes, {
        keyEncoding: options.keyEncoding,
        encoding: options.encoding
    });
    return {
        bytes: requiredResult.bytes + arbitraryResult.bytes,
        value: Object.assign(requiredResult.value, arbitraryResult.value)
    };
};
exports.REQUIRED_UNBOUNDED_TYPED_OBJECT = REQUIRED_UNBOUNDED_TYPED_OBJECT;
var OPTIONAL_UNBOUNDED_TYPED_OBJECT = function (buffer, offset, options) {
    var optionalResult = exports.NON_REQUIRED_BOUNDED_TYPED_OBJECT(buffer, offset, {
        propertyEncodings: options.propertyEncodings,
        optionalProperties: options.optionalProperties
    });
    var arbitraryResult = exports.ARBITRARY_TYPED_KEYS_OBJECT(buffer, offset + optionalResult.bytes, {
        keyEncoding: options.keyEncoding,
        encoding: options.encoding
    });
    return {
        bytes: optionalResult.bytes + arbitraryResult.bytes,
        value: Object.assign(optionalResult.value, arbitraryResult.value)
    };
};
exports.OPTIONAL_UNBOUNDED_TYPED_OBJECT = OPTIONAL_UNBOUNDED_TYPED_OBJECT;
var MIXED_UNBOUNDED_TYPED_OBJECT = function (buffer, offset, options) {
    var requiredResult = exports.REQUIRED_ONLY_BOUNDED_TYPED_OBJECT(buffer, offset, {
        propertyEncodings: options.propertyEncodings,
        requiredProperties: options.requiredProperties
    });
    var optionalResult = exports.NON_REQUIRED_BOUNDED_TYPED_OBJECT(buffer, offset + requiredResult.bytes, {
        propertyEncodings: options.propertyEncodings,
        optionalProperties: options.optionalProperties
    });
    var arbitraryResult = exports.ARBITRARY_TYPED_KEYS_OBJECT(buffer, offset + requiredResult.bytes + optionalResult.bytes, {
        keyEncoding: options.keyEncoding,
        encoding: options.encoding
    });
    return {
        bytes: requiredResult.bytes + optionalResult.bytes + arbitraryResult.bytes,
        value: Object.assign(requiredResult.value, optionalResult.value, arbitraryResult.value)
    };
};
exports.MIXED_UNBOUNDED_TYPED_OBJECT = MIXED_UNBOUNDED_TYPED_OBJECT;
