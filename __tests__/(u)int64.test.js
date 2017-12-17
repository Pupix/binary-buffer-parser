const BufferParser = require('../index');

test('int64 with little endian', () => {
    const buffer = Buffer.from([0x00, 0x11, 0x22, 0x33, 0x44, 0x55, 0x66, 0x77, 0x88, 0x99, 0xAA, 0xBB, 0xCC, 0xDD, 0xEE, 0xFF]);
    const parser = new BufferParser(buffer);

    expect(parser.int64()).toBe('8603657889541918976');
    expect(parser.int64()).toBe('-4822678189205112');
});

test('int64 with big endian', () => {
    const buffer = Buffer.from([0x00, 0x11, 0x22, 0x33, 0x44, 0x55, 0x66, 0x77, 0x88, 0x99, 0xAA, 0xBB, 0xCC, 0xDD, 0xEE, 0xFF]);
    const parser = new BufferParser(buffer);

    parser.bigEndian();

    expect(parser.int64()).toBe('4822678189205111');
    expect(parser.int64()).toBe('-8603657889541918977');
});

test('uint64 with little endian', () => {
    const buffer = Buffer.from([0x00, 0x11, 0x22, 0x33, 0x44, 0x55, 0x66, 0x77, 0x88, 0x99, 0xAA, 0xBB, 0xCC, 0xDD, 0xEE, 0xFF]);
    const parser = new BufferParser(buffer);

    expect(parser.uint64()).toBe('8603657889541918976');
    expect(parser.uint64()).toBe('18441921395520346504');
});

test('uint64 with big endian', () => {
    const buffer = Buffer.from([0x00, 0x11, 0x22, 0x33, 0x44, 0x55, 0x66, 0x77, 0x88, 0x99, 0xAA, 0xBB, 0xCC, 0xDD, 0xEE, 0xFF]);
    const parser = new BufferParser(buffer);

    parser.bigEndian();

    expect(parser.uint64()).toBe('4822678189205111');
    expect(parser.uint64()).toBe('9843086184167632639');
});
