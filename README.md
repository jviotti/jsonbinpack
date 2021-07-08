jsonbinpack
===========

A space-efficient schema-driven binary JSON serialization format based on JSON
Schema.

Contributing
------------

Thanks for your interest in contributing to the project. We welcome
contributions in any of the following areas:

- Add more JSON + JSON Schema test cases in the
  [`test/e2e`](https://github.com/jviotti/jsonbinpack/tree/main/test/e2e)
  directory
- Improve the documentation at
  [`docs`](https://github.com/jviotti/jsonbinpack/tree/main/docs)
- Suggesting new encodings to make JSON BinPack more space-efficient
- Performance improvements, primarily in the encoder
- General bug fixes

Additionally, we are tracking the following major changes:

- [ ] Re-write the encoders in C++ and compile to WebAssembly
- [ ] Support recursive JSON Schema documents
- [ ] Implement support for the `if`, `then`, and `else` JSON Schema keywords
- [ ] Implement support for the `anyOf` JSON keyword
- [ ] Implement support for inline binary blobs defined with the
  `contentEncoding` JSON Schema keyword

Don't hesitate in getting in touch if you require guidance on contributing to
the project.

License
-------

This project is released under the terms specified in the
[license](https://github.com/jviotti/jsonbinpack/blob/main/LICENSE).
