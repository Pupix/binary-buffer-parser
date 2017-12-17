const BufferParser = require('../index');

test('shorthands', () => {
    const parser = new BufferParser();

    expect(parser.byte).toBe(parser.int8);
    expect(parser.ubyte).toBe(parser.uint8);
    expect(parser.short).toBe(parser.int16);
    expect(parser.ushort).toBe(parser.uint16);
    expect(parser.int).toBe(parser.int32);
    expect(parser.uint).toBe(parser.uint32);
    expect(parser.long).toBe(parser.int64);
    expect(parser.ulong).toBe(parser.uint64);
    expect(parser.half).toBe(parser.float16);
    expect(parser.float).toBe(parser.float32);
    expect(parser.double).toBe(parser.float64);
});
