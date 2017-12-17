const BufferParser = require('../index');

test('works with little endian', () => {
    const buffer = Buffer.from([0x00, 0x11, 0x22, 0x33]);
    const parser = new BufferParser(buffer);

    expect(parser.float16()).toBe(0.0006103515625);
    expect(parser.float16()).toBe(0.222900390625);
});

test('works with big endian', () => {
    const buffer = Buffer.from([0x00, 0x11, 0x22, 0x33]);
    const parser = new BufferParser(buffer);

    parser.bigEndian();

    expect(parser.float16()).toBe(0.00103759765625);
    expect(parser.float16()).toBe(0.01210784912109375);
});
