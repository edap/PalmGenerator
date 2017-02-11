/* eslint-env browser */
import * as THREE from 'three';
import LeafGeometry from './leafGeometry.js';
import PalmGenerator from './PalmGenerator.js';
import Stats from 'stats.js';
import Gui from './gui.js';
import {phyllotaxisConical} from './phillotaxis.js';
import {fragmentShader, vertexShader} from './shaders.js';
import CollectionMaterials from './materials.js';
import {PointLights} from './pointLights.js';

const materials = new CollectionMaterials;
let material = getMaterial();
//let material = materials["phong"];
const gui = new Gui(material);

const stats = new Stats();
const scene = new THREE.Scene();
const OrbitControls = require('three-orbit-controls')(THREE);
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({antialias:true});

var objects = [];
let n_frames = 0;

function init(){
    //setup the scene and the camera
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.style.margin =0;
    document.body.appendChild(renderer.domElement);

    stats.showPanel( 0 ); // 0: fps, 1: ms, 2: mb, 3+: custom
    document.body.appendChild( stats.dom );
    camera.position.z = 80;
    let controls = new OrbitControls(camera, renderer.domElement);

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

    let opt = {length: gui.params.length,
               length_stem: gui.params.length_stem,
               width_stem:gui.params.width_stem,
               leaf_width:gui.params.leaf_width,
               leaf_up:gui.params.leaf_up,
               density:gui.params.density,
               curvature:gui.params.curvature,
               curvature_border:gui.params.curvature_border,
               leaf_inclination:gui.params.leaf_inclination};

    let trunkGeometry = new THREE.BoxGeometry(5,5,5);
    let leafGeometry = new LeafGeometry(opt);
    let palm = new PalmGenerator(leafGeometry,
                                     trunkGeometry,
                                     {num:1200, foliage_start_at:40},
                                     true
                                    );
    let geometry = palm.geometry;
    let palmBuffers = palm.buffers;
    let bufGeometry = new THREE.BufferGeometry().fromGeometry(geometry);
    console.log(palmBuffers);
    bufGeometry.addAttribute( 'angle', new THREE.BufferAttribute(
        palmBuffers.angle,
        1));
    scene.add(new THREE.Mesh(bufGeometry, material));
}

function getMaterial(){
    let screenResolution = new THREE.Vector2(window.innerWidth, window.innerHeight);
    let tmp_uniforms = {
		    time: { value: 1.0 },
        color: {type: "c", value: new THREE.Color( 0xff3322 )},
		    uResolution: { value: screenResolution }
	  };
    //console.log(vertexShader());
    let material = new THREE.ShaderMaterial( {
	      uniforms: THREE.UniformsUtils.merge([
            THREE.UniformsLib['lights'],
            tmp_uniforms
        ]),
        lights: true,
	      vertexShader: vertexShader(),
	      fragmentShader: fragmentShader()

    } );
    //console.log(material.vertexShader);
    return material;
}


function render(){
    stats.begin();
    renderer.render(scene, camera);
    stats.end();
    requestAnimationFrame(render);
}
init();
render();
