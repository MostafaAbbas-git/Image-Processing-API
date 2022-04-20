import sharp, { OutputInfo } from 'sharp';

const resizeImage = async (
  input: string,
  output: string,
  width: number,
  height: number
): Promise<string> => {
  return sharp(input)
    .resize(width, height)
    .toFile(output)
    .then((info: OutputInfo) => {
      if (info.size > 0) {
        return output;
      } else {
        return 'Error occured. Resized image is corrupted (It has no size).';
      }
    })
    .catch((err) => {
      return err.message;
    });
};

export default resizeImage;
