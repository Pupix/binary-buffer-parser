const path = require('path');
const BufferParser = require('../index');

const fixturePath = path.join(__dirname, 'fixtures', 'file', 'file.bin');

test('can access file buffers', () => {
    const parser = new BufferParser();

    parser.open(fixturePath);
    expect(parser.path()).toBe(fixturePath);
    expect(parser.size()).toBe(3);
    parser.close();
});

test('can read from file buffers', () => {
    const parser = new BufferParser();

    parser.open(fixturePath);
    expect(parser.uint8()).toBe(0x00);

    parser.bigEndian();
    expect(parser.uint16()).toBe(0x1122);
    parser.close();
});