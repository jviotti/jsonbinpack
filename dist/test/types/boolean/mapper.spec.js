"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var tap_1 = __importDefault(require("tap"));
var mapper_1 = require("../../../lib/types/boolean/mapper");
tap_1.default.test('should encode a boolean value', function (test) {
    var schema = {
        type: 'boolean'
    };
    var result = mapper_1.getBooleanEncoding(schema);
    test.strictSame(result, {
        encoding: 'BOOLEAN_8BITS__ENUM_FIXED',
        options: {}
    });
    test.end();
});
