const path = require('path');
const BufferParser = require('../index');

test('works with plain buffers', () => {
    const buffer = Buffer.from([0x00, 0x00, 0x00]);
    const parser = new BufferParser(buffer);

    expect(parser.size()).toBe(3);
});

test('works with files', () => {
    const parser = new BufferParser();

    parser.open(path.join(__dirname, 'fixtures', 'size', 'file.bin'));
    expect(parser.size()).toBe(3);
    parser.close();
});