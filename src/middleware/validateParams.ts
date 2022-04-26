import express from 'express';

function validateParams(
  req: express.Request,
  res: express.Response,
  next: () => void
): unknown {
  const filename = String(req.query.filename);
  const width = Number(req.query.width);
  const height = Number(req.query.height);

  // validate input parameters
  if (
    isNaN(width) ||
    isNaN(height) ||
    width == 0 ||
    height == 0 ||
    filename == undefined ||
    filename === ''
  ) {
    return res.status(400).send('Invalid parameters!');
  }
  next();
}

export default validateParams;
