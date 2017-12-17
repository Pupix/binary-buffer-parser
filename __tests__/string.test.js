const BufferParser = require('../index');

test('can read string', () => {
    const buffer = Buffer.from([0x68, 0x65, 0x6C, 0x6C, 0x6F, 0x77, 0x6F, 0x72, 0x6C, 0x64]);
    const parser = new BufferParser(buffer);

    expect(parser.string(5)).toBe('hello');
    expect(parser.string(5)).toBe('world');
});