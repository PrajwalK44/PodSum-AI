/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all files that contain Nativewind classes.
  content: [
    './app/**/*.{js,jsx,ts,tsx}',
    './App.tsx',
    './components/**/*.{js,jsx,ts,tsx}',
  ],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      fontFamily: {
        'Jakarta-Bold': ['Jakarta-Bold'],
        'Jakarta-ExtraBold': ['Jakarta-ExtraBold'],
        'Jakarta-ExtraLight': ['Jakarta-ExtraLight'],
        'Jakarta-Light': ['Jakarta-Light'],
        'Jakarta-Medium': ['Jakarta-Medium'],
        'Jakarta-Regular': ['Jakarta-Regular'],
        'Jakarta-SemiBold': ['Jakarta-SemiBold'],
      },
    },
  },
  plugins: [],
}
