import express from 'express';
import path from 'path';
import { promises as fsPromises } from 'fs';

async function checkFiles(
  req: express.Request,
  res: express.Response,
  next: () => void
): Promise<unknown> {
  const filename = String(req.query.filename);

  // check if the filename parameter exists in the directory or not.
  const assetsDirectory = path.join(process.cwd(), 'assets', 'full');
  const allFiles: string[] = [];
  const files = await fsPromises.readdir(assetsDirectory);

  files.forEach((file) => {
    const _filename: string = path.parse(file).base;
    allFiles.push(_filename);
  });
  const result = allFiles.includes(filename + '.jpg');
  if (!result) return res.status(404).send('File not found');

  next();
}

export default checkFiles;
