/* eslint-disable no-param-reassign */
import { phyllotaxisConical, phyllotaxisOnCurve } from './phyllotaxis.js';
import { BufferGeometry, BufferAttribute, Object3D, Color } from 'three';
import * as BufferGeometryUtils from 'three/addons/utils/BufferGeometryUtils.js';
export class PalmGenerator {
    // keep in mind, palm grows along the z axis. Specifically, from positive
    // z axis to negative z-axis
    constructor(leaf_geometry, trunk_geometry, options = {}, curve = false){
        const opt = Object.assign(this.default_options(), options);
        return this.buildPalmGeometry(
            leaf_geometry,
            trunk_geometry,
            opt,
            curve);
    }

    default_options(){
        return {
            spread: 0.2,
            angle: 137.5,
            num: 500,
            growth: 0.05,
            foliage_start_at: 50,
            starting_angle_open: 50,
            angle_open: 29,
            trunk_regular: true,
            vertex_colors: false,
            vertex_colors_hsb_range: 360
        };
    }

    buildPalmGeometry(leaf_geometry, trunk_geometry, options, curve){
        let palm_geometry = new BufferGeometry();
        const PItoDeg = (Math.PI / 180.0);
        const angleInRadians = options.angle * PItoDeg;
        const curve_geometry = this.createGeometryCurve(curve, options.num);
        const colorHSB = new Color('hsl(0, 100%, 50%)');

        for (let i = 0; i < options.num; i++){
            const object = new Object3D();
            const isALeaf = (i <= options.foliage_start_at);
            const geometry_model = isALeaf ? leaf_geometry : trunk_geometry;
            const geometry = geometry_model.clone();

            // the current angle is used just for the colors
            // in case we are going to create a separate buffer with the colors
            if (options.vertex_colors === true){
                const colorShift = (angleInRadians * i) % options.vertex_colors_hsb_range;
                colorHSB.setHSL(colorShift / options.vertex_colors_hsb_range, 1.0, 0.5);
            }

            let coord;
            if (curve !== null && curve !== false){
                coord = phyllotaxisOnCurve(i, angleInRadians, options.spread, curve_geometry);
            } else {
                coord = phyllotaxisConical(i, angleInRadians, options.spread, options.growth);
            }
            object.position.set(coord.x, coord.y, coord.z);

            if (isALeaf){
                // The scale ratio is a value between 0.001 and 1.
                // It is 0.0001 for the first leaves, and 1 for the last one
                const ratio = Math.abs(i / options.foliage_start_at);
                // This is to avaoid a scaleRatio of 0, that would cause a warning while scaling
                // an object for 0
                const scaleRatio = ratio === 0 ? 0.001 : ratio;
                object.rotateZ(i * angleInRadians);
                const y_angle = options.angle_open * scaleRatio;
                object.rotateY((options.starting_angle_open + y_angle + ((i * 200) / options.num)) * -PItoDeg);

                // as leaves grow up, they become bigger
                object.scale.set(5 * scaleRatio, 1, 1);
                object.rotateZ(-(Math.PI / 2));
            } else {
                object.rotateZ(i * angleInRadians);
                if (options.trunk_regular){
                    object.rotateY((90 + options.angle_open) * -PItoDeg);
                } else {
                    object.rotateY((90 + options.angle_open + ((i * 100) / options.num)) * -PItoDeg);
                }
            }
            object.updateMatrixWorld(true, true);
            geometry.applyMatrix4(object.matrixWorld);

            palm_geometry = this.pushGeomIntoPalmGeom(geometry, palm_geometry, options.vertex_colors, colorHSB);
        }
        return palm_geometry;
    }

    pushGeomIntoPalmGeom(geometry, palm_geometry, vertex_colors, colorHSB){
        if (vertex_colors === true){
            this.addColor(geometry, colorHSB);
        }

        // if the palm geometry is empty, then assign the geometry the palm geometry
        if (palm_geometry.index === null){
            palm_geometry = geometry;
        // otherwise, merge it
        }else{
            palm_geometry = BufferGeometryUtils.mergeGeometries([palm_geometry, geometry]);
        }
        return palm_geometry;
    };

    addColor(geometry, color){
        const x = color.r;
        const y = color.g;
        const z = color.b;

        const count = geometry.attributes.position.count;
        if(!geometry.attributes.color){
            const buffer = new BufferAttribute(new Float32Array(count * 3), 3);
            geometry.setAttribute('color', buffer);
        }
        for (let i = 0; i < count; i++){
            geometry.attributes.color.setXYZ(i, x, y, z);
            geometry.attributes.color.needsUpdate = true;
        }
    }

    createGeometryCurve(curve, number_tot_objects){
        if (curve === null || curve === false){
            return null;
        }
        // First point of the curve is the top of the foliage
        // Last point of the curve is the bottom, where the root are.
        // Curve is expected to be a CatmullRomCurve3
        // that has as last vertex the position of the root

        const positions = curve.getPoints(number_tot_objects);
        const flatenned = positions.flatMap(e => [e.x, e.y, e.z]);
        const geometry = new BufferGeometry();
        const positionNumComponents = 3;

        geometry.setAttribute(
            'position',
            new BufferAttribute(new Float32Array(flatenned), positionNumComponents));


        // The origina phyllotaxis pattern in 2d was developing on axes
        // x and y. When moving to 3d I've simply used the same algorithm
        // and added a third dimension, z. The tree was growing from the leafs
        // to the roots along the negative z axis. This turns out to be a bit impractical when positioning the palms on a scene, that's why i make here 2 operation.
        // 1) I rotate the palm on the x axis, so that it looks like the palm grows along the y axis, not the z
        // 2) I move the palms up un the y axis, so that the roots are at 0
        geometry.rotateX(-(Math.PI + (Math.PI / 2)));
        return geometry;
    }
}
