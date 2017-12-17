const BufferParser = require('../index');

test('stops at null bytes', () => {
    const buffer = Buffer.from([0x68, 0x65, 0x6C, 0x6C, 0x6F, 0x00, 0x77, 0x6F, 0x72, 0x6C, 0x64]);
    const parser = new BufferParser(buffer);

    expect(parser.string0()).toBe('hello');
    expect(parser.string0()).toBe('world');
});

test('stops at end of file', () => {
    const buffer = Buffer.from([0x68, 0x65, 0x6C, 0x6C, 0x6F, 0x00, 0x77, 0x6F, 0x72, 0x6C, 0x64]);
    const parser = new BufferParser(buffer);

    parser.seek(6);
    expect(parser.string0()).toBe('world');
});