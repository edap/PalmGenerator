/* eslint-env browser */
import * as THREE from 'three';
import Gui from './gui.js';
import {phyllotaxisSimple, phyllotaxisApple, phyllotaxisWrong} from './phillotaxis.js';
import CollectionGeometries from './geometries.js';
import CollectionMaterials from './materials.js';
import {PointLights} from './pointLights.js';

const goldenRatio = 13.508;
const geometries = new CollectionGeometries;
const materials = new CollectionMaterials;
let material = materials["phong"];
const gui = new Gui(material);
const scene = new THREE.Scene();
const OrbitControls = require('three-orbit-controls')(THREE);
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({antialias:true});
renderer.setSize(window.innerWidth, window.innerHeight);

document.body.style.margin =0;
document.body.appendChild(renderer.domElement);
camera.position.z = 80;
this.controls = new OrbitControls(camera, renderer.domElement);

//scene
var objects = [];
var flower = new THREE.Group();
let n_frames = 0;

//lights
let ambientLight = new THREE.AmbientLight( 0xa2ac00 );
scene.add( ambientLight );

renderer.setClearColor( 0x57be92 );
gui.addScene(scene, ambientLight, renderer);
//gui.addMaterials(materials);

PointLights().map((light) => {
    scene.add( light );
});


var axisHelper = new THREE.AxisHelper( 50 );
//scene.add( axisHelper );

window.addEventListener('resize', function() {
    var WIDTH = window.innerWidth,
    HEIGHT = window.innerHeight;
    renderer.setSize(WIDTH, HEIGHT);
    camera.aspect = WIDTH / HEIGHT;
    camera.updateProjectionMatrix();
});

function populateFlower(selected_geometry, selected_second_geometry, selected_material) {
    let PItoDeg = (Math.PI/180.0);
    let angleInRadians = gui.params.angle * PItoDeg;
    for (var i = 0; i< gui.params.num; i++) {

        let geometry;
        if (i> gui.params.change_geometry_at ) {
            geometry = selected_second_geometry;
        } else {
            geometry = selected_geometry;
        }
        let object = new THREE.Mesh(geometry, selected_material);
        let coord;
        coord = phyllotaxisSimple(i, angleInRadians, gui.params.spread, gui.params.extrude_2Dflower);
        object.position.set(coord.x, coord.y, coord.z);

        object.rotateZ( i* angleInRadians);
        object.rotateY( (90 + gui.params.angle_y + i * 100/gui.params.num ) * -PItoDeg );
        //object.rotateZ( gui.params.angle_x);
        if (i <= gui.params.change_geometry_at) {
            let ratio = Math.abs(i/gui.params.change_geometry_at);
            //this is to avaoid a scaleRatio of 0, that would cause a warning
            let scaleRatio = ratio === 0 ? 0.01 : ratio;
            object.scale.set(gui.params.scale_x*(scaleRatio),gui.params.scale_y,1);
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
    n_frames++;
    let spread;
    if (gui.params.anim_spread) {
        //gui.params.spread = Math.abs(Math.sin(n_frames/100) * gui.params.amplitude);
        gui.params.num = Math.abs(Math.sin(n_frames/100) * gui.params.amplitude);
    }
    populateFlower(geometries[gui.params.geometry], geometries[gui.params.second_geometry], material);
    if (gui.params.zoetrope) {
        flower.rotateZ(gui.params.zoetrope_angle);
    }
    requestAnimationFrame(render);
    renderer.render(scene, camera);
    resetFlower();
}

render();
