import express from 'express';
import fs, { promises as fsPromises } from 'fs';
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

    // directory to check if exists
    const outputDir = 'assets/thumb';

    // check if directory exists
    fs.access(outputDir, (errorNotFound) => {
      // if it does not exist, create it
      if (errorNotFound) {
        fs.mkdir(outputDir, function (err) {
          if (err) {
            return res.send(err);
          }
        });
      }
    });

    const inputImgPath = `assets/full/${filename}.jpg`;
    const outputImgPath = `${outputDir}/${filename}_${width}_${height}_thumb.jpg`;

    try {
      // check for chached image
      if (fs.existsSync(outputImgPath)) {
        // 304: Not Modified
        res.status(304).sendFile(outputImgPath, { root: '.' });
        return;
      }

      // resize img using sharp
      const result = await resizeImage(
        inputImgPath,
        outputImgPath,
        width,
        height
      );
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
