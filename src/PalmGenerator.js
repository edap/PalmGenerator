import LeafGeometry from './leafGeometry.js';
import {phyllotaxisConical} from './phillotaxis.js';
import * as THREE from 'THREE';

export default class PalmGenerator{
    constructor(foliage_options, general_options, material){
        let cleaned_leaf_geometry_options =
            this.merge_and_validate_foliage(foliage_options, this.default_foliage_options());
        let cleaned_general_options =
            this.merge_and_validate_general(general_options, this.default_general_options());
        let objects = this.buildPalm(cleaned_leaf_geometry_options, cleaned_general_options, material);
        let geometry = this.mergeObjectsInOneGeometry(objects);
        return geometry;
    }

    default_foliage_options(){
        return {
            length:20,
            length_stem:4,
            width_stem:2,
            leaf_width:0.5,
            leaf_up:1,
            density:2,
            positive_curvature: 0.05,
            positive_curvature_border: 0.05,
            leaf_inclination: 0.2
        };
    }

    default_general_options(){
        return {
            spread: 0.2,
            angle: 137.5,
            num: 500,
            z_decrease: 0.05,
            foliage_start_at: 50,
            starting_angle_y: 50,
            angle_y: 29
        };
    }

    merge_and_validate_foliage(options, defaults){
        //TODO implement validations
        let opt = Object.assign(defaults, options);
        return opt;
    }

    merge_and_validate_general(options, defaults){
        //TODO implement validations
        let opt = Object.assign(defaults, options);
        return opt;
    }

    buildPalm(leaf_geometry_options, general_options, material){
        let radius = 5;
        let leafGeometry = new LeafGeometry(leaf_geometry_options);//here you could have passed any type of geometry, anyway, with the leafGeometry it looks like a palm
        let trunkGeometry = new THREE.BoxGeometry( radius, radius, radius);
        let objects = this.populatePalm(leafGeometry, trunkGeometry, general_options, material);
        return objects;
    }

    populatePalm(foliage_geometry, trunk_geometry, options, selected_material) {
        let objs = [];
        let PItoDeg = (Math.PI/180.0);
        let angleInRadians = options.angle * PItoDeg;
        for (var i = 0; i< options.num; i++) {
            let isALeaf = (i <= options.foliage_start_at)? true : false;
            let geometry = isALeaf ? foliage_geometry : trunk_geometry;
            let object = new THREE.Mesh(geometry, selected_material);
            object.angle = angleInRadians * i;
            let coord = phyllotaxisConical(i, angleInRadians, options.spread, options.z_decrease);
            object.position.set(coord.x, coord.y, coord.z);
            if (isALeaf) {
                this.transformIntoLeaf(object, i, angleInRadians, options);
            } else {
                object.rotateZ( i* angleInRadians);
                object.rotateY( (90 + options.angle_y + i * 100/options.num ) * -PItoDeg );
            }
            objs.push(object);
        }
        return objs;
    }

    transformIntoLeaf(object, iter, angleInRadians, options){
        let PItoDeg = (Math.PI/180.0);
        //the scale ratio is a value between 0.001 and 1.
        // It is 0.0001 for the first leaves, and 1 for the last ones
        let ratio = Math.abs(iter/options.foliage_start_at);
        //this is to avaoid a scaleRatio of 0, that would cause a warning while scaling
        // an object for 0
        let scaleRatio = ratio === 0 ? 0.001 : ratio;
        object.rotateZ( iter* angleInRadians);
        let yrot = (iter/options.angle_y) * options.foliage_start_at;
        //object.rotateY( (yrot ) * -PItoDeg );
        let y_angle = options.angle_y * scaleRatio;
        object.rotateY( (options.starting_angle_y + y_angle + iter * 200/options.num ) * -PItoDeg );

        // as they grow up, they become bigger
        object.scale.set(5 * scaleRatio ,1 ,1);
        object.rotateZ(-(Math.PI/2));
    }

    mergeObjectsInOneGeometry(objects){
        let geometry = new THREE.Geometry();
        for (let i = 0; i < objects.length; i++){
            let mesh = objects[i];
            mesh.updateMatrix();
            geometry.merge(mesh.geometry, mesh.matrix);
        }
        return geometry;
    }
}
