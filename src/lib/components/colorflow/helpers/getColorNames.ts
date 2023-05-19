// formulas : http://www.easyrgb.com/en/math.php
//https://www.rapidtables.com
export const hexToVBCode = (hexCode: string) => {
  let index = hexCode.substring(1);
  return parseInt(index, 16);
};

export const rgbToLab = (r: number, g: number, b: number) => {
  const normalizedColorValue = (val: number) => {
    val = val / 255;
    return val > 0.04045 ? Math.pow((val + 0.055) / 1.055, 2.4) : val / 12.92;
  };

  const x =
    (normalizedColorValue(r) * 0.4124 +
      normalizedColorValue(g) * 0.3576 +
      normalizedColorValue(b) * 0.1805) /
    0.95047;
  const y =
    (normalizedColorValue(r) * 0.2126 +
      normalizedColorValue(g) * 0.7152 +
      normalizedColorValue(b) * 0.0722) /
    1.0;
  const z =
    (normalizedColorValue(r) * 0.0193 +
      normalizedColorValue(g) * 0.1192 +
      normalizedColorValue(b) * 0.9505) /
    1.08883;

  const l = Math.round(116 * y - 16);
  const a = Math.round(500 * (x - y));
  const bb = Math.round(200 * (y - z));

  return [l, a, bb];
};

export const rgbToCmyk = (r: number, g: number, b: number) => {
  let c = 1 - r / 255;
  let m = 1 - g / 255;
  let y = 1 - b / 255;
  let k = 1;

  const minCMY = Math.min(c, m, y);

  if (minCMY < k) {
    k = minCMY;
  }

  c = (c - k) / (1 - k);
  m = (m - k) / (1 - k);
  y = (y - k) / (1 - k);
  k *= 100;

  const cmyk = [c * 100, m * 100, y * 100, k];

  return cmyk.map((value) => parseFloat(value.toFixed(1)));
};

export const rgbToHsv = (r: number, g: number, b: number) => {
  //   (r = r / 255), (g = g / 255), (b = b / 255);
  const bitR = r / 255;
  const bitG = g / 255;
  const bitB = b / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);

  let h = 0; // achromatic;
  let s: number;
  let v = max;

  var d = max - min;
  s = max === 0 ? 0 : d / max;

  if (max !== min) {
    switch (max) {
      case bitR:
        h = (bitG - bitB) / d + (bitG < bitB ? 6 : 0);
        break;
      case bitG:
        h = (bitB - bitR) / d + 2;
        break;
      case bitB:
        h = (bitR - bitG) / d + 4;
        break;
    }
    h /= 6;
  }

  h = parseFloat(h.toFixed(5)) * 360;
  s = parseFloat(s.toFixed(3)) * 100;
  v = parseFloat(v.toFixed(3)) * 100;

  let hsv = [h, s, v];

  // Formating to 2 decimals if floating number
  for (let i = 0; i < hsv.length; i++) {
    if (hsv[i] !== Math.round(hsv[i])) {
      hsv[i] = parseFloat(hsv[i].toFixed(1));
    }
    // Round number if the first if turns up to be xxx.00
    if (hsv[i] == Math.round(hsv[i])) {
      hsv[i] = Math.round(hsv[i]);
    }
  }

  return hsv;
};

export const rgbToHsl = (r: number, g: number, b: number) => {
  const normR = r / 255;
  const normG = g / 255;
  const normB = b / 255;

  const max = Math.max(normR, normG, normB);
  const min = Math.min(normR, normG, normB);
  const delta = max - min;

  let h = 0;
  let s;
  let l;

  l = (max + min) / 2;

  if (delta === 0) {
    // gray, no chroma
    h = 0;
    s = 0;
  } else {
    // chromatic
    if (l < 0.5) {
      s = delta / (max + min);
    } else {
      s = delta / (2 - max - min);
    }

    const deltaR = ((max - normR) / 6 + delta / 2) / delta;
    const deltaG = ((max - normG) / 6 + delta / 2) / delta;
    const deltaB = ((max - normB) / 6 + delta / 2) / delta;

    if (normR === max) {
      h = deltaB - deltaG;
    } else if (normG === max) {
      h = 1 / 3 + deltaR - deltaB;
    } else if (normB === max) {
      h = 2 / 3 + deltaG - deltaR;
    }

    if (h < 0) h += 1;
    if (h > 1) h -= 1;
  }

  h = parseFloat(h.toFixed(5)) * 360;
  s = parseFloat(s.toFixed(3)) * 100;
  l = parseFloat(l.toFixed(3)) * 100;

  let hsl = [h, s, l];

  // Formatting to 2 decimals if floating number
  for (let i = 0; i < hsl.length; i++) {
    if (hsl[i] !== Math.round(hsl[i])) {
      hsl[i] = Number(hsl[i].toFixed(1));
    }

    // Round number if the first if turns up to be xxx.00
    if (hsl[i] == Math.round(hsl[i])) {
      hsl[i] = Math.round(hsl[i]);
    }
  }

  return hsl;
};

