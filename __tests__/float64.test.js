const BufferParser = require('../index');

test('works with little endian', () => {
    const buffer = Buffer.from([0x00, 0x11, 0x22, 0x33, 0x44, 0x55, 0x66, 0x77, 0x88, 0x99, 0xAA, 0xBB, 0xCC, 0xDD, 0xEE, 0xFF]);
    const parser = new BufferParser(buffer);

    expect(parser.float64()).toBe(buffer.readDoubleLE(0));
    expect(parser.float64()).toBe(buffer.readDoubleLE(8));
});

test('works with big endian', () => {
    const buffer = Buffer.from([0x00, 0x11, 0x22, 0x33, 0x44, 0x55, 0x66, 0x77, 0x88, 0x99, 0xAA, 0xBB, 0xCC, 0xDD, 0xEE, 0xFF]);
    const parser = new BufferParser(buffer);

    parser.bigEndian();

    expect(parser.float64()).toBe(buffer.readDoubleBE(0));
    expect(parser.float64()).toBe(buffer.readDoubleBE(8));
});
