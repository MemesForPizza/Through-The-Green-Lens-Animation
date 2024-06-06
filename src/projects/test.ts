import {makeProject} from '@motion-canvas/core';


import testscene from '../scenes/test?scene';
import '../global.css'

export default makeProject({
  scenes: [testscene],
  experimentalFeatures: false
});
