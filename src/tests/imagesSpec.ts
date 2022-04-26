import supertest from 'supertest';
import app from '../index';
import resizeImage from '../utilities/processing';
import fs from 'fs';
import path from 'path';

const request = supertest(app);

describe('/api/images test suite', () => {
  const filename = 'fjord';
  const width = 200;
  const height = 200;
  const outputDir = 'assets/thumb';

  //  Remove all files from thumb directory
  beforeEach((): void => {
    fs.readdir(outputDir, (err, files) => {
      if (err) throw err;

      for (const file of files) {
        fs.unlink(path.join(outputDir, file), (err) => {
          if (err) throw err;
        });
      }
    });
  });

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

  it('should return new resized image from the function', async () => {
    const inputImgPath = `assets/full/${filename}.jpg`;
    const outputImgPath = `${outputDir}/${filename}_${width}_${height}_thumb.jpg`;

    expect(async () => {
      await resizeImage(inputImgPath, outputImgPath, 200, 200);
    }).not.toThrow();
  });
});
