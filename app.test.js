const request = require('supertest');
const app = require('./app'); // Adjust the path to your app file

describe('GET /', () => {
  it('should return index.html', async () => {
    const response = await request(app).get('/');
    expect(response.statusCode).toBe(200);
    expect(response.text).toContain('index.html'); // Adjust based on your HTML content
  });
});

describe('POST /review', () => {
  it('should insert a review', async () => {
    const response = await request(app).post('/review').send({ username:"paul",review:"this is good",imdb_id:"hello" });
    expect(response.statusCode).toBe(200);
    expect(response.text).toContain('review.html'); // Adjust based on your response
  });
});