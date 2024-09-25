import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        pretendard: ['var(--font-pretendard)'],
      },
      colors: {
        primary: '#4C48FF',
        secondary: '#FF4853',
        accent: '#ffad1f',
        danger: '#e0245e',
        grey_0: '#F4F4F4',
        grey_1: '#E3E6EA',
        grey_2: '#D2D2D2',
        grey_3: '#999999',
        grey_4: '#7F7F7F',
        grey_6: '#4E4E4E',
        blue_1: '#d2d1f6',
        blue_2: '#b0aff8',
        blue_3: '#8f8cfb',
        blue_4: '#6d6dfd',
        blue_5: '#5a54ff',
        blue_6: '#4c48ff',
        red_1: '#f6d4d6',
        red_2: '#f7b8bb',
        red_3: '#f99ca1',
        red_4: '#fb8087',
        red_5: '#fd646d',
        red_6: '#FF4853',
        yellow_1: '#f6e3d1',
        yellow_2: '#f7d5b5',
        yellow_3: '#f9c89a',
        yellow_4: '#fbba7e',
        yellow_5: '#fdad63',
        yellow_6: '#FFA048',
        green_1: '#d1f6e2',
        green_2: '#aeeaca',
        green_3: '#8cdfb2',
        green_4: '#69d39a',
        green_5: '#47c882',
        green_6: '#25BD6B',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      screens: {
        sm: '640px',
        md: '768px',
        lg: '1024px',
        xl: '1280px',
        '2xl': '1536px',
      },
    },
  },
  plugins: [],
};
export default config;
