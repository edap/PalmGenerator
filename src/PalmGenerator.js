import {phyllotaxisConical, phyllotaxisOnCurve} from './phillotaxis.js';
import * as THREE from 'THREE';

export default class PalmGenerator{
    // keep in mind, palm grows along the z axis. Specifically, from positive
    // z axis to negative z-axis
    constructor(leaf_geometry, trunk_geometry, options={}, curve=false){
        let buffers;
        let geometry;
        let objects;
        let result;
        let cleaned_options =
            this._merge_and_validate_options(options, this._default_options());

        if (cleaned_options.buffers){
            let hash_vertex_info = this._getTotNumVertices(leaf_geometry,
                                                      trunk_geometry,
                                                      cleaned_options.num,
                                                      cleaned_options.foliage_start_at);

            buffers = this._createBuffers(hash_vertex_info.tot_vertices);
            objects = this._buildPalm(leaf_geometry,
                                      trunk_geometry,
                                      cleaned_options);
            geometry = this._mergeObjectsInOneGeometryAndFullfilBuffers(objects,
                                                                           cleaned_options,
                                                                           hash_vertex_info,
                                                                           buffers);
            result =  { geometry:geometry, buffers: buffers };
        } else {
            objects = this._buildPalm(leaf_geometry,
                                      trunk_geometry,
                                      cleaned_options,
                                      curve);
            geometry = this._mergeObjectsInOneGeometry(objects, cleaned_options);
            result =  { geometry:geometry };
        }
        return result;
    }

    _default_options(){
        return {
            spread: 0.2,
            angle: 137.5,
            num: 500,
            z_decrease: 0.05,
            foliage_start_at: 50,
            starting_angle_y: 50,
            angle_y: 29,
            trunk_regular:true,
            buffers:false
        };
    }

    _merge_and_validate_options(options, defaults){
        //TODO implement validations, check if the first point in the
        // curve as a z value bigger than the last one
        let opt = Object.assign(defaults, options);
        return opt;
    }

    _buildPalm(leaf_geometry, trunk_geometry, options, curve){
        let material = new THREE.MeshBasicMaterial();
        let objects;
        if (curve) {
            // TODO, validate curve, as the user may expect that the starting point
            // is on z
            let curve_geometry = this._createGeometryCurve(curve, options.num);
            objects = this._populatePalmOnCurve(
                leaf_geometry, trunk_geometry, options, material, curve_geometry);
        } else {
            objects = this._populatePalm(
                leaf_geometry, trunk_geometry, options, material);
        }
        return objects;
    }

    _populatePalm(foliage_geometry, trunk_geometry, options, material) {
        let objs = [];
        let PItoDeg = (Math.PI/180.0);
        let angleInRadians = options.angle * PItoDeg;
        for (var i = 0; i< options.num; i++) {
            let isALeaf = (i <= options.foliage_start_at)? true : false;
            let geometry = isALeaf ? foliage_geometry : trunk_geometry;
            let object = new THREE.Mesh(geometry, material);
            //object.angle = angleInRadians * i;
            object.angle = (options.angle * i) % 256;
            //object.angle = i;
            let coord = phyllotaxisConical(i, angleInRadians, options.spread, options.z_decrease);
            object.position.set(coord.x, coord.y, coord.z);
            if (isALeaf) {
                this._transformIntoLeaf(object, i, angleInRadians, options);
            } else {
                object.rotateZ( i* angleInRadians);
                if(options.trunk_regular){
                    object.rotateY( (90 + options.angle_y ) * -PItoDeg );
                }else{
                    object.rotateY( (90 + options.angle_y + i * 100/options.num ) * -PItoDeg );
                }
            }
            objs.push(object);
        }
        return objs;
    }
    _populatePalmOnCurve(foliage_geometry, trunk_geometry, options, material, curve_geometry) {
        let objects = [];
        let PItoDeg = (Math.PI/180.0);
        let angleInRadians = options.angle * PItoDeg;
        for (var i = 0; i< options.num; i++) {
            let isALeaf = (i <= options.foliage_start_at)? true : false;
            let geometry = isALeaf ? foliage_geometry : trunk_geometry;
            let object = new THREE.Mesh(geometry, material);
            let coord = phyllotaxisOnCurve(i, angleInRadians, options.spread, curve_geometry);
            object.position.set(coord.x, coord.y, coord.z);

            //object.lookAt(coord.prev);
            if (isALeaf) {
                // if it is a leave, they all should be orientated to the
                // beginning of the curve
                if (i!==0) {
                    object.lookAt(coord.prev);
                } else {
                    //object number 0 soffer of gimbal loock
                    // because he's lookingAt is own position probably
                    object.lookAt(coord.prev);
                    object.rotateY( (40 + options.angle_y * 100/options.num ) * -PItoDeg );
                }
                this._transformIntoLeaf(object, i, angleInRadians, options);
            } else {
                object.lookAt(coord.prev);
                object.rotateZ(i* angleInRadians);
                object.rotateY((90 + options.angle_y + i * 100/options.num ) * -PItoDeg);
            }

            objects.push(object);
        }
        return objects;
    }

