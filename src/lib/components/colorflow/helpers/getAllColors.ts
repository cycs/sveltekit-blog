import { displayCommonColors } from './displayCommonColors';
import { numberOfColors, sortAllColors } from './getColorNames';

type GetAllColorsType = {
  splits: number;
  sourceBuffer8: Uint8ClampedArray;
  sourceBuffer32: Int32Array;
};

export const getAllColors = ({
  splits,
  sourceBuffer8,
  sourceBuffer32,
}: GetAllColorsType) => {
  const countColors = [];
  // const last = [];
  let current = [];

  for (let i = 0, k = 0; i < sourceBuffer8.length; i += 4, k++) {
    if (sourceBuffer32[k] !== 0) {
      // ignore black pixels
      current = [sourceBuffer8[i], sourceBuffer8[i + 1], sourceBuffer8[i + 2]];
      // console.log(current);
      if (
        sourceBuffer8[i] <= 255 &&
        sourceBuffer8[i + 1] <= 255 &&
        sourceBuffer8[i + 2] <= 255
      ) {
        countColors.push(current);
      }
    }
  }

  const reducedBuffers = numberOfColors(sourceBuffer8, sourceBuffer32);
  console.log({ countColors });
  const mappedColors = sortAllColors({
    reduced: reducedBuffers,
    all: countColors.filter(
      (a, b) => a[0] <= 255 && a[1] <= 255 && a[2] <= 255,
    ),
    numberOfColors: splits,
  });
  // console.log({ splits, mappedColors });

  displayCommonColors(mappedColors);
};
