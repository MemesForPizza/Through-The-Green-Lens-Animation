# Through The Green Lens Animation
These are the source code used for my school's video editing contest: Through The Green Lens.

The code inside may be very messy as codes from my other projects (including old, messy ones) has been used. The animation is also implemented in a really hacky way to speed things up due to time constraints. I do not intend to maintain this codebase.

Some assets has been removed or replaced to avoid legal problems.

## Running the project
Before running it for the first time, please install dependencies using
```shell
npm install
```

Then run using
```shell
npm run serve
```
The editor can be accessed by visiting [http://localhost:9000/](http://localhost:9000/).

[Learn more about motion-canvas](https://motioncanvas.io/)

## Credits
- [motion-canvas](https://github.com/motion-canvas/motion-canvas): Main TypeScript Animation Library
- [Font-Awesome](https://github.com/FortAwesome/Font-Awesome): Icons
- [Sidequest (Cut Ver.)](https://osu.ppy.sh/beatmapsets/2113834#mania/4487875): Beatmap and Music
- [osu](https://github.com/ppy/osu): Inspiration and code (ported to this project)
- [osu-resources](https://github.com/ppy/osu-resources): [Cursor images](https://github.com/ppy/osu-resources/tree/master/osu.Game.Resources/Textures/Cursor) (with slight [modifications](images/images/cursor/cursor-additive.png)), [Placeholder backgrounds](https://github.com/ppy/osu-resources/blob/master/osu.Game.Resources/Textures/Backgrounds/bg1.jpg): and [test beatmaps](https://github.com/ppy/osu-resources/blob/master/osu.Game.Resources/Tracks/circles.osz).
- [osu-classes](https://github.com/kionell/osu-classes) & [osu-parsers](https://github.com/kionell/osu-parsers): Utilities to read and parse osu! files
