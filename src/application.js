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
    document.body.addEventListener("keypress", maybeSpacebarPressed);

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

    let curve = getCurve();

    let palm = new PalmGenerator(leafGeometry,
                                 trunkGeometry,
                                 {num:200, foliage_start_at:30, z_decrease:0.7},
                                 curve);
    let geometry = palm.geometry;
    let bufGeometry = new THREE.BufferGeometry().fromGeometry(geometry);
    // disable color for a while
    // let palmBuffers = palm.buffers;
    // console.log(palmBuffers);
    // bufGeometry.addAttribute( 'angle', new THREE.BufferAttribute(
    //     palmBuffers.angle,
    //     1));

    //scene.add(new THREE.Mesh(bufGeometry, material));
    let mesh = new THREE.Mesh(bufGeometry, material);
    mesh.material = new THREE.MeshLambertMaterial( {
        color: 0xffffff
    } );
    scene.add( mesh );

    var helper = new THREE.EdgesHelper( mesh, 0x969696 );
    helper.material.linewidth = 1;
    scene.add( helper );
}

function getCurve(){
    var curve = new THREE.CatmullRomCurve3( [
	      new THREE.Vector3( 0, 0, 0 ),
	      new THREE.Vector3( -10, 0, -30 ),
	      new THREE.Vector3( 10, 0, -100 )
    ] );
    return curve;
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

function maybeSpacebarPressed(e){
    if (e.keyCode === 0 || e.keyCode === 32) {
        e.preventDefault();
            let cameraSpeed = 0.9;
            camera.position.z  += cameraSpeed;
        }
    }


function render(){
    stats.begin();
    renderer.render(scene, camera);
    stats.end();
    requestAnimationFrame(render);
}
init();
render();