export const getMostSimilarColor = (colorNames: Color[], lab: number[]) => {
  // algorithm : http://www.easyrgb.com/en/math.php

  let mostSimilarColors = colorNames.reduce((_, color) => {
    const mostSimilarColor: { color: Color; dE94: number }[] = [];
    let l1 = color.lab[0],
      a1 = color.lab[1],
      b1 = color.lab[2],
      l2 = lab[0],
      a2 = lab[1],
      b2 = lab[2],
      wl,
      wc,
      wh; //Weighting factors

    let xC1 = Math.sqrt(Math.pow(a1, 2) + Math.pow(b1, 2)),
      xC2 = Math.sqrt(Math.pow(a2, 2) + Math.pow(b2, 2)),
      xDL = l2 - l1,
      xDC = xC2 - xC1,
      xDE = Math.sqrt(
        (l1 - l2) * (l1 - l2) + (a1 - a2) * (a1 - a2) + (b1 - b2) * (b1 - b2),
      ),
      xDH = xDE * xDE - xDL * xDL - xDC * xDC;

    if (xDH > 0) {
      xDH = Math.sqrt(xDH);
    } else {
      xDH = 0;
    }

    let xSC = 1 + 0.045 * xC1;
    let xSH = 1 + 0.015 * xC1;

    // color difference formula that calculates the difference between
    // two colors in the CIELAB color space
    let dE94 = Math.sqrt(
      Math.pow(xDL, 2) + Math.pow(xDC, 2) + Math.pow(xDH, 2),
    );

    if (dE94 < 15) {
      mostSimilarColor.push({ color, dE94 });
    }
    return mostSimilarColor;
  }, [] as { color: Color; dE94: number }[]);

  let mostSimilarColor = mostSimilarColors[0];
  mostSimilarColors.forEach((color) => {
    if (color.dE94 < mostSimilarColor.dE94) {
      mostSimilarColor = color;
    }
  });

  return mostSimilarColor?.color || '';
};

type Color = {
  name: string;
  hex: string;
  lab: number[];
  hsv: number[];
  vb: number;
  rgb: number[];
};

export const getColorNamesJSON = (
  data: {
    [key: string]: string;
  }[],
) => {
  let colors: Color[] = [];

  data.forEach((color) => {
    const key = Object.keys(color)[0];
    const regex = /rgb\((\d{1,3}), (\d{1,3}), (\d{1,3})\)/;

    const rgbColor = color?.[key] || '';

    //   const r = parseInt(rgbColor.match(regex)?.[1] || '');
    //   const g = parseInt(rgbColor.match(regex)?.[2] || '');
    //   const b = parseInt(rgbColor.match(regex)?.[3] || '');

    const [a, r, g, b] = rgbColor.match(regex)?.map(Number) || [0, 0, 0];

    let hexCode = rgbToHex(r, g, b),
      VbCode = hexToVBCode(hexCode),
      hsvCode = rgbToHsv(r, g, b),
      labCode = rgbToLab(r, g, b);

    colors.push({
      name: key,
      hex: hexCode,
      lab: labCode,
      hsv: hsvCode,
      vb: VbCode,
      rgb: [r, g, b],
    });
  });

  colors.sort((a, b) => {
    return a.name > b.name ? 1 : -1;
  });

  return colors;
};

// export const getColorNames = () => {
//   //   var colorNames;

//   /* Source : http://axonflux.com/handy-rgb-to-hsl-and-rgb-to-hsv-color-model-c */

//   //    Public methods
//   n.getColorNamesJSON = getColorNamesJSON;
//   n.hexToVBCode = hexToVBCode;
//   n.rgbToHsv = rgbToHsv;
//   n.rgbToHsl = rgbToHsl;
//   n.rgbToCmyk = rgbToCmyk;
//   n.rgbToLab = rgbToLab;
//   n.mostSimilarColor = mostSimilarColor;

//   return n;
// };

