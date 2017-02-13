/* eslint-env browser */
const editMode = true;

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
//let material = getMaterial();
let material = materials["lambert"];
const gui = new Gui(material);

const stats = new Stats();
const scene = new THREE.Scene();
const OrbitControls = require('three-orbit-controls')(THREE);
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({antialias:true, logarithmicDepthBuffer:true});

var objects = [];
let n_frames = 0;
let z_adjust = 10;

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
    let ambientLight = new THREE.AmbientLight( 0x3ccf00 );
    scene.add( ambientLight );
    //renderer.setClearColor( 0x57be92 );
    renderer.setClearColor( 0xffffff );
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

    if(!editMode){
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
        scene.add( mesh );

        // var line = new THREE.EdgesHelper( mesh, 0x000000 );
        // line.material.linewidth = 0.1;

        var edges = new THREE.EdgesGeometry( geometry );
        var line = new THREE.LineSegments( edges, new THREE.LineBasicMaterial( { color: 0x000000 } ) );
        scene.add( line );

    }
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
    if (e.keyCode === 0 || e.keyCode === 38) {
        e.preventDefault();
            z_adjust +=2;
    }
    if (e.keyCode === 0 || e.keyCode === 40) {
        e.preventDefault();
        z_adjust -=2;
    }
}


function addPalmToScene(){
    let opt = {length: gui.params.length,
               length_stem: gui.params.length_stem,
               width_stem:gui.params.width_stem,
               leaf_width:gui.params.leaf_width,
               leaf_up:gui.params.leaf_up,
               density:gui.params.density,
               curvature:gui.params.curvature,
               curvature_border:gui.params.curvature_border,
               leaf_inclination:gui.params.leaf_inclination};
    let palmOpt = {num: gui.params.num,
                   foliage_start_at: gui.params.foliage_start_at,
                   z_decrease: gui.params.z_decrease,
                   angle: gui.params.angle,
                   angle_y: gui.params.angle_y,
                   starting_angle_y: gui.params.starting_angle_y,
                   trunk_regular: gui.params.trunk_regular,
                   spread: gui.params.spread};

    let trunkGeometry = new THREE.BoxGeometry(5,5,5);
    let leafGeometry = new LeafGeometry(opt);
    let palm = new PalmGenerator(leafGeometry,
                                 trunkGeometry,
                                 palmOpt);
    let geometry = palm.geometry;
    geometry.applyMatrix( new THREE.Matrix4().makeTranslation(0, 0, z_adjust) );
    let mesh = new THREE.Mesh(geometry, material);
    mesh.material = material;
    mesh.name = "palm";
    scene.add( mesh );

    var edges = new THREE.EdgesGeometry( geometry );
    var line = new THREE.LineSegments( edges, new THREE.LineBasicMaterial( { color: 0x000000, linewidth:1 } ) );
    line.name = "edges";
    scene.add( line );
}

function removePalmFromScene(){
    let palm = scene.getObjectByName( "palm" );
    let edges = scene.getObjectByName( "edges" );
    scene.remove(palm);
    scene.remove(edges);
}

function render(){
    stats.begin();
    if(editMode){addPalmToScene();};
    renderer.render(scene, camera);
    if(editMode){removePalmFromScene();};
    stats.end();
    requestAnimationFrame(render);
}
init();
render();
