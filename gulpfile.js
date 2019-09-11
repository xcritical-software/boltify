const createTasks = require('@xcritical/xc-front-libs-utils/gulp-tasks');
const { name } = require('./package.json');


createTasks(name, {
  tsGlob: ['!src/**/*.test.ts', 'src/**/*.ts'],
});