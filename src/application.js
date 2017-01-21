/* eslint-env browser */
import * as THREE from 'three';
import Cube from './cube.js';
import DAT from 'dat-gui';
import {phyllotaxisSimple, phyllotaxisSphere} from './phillotaxis.js';

//geometries
const widthSegments = 32;
const heightSegments = 32;
const radius = 5;
const geometries = {
    "sphere": new THREE.SphereGeometry(radius, widthSegments, heightSegments),
    "box": new THREE.BoxGeometry( radius, radius, radius, 4, 4, 4 )
};

var material = new THREE.MeshStandardMaterial( {color: 0x00ff00} );


var objects = [];
var flower = new THREE.Group();
const scene = new THREE.Scene();
const OrbitControls = require('three-orbit-controls')(THREE);
const gui = new DAT.GUI();
var params = {
    geometry: "sphere",
    angle: 137.5,
    angle_b: 137.5,
    spread: 10,
    num: 100,
    rotate_flower: false,
    extrude_2Dflower: false,
    amplitude: 0.1,
    spherical:false,
    inc_bla: 0.5
};


gui.add(params, "num").min(1).max(800).step(1);
gui.add(params, "geometry", ["sphere", "box"]);
gui.add(params, "angle").min(132.0).max(138.0).step(0.1);
gui.add(params, "angle_b").min(137.3).max(137.6).step(0.1);
gui.add(params, "spread").min(0).max(20).step(0.1);
gui.add(params, "amplitude").min(0).max(10).step(0.1);
gui.add(params, "inc_bla").min(0.1).max(1).step(0.1);
gui.add(params, "rotate_flower");
gui.add(params, "extrude_2Dflower");
gui.add(params, "spherical");

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
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

function populateFlower(selected_geometry) {
    for (var i = 0; i< params.num; i++) {
        let coord;
        let object = new THREE.Mesh(selected_geometry, material);
        if (params.spherical) {
            coord = phyllotaxisSphere(i, params.angle, params.angle_b, params.spread, params.num);
            object.position.set(coord.x, coord.y, coord.z);
        } else {
            coord = phyllotaxisSimple(i, params.angle, params.spread, params.extrude_2Dflower);
            object.position.set(coord.x, coord.y, coord.z);
				    object.rotateY( (90 + 40 + i * 100/params.num ) * Math.PI/180.0 );
        }

        objects.push(object);
        flower.add(object);
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

function render(){
    populateFlower(geometries[params.geometry]);
    if(params.rotate_flower){
        flower.rotateZ( 0.0137);
    }
	  requestAnimationFrame(render);
	  renderer.render(scene, camera);
    resetFlower();
}

render();
