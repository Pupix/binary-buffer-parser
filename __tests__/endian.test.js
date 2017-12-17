const BufferParser = require('../index');


test('defaults to little endian', () => {
    const buffer = Buffer.from([]);
    const parser = new BufferParser(buffer);

    expect(parser.isLittleEndian()).toBe(true);
    expect(parser.isBigEndian()).toBe(false);
});

test('can change to big endian', () => {
    const buffer = Buffer.from([]);
    const parser = new BufferParser(buffer);

    parser.bigEndian();

    expect(parser.isLittleEndian()).toBe(false);
    expect(parser.isBigEndian()).toBe(true);
});

test('can change to back and forth between endians', () => {
    const buffer = Buffer.from([]);
    const parser = new BufferParser(buffer);

    parser.bigEndian();

    expect(parser.isLittleEndian()).toBe(false);
    expect(parser.isBigEndian()).toBe(true);

    parser.littleEndian();

    expect(parser.isLittleEndian()).toBe(true);
    expect(parser.isBigEndian()).toBe(false);
});