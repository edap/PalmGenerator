# Palm Generator

The Palm Generator is a Three.js module to create palms. For the moment it is in beta version, and it is available just as es6 class, but an npm package will arrive soon.
At this [website](http://davideprati.com/projects/palm-generator) You can see some example of which kind of palms it is able to create.

## Usage
This repository contains a usage example. In order to see it, `npm install`, `npm start`. If you want to include a palm done with this generator, copy the classes `PalmGenerator.js` and `phyllotaxis.js` in your source folder. 

The palm generator constructor has the following signature:

```javascript
new PalmGenerator(leafGeometry, trunkGeometry, options, curve=false);
```

`leafGeometry`. Required. Has to be an instance of `THREE.Geometry`, and it is the geometry used for the leafs of the palm.

`trunkGeometry`. Required. Has to be an instance of `THREE.Geometry`, and it is the geometry used for the trunk of the palm. 

`options`. Optional. Is an object containing the options, defaults are provided
The available options are:

- `spread`. Float. It is the value that defines how much the objects that compose the palms should distantiate from each other. Keep it between 0 and 2.

- `angle` Float, degrees. It is the rotation angle that affects the phyllotaxis pattern. The default is the golden angle, 137.5,

- `num` Integer. It defines how many objects compose the palm. Keep it between 200 and 1000. The smaller, the faster.

- `growth`.Float. This value define how much the palm should grow along the y axis. With this generator

- `foliage_start_at`. Integer.It defines how many object will be leafs. It has to be a value smaller than `num`.

- `trunk_regular`. Boolean. It defines if the phyllotaxis will deform the trunk or not.

- `buffers`: Boolean. Highly experimental, default is false, updates will follow.

- `angle_open`: Float, degree. It defines the disclose angle of the leaves,

- `starting_angle_open` Float, degree. It defines from which angle the leave will start to disclose

`curve`. Optional. A CatmullRomCurve3 can be passed as last argument. The first vertex in the curve will define the position of the treetop, the last one will define the position of the part of the trunk that is attached to the ground. Look at the curve in `src/application.js` to have an idea about how to make palms alongside curves. 



