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
    test.is(mapper_1.getStates(schema), Infinity);
    test.strictSame(result, {
        type: 'array',
        encoding: 'FLOOR_SEMITYPED_LENGTH_PREFIX',
        options: {
            minimum: 0,
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
    test.is(mapper_1.getStates(schema), Infinity);
    test.strictSame(result, {
        type: 'array',
        encoding: 'FLOOR_SEMITYPED_LENGTH_PREFIX',
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
    test.is(mapper_1.getStates(schema), Infinity);
    test.strictSame(result, {
        type: 'array',
        encoding: 'ROOF_SEMITYPED_LENGTH_PREFIX',
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
    test.is(mapper_1.getStates(schema), Infinity);
    test.strictSame(result, {
        type: 'array',
        encoding: 'BOUNDED_8BITS_SEMITYPED_LENGTH_PREFIX',
        options: {
            minimum: 0,
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
    test.is(mapper_1.getStates(schema), Infinity);
    test.strictSame(result, {
        type: 'array',
        encoding: 'BOUNDED_8BITS_SEMITYPED_LENGTH_PREFIX',
        options: {
            minimum: 0,
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
    test.is(mapper_1.getStates(schema), Infinity);
    test.strictSame(result, {
        type: 'array',
        encoding: 'BOUNDED_8BITS_SEMITYPED_LENGTH_PREFIX',
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
    test.is(mapper_1.getStates(schema), Infinity);
    test.strictSame(result, {
        type: 'array',
        encoding: 'BOUNDED_SEMITYPED_LENGTH_PREFIX',
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
    test.is(mapper_1.getStates(schema), Infinity);
    test.strictSame(result, {
        type: 'array',
        encoding: 'FLOOR_SEMITYPED_LENGTH_PREFIX',
        options: {
            minimum: 0,
            prefixEncodings: [
                {
                    type: 'integer',
                    encoding: 'ARBITRARY_ZIGZAG_VARINT',
                    options: {}
                },
                {
                    type: 'string',
                    encoding: 'BOUNDED_PREFIX_LENGTH_8BIT_FIXED',
                    options: {
                        minimum: 0,
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
    test.is(mapper_1.getStates(schema), Infinity);
    test.strictSame(result, {
        type: 'array',
        encoding: 'FLOOR_SEMITYPED_LENGTH_PREFIX',
        options: {
            minimum: 5,
            prefixEncodings: [
                {
                    type: 'integer',
                    encoding: 'ARBITRARY_ZIGZAG_VARINT',
                    options: {}
                },
                {
                    type: 'string',
                    encoding: 'BOUNDED_PREFIX_LENGTH_8BIT_FIXED',
                    options: {
                        minimum: 0,
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
    test.is(mapper_1.getStates(schema), Infinity);
    test.strictSame(result, {
        type: 'array',
        encoding: 'FLOOR_TYPED_LENGTH_PREFIX',
        options: {
            minimum: 5,
            encoding: {
                type: 'array',
                encoding: 'FLOOR_SEMITYPED_LENGTH_PREFIX',
                options: {
                    minimum: 0,
                    prefixEncodings: []
                }
            },
            prefixEncodings: [
                {
                    type: 'integer',
                    encoding: 'ARBITRARY_ZIGZAG_VARINT',
                    options: {}
                },
                {
                    type: 'string',
                    encoding: 'BOUNDED_PREFIX_LENGTH_8BIT_FIXED',
                    options: {
                        minimum: 0,
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
    test.strictSame(mapper_1.getStates(schema), [
        [false],
        [true],
        [false, false],
        [false, true],
        [true, false],
        [true, true]
    ]);
    test.strictSame(result, {
        type: 'enum',
        encoding: 'TOP_LEVEL_8BIT_CHOICE_INDEX',
        options: {
            choices: [
                [false],
                [true],
                [false, false],
                [false, true],
                [true, false],
                [true, true]
            ]
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
    test.strictSame(mapper_1.getStates(schema), [
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
        type: 'enum',
        encoding: 'TOP_LEVEL_8BIT_CHOICE_INDEX',
        options: {
            choices: [
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
            ]
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
    test.strictSame(mapper_1.getStates(schema), [
        [],
        [false],
        [true],
        [false, false],
        [false, true],
        [true, false],
        [true, true]
    ]);
    test.strictSame(result, {
        type: 'enum',
        encoding: 'TOP_LEVEL_8BIT_CHOICE_INDEX',
        options: {
            choices: [
                [],
                [false],
                [true],
                [false, false],
                [false, true],
                [true, false],
                [true, true]
            ]
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
    test.strictSame(mapper_1.getStates(schema), [
        [false],
        [true],
        [false, false],
        [false, true],
        [true, false],
        [true, true]
    ]);
    test.strictSame(result, {
        type: 'enum',
        encoding: 'TOP_LEVEL_8BIT_CHOICE_INDEX',
        options: {
            choices: [
                [false],
                [true],
                [false, false],
                [false, true],
                [true, false],
                [true, true]
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
    test.strictSame(mapper_1.getStates(schema), [
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
        type: 'enum',
        encoding: 'TOP_LEVEL_8BIT_CHOICE_INDEX',
        options: {
            choices: [
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
            ]
        }
    });
    test.end();
});
tap_1.default.test('should encode a bounded array with bounded prefixItems', function (test) {
    var schema = {
        type: 'array',
        minItems: 2,
        maxItems: 2,
        prefixItems: [
            {
                type: 'integer',
                minimum: 0,
                maximum: 2
            },
            {
                type: 'object',
                additionalProperties: false,
                required: ['requireReturn'],
                properties: {
                    requireReturn: {
                        type: 'boolean'
                    }
                }
            }
        ]
    };
    var result = mapper_1.getEncoding(schema, 0);
    test.strictSame(mapper_1.getStates(schema), [
        [0, {
                requireReturn: false
            }],
        [0, {
                requireReturn: true
            }],
        [1, {
                requireReturn: false
            }],
        [1, {
                requireReturn: true
            }],
        [2, {
                requireReturn: false
            }],
        [2, {
                requireReturn: true
            }]
    ]);
    test.strictSame(result, {
        type: 'enum',
        encoding: 'TOP_LEVEL_8BIT_CHOICE_INDEX',
        options: {
            choices: [
                [0, {
                        requireReturn: false
                    }],
                [0, {
                        requireReturn: true
                    }],
                [1, {
                        requireReturn: false
                    }],
                [1, {
                        requireReturn: true
                    }],
                [2, {
                        requireReturn: false
                    }],
                [2, {
                        requireReturn: true
                    }]
            ]
        }
    });
    test.end();
});
