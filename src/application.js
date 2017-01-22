/* eslint-env browser */
import * as THREE from 'three';
import Gui from './gui.js';
import {phyllotaxisSimple, phyllotaxisSphere} from './phillotaxis.js';
import CollectionGeometries from './geometries.js';
import CollectionMaterials from './materials.js';

const scene = new THREE.Scene();
const OrbitControls = require('three-orbit-controls')(THREE);
const gui = new Gui();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
camera.position.z = 80;
this.controls = new OrbitControls(camera, renderer.domElement);

//scene
const materials = new CollectionMaterials;
const geometries = new CollectionGeometries;
var objects = [];
var flower = new THREE.Group();

//light
var light = new THREE.DirectionalLight(0xffffff);
light.position.set(1,0,1).normalize();
scene.add(light);

var axisHelper = new THREE.AxisHelper( 50 );
scene.add( axisHelper );

window.addEventListener('resize', function() {
    var WIDTH = window.innerWidth,
    HEIGHT = window.innerHeight;
    renderer.setSize(WIDTH, HEIGHT);
    camera.aspect = WIDTH / HEIGHT;
    camera.updateProjectionMatrix();
});

function populateFlower(selected_geometry, selected_material) {
    for (var i = 0; i< gui.params.num; i++) {
        let coord;
        let object = new THREE.Mesh(selected_geometry, selected_material);
        if (gui.params.spherical) {
            coord = phyllotaxisSphere(i, gui.params.angle, gui.params.angle_b, gui.params.spread, gui.params.num);
            object.position.set(coord.x, coord.y, coord.z);
        } else {
            coord = phyllotaxisSimple(i, gui.params.angle, gui.params.spread, gui.params.extrude_2Dflower);
            object.position.set(coord.x, coord.y, coord.z);
				    object.rotateY( (90 + 40 + i * 100/gui.params.num ) * -Math.PI/180.0 );
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
    populateFlower(geometries[gui.params.geometry],materials[gui.params.material]);
    if(gui.params.rotate_flower){
        flower.rotateZ( 0.0137);
    }
	  requestAnimationFrame(render);
	  renderer.render(scene, camera);
    resetFlower();
}

render();
