/* eslint-env browser */
import * as THREE from 'three';
import Cube from './cube.js';
import DAT from 'dat-gui';

//sphere
const widthSegments = 32;
const heightSegments = 32;
const radius = 5;
var geometry = new THREE.SphereGeometry(radius, widthSegments, heightSegments);
var material = new THREE.MeshStandardMaterial( {color: 0x00ff00} );


var objects = [];
var flower = new THREE.Group();
const scene = new THREE.Scene();
const OrbitControls = require('three-orbit-controls')(THREE);
const gui = new DAT.GUI();
var params = {
    angle: 137.5,
    spread: 10,
    num: 100,
    rotate_flower: false,
    extrude_flower: false,
    amplitude: 0.1,
    inc_bla: 0.5,
    pos_x: 0,
    pos_y: 0,
    pos_z: 0
};


gui.add(params, "pos_x").min(-10).max(10).step(1);
gui.add(params, "pos_y").min(-10).max(10).step(1);
gui.add(params, "pos_z").min(0).max(70).step(1);
gui.add(params, "num").min(1).max(400).step(1);
gui.add(params, "angle").min(130).max(140).step(0.2);
gui.add(params, "spread").min(0).max(20).step(0.1);
gui.add(params, "amplitude").min(0).max(10).step(0.1);
gui.add(params, "inc_bla").min(0.1).max(1).step(0.1);
gui.add(params, "rotate_flower");
gui.add(params, "extrude_flower");

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
var n = 0;
const c = 2;

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

camera.position.z = 80;
this.controls = new OrbitControls(camera, renderer.domElement);


//light
var light = new THREE.DirectionalLight(0xffffff);
light.position.set(1,0,1).normalize();
scene.add(light);

//populateFlower();

window.addEventListener('resize', function() {
    var WIDTH = window.innerWidth,
    HEIGHT = window.innerHeight;
    renderer.setSize(WIDTH, HEIGHT);
    camera.aspect = WIDTH / HEIGHT;
    camera.updateProjectionMatrix();
});

var bla =0.02;
function populateFlower() {
    for (var i = 0; i< params.num; i++) {
        let coord = phyllotaxis(i, params.angle, params.spread);
        let sphere = new THREE.Mesh(geometry, material);
        sphere.position.set(coord.x, coord.y, 0);
        if(params.extrude_flower){
            //sphere.position.z = i * -.05;
            var z = Math.sin(bla) * params.amplitude;
            console.log(z);
            bla += params.inc_bla;
            sphere.position.z = z;
            console.log(z);
				    sphere.rotateY( (90 + 40 + i * 100/params.num ) * Math.PI/180.0 );
        }
        objects.push(sphere);
        flower.add(sphere);
    }
    scene.add(flower);
}

function resetFlower(){
    for(var index in objects){
        let object = objects[index];
			  flower.remove( object );
    }
    scene.remove(flower);
    objects = [];
}

function phyllotaxis(i, angle, spread){
    let current_angle = i * angle;
    let radius = spread * Math.sqrt(i);
    let x = radius * Math.cos(current_angle);
    let y = radius * Math.sin(current_angle);
    return {x: x, y: y};
}

function render(){
    populateFlower();
    if(params.rotate_flower){
        flower.rotateZ( 0.0137);
    }
	  requestAnimationFrame(render);
	  renderer.render(scene, camera);
    resetFlower();
}

render();
