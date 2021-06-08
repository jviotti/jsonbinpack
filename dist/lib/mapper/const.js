"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getConstEncoding = void 0;
var encoder_1 = require("../encoder");
var getConstEncoding = function (schema) {
    return {
        type: encoder_1.EncodingType.Const,
        encoding: 'CONST_NONE',
        options: {
            value: schema.const
        }
    };
};
exports.getConstEncoding = getConstEncoding;