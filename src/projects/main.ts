import {makeProject} from '@motion-canvas/core';


import intro from '../scenes/main?scene';
import audio from '../../audio/timeline.wav'
import '../global.css'

export default makeProject({
  scenes: [intro],
  experimentalFeatures: false,
  audio: audio
});
