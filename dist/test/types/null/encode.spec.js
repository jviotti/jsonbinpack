"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var tap_1 = __importDefault(require("tap"));
var encode_1 = require("../../../lib/types/null/encode");
tap_1.default.test('NULL_8BITS__ENUM_FIXED: should encode null as 0x00', function (test) {
    var buffer = Buffer.allocUnsafe(1);
    var bytesWritten = encode_1.NULL_8BITS__ENUM_FIXED(buffer, 0);
    test.strictSame(buffer, Buffer.from([0x00]));
    test.is(bytesWritten, 1);
    test.end();
});