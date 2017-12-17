const BufferParser = require('../index');

test('bit 8', () => {
    const buffer = Buffer.from([0x01, 0x02, 0x03, 0x04]);
    const parser = new BufferParser(buffer);

    const bits = parser.bit8();

    expect(bits[0]).toBe(true);
    expect(bits[1]).toBe(false);
    expect(bits[2]).toBe(false);
    expect(bits[3]).toBe(false);
    expect(bits[4]).toBe(false);
    expect(bits[5]).toBe(false);
    expect(bits[6]).toBe(false);
    expect(bits[7]).toBe(false);
});

test('bit 16', () => {
    const buffer = Buffer.from([0x01, 0x02, 0x03, 0x04]);
    const parser = new BufferParser(buffer);

    const bits = parser.bit16();

    expect(bits[0]).toBe(true);
    expect(bits[1]).toBe(false);
    expect(bits[2]).toBe(false);
    expect(bits[3]).toBe(false);
    expect(bits[4]).toBe(false);
    expect(bits[5]).toBe(false);
    expect(bits[6]).toBe(false);
    expect(bits[7]).toBe(false);
    expect(bits[8]).toBe(false);
    expect(bits[9]).toBe(true);
    expect(bits[10]).toBe(false);
    expect(bits[11]).toBe(false);
    expect(bits[12]).toBe(false);
    expect(bits[13]).toBe(false);
    expect(bits[14]).toBe(false);
    expect(bits[15]).toBe(false);
});

test('bit 32', () => {
    const buffer = Buffer.from([0x01, 0x02, 0x03, 0x04]);
    const parser = new BufferParser(buffer);

    const bits = parser.bit32();

    expect(bits[0]).toBe(true);
    expect(bits[1]).toBe(false);
    expect(bits[2]).toBe(false);
    expect(bits[3]).toBe(false);
    expect(bits[4]).toBe(false);
    expect(bits[5]).toBe(false);
    expect(bits[6]).toBe(false);
    expect(bits[7]).toBe(false);
    expect(bits[8]).toBe(false);
    expect(bits[9]).toBe(true);
    expect(bits[10]).toBe(false);
    expect(bits[11]).toBe(false);
    expect(bits[12]).toBe(false);
    expect(bits[13]).toBe(false);
    expect(bits[14]).toBe(false);
    expect(bits[15]).toBe(false);
    expect(bits[16]).toBe(true);
    expect(bits[17]).toBe(true);
    expect(bits[18]).toBe(false);
    expect(bits[19]).toBe(false);
    expect(bits[20]).toBe(false);
    expect(bits[21]).toBe(false);
    expect(bits[22]).toBe(false);
    expect(bits[23]).toBe(false);
    expect(bits[24]).toBe(false);
    expect(bits[25]).toBe(false);
    expect(bits[26]).toBe(true);
    expect(bits[27]).toBe(false);
    expect(bits[29]).toBe(false);
    expect(bits[29]).toBe(false);
    expect(bits[30]).toBe(false);
    expect(bits[31]).toBe(false);
});