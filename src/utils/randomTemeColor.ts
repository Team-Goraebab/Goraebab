import { colorsOption } from '@/data/color';

export function getRandomThemeColor(colors: typeof colorsOption) {
  const labels = Array.from(new Set(colors.map((color) => color.label)));

  const randomLabel = labels[Math.floor(Math.random() * labels.length)];

  const filteredColors = colors.filter((color) => color.label === randomLabel);

  let themeColor = {
    bgColor: '#fff',
    borderColor: '#ccc',
    textColor: '#000',
  };

  const subColors = filteredColors.filter((color) => !color.sub);
  if (subColors.length > 0) {
    themeColor.borderColor = subColors[0].color;
    themeColor.textColor = subColors[0].color;
  }

  const nonSubColors = filteredColors.filter((color) => color.sub);
  if (nonSubColors.length > 0) {
    themeColor.bgColor = nonSubColors[0].color;
  }

  return themeColor;
}
