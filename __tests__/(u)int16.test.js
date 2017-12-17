const BufferParser = require('../index');

test('int16 with little endian', () => {
    const buffer = Buffer.from([0xAA, 0xBB, 0xCC, 0xDD]);
    const parser = new BufferParser(buffer);

    expect(parser.int16()).toBe(buffer.readInt16LE(0));
    expect(parser.int16()).toBe(buffer.readInt16LE(2));
});

test('int16 with big endian', () => {
    const buffer = Buffer.from([0xAA, 0xBB, 0xCC, 0xDD]);
    const parser = new BufferParser(buffer);

    parser.bigEndian();

    expect(parser.int16()).toBe(buffer.readInt16BE(0));
    expect(parser.int16()).toBe(buffer.readInt16BE(2));
});

test('uint16 with little endian', () => {
    const buffer = Buffer.from([0xAA, 0xBB, 0xCC, 0xDD]);
    const parser = new BufferParser(buffer);

    expect(parser.uint16()).toBe(buffer.readUInt16LE(0));
    expect(parser.uint16()).toBe(buffer.readUInt16LE(2));
});

test('uint16 with big endian', () => {
    const buffer = Buffer.from([0xAA, 0xBB, 0xCC, 0xDD]);
    const parser = new BufferParser(buffer);

    parser.bigEndian();

    expect(parser.uint16()).toBe(buffer.readUInt16BE(0));
    expect(parser.uint16()).toBe(buffer.readUInt16BE(2));
});