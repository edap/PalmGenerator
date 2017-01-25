/* eslint-env browser */
import * as THREE from 'three';
import Gui from './gui.js';
import {phyllotaxisSimple, phyllotaxisApple, phyllotaxisWrong} from './phillotaxis.js';
import CollectionGeometries from './geometries.js';
import CollectionMaterials from './materials.js';

const goldenRatio = 13.508;
const gui = new Gui();
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
const materials = new CollectionMaterials;
const geometries = new CollectionGeometries;
var objects = [];
var flower = new THREE.Group();
let n_frames = 0;

//lights
let ambientLight = new THREE.AmbientLight( 0x000000 );
scene.add( ambientLight );
gui.addScene(scene, ambientLight, renderer);
gui.addMaterials(materials);

let lights = [];
lights[ 0 ] = new THREE.PointLight( 0xffffff, 1, 0 );
lights[ 1 ] = new THREE.PointLight( 0xffffff, 1, 0 );
lights[ 2 ] = new THREE.PointLight( 0xffffff, 1, 0 );

lights[ 0 ].position.set( 0, 200, 0 );
lights[ 1 ].position.set( 100, 200, 100 );
lights[ 2 ].position.set( - 100, - 200, - 100 );

scene.add( lights[ 0 ] );
scene.add( lights[ 1 ] );
scene.add( lights[ 2 ] );


var axisHelper = new THREE.AxisHelper( 50 );
//scene.add( axisHelper );

window.addEventListener('resize', function() {
    var WIDTH = window.innerWidth,
    HEIGHT = window.innerHeight;
    renderer.setSize(WIDTH, HEIGHT);
    camera.aspect = WIDTH / HEIGHT;
    camera.updateProjectionMatrix();
});

function populateFlower(selected_geometry, selected_material) {
    let angleInRadians = gui.params.angle * (Math.PI/180.0);
    for (var i = 0; i< gui.params.num; i++) {
        let coord;
        let object = new THREE.Mesh(selected_geometry, selected_material);
        switch(gui.params.modus){
            case "apple":
                coord = phyllotaxisApple(i, angleInRadians, gui.params.spread, gui.params.num);
                object.position.set(coord.x, coord.y, coord.z);
            break;
            case "weird":
                coord = phyllotaxisWrong(i, gui.params.angle, gui.params.spread, gui.params.num);
                object.position.set(coord.x, coord.y, coord.z);
            break;
            default:
                coord = phyllotaxisSimple(i, angleInRadians, gui.params.spread, gui.params.extrude_2Dflower);
                object.position.set(coord.x, coord.y, coord.z);
                object.rotateY( (90 + 40 + i * 100/gui.params.num ) * -Math.PI/180.0 );
            break;
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
    if(gui.params.anim_spread){
        gui.params.spread = Math.abs(Math.sin(n_frames/100) * gui.params.amplitude);
    }
    populateFlower(geometries[gui.params.geometry],materials[gui.params.material]);
    if(gui.params.zoetrope){
        flower.rotateZ(gui.params.zoetrope_angle);
    }
    requestAnimationFrame(render);
    renderer.render(scene, camera);
    resetFlower();
}

render();
