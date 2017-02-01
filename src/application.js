/* eslint-env browser */
import * as THREE from 'three';
import Gui from './gui.js';
import {phyllotaxisConical} from './phillotaxis.js';
import CollectionGeometries from './geometries.js';
import CollectionMaterials from './materials.js';
import {PointLights} from './pointLights.js';
const radius = 5; //this number is used to create the geometried and to position the Leafs correctly
const geometries = new CollectionGeometries(radius);
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


window.addEventListener('resize', function() {
    let WIDTH = window.innerWidth,
    HEIGHT = window.innerHeight;
    renderer.setSize(WIDTH, HEIGHT);
    camera.aspect = WIDTH / HEIGHT;
    camera.updateProjectionMatrix();
});

function transformIntoLeaf(object, iter, angleInRadians, radius, scaleAsItGrows){
    let PItoDeg = (Math.PI/180.0);
    //the scale ratio is a value between 0.001 and 1.
    // It is 0.0001 for the first leaves, and 1 for the last ones
    let ratio = Math.abs(iter/gui.params.foliage_start_at);
    //this is to avaoid a scaleRatio of 0, that would cause a warning while scaling
    // an object for 0
    let scaleRatio = ratio === 0 ? 0.001 : ratio;
    object.rotateZ( iter* angleInRadians);
    let yrot = (iter/gui.params.angle_y) * gui.params.foliage_start_at;
    //object.rotateY( (yrot ) * -PItoDeg );
    object.rotateY( (90 + gui.params.angle_y + iter * 200/gui.params.num ) * -PItoDeg );

    // as they grow up, they should be translate on its own x axis, otherwise
    // with certains geometries, like spheres, they make an intersections that looks weird
    if (scaleAsItGrows) {
        object.translateX(gui.params.scale_x * scaleRatio * (radius -0.2) );
        object.scale.set(gui.params.scale_x * scaleRatio ,gui.params.scale_y,1);
    }else{
        object.translateX(gui.params.scale_x* radius );
        object.scale.set(gui.params.scale_x ,gui.params.scale_y,1);
    }

}

function populatePalm(foliage_geometry, trunk_geometry, selected_material, radius) {
    let PItoDeg = (Math.PI/180.0);
    let angleInRadians = gui.params.angle * PItoDeg;
    for (var i = 0; i< gui.params.num; i++) {
        let isALeaf = (i <= gui.params.foliage_start_at)? true : false;
        let geometry = isALeaf ? foliage_geometry : trunk_geometry;
        let object = new THREE.Mesh(geometry, selected_material);
        let coord = phyllotaxisConical(i, angleInRadians, gui.params.spread, gui.params.z_decrease);
        object.position.set(coord.x, coord.y, coord.z);
        if (isALeaf) {
            transformIntoLeaf(object, i, angleInRadians, radius, gui.params.scale_as_grows);
        } else {
            object.rotateZ( i* angleInRadians);
            object.rotateY( (90 + gui.params.angle_y + i * 100/gui.params.num ) * -PItoDeg );
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
        gui.params.spread = Math.abs(Math.sin(n_frames/100) * gui.params.amplitude);
        //gui.params.num = Math.abs(Math.sin(n_frames/100) * gui.params.amplitude);
    }
    populatePalm(
        geometries[gui.params.foliage_geometry],
        geometries[gui.params.trunk_geometry],
        material, radius);
    if (gui.params.zoetrope) {
        palm.rotateZ(gui.params.zoetrope_angle);
    }
    requestAnimationFrame(render);
    renderer.render(scene, camera);
    resetPalm();
}

render();
