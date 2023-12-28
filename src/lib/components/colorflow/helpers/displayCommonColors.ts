import {
  getColorNamesJSON,
  getMostSimilarColor,
  hexToVBCode,
  rgbToCmyk,
  rgbToHex,
  rgbToHsl,
  randomNumber,
  rgbToHsv,
  rgbToLab,
  coloredLetter,
} from './getColorNames';
import colorsJSON from '../../../data/colors.json';
import { getHslMouseEffect } from './getHslMouseEffect';
import { browser } from '$app/environment';

export const displayCommonColors = (colors: [number[], number][]) => {
  if (!browser) {
    return null;
  }
  const colorsDiv = document.querySelector('.palette .colors');

  if (!colorsDiv) {
    return null;
  }

  const colorNames = getColorNamesJSON(colorsJSON);
  colorsDiv.innerHTML = '';

  for (let i = 0; i < colors.length; i++) {
    const c = colors[i];
    let hexCode = rgbToHex(c[0][0], c[0][1], c[0][2]);

    let percent = c[1] + '%';
    let color = c[0][0] + c[0][1] + c[0][2] > 382 ? 'black' : 'white';
    let colorText = 'text--' + color;
    // let vbCode = hexToVBCode(hexCode);
    let hsv = rgbToHsv(c[0][0], c[0][1], c[0][2]);
    let hsl = rgbToHsl(c[0][0], c[0][1], c[0][2]);
    let cmyk = rgbToCmyk(c[0][0], c[0][1], c[0][2]);
    let lab = rgbToLab(c[0][0], c[0][1], c[0][2]);

    let mostSimilarColor = getMostSimilarColor(colorNames, lab);

    //Easter egg
    // eggCount(mostSimilarColor.name);

    let li = document.createElement('li');
    li.setAttribute('class', 'colors__box');
    li.setAttribute('data-hex', hexCode);

    let span = document.createElement('span');
    span.setAttribute('class', colorText);
    span.innerHTML = percent;
    li.appendChild(span);

    let spanName = document.createElement('span');
    spanName.classList.add(`${colorText}`);
    spanName.classList.add('box__name');
    spanName.innerHTML = mostSimilarColor.name;
    li.appendChild(spanName);

    li.addEventListener('mousemove', (e) => getHslMouseEffect(e, hsl));

    li.addEventListener('click', () => {
      displayCodes(mostSimilarColor.name, hsv, cmyk, lab, hsl, hexCode, [
        c[0][0],
        c[0][1],
        c[0][2],
      ]);
    });
    colorsDiv.appendChild(li);
  }

  const lis = colorsDiv.querySelectorAll('.colors__box');

  lis.forEach((l) => {
    (l as HTMLElement).style.background = (l as HTMLElement).dataset.hex || '';
  });
};

const displayCodes = (
  name: string,
  hsv: number[],
  cmjn: number[],
  lab: number[],
  hsl: number[],
  hex: string,
  rgb: number[],
) => {
  //   if (!allowCopy) {
  //     allowCopy = true;
  //   }
  document.body.classList.add('codes--active');

  const hexSpan = document.querySelector('.code__hex .code__color');
  const rgbSpan = document.querySelector('.code__rgb .code__color');
  const labSpan = document.querySelector('.code__lab .code__color');
  const cmjnSpan = document.querySelector('.code__cmjn .code__color');
  const hsvSpan = document.querySelector('.code__hsv .code__color');
  const hslSpan = document.querySelector('.code__hsl .code__color');

  const randomNum = randomNumber(name.length, name);
  const coloredWord = coloredLetter(name, randomNum, hex);
  const colorsTitle = document.querySelector('.codes__title');

  if (colorsTitle) {
    colorsTitle.innerHTML = coloredWord;

    const spanColor = colorsTitle.querySelector('span');
    if (spanColor) {
      spanColor.style.color = spanColor.dataset.hex || '';
    }
  }

  if (hexSpan && rgbSpan && hslSpan && hsvSpan && cmjnSpan && labSpan) {
    hexSpan.innerHTML = hex;
    rgbSpan.innerHTML = `${rgb[0]}, ${rgb[1]}, ${rgb[2]}`;
    hslSpan.innerHTML = `${hsl[0]}, ${hsl[1]}, ${hsl[2]}`;
    hsvSpan.innerHTML = `${hsv[0]}, ${hsv[1]}, ${hsv[2]}`;
    cmjnSpan.innerHTML = `${cmjn[0]}, ${cmjn[1]}, ${cmjn[2]}, ${cmjn[3]}`;
    labSpan.innerHTML = `${lab[0]}, ${lab[1]}, ${lab[2]}`;
  }
};
