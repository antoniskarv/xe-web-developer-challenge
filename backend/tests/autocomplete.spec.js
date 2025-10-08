const request = require('supertest');
const app = require('../server');
const axios = require('axios');

jest.mock('axios');

describe('GET /api/autocomplete', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // clear cache between tests
    if (app?.locals?.__clearAutocompleteCache) {
      app.locals.__clearAutocompleteCache();
    }
  });

  it('returns [] when input < 3 chars', async () => {
    const res = await request(app).get('/api/autocomplete?input=na');
    expect(res.status).toBe(200);
    expect(res.body).toEqual([]);
    expect(axios.get).not.toHaveBeenCalled();
  });

  it('proxies results from external API', async () => {
    axios.get.mockResolvedValueOnce({
      status: 200,
      data: [{ placeId: 'p1', mainText: 'Nafplio', secondaryText: 'Ελλάδα' }]
    });
    const res = await request(app).get('/api/autocomplete?input=naf');
    expect(res.status).toBe(200);
    expect(res.body[0].placeId).toBe('p1');
    expect(axios.get).toHaveBeenCalledTimes(1);
  });

  it('serves second identical request from cache (no extra axios call)', async () => {
    axios.get.mockResolvedValueOnce({
      status: 200,
      data: [{ placeId: 'p2', mainText: 'Athens', secondaryText: 'Ελλάδα' }]
    });

    // 1st call populates cache
    const first = await request(app).get('/api/autocomplete?input=ath');
    expect(first.status).toBe(200);
    expect(axios.get).toHaveBeenCalledTimes(1);

    // 2nd call should be served from cache
    const second = await request(app).get('/api/autocomplete?input=ATH');
    expect(second.status).toBe(200);
    expect(second.body[0].placeId).toBe('p2');

    expect(axios.get).toHaveBeenCalledTimes(1);
  });

  it('handles provider error/status', async () => {
    axios.get.mockResolvedValueOnce({ status: 500, data: {} });
    const res = await request(app).get('/api/autocomplete?input=errx');
    expect(res.status).toBe(502);
  });

  it('handles network failure', async () => {
    axios.get.mockRejectedValueOnce(new Error('timeout'));
    const res = await request(app).get('/api/autocomplete?input=netx');
    expect(res.status).toBe(502);
  });
});
