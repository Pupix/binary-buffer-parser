
# binary-buffer-parser
A binary buffer parser with support for infinite sized files.

[![Build Status](https://travis-ci.org/Pupix/binary-buffer-parser.svg?branch=master)](https://travis-ci.org/Pupix/binary-buffer-parser)
[![Pupix's Discord](https://img.shields.io/badge/discord-My%20projects-738bd7.svg?style=flat)](https://discord.gg/hPtrMcx)

## Download
binary-buffer-parser is installable via:

- [GitHub](https://github.com/Pupix/binary-buffer-parser) `git clone https://github.com/Pupix/binary-buffer-parser.git`
- [npm](https://www.npmjs.com/): `npm install binary-buffer-parser`
- [yarn](https://www.yarn.com/): `yarn add binary-buffer-parser`

## Quick example

Parsing buffers
```js
const BinaryParser = require('binary-buffer-parser');
const buffer = Buffer.from('Hello world!');
const bufferParser = new BinaryParser(buffer);

console.log(bufferParser.int8()); // 72
console.log(bufferParser.uint32()); // 1869376613
console.log(bufferParser.string(parser.size())) // Hello World!
```

Parsing files
```js
const BinaryParser = require('binary-buffer-parser');
const fileParser = new BinaryParser();

fileParser.open('/path/to/file');
console.log(fileParser.int8());
console.log(fileParser.uint32());
fileParser.close();
```
---

# Documentation

## Integers methods

### int8(length) / byte(length)

Reads an 8 bit signed integer from the buffer / file.

**Arguments**

1. **{number} [length = 1]** The number of int8 to read consecutively

### uint8(length) / ubyte(length)

Reads an 8 bit unsigned integer from the buffer / file.

**Arguments**

1. **{number} [length = 1]** The number of uint8 to read consecutively

### int16(length) / short(length)

Reads a 16 bit signed integer from the buffer / file.

**Arguments**

1. **{number} [length = 1]** The number of int16 to read consecutively

### uint16(length) / ushort(length)

Reads a 16 bit unsigned integer from the buffer / file.

**Arguments**

1. **{number} [length = 1]** The number of uint16 to read consecutively

### int24(length)

Reads a 24 bit signed integer from the buffer / file.

**Arguments**

1. **{number} [length = 1]** The number of int24 to read consecutively

### uint24(length)

Reads a 24 bit unsigned integer from the buffer / file.

**Arguments**

1. **{number} [length = 1]** The number of uint24 to read consecutively

### int32(length) / int(length)

Reads a 32 bit signed integer from the buffer / file.

**Arguments**

1. **{number} [length = 1]** The number of int32 to read consecutively

### uint32(length) / int(length)

Reads a 32 bit unsigned integer from the buffer / file.

**Arguments**

1. **{number} [length = 1]** The number of uint32 to read consecutively

### int64(length) / long(length)

Reads a 64 bit signed integer from the buffer / file.

**Note**: *JavaScript does not represent 64 bit integers correctly, so the result will be returned as a string*

**Arguments**

1. **{number} [length = 1]** The number of int64 to read consecutively

### uint64(length) / ulong(length)

Reads a 64 bit unsigned integer from the buffer / file.

**Note**: *JavaScript does not represent 64 bit integers correctly, so the result will be returned as a string*

**Arguments**

1. **{number} [length = 1]** The number of uint64 to read consecutively

## Floating points methods

### float16(length) / half(length)

Reads a 16 bit floating point number from the buffer / file.

**Arguments**

1. **{number} [length = 1]** The number of float16 to read consecutively

### float32(length) / float(length)

Reads a 32 bit floating point number from the buffer / file.

**Arguments**

1. **{number} [length = 1]** The number of float32 to read consecutively

### float64(length) / double(length)

Reads a 64 bit signed integer from the buffer / file.

**Arguments**

1. **{number} [length = 1]** The number of float64 to read consecutively

### string(length)

Reads an ASCII string from the buffer / file.

**Parameters**

1. **{number} [length = 1] ** The length of the string.

### string0()

Reads a null terminated ASCII string from the buffer.

### wstring(length)

Reads an UTF16 string from the buffer / file.

**Parameters**

1. **{number} [length = 1] ** The length of the string.

### wstring0()

Reads a null terminated an UTF16 string string from the buffer.

## Bitfield methods

### bit8(length)

Reads an unsigned 8 bit integer from the buffer and returns an array with `true`/`false`
based on the values of each bit.

**Arguments**

1. **{number} [length = 1]** The number of bitfields to read consecutively

### bit16()

Reads an unsigned 16 bit integer from the buffer and returns an array with `true`/`false`
based on the values of each bit.

**Arguments**

1. **{number} [length = 1]** The number of bitfields to read consecutively

### bit32()

Reads an unsigned 32 bit integer from the buffer and returns an array with `true`/`false`
based on the values of each bit.

**Arguments**

1. **{number} [length = 1]** The number of bitfields to read consecutively

## File Methods

### open(path)

Opens a file from the specified path and parses it.

**Parameters**

1. **path {string}** The path to retrieve the file from.

<a name="/close" />
### close()

Closes the previously opened file. Should always be called once you are done parsing to avoid memory leaks.

## Helper Methods

### bigEndian()

Indicates that all subsequent reads and writes from the buffer / file should use big-endian byte order.

### littleEndian()

Indicates that all subsequent reads and writes from the buffer / file should use little-endian byte order.

### isBigEndian()

Returns true if the buffer / file is being read in big-endian byte order, or false otherwise.

### isLittleEndian()

Returns true if the buffer / file is being read in little-endian byte order, or false otherwise.

### size()

Returns the size of the buffer / file in bytes.

### path()

Returns the physical disk location of the buffer.

### eof()

Returns true if the current read position is at the end of the buffer.

### seek(offset)

Sets the current read position to the address `offset`.

1. **offset {number}** The new value of the new offset position.

### skip(offset)

Moves the current read position ahead by offset bytes.

1. **offset {number}** The number of bytes to skip over.

<a name="/tell" />
### tell()

Returns the current read position of the buffer / file.
