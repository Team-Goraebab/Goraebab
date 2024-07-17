import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#4C48FF',
        secondary: '#FF4853',
        accent: '#ffad1f',
        danger: '#e0245e',
        header_bg: '#E3E6EA',
        grey_1: '#F4F4F4',
        grey_2: '#D2D2D2',
        grey_3: '',
        grey_4: '#7F7F7F',
        blue_1: '#d2d1f6',
        blue_2: '#4C48FF',
        red_1: '#f6d4d6',
        red_2: '#FF4853',
        yellow_1: '#f6e3d1',
        yellow_2: '#FFA048',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [],
};
export default config;
