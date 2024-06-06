
// utils
import { OsuBeatSyncedController } from '../utils/OsuBeatSyncedController';
import { FrameLoop } from '../utils/FrameLoop';

// motioncanvas
import { makeScene2D } from '@motion-canvas/2d';
import { EPSILON, delay, linear, useThread, waitFor } from '@motion-canvas/core';

// custom components
import { Earth } from '../components/Earth';
import { Cursor } from '../components/Cursor';

// subscenes
import IntroSubscene from './subscenes/intro'
import MenuSubscene1 from './subscenes/menu1'
import ConservePowerSubscene from './subscenes/conservePower'
import MenuSubscene2 from './subscenes/menu2'
import RecycleSubscene from './subscenes/recycle'
import MenuSubscene3 from './subscenes/menu3'
import OutroSubscene from './subscenes/outro'

// external libs
import { BeatmapDecoder } from 'osu-parsers';

// osu!
import beatmapraw from '../../beatmaps/Sidequest-mania-modified/beatmap.osu?raw'
import { EventWriter } from '../utils/EventWriter';
import { AudioEvent } from '../utils/AudioEvent';

const decoder = new BeatmapDecoder()
const beatmap = decoder.decodeFromString(beatmapraw)

const VIDEO_LENGTH_TARGET = 56.93 // seconds

export default makeScene2D(function* (view) {
  const audioTimingPointWriter = new EventWriter<AudioEvent>()
  const beatSyncSource = new OsuBeatSyncedController(beatmap)
  const updateSource = new FrameLoop()
  const cursor = <Cursor updateSource={updateSource} audioTimingPointWriter={audioTimingPointWriter}/> as Cursor
  const earth = <Earth size={1000} beatSyncTo={beatSyncSource} updateSource={updateSource} stroke={"#ffffff"}/> as Earth
  yield beatSyncSource.Start()
  yield updateSource.Start()
  cursor.position([669, 715])
  earth.play()
  view.add(earth)
  view.add(cursor)
  yield* IntroSubscene(view, earth, cursor)
  yield* MenuSubscene1(view, earth, cursor)
  yield* ConservePowerSubscene(view, earth, cursor)
  yield* MenuSubscene2(view, earth, cursor)
  yield* RecycleSubscene(view, earth, cursor, beatSyncSource, updateSource)
  yield* MenuSubscene3(view, earth, cursor)
  const earthClone = <Earth stroke={"#ffffff"} zIndex={2000} opacity={0}/> as Earth
  yield earthClone.opacity(1, 0.1, linear)
  yield delay(0.1, earth.opacity(0, 0.1, linear))
  earthClone.time(VIDEO_LENGTH_TARGET - useThread().time() - 5.18)
  earthClone.size(earth.size)
  earthClone.scale(earth.scale)
  earthClone.glowRadius(earth.glowRadius)
  earthClone.absolutePosition(earth.absolutePosition)
  earthClone.play()
  view.add(earthClone)
  yield* OutroSubscene(view, earth, cursor)
  console.log(VIDEO_LENGTH_TARGET - useThread().time(), useThread().time())
  yield* waitFor(VIDEO_LENGTH_TARGET - useThread().time())
  const e = audioTimingPointWriter.retrieve()
  console.log(e)
  console.log(JSON.stringify(e))
});