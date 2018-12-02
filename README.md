# Palm Generator

<a href="https://vimeo.com/204789237">Video</a>

The Palm Generator is a Three.js module to create palms. For the moment it is in beta version, and it is available just as es6 class, but an npm package will arrive soon.
[Here](http://davideprati.com/projects/palm-generator) you can see what kind of palms it is able to create.

## Usage
This repository contains a usage example, run `npm start`. To use the PalmGenerator in your THREEjs application, copy the classes `PalmGenerator.js` and `phyllotaxis.js` in your source folder and follow this instructions. 

First, you need to create a palm. The palm generator constructor has the following signature:

```javascript
let palm = new PalmGenerator(leafGeometry, trunkGeometry, options, curve=false);
```

`leafGeometry`. Required. Has to be an instance of `THREE.Geometry`, and it is the geometry used for the leaves of the palm.

`trunkGeometry`. Required. Has to be an instance of `THREE.Geometry`, and it is the geometry used for the trunk of the palm. 

`options`. Optional. Is an object containing the options. The available options are:

- `spread`. Float. It is the value that defines how much the objects that compose the palm should distantiate from each other. Keep it between 0 and 2.

- `angle` Float, degrees. It is the rotation angle that affects the phyllotaxis pattern. The default is the golden angle, 137.5,

- `num` Integer. It defines how many objects compose the palm. Keep it between 200 and 1000. The smaller, the faster.

- `growth`.Float. This value define how much the palm should grow along the y axis.

- `foliage_start_at`. Integer.It defines how many object will be leafs. It has to be a value smaller than `num`.

- `trunk_regular`. Boolean. It defines if the phyllotaxis will deform the trunk or not.

- `vertex_colors`: Boolean. Enable per vertex color 

- `angle_open`: Float, degree. It defines the disclose angle of the leaves.

- `starting_angle_open` Float, degree. It defines from which angle the leaves will start to disclose.

`curve`. Optional. A CatmullRomCurve3 can be passed as last argument. The first vertex in the curve will define the position of the treetop, the last one will define the position of the part of the trunk that is attached to the ground. Look at the curve in `src/App.js` to see an example about how to make palms alongside curves. 

The PalmGenerator returns an object containing an instance of THREE.Geometry.

Example:

```javascript
let leafGeometry = new THREE.SphereGeometry(5, 20, 20);
let trunkGeometry = new THREE.BoxGeometry(5,5,5);
let palm = new PalmGenerator(leafGeometry,
                            trunkGeometry,
                            curve);
let geometry = palm.geometry;
let bufGeometry = new THREE.BufferGeometry().fromGeometry(geometry);
let mesh = new THREE.Mesh(bufGeometry, material);
scene.add( mesh );
```

## Enter LeafGeometry

The previous snippet generates a tree that looks weird. The trunk is fine but the foliage is really abstract.
This is because the PalmGenerator accepts any kind of geometry, but probably a sphere isn't the best geometry to draw a leaf. In order to have leaves the looks like palm leaves but do not require too much polygons, I've created a custom geometry, called `LeafGeometry`. You can dowload the class `LeafGeometry.js` from the [repository](https://github.com/edap/LeafGeometry) and put it into your source folder. We change the previous snippet as follows:

```javascript
let leaf_opt = {
    length: 60,
    length_stem: 20,
    width_stem: 0.2,
    leaf_width: 0.8,
    leaf_up: 1.5,
    density: 11,
    curvature: 0.04,
    curvature_border: 0.005,
    leaf_inclination: 0.9
};

let trunkGeometry = new THREE.BoxGeometry(5,5,5);
let leafGeometry = new LeafGeometry(leaf_opt);

let palm_opt = {
    spread: 0.1,
    angle: 137.5,
    num: 406,
    growth: 0.12,
    foliage_start_at: 56,
    trunk_regular: false,
    angle_open: 36.17,
    starting_angle_open: 50
};

let palmGeometry = new PalmGenerator(leafGeometry,
                            trunkGeometry,
                            palm_opt);
let mesh = new THREE.Mesh(palmGeometry, material);
scene.add(mesh);
```

The previous snippet should generate a palm like this one:

![example](example.png)

## Curves

If we add a curve to the previous palm, passing an instance of a `CatmullRomCurve3` as fourth argument to the constructor, for example:

```javascript
var curve = new THREE.CatmullRomCurve3( [
      new THREE.Vector3( -40, 150, 0 ),
      new THREE.Vector3( -40, 100, 0 ),
      new THREE.Vector3( 0, 60, 0 ),
      new THREE.Vector3( 0, 0, 0 ),
] );

let palm = new PalmGenerator(leafGeometry,
                            trunkGeometry,
                            palm_opt,
                            curve);
```

A palm like the following one is created:

![example](example-curve.png)







