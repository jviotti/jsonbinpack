"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var tap_1 = __importDefault(require("tap"));
var mapper_1 = require("../../lib/mapper");
tap_1.default.test('should encode an object with an enum with one value', function (test) {
    var schema = {
        type: 'object',
        properties: {
            test: {
                enum: ['foo']
            }
        }
    };
    var result = mapper_1.getEncoding(schema, 0);
    test.is(mapper_1.getStates(schema), Infinity);
    test.strictSame(result, {
        type: 'object',
        encoding: 'OPTIONAL_UNBOUNDED_TYPED_OBJECT',
        options: {
            optionalProperties: ['test'],
            encoding: {
                type: 'any',
                encoding: 'ANY_PACKED_TYPE_TAG_BYTE_PREFIX',
                options: {}
            },
            keyEncoding: {
                type: 'string',
                encoding: 'STRING_UNBOUNDED_SCOPED_PREFIX_LENGTH',
                options: {}
            },
            propertyEncodings: {
                test: {
                    type: 'enum',
                    encoding: 'CONST_NONE',
                    options: {
                        value: 'foo'
                    }
                }
            }
        }
    });
    test.end();
});
tap_1.default.test('should encode a top-level enum with one value', function (test) {
    var schema = {
        enum: ['foo']
    };
    var result = mapper_1.getEncoding(schema, 0);
    test.strictSame(mapper_1.getStates(schema), ['foo']);
    test.strictSame(result, {
        type: 'enum',
        encoding: 'CONST_NONE',
        options: {
            value: 'foo'
        }
    });
    test.end();
});
