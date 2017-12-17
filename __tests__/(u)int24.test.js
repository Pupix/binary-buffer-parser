const BufferParser = require('../index');

test('int24 with little endian', () => {
    const buffer = Buffer.from([0xAA, 0xBB, 0xCC, 0xDD, 0xEE, 0xFF]);
    const parser = new BufferParser(buffer);

    expect(parser.int24()).toBe(-3359830);
    expect(parser.int24()).toBe(-4387);
});

test('int24 with big endian', () => {
    const buffer = Buffer.from([0xAA, 0xBB, 0xCC, 0xDD, 0xEE, 0xFF]);
    const parser = new BufferParser(buffer);

    parser.bigEndian();

    expect(parser.int24()).toBe(-5588020);
    expect(parser.int24()).toBe(-2232577);
});

test('uint24 with little endian', () => {
    const buffer = Buffer.from([0xAA, 0xBB, 0xCC, 0xDD, 0xEE, 0xFF]);
    const parser = new BufferParser(buffer);

    expect(parser.uint24()).toBe(13417386);
    expect(parser.uint24()).toBe(16772829);
});

test('uint24 with big endian', () => {
    const buffer = Buffer.from([0xAA, 0xBB, 0xCC, 0xDD, 0xEE, 0xFF]);
    const parser = new BufferParser(buffer);

    parser.bigEndian();

    expect(parser.uint24()).toBe(11189196);
    expect(parser.uint24()).toBe(14544639);
});
