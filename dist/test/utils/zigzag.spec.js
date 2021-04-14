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
var tap_1 = __importDefault(require("tap"));
var fc = __importStar(require("fast-check"));
var zigzag_1 = require("../../lib/utils/zigzag");
tap_1.default.test('should encode 0 as 0', function (test) {
    test.is(zigzag_1.zigzagEncode(0), 0);
    test.end();
});
tap_1.default.test('should encode -1 as 1', function (test) {
    test.is(zigzag_1.zigzagEncode(-1), 1);
    test.end();
});
tap_1.default.test('should encode 1 as 2', function (test) {
    test.is(zigzag_1.zigzagEncode(1), 2);
    test.end();
});
tap_1.default.test('should encode -2 as 3', function (test) {
    test.is(zigzag_1.zigzagEncode(-2), 3);
    test.end();
});
tap_1.default.test('a positive integer should result in an even integer', function (test) {
    fc.assert(fc.property(fc.integer({
        min: 0
    }), function (value) {
        return zigzag_1.zigzagEncode(value) % 2 === 0;
    }), {
        verbose: false
    });
    test.end();
});
tap_1.default.test('a negative integer should result in an odd integer', function (test) {
    fc.assert(fc.property(fc.integer({
        max: -1
    }), function (value) {
        return zigzag_1.zigzagEncode(value) % 2 === 1;
    }), {
        verbose: false
    });
    test.end();
});
tap_1.default.test('encoding should result in a positive integer', function (test) {
    fc.assert(fc.property(fc.integer(), function (value) {
        return zigzag_1.zigzagEncode(value) >= 0;
    }), {
        verbose: false
    });
    test.end();
});
tap_1.default.test('should decode a ZigZag encoded integer', function (test) {
    fc.assert(fc.property(fc.integer(), function (value) {
        return zigzag_1.zigzagDecode(zigzag_1.zigzagEncode(value)) === value;
    }), {
        verbose: false
    });
    test.end();
});