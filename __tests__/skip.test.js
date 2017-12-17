const BufferParser = require('../index');

test('skips 1 byte by default', () => {
    const buffer = Buffer.from([0x00, 0x00, 0x00]);
    const parser = new BufferParser(buffer);

    parser.skip();
    expect(parser.tell()).toBe(1);
});

test('correctly changes the offset', () => {
    const buffer = Buffer.from([0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00]);
    const parser = new BufferParser(buffer);

    parser.skip(1);
    expect(parser.tell()).toBe(1);
    parser.skip(2);
    expect(parser.tell()).toBe(3);
    parser.skip(4);
    expect(parser.tell()).toBe(7);
});

test('only accepts positive values', () => {
    const buffer = Buffer.from([0x00, 0x00, 0x00]);
    const parser = new BufferParser(buffer);

    expect(() => parser.skip(-1)).toThrow();
});

test('only accepts values lower than the buffer size', () => {
    const buffer = Buffer.from([0x00, 0x00, 0x00]);
    const parser = new BufferParser(buffer);

    expect(() => parser.skip(5)).toThrow();
});