/* eslint-env browser */
import * as THREE from 'three';
import Sphere from './sphere.js';
import Cube from './cube.js';
import DAT from 'dat-gui';

const scene = new THREE.Scene();
const OrbitControls = require('three-orbit-controls')(THREE);
const gui = new DAT.GUI();
var params = {
    angle: 137.5,
    spread: 10,
    num: 100,
    pos_x: 0,
    pos_y: 0,
    pos_z: 0
};


gui.add(params, "pos_x").min(-10).max(10).step(1);
gui.add(params, "pos_y").min(-10).max(10).step(1);
gui.add(params, "pos_z").min(0).max(70).step(1);
gui.add(params, "num").min(10).max(200).step(1);
gui.add(params, "angle").min(100).max(300).step(1);
gui.add(params, "spread").min(10).max(50).step(1);

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const radius = 5;
var n = 0;
const c = 2;

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

camera.position.z = 80;
this.controls = new OrbitControls(camera, renderer.domElement);

populate();

window.addEventListener('resize', function() {
    var WIDTH = window.innerWidth,
    HEIGHT = window.innerHeight;
    renderer.setSize(WIDTH, HEIGHT);
    camera.aspect = WIDTH / HEIGHT;
    camera.updateProjectionMatrix();
});

function populate() {
    for (var i = 0; i< params.num; i++) {
        let angle = i * params.angle;
        let radius = params.spread * Math.sqrt(i);
        let x = radius * Math.cos(angle);
        let y = radius * Math.sin(angle);
        console.log(y);
        let sphere = new Sphere(x, y, 3);
        scene.add(sphere.mesh);
    }
}

function render(){
	requestAnimationFrame(render);
  var a = n * 137.5;
  var r = c * Math.sqrt(n);

  var x = r * Math.cos(a) + window.innerWidth/2;
  var y = r * Math.sin(a) + window.innerHeight/2;
  //sphere.mesh.position.x = params.pos_x;
  //sphere.mesh.position.y = params.pos_y;
  //sphere.mesh.position.z = params.pos_z;

  n++;
	renderer.render(scene, camera);
}

render();
