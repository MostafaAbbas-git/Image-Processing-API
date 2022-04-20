import supertest from 'supertest';
import app from '../index';

const request = supertest(app);

describe('/api/images test suite', () => {
  const filename = 'fjord';
  const width = 200;
  const height = 200;

  it('should return error status 400 for a missing parameter', async () => {
    const res = await request.get('/api/images').query({ filename, width });
    expect(res.status).toBe(400);
  });

  it('should return error status 400 for an invalid parameter', async () => {
    const res = await request
      .get('/api/images')
      .query({ filename, width: 'x', height: 'y' });

    expect(res.status).toBe(400);
  });

  it('should return status 404 if the filename does not exist in the asset folder', async () => {
    const res = await request
      .get('/api/images')
      .query({ filename: 'file', width, height });
    expect(res.status).toBe(404);
  });

  it('should return resized image for proper given parameters', async () => {
    const res = await request
      .get('/api/images')
      .query({ filename, width, height });
    expect(res.status).toBe(200);
    expect(res.headers['content-type']).toEqual('image/jpg');
  });
});
