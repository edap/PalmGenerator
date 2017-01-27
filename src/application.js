/* eslint-env browser */
import * as THREE from 'three';
import Gui from './gui.js';
import {phyllotaxisConical} from './phillotaxis.js';
import CollectionGeometries from './geometries.js';
import CollectionMaterials from './materials.js';
import {PointLights} from './pointLights.js';

const geometries = new CollectionGeometries;
const materials = new CollectionMaterials;
const material = materials["phong"];
const gui = new Gui(material);

//setup the scene and the camera
const scene = new THREE.Scene();
const OrbitControls = require('three-orbit-controls')(THREE);
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({antialias:true});
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.style.margin =0;
document.body.appendChild(renderer.domElement);
camera.position.z = 80;
this.controls = new OrbitControls(camera, renderer.domElement);

//palm group
var objects = [];
var palm = new THREE.Group();
let n_frames = 0;

//add lights to the scene
let ambientLight = new THREE.AmbientLight( 0xa2ac00 );
scene.add( ambientLight );
renderer.setClearColor( 0x57be92 );
gui.addScene(scene, ambientLight, renderer);
PointLights().map((light) => {
    scene.add( light );
});


let axisHelper = new THREE.AxisHelper( 50 );
//scene.add( axisHelper );

window.addEventListener('resize', function() {
    let WIDTH = window.innerWidth,
    HEIGHT = window.innerHeight;
    renderer.setSize(WIDTH, HEIGHT);
    camera.aspect = WIDTH / HEIGHT;
    camera.updateProjectionMatrix();
});

let getCurrentGeometry = (foliage_geometry, trunk_geometry, iter) => {
    let geometry;
    if (iter> gui.params.foliage_start_at ) {
        geometry = foliage_geometry;
    } else {
        geometry = trunk_geometry;
    }
    return geometry;
};

function transformIntoLeaf(object, iter){
    let ratio = Math.abs(iter/gui.params.foliage_start_at);
    //this is to avaoid a scaleRatio of 0, that would cause a warning
    let scaleRatio = ratio === 0 ? 0.01 : ratio;
    object.scale.set(gui.params.scale_x*(scaleRatio),gui.params.scale_y,1);
}

function populatePalm(foliage_geometry, trunk_geometry, selected_material) {
    let PItoDeg = (Math.PI/180.0);
    let angleInRadians = gui.params.angle * PItoDeg;
    for (var i = 0; i< gui.params.num; i++) {
        let geometry = getCurrentGeometry(foliage_geometry, trunk_geometry, i);
        let object = new THREE.Mesh(geometry, selected_material);
        let coord;
        coord = phyllotaxisConical(i, angleInRadians, gui.params.spread, gui.params.z_decrease);
        object.position.set(coord.x, coord.y, coord.z);
        object.rotateZ( i* angleInRadians);
        object.rotateY( (90 + gui.params.angle_y + i * 100/gui.params.num ) * -PItoDeg );
        //object.rotateZ( gui.params.angle_x);
        if (i <= gui.params.foliage_start_at) {
            transformIntoLeaf(object, i);
        }
        objects.push(object);
        palm.add(object);
    }
    scene.add(palm);
}

function resetPalm(){
    for(var index in objects){
        let object = objects[index];
			  palm.remove( object );
    }
    scene.remove(palm);
    objects = [];
}

function render(){
    n_frames++;
    let spread;
    if (gui.params.anim_spread) {
        //gui.params.spread = Math.abs(Math.sin(n_frames/100) * gui.params.amplitude);
        gui.params.num = Math.abs(Math.sin(n_frames/100) * gui.params.amplitude);
    }
    populatePalm(
        geometries[gui.params.foliage_geometry],
        geometries[gui.params.trunk_geometry],
        material);
    if (gui.params.zoetrope) {
        palm.rotateZ(gui.params.zoetrope_angle);
    }
    requestAnimationFrame(render);
    renderer.render(scene, camera);
    resetPalm();
}

render();
