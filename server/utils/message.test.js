var expect = require('expect'),
    { generateMessage, generateLocationMessage } = require('./message');

describe('generateMessage', () => {
  it('should generate correct message object', () => {
    var from = 'John',
        text = 'Some text',
        response = generateMessage(from, text);

    expect(response).toInclude({ from, text });
    expect(response.createdAt).toBeA('number');
  });
});

describe('generateLocationMessage', () => {
  it('should generate correct location object', () => {
    var from = 'John',
        latitude = '1',
        longitude = '1',
        url = `https://www.google.com/maps?q=${latitude},${longitude}`,
        response = generateLocationMessage(from, latitude, longitude);

    expect(response.from).toBe(from);
    expect(response.url).toBe(url);
    expect(response.createdAt).toBeA('number');
  });
});
