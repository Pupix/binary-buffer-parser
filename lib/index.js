/*jslint bitwise: true, browser: true, devel: true, node: true, ass: true, nomen: true, unparam: true, indent: 4 */

(function (global) {
    "use strict";

    // Vars
    var XP = global.XP || require('expandjs'),
        stepMap = {
            Int8: {
                size: 1,
                needsEndian: false
            },
            UInt8: {
                size: 1,
                needsEndian: false
            },
            Int16: {
                size: 2,
                needsEndian: true
            },
            UInt16: {
                size: 2,
                needsEndian: true
            },
            Int32: {
                size: 4,
                needsEndian: true
            },
            UInt32: {
                size: 4,
                needsEndian: true
            },
            Float: {
                size: 4,
                needsEndian: true
            },
            Double: {
                size: 8,
                needsEndian: true
            }
        };

    /*********************************************************************/

    //Util
    function isBuffer(item) {
        return item instanceof Buffer;
    }

    function isArrayBuffer(item) {
        return item instanceof ArrayBuffer;
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

        initialize: function (buffer) {

            XP.assertArgument(isBuffer(buffer) || isArrayBuffer(buffer), 1, 'Buffer or ArrayBuffer');

            this._buffer = isBuffer(buffer) ? buffer : new Buffer(buffer);
            this.addShorthandMethods_();
        },

        /**************************************************************/

        _buffer: {
            value: null,
            configurable : false,
            enumerable: false
        },

        _endian: {
            value: 'LE',
            configurable : false,
            enumerable: false
        },

        _offset: {
            value: 0,
            configurable : false,
            enumerable: false
        },

        /**************************************************************/

        endianess: function (value) {

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

        size: function () {
            return this._buffer.length;
        },

        /**************************************************************/

        stringView: function () {
            return XP.map(this._buffer, function (byte) {
                return String.fromCharCode(byte);
            });
        },

        hexView: function () {
            var pre = '';
            return XP.map(this._buffer, function (byte) {
                pre = (byte < 16) ? '0' : '';
                return XP.upperCase(pre + byte.toString(16));
            });
        },

        ansiView: function () {
            return XP.map(this._buffer, function (byte) {
                return isAnsi(byte) ? String.fromCharCode(byte) : '.';
            });
        },

        /**************************************************************/

        tell: function () {
            return this._offset;
        },

        seek: function (offset) {

            XP.assertArgument(XP.isNumber(offset), 1, 'Number');
            XP.assertArgument(XP.isWithin(offset, 0, this.size()), 1, 'Out of bound');

            this._offset = offset;
            return this._offset;
        },

        skip: function (offset) {
            return this.seek(this.tell() + offset);
        },

        /**************************************************************/

        int8: function (length) {
            XP.assertArgument(XP.isVoid(length) || XP.isPositive(length), 1, 'Positive number');
            return this._read({_read: 'Int8', _length: length});
        },

        uint8: function (length) {
            XP.assertArgument(XP.isVoid(length) || XP.isPositive(length), 1, 'Positive number');
            return this._read({_read: 'UInt8', _length: length});
        },

        int16: function (length) {
            XP.assertArgument(XP.isVoid(length) || XP.isPositive(length), 1, 'Positive number');
            return this._read({_read: 'Int16', _length: length});
        },

        uint16: function (length) {
            XP.assertArgument(XP.isVoid(length) || XP.isPositive(length), 1, 'Positive number');
            return this._read({_read: 'UInt16', _length: length});
        },

        int32: function (length) {
            XP.assertArgument(XP.isVoid(length) || XP.isPositive(length), 1, 'Positive number');
            return this._read({_read: 'Int32', _length: length});
        },

        uint32: function (length) {
            XP.assertArgument(XP.isVoid(length) || XP.isPositive(length), 1, 'Positive number');
            return this._read({_read: 'UInt32', _length: length});
        },

        float: function (length) {
            XP.assertArgument(XP.isVoid(length) || XP.isPositive(length), 1, 'Positive number');
            return this._read({_read: 'Float', _length: length});
        },

        double: function (length) {
            XP.assertArgument(XP.isVoid(length) || XP.isPositive(length), 1, 'Positive number');
            return this._read({_read: 'Double', _length: length});
        },

        string: function (length) {
            XP.assertArgument(XP.isPositive(length), 1, 'Positive number');
            this.skip(length);
            return this._buffer.toString('utf8', this._offset - length, this._offset);
        },

        string0: function () {
            var start = this.tell(),
                final = start;

            while (this.byte() !== 0) {
                final += 1;
            }

            return this._buffer.toString('utf8', start, final);
        },

        /**************************************************************/

        bit8: function (length) {
            XP.assertArgument(XP.isVoid(length) || XP.isPositive(length), 1, 'Positive number');
            return this._mapBitField(this.uint8(length), 8);
        },

        bit16: function (length) {
            XP.assertArgument(XP.isVoid(length) || XP.isPositive(length), 1, 'Positive number');
            return this._mapBitField(this.uint16(length), 16);
        },

        bit32: function (length) {
            XP.assertArgument(XP.isVoid(length) || XP.isPositive(length), 1, 'Positive number');
            return this._mapBitField(this.uint32(length), 32);
        },

        /**************************************************************/

        addShorthandMethods_: function () {
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
                    method = opt._read + (stepMap[opt._read].needsEndian ? this._endian : ''),
                    length = opt._length || 1;

                for (i = 0; i < length; i += 1) {
                    result.push(this._buffer['read' + method](this._offset));
                    this.skip(stepMap[opt._read].size);
                }

                return length === 1 ? result[0] : result;
            },
            configurable : false,
            enumerable: false,
            writable: false
        },

        _mapBitField: function (value, length) {
            var flags = [],
                i;

            for (i = 0; i < length; i += 1) {
                flags.push((value & (1 << i)) !== 0);
            }

            return flags;
        }

    });

}(typeof window !== "undefined" ? window : global));
