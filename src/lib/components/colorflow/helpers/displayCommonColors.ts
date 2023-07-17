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

export const displayCommonColors = (colors: [number[], number][]) => {
  const colorsDiv = document.querySelector('.palette .colors');

  if (!colorsDiv) {
    return null;
  }

  var colorNames = getColorNamesJSON(colorsJSON);
  colorsDiv.innerHTML = '';

  colors.map((c, key) => {
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

    li.addEventListener('mousemove', (e) => {
      const target = e.target as HTMLElement;

      const x = e.pageX - target.offsetLeft;
      const y = e.pageY - target.offsetTop;

      let hsl1 = `hsla(${hsl[0]}, ${hsl[1]}%, ${hsl[2] - 20}%, 1)`,
        hsl2 = `hsla(${hsl[0]}, ${hsl[1]}%, ${hsl[2] - 5}%, 1)`,
        hsl3 = `hsla(${hsl[0]}, ${hsl[1]}%, ${hsl[2]}%, 1)`;

      target.style.setProperty('--x', `${x}px`);
      target.style.setProperty('--y', `${y}px`);
      target.style.setProperty('--color1', hsl1);
      target.style.setProperty('--color2', hsl2);
      target.style.setProperty('--color3', hsl3);
    });

    li.addEventListener('click', () =>
      displayCodes(mostSimilarColor.name, hsv, cmyk, lab, hsl, hexCode, [
        c[0][0],
        c[0][1],
        c[0][2],
      ]),
    );
    colorsDiv.appendChild(li);
  });

  var lis = colorsDiv.querySelectorAll('.colors__box');
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

  const hexSpan = document.querySelector('.code__hex .code__color'),
    rgbSpan = document.querySelector('.code__rgb .code__color'),
    labSpan = document.querySelector('.code__lab .code__color'),
    cmjnSpan = document.querySelector('.code__cmjn .code__color'),
    hsvSpan = document.querySelector('.code__hsv .code__color'),
    hslSpan = document.querySelector('.code__hsl .code__color');

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
