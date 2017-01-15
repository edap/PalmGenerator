/* eslint-env browser */
import {Scene, PerspectiveCamera, WebGLRenderer} from 'three';
import Cube from './cube.js';

const scene = new Scene();
const camera = new PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

const renderer = new WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
const cube = new Cube();
scene.add(cube.mesh);

camera.position.z = 5;

function render(){
	requestAnimationFrame(render);
	cube.update();
	renderer.render(scene, camera);
}

render();
