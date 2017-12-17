const fs = require('fs-extra');

const LITTLE_ENDIAN = 'LE';
const BIG_ENDIAN = 'BE';

const LENGTH_MAP = {
    Int8: 1,
    UInt8: 1,
    Int16LE: 2,
    Int16BE: 2,
    UInt16LE: 2,
    UInt16BE: 2,
    Int32LE: 4,
    Int32BE: 4,
    UInt32LE: 4,
    UInt32BE: 4,
    FloatLE: 4,
    FloatBE: 4,
    DoubleLE: 8,
    DoubleBE: 8
};

/*********************************************************************/

class BufferParser {

    /**
     * Creates a new instance of the BufferParser.
     *
     * @param {Buffer} [buffer] The buffer to be parsed
     * @returns BufferParser
     */
    constructor(buffer) {
        if (buffer && !Buffer.isBuffer(buffer)) {
            throw new TypeError('First parameter must be Buffer');
        }

        this._endian = LITTLE_ENDIAN;
        this._isFile = false;

        this._path = null;
        this._buffer = buffer || null;

        this._fd = null;
        this._size = null;

        this._offset = 0;

        this._addShorthandMethods();
    }

    /*************************************************************************/

    /**
     * Indicates that all subsequent reads and writes from the buffer should use big-endian byte order.
     */
    bigEndian() {
        this._endian = BIG_ENDIAN;
    }

    /**
     * Returns true if the buffer is being read in big-endian byte order, or false otherwise.
     *
     * @returns {boolean}
     */
    isBigEndian() {
        return this._endian === BIG_ENDIAN;
    }

    /**
     * Indicates that all subsequent reads and writes from the buffer should use little-endian byte order.
     */
    littleEndian() {
        this._endian = LITTLE_ENDIAN;
    }

    /**
     * Returns true if the buffer is being read in little-endian byte order, or false otherwise.
     *
     * @returns {boolean}
     */
    isLittleEndian() {
        return this._endian === LITTLE_ENDIAN;
    }

    /**
     * Returns the size of the buffer in bytes.
     *
     * @returns {number}
     */
    size() {
        return this._isFile ? this._size : this._buffer.length;
    }

    /**
     * Returns the physical disk location of the buffer.
     *
     * @returns {string | null}
     */
    path() {
        return this._path;
    }

    /**
     * Returns true if the current read position is at the end of the buffer.
     *
     * @returns {boolean}
     */
    eof() {
        return this.tell() === this.size();
    }

    /*************************************************************************/

    /**
     * Returns the current read position of the buffer.
     *
     * @returns {number}
     */
    tell() {
        return this._offset;
    }

    /**
     * Sets the current read position to the address `offset`.
     *
     * @param {number} [offset = 0]
     * @returns {number}
     */
    seek(offset = 0) {
        if (offset < 0 || offset > this.size()) {
            throw new RangeError('Offset out of range');
        }

        this._offset = offset;

        return this._offset;
    }

    /**
     * Moves the current read position ahead by offset bytes
     *
     * @param {number} [offset = 1]
     * @returns {number}
     */
    skip(offset = 1) {
        return this.seek(this.tell() + offset);
    }

    /*************************************************************************/

    /**
     * Reads an 8 bit signed integer from the buffer.
     *
     * @param {number} [length = 1] The number of int8 to read consecutively
     * @returns {number | number[]}
     */
    int8(length = 1) {
        return this._read('Int8', length);
    }

    /**
     * Reads an 8 bit unsigned integer from the buffer.
     *
     * @param {number} [length = 1] The number of uint8 to read consecutively
     * @returns {number | number[]}
     */
    uint8(length = 1) {
        return this._read('UInt8', length);
    }

    /**
     * Reads a 16 bit signed integer from the buffer.
     *
     * @param {number} [length = 1] The number of int16 to read consecutively
     * @returns {number | number[]}
     */
    int16(length = 1) {
        return this._read(`Int16${this._endian}`, length);
    }

    /**
     * Reads a 16 bit signed integer from the buffer.
     *
     * @param {number} [length = 1] The number of uint16 to read consecutively
     * @returns {number | number[]}
     */
    uint16(length = 1) {
        return this._read(`UInt16${this._endian}`, length);
    }

    /**
     * Reads a 32 bit signed integers from the buffer.
     *
     * @param {number} [length = 1] The number of int32 to read consecutively
     * @returns {number | number[]}
     */
    int32(length = 1) {
        return this._read(`Int32${this._endian}`, length);
    }

    /**
     * Reads a 32 bit signed integer from the buffer.
     *
     * @param {number} [length = 1] The number of uint32 to read consecutively
     * @returns {number | number[]}
     */
    uint32(length = 1) {
        return this._read(`UInt32${this._endian}`, length);
    }

    /**
     * Reads a 32 bit floating point number from the buffer.
     *
     * @param {number} [length = 1] The number of float32 to read consecutively
     * @returns {number | number[]}
     */
    float32(length = 1) {
        return this._read(`Float${this._endian}`, length);
    }

