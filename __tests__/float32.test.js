const BufferParser = require('../index');

test('works with little endian', () => {
    const buffer = Buffer.from([0x00, 0x11, 0x22, 0x33, 0x44, 0x55, 0x66, 0x77]);
    const parser = new BufferParser(buffer);

    expect(parser.float32()).toBe(buffer.readFloatLE(0));
    expect(parser.float32()).toBe(buffer.readFloatLE(4));
});

test('works with big endian', () => {
    const buffer = Buffer.from([0x00, 0x11, 0x22, 0x33, 0x44, 0x55, 0x66, 0x77]);
    const parser = new BufferParser(buffer);

    parser.bigEndian();

    expect(parser.float32()).toBe(buffer.readFloatBE(0));
    expect(parser.float32()).toBe(buffer.readFloatBE(4));
});
