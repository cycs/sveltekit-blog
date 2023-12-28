export const getHslMouseEffect = (e: MouseEvent, hsl: number[]) => {
  const target = e.target as HTMLElement;

  const x = e.pageX - target.offsetLeft;
  const y = e.pageY - target.offsetTop;

  const hsl1 = `hsla(${hsl[0]}, ${hsl[1]}%, ${hsl[2] - 20}%, 1)`;
  const hsl2 = `hsla(${hsl[0]}, ${hsl[1]}%, ${hsl[2] - 5}%, 1)`;
  const hsl3 = `hsla(${hsl[0]}, ${hsl[1]}%, ${hsl[2]}%, 1)`;

  target.style.setProperty('--x', `${x}px`);
  target.style.setProperty('--y', `${y}px`);
  target.style.setProperty('--color1', hsl1);
  target.style.setProperty('--color2', hsl2);
  target.style.setProperty('--color3', hsl3);
};
