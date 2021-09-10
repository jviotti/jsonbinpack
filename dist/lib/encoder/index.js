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
exports.decode = exports.encode = exports.EncodingType = exports.getDefaultEncodingContext = exports.ResizableBuffer = void 0;
var assert_1 = require("assert");
var encoding_type_1 = require("./encoding-type");
var ENCODE_INTEGER = __importStar(require("./integer/encode"));
var ENCODE_NUMBER = __importStar(require("./number/encode"));
var ENCODE_STRING = __importStar(require("./string/encode"));
var ENCODE_ANY = __importStar(require("./any/encode"));
var ENCODE_ARRAY = __importStar(require("./array/encode"));
var ENCODE_OBJECT = __importStar(require("./object/encode"));
var ENCODE_ENUM = __importStar(require("./enum/encode"));
var ENCODE_ONEOF = __importStar(require("./oneof/encode"));
var ENCODE_CONST = __importStar(require("./const/encode"));
var DECODE_INTEGER = __importStar(require("./integer/decode"));
var DECODE_NUMBER = __importStar(require("./number/decode"));
var DECODE_STRING = __importStar(require("./string/decode"));
var DECODE_ANY = __importStar(require("./any/decode"));
var DECODE_ARRAY = __importStar(require("./array/decode"));
var DECODE_OBJECT = __importStar(require("./object/decode"));
var DECODE_ENUM = __importStar(require("./enum/decode"));
var DECODE_ONEOF = __importStar(require("./oneof/decode"));
var DECODE_CONST = __importStar(require("./const/decode"));
var resizable_buffer_1 = require("./resizable-buffer");
Object.defineProperty(exports, "ResizableBuffer", { enumerable: true, get: function () { return __importDefault(resizable_buffer_1).default; } });
var context_1 = require("./context");
Object.defineProperty(exports, "getDefaultEncodingContext", { enumerable: true, get: function () { return context_1.getDefaultEncodingContext; } });
var encoding_type_2 = require("./encoding-type");
Object.defineProperty(exports, "EncodingType", { enumerable: true, get: function () { return encoding_type_2.EncodingType; } });
var ENCODE_TYPE_INDEX = new Map();
var DECODE_TYPE_INDEX = new Map();
ENCODE_TYPE_INDEX.set(encoding_type_1.EncodingType.Integer, ENCODE_INTEGER);
ENCODE_TYPE_INDEX.set(encoding_type_1.EncodingType.Number, ENCODE_NUMBER);
ENCODE_TYPE_INDEX.set(encoding_type_1.EncodingType.String, ENCODE_STRING);
ENCODE_TYPE_INDEX.set(encoding_type_1.EncodingType.Any, ENCODE_ANY);
ENCODE_TYPE_INDEX.set(encoding_type_1.EncodingType.Array, ENCODE_ARRAY);
ENCODE_TYPE_INDEX.set(encoding_type_1.EncodingType.Object, ENCODE_OBJECT);
ENCODE_TYPE_INDEX.set(encoding_type_1.EncodingType.Enum, ENCODE_ENUM);
ENCODE_TYPE_INDEX.set(encoding_type_1.EncodingType.OneOf, ENCODE_ONEOF);
ENCODE_TYPE_INDEX.set(encoding_type_1.EncodingType.Const, ENCODE_CONST);
DECODE_TYPE_INDEX.set(encoding_type_1.EncodingType.Integer, DECODE_INTEGER);
DECODE_TYPE_INDEX.set(encoding_type_1.EncodingType.Number, DECODE_NUMBER);
DECODE_TYPE_INDEX.set(encoding_type_1.EncodingType.String, DECODE_STRING);
DECODE_TYPE_INDEX.set(encoding_type_1.EncodingType.Any, DECODE_ANY);
DECODE_TYPE_INDEX.set(encoding_type_1.EncodingType.Array, DECODE_ARRAY);
DECODE_TYPE_INDEX.set(encoding_type_1.EncodingType.Object, DECODE_OBJECT);
DECODE_TYPE_INDEX.set(encoding_type_1.EncodingType.Enum, DECODE_ENUM);
DECODE_TYPE_INDEX.set(encoding_type_1.EncodingType.OneOf, DECODE_ONEOF);
DECODE_TYPE_INDEX.set(encoding_type_1.EncodingType.Const, DECODE_CONST);
var encode = function (buffer, offset, encoding, value, context) {
    var fns = ENCODE_TYPE_INDEX.get(encoding.type);
    assert_1.strict(typeof fns !== 'undefined');
    return fns[encoding.encoding](buffer, offset, value, encoding.options, context);
};
exports.encode = encode;
var decode = function (buffer, offset, encoding) {
    var fns = DECODE_TYPE_INDEX.get(encoding.type);
    assert_1.strict(typeof fns !== 'undefined');
    return fns[encoding.encoding](buffer, offset, encoding.options);
};
exports.decode = decode;
