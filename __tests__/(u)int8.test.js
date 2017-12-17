const BufferParser = require('../index');

test('int8', () => {
    const buffer = Buffer.from([0xAA, 0xBB]);
    const parser = new BufferParser(buffer);

    expect(parser.int8()).toBe(buffer.readInt8(0));
    expect(parser.int8()).toBe(buffer.readInt8(1));
});

test('uint8', () => {
    const buffer = Buffer.from([0xAA, 0xBB]);
    const parser = new BufferParser(buffer);

    expect(parser.uint8()).toBe(buffer.readUInt8(0));
    expect(parser.uint8()).toBe(buffer.readUInt8(1));
});