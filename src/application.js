/* eslint-env browser */

import * as THREE from 'three';
import LeafGeometry from './leafGeometry.js';
import PalmGenerator from './PalmGenerator.js';
import {fragmentShader, vertexShader} from './shaders.js';
import CollectionMaterials from './materials.js';
import {PointLights} from './pointLights.js';

const materials = new CollectionMaterials;
let material = materials["standard"];

const scene = new THREE.Scene();
const OrbitControls = require('three-orbit-controls')(THREE);
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({antialias:true});
const resolution = new THREE.Vector2( window.innerWidth, window.innerHeight );

let addCurve = false;

function init(){
    //setup the scene and the camera
    document.body.style.margin=0;
    document.body.style.padding=0;

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

    camera.position.z = 140;
    let opt = {
        length: 50,
        length_stem: 4,
        width_stem: 0.5,
        leaf_width: 0.5,
        leaf_up: 1.5,
        density: 30,
        curvature: 0.03,
        curvature_border: 0.005,
        leaf_inclination: 0.7000000000000001};

    let trunkGeometry = new THREE.BoxGeometry(5,5,5);
    let leafGeometry = new LeafGeometry(opt);

    let curve = getCurve();
    if (addCurve) {
        var cgeometry = new THREE.Geometry();
        cgeometry.vertices = curve.getPoints( 50 );
        var cmaterial = new THREE.LineBasicMaterial( { color : 0xff0000 } );
        var curveObject = new THREE.Line( cgeometry, cmaterial );
        scene.add(curveObject);
    }

    let palm = new PalmGenerator(leafGeometry,
                                trunkGeometry,
                                 {        spread: 0,
                                          angle: 137.5,
                                          num: 500,
                                          growth: 0.24,
                                          foliage_start_at: 21.124475427461597,
                                          trunk_regular: true,
                                          buffers: false,
                                          angle_y: 26.469060425556307,
                                          starting_angle_y: 50},
                                //curve);
                                );
    let geometry = palm.geometry;
    let bufGeometry = new THREE.BufferGeometry().fromGeometry(geometry);
    let mesh = new THREE.Mesh(bufGeometry, material);
    scene.add( mesh );
}

function getCurve(){
    var curve = new THREE.CatmullRomCurve3( [
	      new THREE.Vector3( 0, 200, -40 ),
	      new THREE.Vector3( 0, 100, -20 ),
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
