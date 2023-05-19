import { displayCommonColors } from './displayCommonColors';
import { numberOfColors, sortAllColors } from './getColorNames';

export const getAllColors = (
  splits: number,
  sourceBuffer8: Uint8ClampedArray,
  sourceBuffer32: Int32Array,
) => {
  let splitsValue =
    (document.querySelector('.radial__colors .radial__input') as HTMLElement)
      ?.dataset?.key || '';

  var countColors = [],
    last = [],
    current = [],
    // inputValueParsed = parseInt(splitsValue.value),
    splits = parseInt(splitsValue);

  for (var i = 0, k = 0; i < sourceBuffer8.length; i += 4, k++) {
    if (sourceBuffer32[k] !== 0) {
      // ignore black pixels
      current = [sourceBuffer8[i], sourceBuffer8[i + 1], sourceBuffer8[i + 2]];
      countColors[countColors.length] = current;
    }
  }
  var mappedColors = sortAllColors(
    numberOfColors(sourceBuffer8, sourceBuffer32),
    countColors,
    splits,
  );

  displayCommonColors(mappedColors);
};
