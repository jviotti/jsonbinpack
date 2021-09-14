"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var tap_1 = __importDefault(require("tap"));
var mapper_1 = require("../../lib/mapper");
tap_1.default.test('should encode a bounded object with only required keys', function (test) {
    var schema = {
        type: 'object',
        additionalProperties: false,
        required: ['foo', 'bar']
    };
    var result = mapper_1.getEncoding(schema, 0);
    test.is(mapper_1.getStates(schema), Infinity);
    test.strictSame(result, {
        type: 'object',
        encoding: 'REQUIRED_ONLY_BOUNDED_TYPED_OBJECT',
        options: {
            booleanRequiredProperties: [],
            propertyEncodings: {
                foo: {
                    type: 'any',
                    encoding: 'ANY_PACKED_TYPE_TAG_BYTE_PREFIX',
                    options: {}
                },
                bar: {
                    type: 'any',
                    encoding: 'ANY_PACKED_TYPE_TAG_BYTE_PREFIX',
                    options: {}
                }
            },
            requiredProperties: ['bar', 'foo']
        }
    });
    test.end();
});
tap_1.default.test('should encode a bounded object with required keys and empty properties', function (test) {
    var schema = {
        type: 'object',
        additionalProperties: false,
        properties: {},
        required: ['foo', 'bar']
    };
    var result = mapper_1.getEncoding(schema, 0);
    test.is(mapper_1.getStates(schema), Infinity);
    test.strictSame(result, {
        type: 'object',
        encoding: 'REQUIRED_ONLY_BOUNDED_TYPED_OBJECT',
        options: {
            booleanRequiredProperties: [],
            propertyEncodings: {
                foo: {
                    type: 'any',
                    encoding: 'ANY_PACKED_TYPE_TAG_BYTE_PREFIX',
                    options: {}
                },
                bar: {
                    type: 'any',
                    encoding: 'ANY_PACKED_TYPE_TAG_BYTE_PREFIX',
                    options: {}
                }
            },
            requiredProperties: ['bar', 'foo']
        }
    });
    test.end();
});
tap_1.default.test('should encode a bounded object with partially defined required keys', function (test) {
    var schema = {
        type: 'object',
        additionalProperties: false,
        required: ['foo', 'bar'],
        properties: {
            foo: {
                type: 'string',
                maxLength: 5
            }
        }
    };
    var result = mapper_1.getEncoding(schema, 0);
    test.is(mapper_1.getStates(schema), Infinity);
    test.strictSame(result, {
        type: 'object',
        encoding: 'REQUIRED_ONLY_BOUNDED_TYPED_OBJECT',
        options: {
            booleanRequiredProperties: [],
            propertyEncodings: {
                foo: {
                    type: 'string',
                    encoding: 'BOUNDED_PREFIX_LENGTH_8BIT_FIXED',
                    options: {
                        minimum: 0,
                        maximum: 5
                    }
                },
                bar: {
                    type: 'any',
                    encoding: 'ANY_PACKED_TYPE_TAG_BYTE_PREFIX',
                    options: {}
                }
            },
            requiredProperties: ['bar', 'foo']
        }
    });
    test.end();
});
tap_1.default.test('should encode a bounded object with fully defined required keys', function (test) {
    var schema = {
        type: 'object',
        additionalProperties: false,
        required: ['foo', 'bar'],
        properties: {
            bar: {
                type: 'string'
            },
            foo: {
                type: 'string',
                maxLength: 5
            }
        }
    };
    var result = mapper_1.getEncoding(schema, 0);
    test.is(mapper_1.getStates(schema), Infinity);
    test.strictSame(result, {
        type: 'object',
        encoding: 'REQUIRED_ONLY_BOUNDED_TYPED_OBJECT',
        options: {
            booleanRequiredProperties: [],
            propertyEncodings: {
                foo: {
                    type: 'string',
                    encoding: 'BOUNDED_PREFIX_LENGTH_8BIT_FIXED',
                    options: {
                        minimum: 0,
                        maximum: 5
                    }
                },
                bar: {
                    type: 'string',
                    encoding: 'FLOOR_PREFIX_LENGTH_ENUM_VARINT',
                    options: {
                        minimum: 0
                    }
                }
            },
            requiredProperties: ['bar', 'foo']
        }
    });
    test.end();
});
tap_1.default.test('should encode a bounded object with no required nor optionals', function (test) {
    var schema = {
        type: 'object',
        additionalProperties: false
    };
    var result = mapper_1.getEncoding(schema, 0);
    test.strictSame(mapper_1.getStates(schema), [
        {}
    ]);
    test.strictSame(result, {
        type: 'enum',
        encoding: 'CONST_NONE',
        options: {
            value: {}
        }
    });
    test.end();
});
tap_1.default.test('should encode a bounded object with optional properties', function (test) {
    var schema = {
        type: 'object',
        additionalProperties: false,
        properties: {
            foo: {
                type: 'string',
                maxLength: 5
            }
        }
    };
    var result = mapper_1.getEncoding(schema, 0);
    test.is(mapper_1.getStates(schema), Infinity);
    test.strictSame(result, {
        type: 'object',
        encoding: 'NON_REQUIRED_BOUNDED_TYPED_OBJECT',
        options: {
            propertyEncodings: {
                foo: {
                    type: 'string',
                    encoding: 'BOUNDED_PREFIX_LENGTH_8BIT_FIXED',
                    options: {
                        minimum: 0,
                        maximum: 5
                    }
                }
            },
            optionalProperties: ['foo']
        }
    });
    test.end();
});
tap_1.default.test('should encode a bounded object with more than one optional keys', function (test) {
    var schema = {
        type: 'object',
        additionalProperties: false,
        properties: {
            bar: {
                type: 'string'
            },
            foo: {
                type: 'string',
                maxLength: 5
            }
        }
    };
    var result = mapper_1.getEncoding(schema, 0);
    test.is(mapper_1.getStates(schema), Infinity);
    test.strictSame(result, {
        type: 'object',
        encoding: 'NON_REQUIRED_BOUNDED_TYPED_OBJECT',
        options: {
            propertyEncodings: {
                foo: {
                    type: 'string',
                    encoding: 'BOUNDED_PREFIX_LENGTH_8BIT_FIXED',
                    options: {
                        minimum: 0,
                        maximum: 5
                    }
                },
                bar: {
                    type: 'string',
                    encoding: 'FLOOR_PREFIX_LENGTH_ENUM_VARINT',
                    options: {
                        minimum: 0
                    }
                }
            },
            optionalProperties: ['bar', 'foo']
        }
    });
    test.end();
});
tap_1.default.test('should encode a bounded object with more than one optional keys and empty required', function (test) {
    var schema = {
        type: 'object',
        additionalProperties: false,
        required: [],
        properties: {
            bar: {
                type: 'string'
            },
            foo: {
                type: 'string',
                maxLength: 5
            }
        }
    };
    var result = mapper_1.getEncoding(schema, 0);
    test.is(mapper_1.getStates(schema), Infinity);
    test.strictSame(result, {
        type: 'object',
        encoding: 'NON_REQUIRED_BOUNDED_TYPED_OBJECT',
        options: {
            propertyEncodings: {
                foo: {
                    type: 'string',
                    encoding: 'BOUNDED_PREFIX_LENGTH_8BIT_FIXED',
                    options: {
                        minimum: 0,
                        maximum: 5
                    }
                },
                bar: {
                    type: 'string',
                    encoding: 'FLOOR_PREFIX_LENGTH_ENUM_VARINT',
                    options: {
                        minimum: 0
                    }
                }
            },
            optionalProperties: ['bar', 'foo']
        }
    });
    test.end();
});
tap_1.default.test('should encode a bounded object with an optional and a required property', function (test) {
    var schema = {
        type: 'object',
        additionalProperties: false,
        required: ['bar'],
        properties: {
            foo: {
                type: 'string',
                maxLength: 5
            }
        }
    };
    var result = mapper_1.getEncoding(schema, 0);
    test.is(mapper_1.getStates(schema), Infinity);
    test.strictSame(result, {
        type: 'object',
        encoding: 'MIXED_BOUNDED_TYPED_OBJECT',
        options: {
            propertyEncodings: {
                foo: {
                    type: 'string',
                    encoding: 'BOUNDED_PREFIX_LENGTH_8BIT_FIXED',
                    options: {
                        minimum: 0,
                        maximum: 5
                    }
                },
                bar: {
                    type: 'any',
                    encoding: 'ANY_PACKED_TYPE_TAG_BYTE_PREFIX',
                    options: {}
                }
            },
            optionalProperties: ['foo'],
            booleanRequiredProperties: [],
            requiredProperties: ['bar']
        }
    });
    test.end();
});
tap_1.default.test('should encode a bounded object with an optional and a typed required property', function (test) {
    var schema = {
        type: 'object',
        additionalProperties: false,
        required: ['bar'],
        properties: {
            bar: {
                type: 'string'
            },
            foo: {
                type: 'string',
                maxLength: 5
            }
        }
    };
    var result = mapper_1.getEncoding(schema, 0);
    test.is(mapper_1.getStates(schema), Infinity);
    test.strictSame(result, {
        type: 'object',
        encoding: 'MIXED_BOUNDED_TYPED_OBJECT',
        options: {
            propertyEncodings: {
                foo: {
                    type: 'string',
                    encoding: 'BOUNDED_PREFIX_LENGTH_8BIT_FIXED',
                    options: {
                        minimum: 0,
                        maximum: 5
                    }
                },
                bar: {
                    type: 'string',
                    encoding: 'FLOOR_PREFIX_LENGTH_ENUM_VARINT',
                    options: {
                        minimum: 0
                    }
                }
            },
            optionalProperties: ['foo'],
            booleanRequiredProperties: [],
            requiredProperties: ['bar']
        }
    });
    test.end();
});
tap_1.default.test('should encode a simple unbounded object', function (test) {
    var schema = {
        type: 'object'
    };
    var result = mapper_1.getEncoding(schema, 0);
    test.is(mapper_1.getStates(schema), Infinity);
    test.strictSame(result, {
        type: 'object',
        encoding: 'ARBITRARY_TYPED_KEYS_OBJECT',
        options: {
            keyEncoding: {
                type: 'string',
                encoding: 'STRING_UNBOUNDED_SCOPED_PREFIX_LENGTH',
                options: {}
            },
            encoding: {
                type: 'any',
                encoding: 'ANY_PACKED_TYPE_TAG_BYTE_PREFIX',
                options: {}
            }
        }
    });
    test.end();
});
tap_1.default.test('should encode a simple unbounded object with empty required', function (test) {
    var schema = {
        type: 'object',
        required: []
    };
    var result = mapper_1.getEncoding(schema, 0);
    test.is(mapper_1.getStates(schema), Infinity);
    test.strictSame(result, {
        type: 'object',
        encoding: 'ARBITRARY_TYPED_KEYS_OBJECT',
        options: {
            keyEncoding: {
                type: 'string',
                encoding: 'STRING_UNBOUNDED_SCOPED_PREFIX_LENGTH',
                options: {}
            },
            encoding: {
                type: 'any',
                encoding: 'ANY_PACKED_TYPE_TAG_BYTE_PREFIX',
                options: {}
            }
        }
    });
    test.end();
});
tap_1.default.test('should encode a simple unbounded object with additionalProperties: true', function (test) {
    var schema = {
        type: 'object',
        additionalProperties: true
    };
    var result = mapper_1.getEncoding(schema, 0);
    test.is(mapper_1.getStates(schema), Infinity);
    test.strictSame(result, {
        type: 'object',
        encoding: 'ARBITRARY_TYPED_KEYS_OBJECT',
        options: {
            keyEncoding: {
                type: 'string',
                encoding: 'STRING_UNBOUNDED_SCOPED_PREFIX_LENGTH',
                options: {}
            },
            encoding: {
                type: 'any',
                encoding: 'ANY_PACKED_TYPE_TAG_BYTE_PREFIX',
                options: {}
            }
        }
    });
    test.end();
});
tap_1.default.test('should encode a simple unbounded object with additionalProperties: schema', function (test) {
    var schema = {
        type: 'object',
        additionalProperties: {
            type: 'string'
        }
    };
    var result = mapper_1.getEncoding(schema, 0);
    test.is(mapper_1.getStates(schema), Infinity);
    test.strictSame(result, {
        type: 'object',
        encoding: 'ARBITRARY_TYPED_KEYS_OBJECT',
        options: {
            keyEncoding: {
                type: 'string',
                encoding: 'STRING_UNBOUNDED_SCOPED_PREFIX_LENGTH',
                options: {}
            },
            encoding: {
                type: 'string',
                encoding: 'FLOOR_PREFIX_LENGTH_ENUM_VARINT',
                options: {
                    minimum: 0
                }
            }
        }
    });
    test.end();
});
tap_1.default.test('should encode a simple unbounded object with propertyNames', function (test) {
    var schema = {
        type: 'object',
        propertyNames: {
            type: 'string',
            maxLength: 5
        }
    };
    var result = mapper_1.getEncoding(schema, 0);
    test.is(mapper_1.getStates(schema), Infinity);
    test.strictSame(result, {
        type: 'object',
        encoding: 'ARBITRARY_TYPED_KEYS_OBJECT',
        options: {
            keyEncoding: {
                type: 'string',
                encoding: 'BOUNDED_PREFIX_LENGTH_8BIT_FIXED',
                options: {
                    minimum: 0,
                    maximum: 5
                }
            },
            encoding: {
                type: 'any',
                encoding: 'ANY_PACKED_TYPE_TAG_BYTE_PREFIX',
                options: {}
            }
        }
    });
    test.end();
});
tap_1.default.test('should encode a simple unbounded object with propertyNames and additionalProperties: true', function (test) {
    var schema = {
        type: 'object',
        additionalProperties: true,
        propertyNames: {
            type: 'string',
            maxLength: 5
        }
    };
    var result = mapper_1.getEncoding(schema, 0);
    test.is(mapper_1.getStates(schema), Infinity);
    test.strictSame(result, {
        type: 'object',
        encoding: 'ARBITRARY_TYPED_KEYS_OBJECT',
        options: {
            keyEncoding: {
                type: 'string',
                encoding: 'BOUNDED_PREFIX_LENGTH_8BIT_FIXED',
                options: {
                    minimum: 0,
                    maximum: 5
                }
            },
            encoding: {
                type: 'any',
                encoding: 'ANY_PACKED_TYPE_TAG_BYTE_PREFIX',
                options: {}
            }
        }
    });
    test.end();
});
tap_1.default.test('should encode a simple unbounded object with propertyNames and additionalProperties: schema', function (test) {
    var schema = {
        type: 'object',
        additionalProperties: {
            type: 'string'
        },
        propertyNames: {
            type: 'string',
            maxLength: 5
        }
    };
    var result = mapper_1.getEncoding(schema, 0);
    test.is(mapper_1.getStates(schema), Infinity);
    test.strictSame(result, {
        type: 'object',
        encoding: 'ARBITRARY_TYPED_KEYS_OBJECT',
        options: {
            keyEncoding: {
                type: 'string',
                encoding: 'BOUNDED_PREFIX_LENGTH_8BIT_FIXED',
                options: {
                    minimum: 0,
                    maximum: 5
                }
            },
            encoding: {
                type: 'string',
                encoding: 'FLOOR_PREFIX_LENGTH_ENUM_VARINT',
                options: {
                    minimum: 0
                }
            }
        }
    });
    test.end();
});
tap_1.default.test('should encode a simple unbounded object with a required property', function (test) {
    var schema = {
        type: 'object',
        required: ['foo']
    };
    var result = mapper_1.getEncoding(schema, 0);
    test.is(mapper_1.getStates(schema), Infinity);
    test.strictSame(result, {
        type: 'object',
        encoding: 'REQUIRED_UNBOUNDED_TYPED_OBJECT',
        options: {
            requiredProperties: ['foo'],
            booleanRequiredProperties: [],
            propertyEncodings: {
                foo: {
                    type: 'any',
                    encoding: 'ANY_PACKED_TYPE_TAG_BYTE_PREFIX',
                    options: {}
                }
            },
            keyEncoding: {
                type: 'string',
                encoding: 'STRING_UNBOUNDED_SCOPED_PREFIX_LENGTH',
                options: {}
            },
            encoding: {
                type: 'any',
                encoding: 'ANY_PACKED_TYPE_TAG_BYTE_PREFIX',
                options: {}
            }
        }
    });
    test.end();
});
tap_1.default.test('should encode a simple unbounded object with a required typed property', function (test) {
    var schema = {
        type: 'object',
        required: ['foo'],
        properties: {
            foo: {
                type: 'string'
            }
        }
    };
    var result = mapper_1.getEncoding(schema, 0);
    test.is(mapper_1.getStates(schema), Infinity);
    test.strictSame(result, {
        type: 'object',
        encoding: 'REQUIRED_UNBOUNDED_TYPED_OBJECT',
        options: {
            requiredProperties: ['foo'],
            booleanRequiredProperties: [],
            propertyEncodings: {
                foo: {
                    type: 'string',
                    encoding: 'FLOOR_PREFIX_LENGTH_ENUM_VARINT',
                    options: {
                        minimum: 0
                    }
                }
            },
            keyEncoding: {
                type: 'string',
                encoding: 'STRING_UNBOUNDED_SCOPED_PREFIX_LENGTH',
                options: {}
            },
            encoding: {
                type: 'any',
                encoding: 'ANY_PACKED_TYPE_TAG_BYTE_PREFIX',
                options: {}
            }
        }
    });
    test.end();
});
tap_1.default.test('should encode a simple unbounded object with two optional properties', function (test) {
    var schema = {
        type: 'object',
        properties: {
            foo: {
                type: 'string'
            },
            bar: {
                type: 'string',
                maxLength: 5
            }
        }
    };
    var result = mapper_1.getEncoding(schema, 0);
    test.is(mapper_1.getStates(schema), Infinity);
    test.strictSame(result, {
        type: 'object',
        encoding: 'OPTIONAL_UNBOUNDED_TYPED_OBJECT',
        options: {
            optionalProperties: ['bar', 'foo'],
            propertyEncodings: {
                foo: {
                    type: 'string',
                    encoding: 'FLOOR_PREFIX_LENGTH_ENUM_VARINT',
                    options: {
                        minimum: 0
                    }
                },
                bar: {
                    type: 'string',
                    encoding: 'BOUNDED_PREFIX_LENGTH_8BIT_FIXED',
                    options: {
                        minimum: 0,
                        maximum: 5
                    }
                }
            },
            keyEncoding: {
                type: 'string',
                encoding: 'STRING_UNBOUNDED_SCOPED_PREFIX_LENGTH',
                options: {}
            },
            encoding: {
                type: 'any',
                encoding: 'ANY_PACKED_TYPE_TAG_BYTE_PREFIX',
                options: {}
            }
        }
    });
    test.end();
});
tap_1.default.test('should encode a complex unbounded object', function (test) {
    var schema = {
        type: 'object',
        required: ['foo', 'bar'],
        additionalProperties: {
            type: 'integer'
        },
        propertyNames: {
            type: 'string',
            minLength: 3
        },
        properties: {
            bar: {
                type: 'string',
                maxLength: 5
            },
            baz: {
                type: 'string'
            }
        }
    };
    var result = mapper_1.getEncoding(schema, 0);
    test.is(mapper_1.getStates(schema), Infinity);
    test.strictSame(result, {
        type: 'object',
        encoding: 'MIXED_UNBOUNDED_TYPED_OBJECT',
        options: {
            optionalProperties: ['baz'],
            requiredProperties: ['bar', 'foo'],
            booleanRequiredProperties: [],
            propertyEncodings: {
                foo: {
                    type: 'integer',
                    encoding: 'ARBITRARY_MULTIPLE_ZIGZAG_VARINT',
                    options: {
                        multiplier: 1
                    }
                },
                bar: {
                    type: 'string',
                    encoding: 'BOUNDED_PREFIX_LENGTH_8BIT_FIXED',
                    options: {
                        minimum: 0,
                        maximum: 5
                    }
                },
                baz: {
                    type: 'string',
                    encoding: 'FLOOR_PREFIX_LENGTH_ENUM_VARINT',
                    options: {
                        minimum: 0
                    }
                }
            },
            keyEncoding: {
                type: 'string',
                encoding: 'FLOOR_PREFIX_LENGTH_ENUM_VARINT',
                options: {
                    minimum: 3
                }
            },
            encoding: {
                type: 'integer',
                encoding: 'ARBITRARY_MULTIPLE_ZIGZAG_VARINT',
                options: {
                    multiplier: 1
                }
            }
        }
    });
    test.end();
});
tap_1.default.test('should encode a bounded object with only boolean required keys', function (test) {
    var schema = {
        type: 'object',
        additionalProperties: false,
        required: ['foo', 'bar'],
        properties: {
            foo: {
                type: 'boolean'
            },
            bar: {
                type: 'boolean'
            }
        }
    };
    var result = mapper_1.getEncoding(schema, 0);
    test.strictSame(mapper_1.getStates(schema), [
        {
            foo: false,
            bar: false
        },
        {
            foo: false,
            bar: true
        },
        {
            foo: true,
            bar: false
        },
        {
            foo: true,
            bar: true
        }
    ]);
    test.strictSame(result, {
        type: 'enum',
        encoding: 'TOP_LEVEL_8BIT_CHOICE_INDEX',
        options: {
            choices: [
                {
                    foo: false,
                    bar: false
                },
                {
                    foo: false,
                    bar: true
                },
                {
                    foo: true,
                    bar: false
                },
                {
                    foo: true,
                    bar: true
                }
            ]
        }
    });
    test.end();
});
tap_1.default.test('should encode a bounded property with a single required boolean', function (test) {
    var schema = {
        type: 'object',
        required: ['jsx'],
        additionalProperties: false,
        properties: {
            jsx: {
                type: 'boolean'
            }
        }
    };
    var result = mapper_1.getEncoding(schema, 0);
    test.strictSame(mapper_1.getStates(schema), [
        {
            jsx: false
        },
        {
            jsx: true
        }
    ]);
    test.strictSame(result, {
        type: 'enum',
        encoding: 'TOP_LEVEL_8BIT_CHOICE_INDEX',
        options: {
            choices: [
                {
                    jsx: false
                },
                {
                    jsx: true
                }
            ]
        }
    });
    test.end();
});
tap_1.default.test('should encode a bounded property with a single boolean', function (test) {
    var schema = {
        type: 'object',
        additionalProperties: false,
        properties: {
            jsx: {
                type: 'boolean'
            }
        }
    };
    var result = mapper_1.getEncoding(schema, 0);
    test.strictSame(mapper_1.getStates(schema), [
        {
            jsx: false
        },
        {
            jsx: true
        },
        {}
    ]);
    test.strictSame(result, {
        type: 'enum',
        encoding: 'TOP_LEVEL_8BIT_CHOICE_INDEX',
        options: {
            choices: [
                {
                    jsx: false
                },
                {
                    jsx: true
                },
                {}
            ]
        }
    });
    test.end();
});
tap_1.default.test('should encode an unbounded object with bounded integers', function (test) {
    var schema = {
        type: 'object',
        additionalProperties: {
            type: 'integer',
            minimum: 0,
            maximum: 2
        },
        required: ['foo', 'bar', 'baz', 'name', 'qux', 'extra', 'flag'],
        properties: {
            name: {
                type: 'string'
            },
            age: {
                type: 'integer',
                minimum: 0
            },
            extra: {
                type: 'integer',
                minimum: 0,
                maximum: 2
            },
            flag: {
                type: 'boolean'
            }
        }
    };
    var result = mapper_1.getEncoding(schema, 0);
    test.is(mapper_1.getStates(schema), Infinity);
    test.strictSame(result, {
        type: 'object',
        encoding: 'PACKED_UNBOUNDED_OBJECT',
        options: {
            packedRequiredProperties: ['bar', 'baz', 'extra', 'foo', 'qux'],
            packedEncoding: {
                type: 'integer',
                encoding: 'BOUNDED_MULTIPLE_8BITS_ENUM_FIXED',
                options: {
                    minimum: 0,
                    maximum: 2,
                    multiplier: 1
                }
            },
            encoding: {
                type: 'any',
                encoding: 'ANY_PACKED_TYPE_TAG_BYTE_PREFIX',
                options: {}
            },
            propertyEncodings: {
                name: {
                    type: 'string',
                    encoding: 'FLOOR_PREFIX_LENGTH_ENUM_VARINT',
                    options: {
                        minimum: 0
                    }
                },
                age: {
                    type: 'integer',
                    encoding: 'FLOOR_MULTIPLE_ENUM_VARINT',
                    options: {
                        minimum: 0,
                        multiplier: 1
                    }
                },
                flag: {
                    type: 'enum',
                    encoding: 'BOUNDED_CHOICE_INDEX',
                    options: {
                        choices: [false, true]
                    }
                }
            },
            optionalProperties: ['age'],
            requiredProperties: ['name'],
            booleanRequiredProperties: ['flag'],
            keyEncoding: {
                type: 'string',
                encoding: 'STRING_UNBOUNDED_SCOPED_PREFIX_LENGTH',
                options: {}
            }
        }
    });
    test.end();
});
tap_1.default.test('should encode an unbounded object with bounded integers with maxProperties > length', function (test) {
    var schema = {
        type: 'object',
        maxProperties: 8,
        additionalProperties: {
            type: 'integer',
            minimum: 0,
            maximum: 2
        },
        required: ['foo', 'bar', 'baz', 'name', 'qux', 'extra', 'flag'],
        properties: {
            name: {
                type: 'string'
            },
            extra: {
                type: 'integer',
                minimum: 0,
                maximum: 2
            },
            flag: {
                type: 'boolean'
            }
        }
    };
    var result = mapper_1.getEncoding(schema, 0);
    test.is(mapper_1.getStates(schema), Infinity);
    test.strictSame(result, {
        type: 'object',
        encoding: 'PACKED_UNBOUNDED_OBJECT',
        options: {
            packedRequiredProperties: ['bar', 'baz', 'extra', 'foo', 'qux'],
            packedEncoding: {
                type: 'integer',
                encoding: 'BOUNDED_MULTIPLE_8BITS_ENUM_FIXED',
                options: {
                    minimum: 0,
                    maximum: 2,
                    multiplier: 1
                }
            },
            encoding: {
                type: 'any',
                encoding: 'ANY_PACKED_TYPE_TAG_BYTE_PREFIX',
                options: {}
            },
            propertyEncodings: {
                name: {
                    type: 'string',
                    encoding: 'FLOOR_PREFIX_LENGTH_ENUM_VARINT',
                    options: {
                        minimum: 0
                    }
                },
                flag: {
                    type: 'enum',
                    encoding: 'BOUNDED_CHOICE_INDEX',
                    options: {
                        choices: [false, true]
                    }
                }
            },
            optionalProperties: [],
            requiredProperties: ['name'],
            booleanRequiredProperties: ['flag'],
            keyEncoding: {
                type: 'string',
                encoding: 'STRING_UNBOUNDED_SCOPED_PREFIX_LENGTH',
                options: {}
            }
        }
    });
    test.end();
});
tap_1.default.test('should encode an unbounded object with bounded integers with maxProperties = length', function (test) {
    var schema = {
        type: 'object',
        maxProperties: 7,
        additionalProperties: {
            type: 'integer',
            minimum: 0,
            maximum: 2
        },
        required: ['foo', 'bar', 'baz', 'name', 'qux', 'extra', 'flag'],
        properties: {
            name: {
                type: 'string'
            },
            extra: {
                type: 'integer',
                minimum: 0,
                maximum: 2
            },
            flag: {
                type: 'boolean'
            }
        }
    };
    var result = mapper_1.getEncoding(schema, 0);
    test.is(mapper_1.getStates(schema), Infinity);
    test.strictSame(result, {
        type: 'object',
        encoding: 'PACKED_BOUNDED_REQUIRED_OBJECT',
        options: {
            packedRequiredProperties: ['bar', 'baz', 'extra', 'foo', 'qux'],
            packedEncoding: {
                type: 'integer',
                encoding: 'BOUNDED_MULTIPLE_8BITS_ENUM_FIXED',
                options: {
                    minimum: 0,
                    maximum: 2,
                    multiplier: 1
                }
            },
            propertyEncodings: {
                name: {
                    type: 'string',
                    encoding: 'FLOOR_PREFIX_LENGTH_ENUM_VARINT',
                    options: {
                        minimum: 0
                    }
                },
                flag: {
                    type: 'enum',
                    encoding: 'BOUNDED_CHOICE_INDEX',
                    options: {
                        choices: [false, true]
                    }
                }
            },
            requiredProperties: ['name'],
            booleanRequiredProperties: ['flag']
        }
    });
    test.end();
});
