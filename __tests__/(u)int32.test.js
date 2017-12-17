const BufferParser = require('../index');

test('int32 with little endian', () => {
    const buffer = Buffer.from([0x88, 0x99, 0xAA, 0xBB, 0xCC, 0xDD, 0xEE, 0xFF]);
    const parser = new BufferParser(buffer);

    expect(parser.int32()).toBe(buffer.readInt32LE(0));
    expect(parser.int32()).toBe(buffer.readInt32LE(4));
});

test('int32 with big endian', () => {
    const buffer = Buffer.from([0x88, 0x99, 0xAA, 0xBB, 0xCC, 0xDD, 0xEE, 0xFF]);
    const parser = new BufferParser(buffer);

    parser.bigEndian();

    expect(parser.int32()).toBe(buffer.readInt32BE(0));
    expect(parser.int32()).toBe(buffer.readInt32BE(4));
});

test('uint32 with little endian', () => {
    const buffer = Buffer.from([0x88, 0x99, 0xAA, 0xBB, 0xCC, 0xDD, 0xEE, 0xFF]);
    const parser = new BufferParser(buffer);

    expect(parser.uint32()).toBe(buffer.readUInt32LE(0));
    expect(parser.uint32()).toBe(buffer.readUInt32LE(4));
});

test('uint32 with big endian', () => {
    const buffer = Buffer.from([0x88, 0x99, 0xAA, 0xBB, 0xCC, 0xDD, 0xEE, 0xFF]);
    const parser = new BufferParser(buffer);

    parser.bigEndian();

    expect(parser.uint32()).toBe(buffer.readUInt32BE(0));
    expect(parser.uint32()).toBe(buffer.readUInt32BE(4));
});