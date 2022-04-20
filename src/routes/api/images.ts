import express from 'express';
import { promises as fsPromises } from 'fs';
import { getSharedIdempotencyService } from 'express-idempotency';
import validateParams from '../../middleware/validateParams';
import checkFiles from '../../middleware/checkFiles';
import resizeImage from '../../utilities/processing';

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
      const result = await resizeImage(input, output, width, height);
      await fsPromises
        .readFile(result)
        .then((resizedImg) => {
          // send the data with correct headers
          res.writeHead(200, { 'Content-Type': 'image/jpg' });
          res.end(resizedImg);
        })
        .catch((err) => {
          return res.send(err);
        });
    } catch (err) {
      return res.status(500).send(err);
    }
  }
);

export default images;
