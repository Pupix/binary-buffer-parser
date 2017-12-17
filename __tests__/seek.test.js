const BufferParser = require('../index');

test('defaults to 0', () => {
    const buffer = Buffer.from([0x00, 0x00, 0x00]);
    const parser = new BufferParser(buffer);

    expect(parser.seek()).toBe(0);
});

test('correctly changes the offset', () => {
    const buffer = Buffer.from([0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00]);
    const parser = new BufferParser(buffer);

    parser.seek(1);
    expect(parser.tell()).toBe(1);
    parser.seek(3);
    expect(parser.tell()).toBe(3);
    parser.seek(7);
    expect(parser.tell()).toBe(7);
});

test('only accepts positive values', () => {
    const buffer = Buffer.from([0x00, 0x00, 0x00]);
    const parser = new BufferParser(buffer);

    expect(() => parser.seek(-1)).toThrow();
});

test('only accepts values lower than the buffer size', () => {
    const buffer = Buffer.from([0x00, 0x00, 0x00]);
    const parser = new BufferParser(buffer);

    expect(() => parser.seek(5)).toThrow();
});