export const isAlreadyInArray = <T>(needle: T[], haystack: T[][]) => {
  var flag = false;
  for (var i = 0; i < haystack.length; i++) {
    var compare = 0;
    for (var j = 0; j < haystack[i].length; j++) {
      if (needle[j] === haystack[i][j]) {
        compare++;
      }
      if (compare == needle.length) {
        flag = true;
      }
    }
  }
  return flag;
};

type KeyValue<T> = [key: string, value: T];

export const sortObject = <T>(object: { [key: string]: T }): KeyValue<T>[] => {
  const sortable: KeyValue<T>[] = [];

  for (const key in object) {
    sortable.push([key, object[key]]);
  }

  return sortable;
};

export const rgbToHex = (r: number, g: number, b: number) => {
  const componentToHex = (c: number): string => {
    const hex = c.toString(16);
    return hex.length == 1 ? '0' + hex : hex;
  };

  return '#' + componentToHex(r) + componentToHex(g) + componentToHex(b);
};

export const sortAllColors = (
  reduced: number[][],
  all: number[][],
  splits: number,
) => {
  let median = medianCut(reduced);

  let key = parseInt(Object.keys(median)[0]);
  let dominantSort = sortByDominantColor(all, key);

  let mappedColors = getBucketsSplit(dominantSort, median, splits);

  return mappedColors;
};

export const getBucketsSplit = (
  dominantSort: number[][],
  median: {
    [key: string]: number;
  },
  splits: number,
) => {
  //   let bucket = [];
  let count = 0;
  let increment = 2;

  let splitBucket = twoBucketSplit(dominantSort, median);

  while (increment < splits) {
    let medianCut1 = medianCut(splitBucket[count]);
    // let key1 = parseInt(Object.keys(medianCut1)[0]);

    let lastCount = count;
    count = count + 1;

    splitBucket = twoBucketSplit(splitBucket[lastCount], medianCut1);

    /* Remove the non-split sub bucket*/
    splitBucket = splitBucket.slice(count, splitBucket.length);

    increment = increment + 1;
  }

  /* Prevent getting empty arrays if number of colors is less than number of splits */
  var NoEmptyBucket = splitBucket.filter((bucket) => bucket.length != 0);

  var mappedColors = averageColor(NoEmptyBucket);

  return mappedColors;
};

// export const sortByBucketSize = (buckets: number[][][]) => {
//   buckets.sort((a, b) => {
//     return b.length - a.length;
//   });

//   //   var newBucket = Array.from(buckets);
//   const sizeBuckets = buckets.reduce((a, b) => {
//     return a + b.length;
//   }, 0);

//   const sortedBuckets = buckets.map((b) => {
//     const percentage = ((b.length / sizeBuckets) * 100).toFixed(1);
//     return [{ bucket: b, percentage }];
//   });

//   return sortedBuckets;
// };

const sortByBucketSize = (buckets: number[][][]) => {
  buckets.sort((a, b) => {
    return b.length - a.length;
  });

  const newBucket = Array.from(buckets);
  const sizeBuckets = newBucket.reduce((a, b) => {
    return a + b.length;
  }, 0);

  const sortedBuckets: [number[][], number][] = buckets.map((b) => {
    const percentage = Number(((b.length / sizeBuckets) * 100).toFixed(1));
    return [b, percentage];
  });

  return sortedBuckets;
};

export const averageColor = (buckets: number[][][]) => {
  var mappedColors: [number[], number][] = [];

  var bucketsSorted = sortByBucketSize(buckets);

  bucketsSorted.forEach((bucket) => {
    const reduced = bucket[0].reduce((accumulator, val) => {
      accumulator[0] = accumulator[0] + val[0];
      accumulator[1] = accumulator[1] + val[1];
      accumulator[2] = accumulator[2] + val[2];

      return accumulator;
    });

    const zero = Math.round(reduced[0] / bucket[0].length);
    const one = Math.round(reduced[1] / bucket[0].length);
    const two = Math.round(reduced[2] / bucket[0].length);

    const color = [zero, one, two];
    mappedColors.push([color, bucket[1]]);
  });

  return mappedColors;
};

