/* eslint-env browser */

import * as THREE from 'three';
import LeafGeometry from './LeafGeometry.js';
import PalmGenerator from './PalmGenerator.js';
import CollectionMaterials from './materials.js';
import {PointLights} from './pointLights.js';

const materials = new CollectionMaterials;
let material = materials["standard"];

const scene = new THREE.Scene();
const OrbitControls = require('three-orbit-controls')(THREE);
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({antialias:true});

function init(){
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);
    let controls = new OrbitControls(camera, renderer.domElement);

    //add lights to the scene
    let ambientLight = new THREE.AmbientLight( 0x34ac0f );
    scene.add( ambientLight );
    renderer.setClearColor( 0x434343 );
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

    camera.position.z = 285;
    //camera.position.y = 10;
    let opt = {
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
    let leafGeometry = new LeafGeometry(opt);

    let curve = getCurve();
    let palm_opt = {
        spread: 0.1,
        angle: 137.5,
        num: 406,
        growth: 0.12,
        foliage_start_at: 56.19748205181567,
        trunk_regular: false,
        buffers: true,
        angle_open: 36.17438258159361,
        starting_angle_open: 50
    };

    let palm = new PalmGenerator(leafGeometry,
                                trunkGeometry,
                                 palm_opt, curve);
    let geometry = palm.geometry;
    let bufGeometry = new THREE.BufferGeometry().fromGeometry(geometry);
    let mesh = new THREE.Mesh(bufGeometry, material);
    scene.add( mesh );
}

function getCurve(){
    var curve = new THREE.CatmullRomCurve3( [
	      new THREE.Vector3( -40, 150, 0 ),
	      new THREE.Vector3( -40, 100, 0 ),
	      new THREE.Vector3( 0, 60, 0 ),
	      new THREE.Vector3( 0, 0, 0 ),
    ] );
    return curve;
}

function render(){
    renderer.render(scene, camera);
    requestAnimationFrame(render);
}
init();
render();
