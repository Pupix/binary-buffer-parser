/*jslint bitwise: true, browser: true, devel: true, node: true, ass: true, nomen: true, unparam: true, indent: 4 */

(function () {
    "use strict";

    // Vars
    var XP = require('expandjs'),
        fs = require('fs'),
        stepMap = {
            Int8: 1,
            UInt8: 1,
            Int16: 2,
            UInt16: 2,
            Int32: 4,
            UInt32: 4,
            Float: 4,
            Double: 8
        };

    /*********************************************************************/

    function tryStatSync(fd) {
        let stats;

        try {
            stats = fs.fstatSync(fd);
        } catch (e) {
            fs.closeSync(fd);
            throw e;
        }

        return stats;
    }

    function tryReadSync(fd, buffer, len, pos) {
        var bytesRead;

        try {
            bytesRead = fs.readSync(fd, buffer, 0, len, pos);
        } catch (e) {
            fs.closeSync(fd);
            throw e;
        }
        return bytesRead;
    }

    /*********************************************************************/

    function byteToAnsi(byte) {
        return isAnsi(byte) ? String.fromCharCode(byte) : '.';
    }

    function byteToHex(byte) {
        let res = (byte < 16) ? '0' : '';
        return XP.upperCase(res + byte.toString(16));
    }

    /*********************************************************************/

    //Util
    function isBuffer(item) {
        return item instanceof Buffer;
    }

    function isAnsi(item) {
        return !(item < 32
        || item === 127
        || item === 129
        || item === 141
        || item === 143
        || item === 144
        || item === 157
        || item > 255);
    }

    /*********************************************************************/

    module.exports = new XP.Class('Parser', {

        initialize(buffer) {

            XP.assertArgument(isBuffer(buffer) || XP.isVoid(buffer), 1, 'Buffer');

            this.path = null;
            this._buffer = buffer;
            this._addShorthandMethods();
        },

        /**************************************************************/

        _buffer: {
            value: null,
            configurable : false,
            enumerable: false
        },

        _chunked: {
            value: false,
            configurable : false,
            enumerable: false
        },

        _endian: {
            value: 'LE',
            configurable : false,
            enumerable: false
        },

        _fd: {
            value: null,
            configurable : false,
            enumerable: false
        },

        _offset: {
            value: 0,
            configurable : false,
            enumerable: false
        },

        _size: {
            value: null,
            configurable : false,
            enumerable: false
        },

        /**************************************************************/

        endianess(value) {

            XP.assertArgument(XP.isString(value), 1, 'String');

            value = XP.lowerCase(value);

            if (value === 'little' || value === 'le') {
                this._endian = 'LE';
            }
            if (value === 'big' || value === 'be') {
                this._endian = 'BE';
            }

            return this._endian;
        },

        /**************************************************************/
        open(path) {

            XP.assertArgument(XP.isString(path), 1, 'String');

            this._fd = fs.openSync(path, 'r', 0o666);

            let st = tryStatSync(this._fd);

            this._size = st.isFile() ? st.size : 0;
            this._buffer = null;
            this._chunked = true;

            this.path = path;
        },

        close() {
            fs.closeSync(this._fd);
            this._fd = null;
            this._size = null;
            this._chunked = null;
            this._buffer = null;
            this.path = null;
        },

        /**************************************************************/

        size() {
            return this._chunked ? this._size : this._buffer.length;
        },

        /**************************************************************/

        // To deprecate
        stringView() {
            console.warn('stringView() will be deprecated use string(size()) instead');

            const old = this.tell();

            this.seek(0);
            let result = this._read({_read: 'UInt8', _length: this.size()});
            this.seek(old);

            result = result.map(char => String.fromCharCode(char));
            result = result.join('');
            return result;
        },

        // To deprecate
        hexView() {
            console.warn('hexView() will be deprecated use hex(size()) instead');

            var pre = '';

            const old = this.tell();

            this.seek(0);
            let result = this._read({_read: 'UInt8', _length: this.size()});
            this.seek(old);

            result = result.map(char => {
                pre = (char < 16) ? '0' : '';
                return XP.upperCase(pre + char.toString(16));
            });
            result = result.join('');

            return result;
        },

        // To deprecate
        ansiView() {
            console.warn('ansiView() will be deprecated use ansi(size()) instead');

            const old = this.tell();

            this.seek(0);
            let result = this._read({_read: 'UInt8', _length: this.size()});
            this.seek(old);

            result = result.map(char => isAnsi(char) ? String.fromCharCode(char) : '.');
            result = result.join('');

            return result;
        },

        /**************************************************************/

        tell() {
            return this._offset;
        },

        seek(offset) {

            XP.assertArgument(XP.isNumber(offset), 1, 'Number');
            XP.assertArgument(XP.isWithin(offset, 0, this.size()), 1, 'Out of bound');

            return this._offset = offset;
        },

        skip(offset) {
            return this.seek(this.tell() + offset);
        },

        /**************************************************************/

        int8(length) {
            XP.assertArgument(XP.isVoid(length) || XP.isPositive(length), 1, 'Positive number');
            return this._read({_read: 'Int8', _length: length});
        },

        uint8(length) {
            XP.assertArgument(XP.isVoid(length) || XP.isPositive(length), 1, 'Positive number');
            return this._read({_read: 'UInt8', _length: length});
        },

        int16(length) {
            XP.assertArgument(XP.isVoid(length) || XP.isPositive(length), 1, 'Positive number');
            return this._read({_read: 'Int16', _length: length});
        },

        uint16(length) {
            XP.assertArgument(XP.isVoid(length) || XP.isPositive(length), 1, 'Positive number');
            return this._read({_read: 'UInt16', _length: length});
        },

        int32(length) {
            XP.assertArgument(XP.isVoid(length) || XP.isPositive(length), 1, 'Positive number'); 
            return this._read({_read: 'Int32', _length: length});
        },

        uint32(length) {
            XP.assertArgument(XP.isVoid(length) || XP.isPositive(length), 1, 'Positive number');
            return this._read({_read: 'UInt32', _length: length});
        },

        int64(length) {
            XP.assertArgument(XP.isVoid(length) || XP.isPositive(length), 1, 'Positive number');
            return this._read64({_read: 'Int32', _length: length});
        },

        uint64(length) {
            XP.assertArgument(XP.isVoid(length) || XP.isPositive(length), 1, 'Positive number');
            return this._read64({_read: 'UInt32', _length: length});
        },

        float(length) {
            XP.assertArgument(XP.isVoid(length) || XP.isPositive(length), 1, 'Positive number');
            return this._read({_read: 'Float', _length: length});
        },

        double(length) {
            XP.assertArgument(XP.isVoid(length) || XP.isPositive(length), 1, 'Positive number');
            return this._read({_read: 'Double', _length: length});
        },

        string(length) {
            XP.assertArgument(XP.isPositive(length), 1, 'Positive number');

            let result = this._read({_read: 'UInt8', _length: length});

            if (!Array.isArray(result)) {
                result = [result];
            }

            result = result.map(char => String.fromCharCode(char));
            result = result.join('');

            return result;
        },

        string0() {
            let part,
                result = '';

            while ((part = this.byte()) !== 0) {
                result += String.fromCharCode(part);
            }

            return result;
        },

        /**************************************************************/

        hex(length) {
            let result = this._read({_read: 'UInt8', _length: length});

            if (!Array.isArray(result)) {
                return byteToHex(result);
            }

            return result.map(char => {
                return byteToHex(char);
            });
        },

        ansi(length) {
            let result = this._read({_read: 'UInt8', _length: length});

            if (!Array.isArray(result)) {
                return byteToAnsi(result);
            }

            return result.map(char => {
                return byteToAnsi(char);
            });
        },
        
        /**************************************************************/

        bit8(length) {
            XP.assertArgument(XP.isVoid(length) || XP.isPositive(length), 1, 'Positive number');
            return this._mapBitField(this.uint8(length), 8);
        },

        bit16(length) {
            XP.assertArgument(XP.isVoid(length) || XP.isPositive(length), 1, 'Positive number');
            return this._mapBitField(this.uint16(length), 16);
        },

        bit32(length) {
            XP.assertArgument(XP.isVoid(length) || XP.isPositive(length), 1, 'Positive number');
            return this._mapBitField(this.uint32(length), 32);
        },

        /**************************************************************/

        _addShorthandMethods() {
            var self = this;

            self.byte = self.int8;
            self.ubyte = self.uint8;
            self.short = self.int16;
            self.ushort = self.uint16;
            self.int = self.int32;
            self.uint = self.uint32;
            self.long = self.double;
        },

        /**************************************************************/

        _read: {
            value: function (opt) {
                var i,
                    result = [],
                    method = opt._read + (XP.includes(['Int8', 'UInt8'], opt._read) ? '' : this._endian),
                    length = opt._length || 1;

                // Split this up for easier reading
                if (this._chunked) {
                    let buffer = Buffer.allocUnsafe(stepMap[opt._read] * length);
                    let offset = 0;

                    tryReadSync(this._fd, buffer, stepMap[opt._read] * length, this._offset);

                    for (i = 0; i < length; i += 1) {
                        result.push(buffer['read' + method](offset));
                        offset += stepMap[opt._read];
                        this.skip(stepMap[opt._read]);
                    }
                } else {
                    for (i = 0; i < length; i += 1) {
                        result.push(this._buffer['read' + method](this._offset));
                        this.skip(stepMap[opt._read]);
                    }
                }

                return length === 1 ? result[0] : result;
            },
            configurable : false,
            enumerable: false,
            writable: false
        },

        _read64(opt) {
            var i,
                result = [],
                length = opt._length || 1;

            for (i = 0; i < length; i += 1) {
                let low = this._read({_read: opt._read, _length: 1});
                let high = this._read({_read: opt._read, _length: 1});

                result.push(high.toString(16) + low.toString(16));
            }

            return length === 1 ? result[0] : result;
        },

        _mapBitField(value, length) {
            var flags = [],
                i;

            for (i = 0; i < length; i += 1) {
                flags.push((value & (1 << i)) !== 0);
            }

            return flags;
        }

    });

}());