    /**
     * Reads a 64 bit floating point number from the buffer.
     *
     * @param {number} [length = 1] The number of float64 to read consecutively
     * @returns {number | number[]}
     */
    float64(length = 1) {
        return this._read(`Double${this._endian}`, length);
    }

    /**************************************************************/

    /**
     * Reads a 24 bit signed integers from the buffer.
     *
     * @param {number} [length = 1] The number of int24 to read consecutively
     * @returns {number | number[]}
     */
    int24(length = 1) {
        let result = [];

        for (let i = 0; i < length; i += 1) {
            const bytes = this.uint8(3);

            if (this.isBigEndian()) {
                result.push((bytes[0] << 16 | bytes[1] << 8 | bytes[2]) << 8 >> 8);
            } else {
                result.push((bytes[2] << 16 | bytes[1] << 8 | bytes[0]) << 8 >> 8);
            }
        }

        return length === 1 ? result[0] : result;
    }

    /**
     * Reads a 24 bit unsigned integers from the buffer.
     *
     * @param {number} [length = 1] The number of uint24 to read consecutively
     * @returns {number | number[]}
     */
    uint24(length = 1) {
        let result = [];

        for (let i = 0; i < length; i += 1) {
            const bytes = this.uint8(3);

            if (this.isBigEndian()) {
                result.push(bytes[0] << 16 | bytes[1] << 8 | bytes[2]);
            } else {
                result.push(bytes[2] << 16 | bytes[1] << 8 | bytes[0]);
            }
        }

        return length === 1 ? result[0] : result;
    }

    /**
     * Reads a 16 bit floating point number from the buffer.
     *
     * @param {number} [length = 1] The number of float16 to read consecutively
     * @returns {number | number[]}
     */
    float16(length = 1) {
        let result = [];

        for (let i = 0; i < length; i += 1) {
            let value = this.uint16();

            let sign = 1 - 2 * (value >>> 15);
            let exponent = (value >>> 10) & 0x001F;
            let fraction = value & 0x03FF;

            if (exponent === 0) {
                if (fraction === 0) {
                    value = 0;
                } else {
                    value = sign * Math.pow(2, -14) * fraction
                }
            } else if (exponent === 31) {
                if (fraction === 0) {
                    value = sign * (1 / 0)
                } else {
                    value = NaN;
                }
            } else {
                value = sign * Math.pow(2, exponent - 15) * (1 + fraction / 1024);
            }

            result.push(value);
        }

        return length === 1 ? result[0] : result;
    }

    /**
     * Reads a 64 bit signed int from the buffer.
     * Note: JavaScript does not represent 64 bit integers correctly,
     * so the result will be returned as a string
     *
     * @param {number} [length = 1] The number of int64 to read consecutively
     * @returns {string | string[]}
     */
    int64(length = 1) {
        const result = [];
        const bytes = this._read(`Int32${this._endian}`, length * 2);
        const lowOffset = this.isBigEndian() ? 0 : 1;
        const highOffset = this.isBigEndian() ? 1 : 0;

        for (let i = 0; i < bytes.length; i += 2) {
            let high = bytes[i + lowOffset];
            let low = bytes[i + highOffset];
            let isNegative = false;

            if (low < 0) {
                isNegative = true;
                low = Math.abs(low) - 1;
            }

            if (high < 0) {
                isNegative = true;
                high = Math.abs(high) - 1;
            }

            const value = this._longAddition(this._longMultiply(0x100000000, high), low + (isNegative ? 1 : 0));
            result.push(isNegative ? `-${value}` : value);
        }

        return length === 1 ? result[0] : result;
    }

    /**
     * Reads a 64 bit unsigned int from the buffer.
     * Note: JavaScript does not represent 64 bit integers correctly,
     * so the result will be returned as a string
     *
     * @param {number} [length = 1]  The number of uint64 to read consecutively
     * @returns {string | string[]}
     */
    uint64(length = 1) {
        const result = [];
        const bytes = this._read(`UInt32${this._endian}`, length * 2);
        const lowOffset = this.isBigEndian() ? 0 : 1;
        const highOffset = this.isBigEndian() ? 1 : 0;

        for (let i = 0; i < bytes.length; i += 2) {
            const high = bytes[i + lowOffset];
            const low = bytes[i + highOffset];

            const value = this._longAddition(this._longMultiply(0x100000000, high), low);
            result.push(value);
        }

        return length === 1 ? result[0] : result;
    }

    /**************************************************************/

    /**
     * Reads a variable length string from the buffer.
     *
     * @param {number} [length = 1] The number of characters to read
     * @returns {string | string[]}
     */
    string(length = 1) {
        let bytes = this.uint8(length);
        let result = '';

        if (!Array.isArray(bytes)) {
            bytes = [bytes];
        }

        bytes.forEach(byte => {
            result += String.fromCharCode(byte);
        });

        return result;
    }


    /**
     * Reads a null terminated string from the buffer.
     *
     * @returns {string}
     */
    string0() {
        let result = '';
        let part;

        while (!this.eof() && (part = this.uint8()) !== 0) {
            result += String.fromCharCode(part);
        }

        return result;
    }

    /**************************************************************/

