import express from 'express';
import { promises as fsPromises } from 'fs';
import sharp, { OutputInfo } from 'sharp';
import { getSharedIdempotencyService } from 'express-idempotency';
import validateParams from '../../middleware/validateParams';
import checkFiles from '../../middleware/checkFiles';

const images = express.Router();

images.get(
  '/',
  [validateParams, checkFiles],
  async (req: express.Request, res: express.Response) => {
    // Check if there was a hit! (idempotency)
    const idempotencyService = getSharedIdempotencyService();
    if (idempotencyService.isHit(req)) {
      return;
    }

    const filename = String(req.query.filename);
    const width = Number(req.query.width);
    const height = Number(req.query.height);

    const input = `assets/full/${filename}.jpg`;
    const output = `assets/thumb/${filename}_thumb.jpg`;

    try {
      // resize img using sharp
      sharp(input)
        .resize(width, height)
        .toFile(output, async (err: Error, info: OutputInfo) => {
          // throw any expected/unexpected error
          if (err) throw err;
          if (info.size > 0) {
            // that means the output image is not empty
            // display the resized image in the browser
            await fsPromises
              .readFile(output)
              .then((data) => {
                // send the data with correct headers
                res.writeHead(200, { 'Content-Type': 'image/jpg' });
                res.end(data);
              })
              .catch((err) => {
                return res.send(err);
              });
          } else {
            return res
              .status(500)
              .send('Error occured. Resized image is corrupted.');
          }
        });
    } catch (err) {
      return res.send(err);
    }
  }
);

export default images;
