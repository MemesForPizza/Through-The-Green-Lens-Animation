import {makeProject} from '@motion-canvas/core';


import scene from '../scenes/trianglebgrender?scene';
import '../global.css'

export default makeProject({
  scenes: [scene],
  experimentalFeatures: false
});