    /**
     * Reads an 8 bit bitfield from the buffer.
     *
     * @param {number} [length = 1] The number of bitfields to read consecutively
     * @returns {boolean[]}
     */
    bit8(length = 1) {
        return this._mapBitField(this.uint8(length), 8);
    }

    /**
     * Reads a 16 bit bitfield from the buffer.
     *
     * @param {number} [length = 1] The number of bitfields to read consecutively
     * @returns {boolean[]}
     */
    bit16(length = 1) {
        return this._mapBitField(this.uint16(length), 16);
    }

    /**
     * Reads an 32 bit bitfield from the buffer.
     *
     * @param {number} [length = 1] The number of bitfields to read consecutively
     * @returns {boolean[]}
     */
    bit32(length = 1) {
        return this._mapBitField(this.uint32(length), 32);
    }

    /*************************************************************************/

    /**
     * Opens a file from the specified path and parses it.
     *
     * @param {string} [path] The path to read the file from.
     */
    open(path) {
        this._fd = fs.openSync(path, 'r', 0o666);

        try {
            const stats = fs.fstatSync(this._fd);

            this._size = stats.isFile() ? stats.size : 0;
            this._buffer = null;
            this._isFile = true;

            this._path = path;
        } catch (error) {
            this.close();
            throw error;
        }
    }

    /**
     * Closes the previously opened file. Should always be
     * called once you are done parsing to avoid memory leaks.
     */
    close() {
        fs.closeSync(this._fd);

        this._fd = null;
        this._size = null;
        this._isFile = null;
        this._buffer = null;
        this._path = null;
    }

    /*************************************************************************/

    _read(method, length) {
        return this._isFile ? this._readFileChunk(method, length) : this._readBuffer(method, length);
    }

    _readFileChunk(method, length) {
        const result = [];

        try {
            const buffer = Buffer.alloc(LENGTH_MAP[method] * length);
            fs.readSync(this._fd, buffer, 0, LENGTH_MAP[method] * length, this._offset);

            for (let i = 0; i < length; i += 1) {
                result.push(buffer[`read${method}`](LENGTH_MAP[method] * i));
                this.skip(LENGTH_MAP[method]);
            }
        } catch (error) {
            fs.closeSync(this._fd);
            throw error;
        }

        return length === 1 ? result[0] : result;
    }

    _readBuffer(method, length) {
        const result = [];

        for (let i = 0; i < length; i += 1) {
            result.push(this._buffer[`read${method}`](this._offset));
            this.skip(LENGTH_MAP[method]);
        }

        return length === 1 ? result[0] : result;
    }

    /**
     * Transforms an integer to a bitfield.
     *
     * @param {number} [value] The value to be converted
     * @param {number} [length] The number of bits to map
     * @returns {boolean[]}
     */
    _mapBitField(value, length) {
        const flags = [];

        for (let i = 0; i < length; i += 1) {
            flags.push((value & (1 << i)) !== 0);
        }

        return flags;
    }

    /**
     * Multiplies two numbers using elementary school long
     * multiplication to bypass JS's 64 bit int limitations.
     * http://mathworld.wolfram.com/LongMultiplication.html
     *
     * @param {number} [a] Multiplicand
     * @param {number} [b] Multiplier
     * @returns {string}
     *
     */
    _longMultiply(a, b) {
        a = a.toString().split("").reverse();
        b = b.toString().split("").reverse();

        let result = [];

        for (let i = 0; i < a.length; i += 1) {
            for (let j = 0; j < b.length; j += 1) {
                let idx = i + j;
                result[idx] = a[i] * b[j] + (idx >= result.length ? 0 : result[idx]);

                if (result[idx] > 9) {
                    result[idx + 1] = Math.floor(result[idx] / 10) + (idx + 1 >= result.length ? 0 : result[idx + 1]);
                    result[idx] -= Math.floor(result[idx] / 10) * 10;
                }
            }
        }

        return result.reverse().join("");
    }

    /**
     * Adds two numbers using elementary school
     * addition to bypass JS's 64 bit int limitations.
     * http://mathworld.wolfram.com/Addition.html
     *
     * @param {number} [a] Addend
     * @param {number} [b] Addend
     * @returns {string}
     *
     */
    _longAddition(a, b) {
        a = a.toString().split('').reverse();
        b = b.toString().split('').reverse();

        const length = Math.max(a.length, b.length);
        let result = [];
        let reminder = 0;

        for(let i = 0; i < length; i += 1) {
            let currentSum = Number(a[i] || 0) + Number(b[i] || 0) + reminder;
            reminder = ~~(currentSum / 10);
            result.push(currentSum % 10);
        }

        if (reminder !== 0) {
            result.push(reminder);
        }

        return result.reverse().join('');
    }

    /*************************************************************************/

    _addShorthandMethods() {
        this.byte = this.int8;
        this.ubyte = this.uint8;
        this.short = this.int16;
        this.ushort = this.uint16;
        this.int = this.int32;
        this.uint = this.uint32;
        this.long = this.int64;
        this.ulong = this.uint64;
        this.half = this.float16;
        this.float = this.float32;
        this.double = this.float64;
    }
}

module.exports = BufferParser;