    _createGeometryCurve(curve, number_tot_objects){
        // curve is expected to be a CatmullRomCurve3
        let curveGeometry = new THREE.Geometry();
        curveGeometry.vertices = curve.getPoints(number_tot_objects);
        return curveGeometry;
    }


    _transformIntoLeaf(object, iter, angleInRadians, options){
        let PItoDeg = (Math.PI/180.0);
        // The scale ratio is a value between 0.001 and 1.
        // It is 0.0001 for the first leaves, and 1 for the last one
        let ratio = Math.abs(iter/options.foliage_start_at);
        // This is to avaoid a scaleRatio of 0, that would cause a warning while scaling
        // an object for 0
        let scaleRatio = ratio === 0 ? 0.001 : ratio;
        object.rotateZ( iter* angleInRadians);
        let yrot = (iter/options.angle_y) * options.foliage_start_at;
        //object.rotateY( (yrot ) * -PItoDeg );
        let y_angle = options.angle_y * scaleRatio;
        object.rotateY( (options.starting_angle_y + y_angle + iter * 200/options.num ) * -PItoDeg );
        // as leaves grow up, they become bigger
        object.scale.set(5 * scaleRatio ,1 ,1);
        object.rotateZ(-(Math.PI/2));
    }

    _mergeObjectsInOneGeometryAndFullfilBuffers(objs, opt, vertex_info, buffers){
        let geometry = new THREE.Geometry();
        let current_pos = 0; // current position in the buffers
        for (let i = 0; i < objs.length; i++){
            if (i <= opt.foliage_start_at) {
                for(let pos=0; pos < vertex_info.n_vertices_leaf; pos++){
                    buffers.angle[current_pos] = objs[i].angle;
                    buffers.isLeaf[current_pos] = 1.0;
                    current_pos ++;
                }
            } else {
                for(let pos=0; pos < vertex_info.n_vertices_trunk; pos++){
                    buffers.angle[current_pos] = objs[i].angle;
                    buffers.isLeaf[current_pos] = 0.0;
                    current_pos ++;
                }
            }

            let mesh = objs[i];
            mesh.updateMatrix();
            geometry.merge(mesh.geometry, mesh.matrix);
        }
        return geometry;
    }
    _mergeObjectsInOneGeometry(objects){
        let geometry = new THREE.Geometry();
        for (let i = 0; i < objects.length; i++){
            let mesh = objects[i];
            mesh.updateMatrix();
            geometry.merge(mesh.geometry, mesh.matrix);
        }
        return geometry;
    }

    _createBuffers(n_vert){
        return {
            angle: new Float32Array(n_vert),
            isLeaf: new Float32Array(n_vert)
        };
    }

    _getTotNumVertices(foliage_geometry, trunk_geometry, tot_objects, foliage_start_at){
        let adjusted_foliage_start_at = foliage_start_at + 1; //counting the 0 too
        let vertices_in_leaf = foliage_geometry.faces.length * 3;
        let vertices_in_trunk = trunk_geometry.faces.length * 3;
        let n_vertices_in_leaf = adjusted_foliage_start_at * vertices_in_leaf;
        let n_vertices_in_trunk = (tot_objects - adjusted_foliage_start_at) * vertices_in_trunk;
        return{
            tot_vertices: (n_vertices_in_trunk + n_vertices_in_leaf),
            n_vertices_leaf: vertices_in_leaf,
            n_vertices_trunk: vertices_in_trunk
        };
    }
}
