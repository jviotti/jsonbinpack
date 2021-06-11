"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var tap_1 = __importDefault(require("tap"));
var mapper_1 = require("../../lib/mapper");
tap_1.default.test('should encode an arbitrary array', function (test) {
    var schema = {
        type: 'array'
    };
    var result = mapper_1.getEncoding(schema, 0);
    test.is(mapper_1.getStates(schema, 0), Infinity);
    test.strictSame(result, {
        type: 'array',
        encoding: 'UNBOUNDED_SEMITYPED__LENGTH_PREFIX',
        options: {
            prefixEncodings: []
        }
    });
    test.end();
});
tap_1.default.test('should encode an arbitrary array with minItems', function (test) {
    var schema = {
        type: 'array',
        minItems: 10
    };
    var result = mapper_1.getEncoding(schema, 0);
    test.is(mapper_1.getStates(schema, 0), Infinity);
    test.strictSame(result, {
        type: 'array',
        encoding: 'FLOOR_SEMITYPED__LENGTH_PREFIX',
        options: {
            minimum: 10,
            prefixEncodings: []
        }
    });
    test.end();
});
tap_1.default.test('should encode an arbitrary array with maxItems = 256', function (test) {
    var schema = {
        type: 'array',
        maxItems: 256
    };
    var result = mapper_1.getEncoding(schema, 0);
    test.is(mapper_1.getStates(schema, 0), Infinity);
    test.strictSame(result, {
        type: 'array',
        encoding: 'ROOF_SEMITYPED__LENGTH_PREFIX',
        options: {
            maximum: 256,
            prefixEncodings: []
        }
    });
    test.end();
});
tap_1.default.test('should encode an arbitrary array with maxItems = 255', function (test) {
    var schema = {
        type: 'array',
        maxItems: 255
    };
    var result = mapper_1.getEncoding(schema, 0);
    test.is(mapper_1.getStates(schema, 0), Infinity);
    test.strictSame(result, {
        type: 'array',
        encoding: 'ROOF_8BITS_SEMITYPED__LENGTH_PREFIX',
        options: {
            maximum: 255,
            prefixEncodings: []
        }
    });
    test.end();
});
tap_1.default.test('should encode an arbitrary array with maxItems < 255', function (test) {
    var schema = {
        type: 'array',
        maxItems: 10
    };
    var result = mapper_1.getEncoding(schema, 0);
    test.is(mapper_1.getStates(schema, 0), Infinity);
    test.strictSame(result, {
        type: 'array',
        encoding: 'ROOF_8BITS_SEMITYPED__LENGTH_PREFIX',
        options: {
            maximum: 10,
            prefixEncodings: []
        }
    });
    test.end();
});
tap_1.default.test('should encode an arbitrary array with maxItems - minItems < 255', function (test) {
    var schema = {
        type: 'array',
        maxItems: 10,
        minItems: 3
    };
    var result = mapper_1.getEncoding(schema, 0);
    test.is(mapper_1.getStates(schema, 0), Infinity);
    test.strictSame(result, {
        type: 'array',
        encoding: 'BOUNDED_8BITS_SEMITYPED__LENGTH_PREFIX',
        options: {
            minimum: 3,
            maximum: 10,
            prefixEncodings: []
        }
    });
    test.end();
});
tap_1.default.test('should encode an arbitrary array with maxItems - minItems > 255', function (test) {
    var schema = {
        type: 'array',
        maxItems: 450,
        minItems: 30
    };
    var result = mapper_1.getEncoding(schema, 0);
    test.is(mapper_1.getStates(schema, 0), Infinity);
    test.strictSame(result, {
        type: 'array',
        encoding: 'BOUNDED_SEMITYPED__LENGTH_PREFIX',
        options: {
            minimum: 30,
            maximum: 450,
            prefixEncodings: []
        }
    });
    test.end();
});
tap_1.default.test('should encode a semi-typed scalar heterogeneous array', function (test) {
    var schema = {
        type: 'array',
        prefixItems: [
            {
                type: 'integer'
            },
            {
                type: 'string',
                maxLength: 5
            }
        ]
    };
    var result = mapper_1.getEncoding(schema, 0);
    test.is(mapper_1.getStates(schema, 0), Infinity);
    test.strictSame(result, {
        type: 'array',
        encoding: 'UNBOUNDED_SEMITYPED__LENGTH_PREFIX',
        options: {
            prefixEncodings: [
                {
                    type: 'integer',
                    encoding: 'ARBITRARY__ZIGZAG_VARINT',
                    options: {}
                },
                {
                    type: 'string',
                    encoding: 'ROOF__PREFIX_LENGTH_8BIT_FIXED',
                    options: {
                        maximum: 5
                    }
                }
            ]
        }
    });
    test.end();
});
tap_1.default.test('should encode a semi-typed array with minItems', function (test) {
    var schema = {
        type: 'array',
        minItems: 5,
        prefixItems: [
            {
                type: 'integer'
            },
            {
                type: 'string',
                maxLength: 5
            }
        ]
    };
    var result = mapper_1.getEncoding(schema, 0);
    test.is(mapper_1.getStates(schema, 0), Infinity);
    test.strictSame(result, {
        type: 'array',
        encoding: 'FLOOR_SEMITYPED__LENGTH_PREFIX',
        options: {
            minimum: 5,
            prefixEncodings: [
                {
                    type: 'integer',
                    encoding: 'ARBITRARY__ZIGZAG_VARINT',
                    options: {}
                },
                {
                    type: 'string',
                    encoding: 'ROOF__PREFIX_LENGTH_8BIT_FIXED',
                    options: {
                        maximum: 5
                    }
                }
            ]
        }
    });
    test.end();
});
tap_1.default.test('should encode a semi + fully typed array with minItems', function (test) {
    var schema = {
        type: 'array',
        minItems: 5,
        items: {
            type: 'array'
        },
        prefixItems: [
            {
                type: 'integer'
            },
            {
                type: 'string',
                maxLength: 5
            }
        ]
    };
    var result = mapper_1.getEncoding(schema, 0);
    test.is(mapper_1.getStates(schema, 0), Infinity);
    test.strictSame(result, {
        type: 'array',
        encoding: 'FLOOR_TYPED__LENGTH_PREFIX',
        options: {
            minimum: 5,
            encoding: {
                type: 'array',
                encoding: 'UNBOUNDED_SEMITYPED__LENGTH_PREFIX',
                options: {
                    prefixEncodings: []
                }
            },
            prefixEncodings: [
                {
                    type: 'integer',
                    encoding: 'ARBITRARY__ZIGZAG_VARINT',
                    options: {}
                },
                {
                    type: 'string',
                    encoding: 'ROOF__PREFIX_LENGTH_8BIT_FIXED',
                    options: {
                        maximum: 5
                    }
                }
            ]
        }
    });
    test.end();
});
tap_1.default.test('should encode a bounded array with bounded boolean items', function (test) {
    var schema = {
        type: 'array',
        maxItems: 2,
        minItems: 1,
        items: {
            type: 'boolean'
        }
    };
    var result = mapper_1.getEncoding(schema, 0);
    test.strictSame(mapper_1.getStates(schema, 0), [
        [false],
        [true],
        [false, false],
        [false, true],
        [true, false],
        [true, true]
    ]);
    test.strictSame(result, {
        type: 'array',
        encoding: 'BOUNDED_8BITS_TYPED__LENGTH_PREFIX',
        options: {
            minimum: 1,
            maximum: 2,
            encoding: mapper_1.getEncoding({
                type: 'boolean'
            }, 1),
            prefixEncodings: []
        }
    });
    test.end();
});
tap_1.default.test('should encode a bounded array with bounded integer items', function (test) {
    var schema = {
        type: 'array',
        maxItems: 2,
        minItems: 1,
        items: {
            type: 'integer',
            maximum: 3,
            minimum: 1
        }
    };
    var result = mapper_1.getEncoding(schema, 0);
    test.strictSame(mapper_1.getStates(schema, 0), [
        [1],
        [2],
        [3],
        [1, 1],
        [1, 2],
        [1, 3],
        [2, 1],
        [2, 2],
        [2, 3],
        [3, 1],
        [3, 2],
        [3, 3]
    ]);
    test.strictSame(result, {
        type: 'array',
        encoding: 'BOUNDED_8BITS_TYPED__LENGTH_PREFIX',
        options: {
            minimum: 1,
            maximum: 2,
            encoding: mapper_1.getEncoding({
                type: 'integer',
                maximum: 3,
                minimum: 1
            }, 1),
            prefixEncodings: []
        }
    });
    test.end();
});
tap_1.default.test('should encode a bounded roofed array with bounded boolean items', function (test) {
    var schema = {
        type: 'array',
        maxItems: 2,
        items: {
            type: 'boolean'
        }
    };
    var result = mapper_1.getEncoding(schema, 0);
    test.strictSame(mapper_1.getStates(schema, 0), [
        [],
        [false],
        [true],
        [false, false],
        [false, true],
        [true, false],
        [true, true]
    ]);
    test.strictSame(result, {
        type: 'array',
        encoding: 'ROOF_8BITS_TYPED__LENGTH_PREFIX',
        options: {
            maximum: 2,
            encoding: mapper_1.getEncoding({
                type: 'boolean'
            }, 1),
            prefixEncodings: []
        }
    });
    test.end();
});
tap_1.default.test('should encode a bounded array with total prefix items', function (test) {
    var schema = {
        type: 'array',
        maxItems: 2,
        minItems: 1,
        prefixItems: [
            {
                type: 'boolean'
            },
            {
                type: 'boolean'
            }
        ]
    };
    var result = mapper_1.getEncoding(schema, 0);
    test.strictSame(mapper_1.getStates(schema, 0), [
        [false],
        [true],
        [false, false],
        [false, true],
        [true, false],
        [true, true]
    ]);
    test.strictSame(result, {
        type: 'array',
        encoding: 'BOUNDED_8BITS_SEMITYPED__LENGTH_PREFIX',
        options: {
            minimum: 1,
            maximum: 2,
            prefixEncodings: [
                mapper_1.getEncoding({
                    type: 'boolean'
                }, 1),
                mapper_1.getEncoding({
                    type: 'boolean'
                }, 1)
            ]
        }
    });
    test.end();
});
tap_1.default.test('should encode a bounded array with partial prefix items', function (test) {
    var schema = {
        type: 'array',
        maxItems: 3,
        minItems: 1,
        items: {
            type: 'integer',
            maximum: 3,
            minimum: 1
        },
        prefixItems: [
            {
                type: 'boolean'
            },
            {
                type: 'boolean'
            }
        ]
    };
    var result = mapper_1.getEncoding(schema, 0);
    test.strictSame(mapper_1.getStates(schema, 0), [
        [false],
        [true],
        [false, false],
        [false, true],
        [true, false],
        [true, true],
        [false, false, 1],
        [false, false, 2],
        [false, false, 3],
        [false, true, 1],
        [false, true, 2],
        [false, true, 3],
        [true, false, 1],
        [true, false, 2],
        [true, false, 3],
        [true, true, 1],
        [true, true, 2],
        [true, true, 3]
    ]);
    test.strictSame(result, {
        type: 'array',
        encoding: 'BOUNDED_8BITS_TYPED__LENGTH_PREFIX',
        options: {
            minimum: 1,
            maximum: 3,
            encoding: mapper_1.getEncoding({
                type: 'integer',
                maximum: 3,
                minimum: 1
            }, 1),
            prefixEncodings: [
                mapper_1.getEncoding({
                    type: 'boolean'
                }, 1),
                mapper_1.getEncoding({
                    type: 'boolean'
                }, 1)
            ]
        }
    });
    test.end();
});
