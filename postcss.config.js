/** @type {import('postcss-load-config').Config} */
import autoprefixer from 'autoprefixer';
import postCSSSass from '@csstools/postcss-sass';

export default {
  plugins: [
    postCSSSass(),
    autoprefixer()
  ]
};
