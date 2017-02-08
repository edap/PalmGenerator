/* eslint-env browser */
import * as THREE from 'three';
import LeafGeometry from './leafGeometry.js';
import Stats from 'stats.js';
import Gui from './gui.js';
import {phyllotaxisConical} from './phillotaxis.js';
import {fragmentShader, vertexShader} from './shaders.js';
import CollectionGeometries from './geometries.js';
import CollectionMaterials from './materials.js';
import {PointLights} from './pointLights.js';
const radius = 5; //this number is used to create the geometried and to position the Leafs correctly
const geometries = new CollectionGeometries(radius);
const materials = new CollectionMaterials;
const material = materials["phong"];
const gui = new Gui(material);

const stats = new Stats();
const scene = new THREE.Scene();
const OrbitControls = require('three-orbit-controls')(THREE);
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({antialias:true});

var objects = [];
var palm = new THREE.Group();
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

    //palm group

    //add lights to the scene
    let ambientLight = new THREE.AmbientLight( 0xa2ac00 );
    scene.add( ambientLight );
    renderer.setClearColor( 0x57be92 );
    gui.addScene(scene, ambientLight, renderer);
    PointLights().map((light) => {
        scene.add( light );
    });
    let mat = getMaterial();


    window.addEventListener('resize', function() {
        let WIDTH = window.innerWidth,
        HEIGHT = window.innerHeight;
        renderer.setSize(WIDTH, HEIGHT);
        camera.aspect = WIDTH / HEIGHT;
        camera.updateProjectionMatrix();
    });
    let leafGeom = new LeafGeometry(gui.params.length,
                                    gui.params.length_stem,
                                    gui.params.width_stem,
                                    gui.params.leaf_width,
                                    gui.params.leaf_up,
                                    gui.params.density,
                                    gui.params.curvature,
                                    gui.params.curvature_border,
                                    gui.params.leaf_inclination);
    let objs = populatePalm(
        leafGeom,
        //geometries[gui.params.foliage_geometry],
        geometries["box"],
        //material, radius);
        mat, radius);

    //scene.add(palm);

    let hash_vertex_info = getTotNumVertices(leafGeom, geometries["box"], gui.params.num, gui.params.foliage_start_at);
    let buffers = createBuffers(hash_vertex_info.tot_vertices);
    var geometry = new THREE.Geometry();
    for (let i = 0; i < objs.length; i++){
        //buffers
        if (i <= gui.params.foliage_start_at) {
            //fullfill color
            for(let pos=(i*hash_vertex_info.n_vertices_leaf); pos < ((i+1) * hash_vertex_info.n_vertices_leaf); pos++){
                buffers.angleBuffer[pos] = objs[i].angle;
                buffers.isLeafBuffer[pos] = 1.0;
            }
        } else {
            for(let pos=(i*hash_vertex_info.n_vertices_trunk); pos < ((i+1) * hash_vertex_info.n_vertices_trunk); pos++){
                buffers.angleBuffer[pos] = objs[i].angle;
                buffers.isLeafBuffer[pos] = 0.0;
            }
        }
        //
        let mesh = objs[i];
        mesh.updateMatrix();
        geometry.merge(mesh.geometry, mesh.matrix);
    }

    let bufGeometry = new THREE.BufferGeometry().fromGeometry(geometry);
    console.log(bufGeometry.attributes.position.count);
    console.log(hash_vertex_info.tot_vertices);
    bufGeometry.addAttribute( 'angle', new THREE.BufferAttribute( buffers.angleBuffer, 1 ) );
    bufGeometry.addAttribute( 'isLeaf', new THREE.BufferAttribute( buffers.isLeafBuffer, 1 ) );
    scene.add(new THREE.Mesh(bufGeometry, mat));
}

function createBuffers(n_vert){
    return {
        angleBuffer: new Float32Array(n_vert),
        isLeafBuffer: new Float32Array(n_vert)
    };
}



function getMaterial(){
    let screenResolution = new THREE.Vector2(window.innerWidth, window.innerHeight);
    let tmp_uniforms = {
		    time: { value: 1.0 },
        color: {type: "c", value: new THREE.Color( gui.params.color )},
		    uResolution: { value: screenResolution }
	  };
    console.log(vertexShader());
    let material = new THREE.ShaderMaterial( {
	      uniforms: THREE.UniformsUtils.merge([
            THREE.UniformsLib['lights'],
            tmp_uniforms
        ]),
        lights: true,
	      vertexShader: vertexShader(),
	      fragmentShader: fragmentShader()

    } );
    console.log(material.vertexShader);
    return material;
}

function transformIntoLeaf(object, iter, angleInRadians, radius){
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
    let y_angle = gui.params.angle_y * scaleRatio;
    object.rotateY( (gui.params.starting_angle_y + y_angle + iter * 200/gui.params.num ) * -PItoDeg );

    // as they grow up, they become bigger
    object.scale.set(5 * scaleRatio ,1 ,1);
    object.rotateZ(-(Math.PI/2));

}

function getTotNumVertices(foliage_geometry, trunk_geometry, tot_objects, foliage_start_at){
    let n_vertices_in_leaf = foliage_geometry.vertices.length * 3;
    let n_vertices_in_trunk = trunk_geometry.vertices.length * 3;
    let n_vertices_in_leafs = foliage_start_at * n_vertices_in_leaf;
    let n_vertices_in_stam = (tot_objects - foliage_start_at) * n_vertices_in_trunk;
    return{
        tot_vertices: (n_vertices_in_stam + n_vertices_in_leafs),
        n_vertices_leaf: n_vertices_in_leaf,
        n_vertices_trunk: n_vertices_in_trunk
    };
}

function populatePalm(foliage_geometry, trunk_geometry, selected_material, radius) {
    let objs = [];
    let PItoDeg = (Math.PI/180.0);
    let angleInRadians = gui.params.angle * PItoDeg;
    for (var i = 0; i< gui.params.num; i++) {
        let isALeaf = (i <= gui.params.foliage_start_at)? true : false;
        let geometry = isALeaf ? foliage_geometry : trunk_geometry;
        let object = new THREE.Mesh(geometry, selected_material);
        object.angle = angleInRadians * i;
        let coord = phyllotaxisConical(i, angleInRadians, gui.params.spread, gui.params.z_decrease);
        object.position.set(coord.x, coord.y, coord.z);
        if (isALeaf) {
            transformIntoLeaf(object, i, angleInRadians, radius);
        } else {
            object.rotateZ( i* angleInRadians);
            object.rotateY( (90 + gui.params.angle_y + i * 100/gui.params.num ) * -PItoDeg );
        }
        objs.push(object);
        //palm.add(object);
    }
    return objs;
}


function render(){
    stats.begin();
    renderer.render(scene, camera);
    stats.end();
    requestAnimationFrame(render);
}
init();
render();