export const getMedian = ({
  r,
  g,
  b,
  rMax,
  rMin,
  gMax,
  gMin,
  bMax,
  bMin,
}: {
  r: number;
  g: number;
  b: number;
  rMax: number;
  rMin: number;
  gMax: number;
  gMin: number;
  bMax: number;
  bMin: number;
}) => {
  let widest = r > g ? r : g;
  widest = widest > b ? widest : b;

  var wideObj: { [key: string]: number } = {};
  switch (widest) {
    case r:
      wideObj[0] = Math.floor((rMax + rMin) / 2);
      break;
    case g:
      wideObj[1] = Math.floor((gMax + gMin) / 2);
      break;
    case b:
      wideObj[2] = Math.floor((bMax + bMin) / 2);
  }
  return wideObj;
};

export const medianCut = (colors: number[][]) => {
  var rMin = 255,
    rMax = 0,
    gMin = 255,
    gMax = 0,
    bMin = 255,
    bMax = 0;

  for (var i = 0; i < colors.length; i++) {
    var r = colors[i][0];
    var g = colors[i][1];
    var b = colors[i][2];

    rMin = r < rMin ? r : rMin;
    rMax = r > rMax ? r : rMax;

    gMin = g < gMin ? g : gMin;
    gMax = g > gMax ? g : gMax;

    bMin = b < bMin ? b : bMin;
    bMax = b > bMax ? b : bMax;
  }

  var rMed = rMax - rMin;
  var gMed = gMax - gMin;
  var bMed = bMax - bMin;

  const median = getMedian({
    r: rMed,
    g: gMed,
    b: bMed,
    bMax,
    bMin,
    gMax,
    gMin,
    rMax,
    rMin,
  });
  return median;
};

export const twoBucketSplit = (
  colors: number[][],
  median: {
    [key: string]: number;
  },
) => {
  var key = Number(Object.keys(median)[0]);
  //   const bucketLengthFloor = Math.floor(colors.length / 2);
  //   const bucketLengthCeil = Math.ceil(colors.length / 2);

  let bucket1: number[][] = [];
  let bucket2: number[][] = [];

  colors.forEach((color) => {
    if (color[key] > median[key]) {
      bucket1[bucket1.length] = color;
    } else {
      bucket2[bucket2.length] = color;
    }
  });

  return [bucket1, bucket2];
};

const sortByDominantColor = (arrayColors: number[][], key: number) => {
  var dominants = arrayColors.sort(function (a, b) {
    const aA = a[key];
    const bB = b[key];

    return bB - aA;
  });

  return dominants;
};

// var getOffsetLeft = function (elem: HTMLElement) {
//   var offsetLeft = 0;
//   do {
//     if (!isNaN(elem.offsetLeft)) {
//       offsetLeft += elem.offsetLeft;
//     }
//   } while ((elem = elem.offsetParent));

//   return offsetLeft;
// };

// var getOffsetTop = function (elem: HTMLElement) {
//   var offsetTop = 0;
//   do {
//     if (!isNaN(elem.offsetTop)) {
//       offsetTop += elem.offsetTop;
//     }
//   } while ((elem = elem.offsetParent));

//   return offsetTop;
// };

export const randomNumber = (max: number, word: string) => {
  let r = Math.floor(Math.random() * max);

  while (word[r] == ' ') {
    // spaces can't be colored
    r = Math.floor(Math.random() * max);
  }
  return r;
};

export const coloredLetter = (word: string, number: number, hex: string) => {
  let span = document.createElement('span');
  span.setAttribute('data-hex', hex);
  span.innerHTML = word[number];

  let letter = `<span data-hex='${hex}'>${word[number]}</span>`;

  return word.replace(word[number], letter);
};

export const numberOfColors = (
  sourceBuffer8: Uint8ClampedArray,
  sourceBuffer32: Int32Array,
  //   data: ImageData,
) => {
  const nbOfColors: { [key: string]: number } = {};
  const countColors = [];
  let last = [] as number[];
  let current = [];

  for (var i = 0, k = 0; i < sourceBuffer32.length; i += 4, k++) {
    if (sourceBuffer32[k] !== 0) {
      current = [sourceBuffer8[i], sourceBuffer8[i + 1], sourceBuffer8[i + 2]];
      var every = current.every(function (element, index) {
        return element === last[index];
      });
      if (every) {
        if (!isAlreadyInArray(current, countColors)) {
          // .push() is slower than inline code
          countColors[countColors.length] = current;

          nbOfColors[current.join('-')] = 1;
        } else {
          nbOfColors[current.join('-')]++;
        }
      }

      last = [
        sourceBuffer8[i],
        sourceBuffer8[i + 1],
        sourceBuffer8[i + 2],
        sourceBuffer8[i + 3],
      ];
    }
  }

  return countColors;
};
