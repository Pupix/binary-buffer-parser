const BufferParser = require('../index');

test('initial value should be 0', () => {
    const buffer = Buffer.from([0x00, 0x00, 0x00]);
    const parser = new BufferParser(buffer);

    expect(parser.tell()).toBe(0);
});

test('updated correctly after read', () => {
    const buffer = Buffer.from([0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00]);
    const parser = new BufferParser(buffer);

    parser.uint8();
    expect(parser.tell()).toBe(1);
    parser.uint16();
    expect(parser.tell()).toBe(3);
    parser.uint32();
    expect(parser.tell()).toBe(7);
});

test('updated correctly after skip', () => {
    const buffer = Buffer.from([0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00]);
    const parser = new BufferParser(buffer);

    parser.skip(1);
    expect(parser.tell()).toBe(1);
    parser.skip(2);
    expect(parser.tell()).toBe(3);
    parser.skip(4);
    expect(parser.tell()).toBe(7);
});

test('updated correctly after seek', () => {
    const buffer = Buffer.from([0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00]);
    const parser = new BufferParser(buffer);

    parser.seek(1);
    expect(parser.tell()).toBe(1);
    parser.seek(3);
    expect(parser.tell()).toBe(3);
    parser.seek(7);
    expect(parser.tell()).toBe(7);
});