# binary-buffer-parser
A simple binary buffer parser with support for infinite sized files.

## Download
binary-buffer-parser is installable via:

- [GitHub](https://github.com/Pupix/binary-buffer-parser) `git clone https://github.com/Pupix/binary-buffer-parser.git`
- [npm](https://www.npmjs.com/): `npm install binary-buffer-parser`

## Quick example

```js
var BinaryParser = require('binary-buffer-parser'),
    buffer = new Buffer('Hello world!')
    parser = new BinaryParser(buffer);
        
    console.log(parser.int8()); // 72
    console.log(parser.uint32()); // 1869376613
    console.log(parser.stringView().join('')) // Hello World!
```

---

## Methods

####[Helper Methods](#/helper-methods)
* [`endianess`](#/endianess)
* [`size`](#/size)
* [`seek`](#/seek)
* [`skip`](#/skip)
* [`tell`](#/tell)

####[Generic Methods](#/generic-methods)
* [`int8 / byte`](#/int8)
* [`uint8 / ubyte`](#/uint8)
* [`int16 / short`](#/int16)
* [`uint16 / ushort`](#/uint16)
* [`int32 / int`](#/int32)
* [`uint32 / uint`](#/uint32)
* [`int64`](#/int64)
* [`uint64`](#/uint64)
* [`float`](#/float)
* [`double / long`](#/double)
* [`string`](#/string)
* [`string0`](#/string0)
* [`hex`](#/hex)
* [`ansi`](#/ansi)

####[Bitfield Methods](#/bitfield-methods)
* [`bit8`](#/bit8)
* [`bit16`](#/bit16)
* [`bit32`](#/bit32)

####[View Methods](#/view-methods)
* [`stringView`](#/stringView)
* [`hexView`](#/hexView)
* [`ansiView`](#/ansiView)

####[File Methods](#/file-methods)
* [`open`](#/open)
* [`close`](#/close)

---

# Documentation

<a name="/helper-methods" />
## Helper Methods

<a name="/endianess" />
### endianess(endian)

Sets the endian format of the parser.

**Parameters**

1. **endian {string}** The new endian format. Can be either `little`/`LE` for little endian or `big`/`BE` for big endian.

<a name="/size" />
### size()

Returns the length of the buffer.

<a name="/seek" />
### seek(offset)

Sets the offset of the reading cursor at the passed position, starting from the beginning of the buffer.

1. **offset {number}** The new value of the new offset position.

<a name="/skip" />
### skip(offset)

Advances the reading cursor by the passed offset from its current position.

1. **offset {number}** The number of bytes to skip over.

<a name="/tell" />
### tell()

Returns the position of the reading cursor inside the buffer.

<a name="/generic-methods" />
## Generic Methods

<a name="/int8" />
### int8(length) / byte(length)

Reads a signed 8 bit integer from the buffer. If `length` is passed, the same function
will be ran multiple times and return the result as an array. 

**Parameters**

1. **[length] {number}** The number of int8 to read consecutively

<a name="/uint8" />
### uint8(length) / ubyte(length)

Reads a unsigned 8 bit integer from the buffer. If `length` is passed, the same function
will be ran multiple times and return the result as an array. 

**Parameters**

1. **[length] {number}** The number of uint8 to read consecutively

<a name="/int16" />
### int16(length) / short(length)

Reads a signed 16 bit integer from the buffer. If `length` is passed, the same function
will be ran multiple times and return the result as an array. 

**Parameters**

1. **[length] {number}** The number of int16 to read consecutively

<a name="/uint16" />
### uint16(length) / ushort(length)

Reads a unsigned 16 bit integer from the buffer. If `length` is passed, the same function
will be ran multiple times and return the result as an array. 

**Parameters**

1. **[length] {number}** The number of uint16 to read consecutively

<a name="/int32" />
### int32(length) / int(length)

Reads a signed 32 bit integer from the buffer. If `length` is passed, the same function
will be ran multiple times and return the result as an array. 

**Parameters**

1. **[length] {number}** The number of int32 to read consecutively

<a name="/uint32" />
### uint32(length) / uint(length)

Reads a unsigned 32 bit integer from the buffer. If `length` is passed, the same function
will be ran multiple times and return the result as an array. 

**Parameters**

1. **[length] {number}** The number of uint32 to read consecutively

<a name="/int64" />
### int64(length)

Reads a signed 64 bit integer from the buffer. If `length` is passed, the same function
will be ran multiple times and return the result as an array.

**N.B** Due to JavaScript's limitations for long int all int64 values will be returned as a hexadecimal string

**Parameters**

1. **[length] {number}** The number of int32 to read consecutively

<a name="/uint64" />
### uint64(length)

Reads a unsigned 64 bit integer from the buffer. If `length` is passed, the same function
will be ran multiple times and return the result as an array. 

**N.B** Due to JavaScript's limitations for long int all uint64 values will be returned as a hexadecimal string

**Parameters**

1. **[length] {number}** The number of uint32 to read consecutively

<a name="/float" />
### float(length)

Reads a 32 bit float from the buffer. If `length` is passed, the same function
will be ran multiple times and return the result as an array. 

**Parameters**

1. **[length] {number}** The number of floats to read consecutively

<a name="/double" />
### double(length) / long(length)

Reads a unsigned 64 bit double from the buffer. If `length` is passed, the same function
will be ran multiple times and return the result as an array. 

**Parameters**

1. **[length] {number}** The number of doubles to read consecutively

<a name="/string" />
### string(length)

Reads an ASCII string from the buffer. 

**Parameters**

1. **length {number}** The length of the string.

<a name="/string0" />
### string0()

Reads a null terminated ASCII string from the buffer.

<a name="/hex" />
### hex(length)

Reads a byte from the buffer and return its hexadecimal representation. If `length` is passed, the same function
will be ran multiple times and return the result as an array. 

**Parameters**

1. **[length] {number}** The number of bytes to read consecutively

<a name="/ansi" />
### ansi(length)

Reads a byte from the buffer and return its ansi representation. If `length` is passed, the same function
will be ran multiple times and return the result as an array. 

**Parameters**

1. **[length] {number}** The number of bytes to read consecutively

<a name="/bitfield-methods" />
## Bitfield methods

<a name="/bit8" />
### bit8()

Reads an unsigned 8 bit integer from the buffer and returns an array with `true`/`false`
based on the values of each bit.

<a name="/bit16" />
### bit16()

Reads an unsigned 16 bit integer from the buffer and returns an array with `true`/`false`
based on the values of each bit.

<a name="/bit32" />
### bit32()

Reads an unsigned 32 bit integer from the buffer and returns an array with `true`/`false`
based on the values of each bit.

<a name="/view-methods" />
## View Methods

<a name="/stringView" />
### stringView()

Returns the buffer in ASCII encoding inside an array, divided by character.

<a name="/hexView" />
### hexView()

Returns the buffer in hexadecimal encoding inside an array, divided by byte.

<a name="/ansiView" />
### ansiView()

Returns the buffer in ANSI encoding inside an array, divided by character.


<a name="/file-methods" />
## File Methods

<a name="/open" />
### open(path)

Opens and reads a file from the specified path.

**Parameters**

1. **path {string}** The path to retrieve the file from.

<a name="/close" />
### close()

Closes the file previously opened.
