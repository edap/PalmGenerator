/* eslint-disable max-statements */
// This file follows the apache 2.0 License, as reported in its repository
// https://github.com/edap/LeafGeometry

import {BufferGeometry, BufferAttribute} from 'three';

export class LeafGeometry {
    constructor(
        options
    ){
        const opt = Object.assign(this.defaultOptions(), options);
        const length = opt.length;
        const length_stem = opt.length_stem;
        let width_stem = opt.width_stem;
        const leaf_width = opt.leaf_width;
        const leaf_up = opt.leaf_up;
        const density = opt.density;
        const positive_curvature = opt.curvature;
        const positive_curvature_border = opt.curvature_border;
        const leaf_inclination = opt.leaf_inclination;

        //leaf_width it's a value that goes from 0.1 to 1.0
        const curvature = positive_curvature * -1.0;
        const curvature_border = positive_curvature_border * -1.0;
        const min_length_stem = (length_stem <= 0) ? 0.1 : length_stem;
        const n_discard_leaf = 4; //number of leaf skipped at the end
        const available_length = length - min_length_stem;
        const leaf_z_space = available_length / density; //length that each leaf occupies on the z axis, padding included
        let y = 0;
        let x = 0;
        let current_z = 0;
        let key_last_vertex = 0;
        const z_zero = length / 2.0;
        const y_zero = this.getPointZero(curvature, length);
        const x_zero = this.getPointZero(curvature_border, length);
        const vertices = [];
        const faces = [];
        const n_leaves = (Math.abs(density - n_discard_leaf));
        const stem_decrease_value = width_stem / (n_leaves * 2);
        //draw stem
        vertices.push(-width_stem / 2, y, current_z);
        vertices.push(width_stem / 2, y, current_z);
        vertices.push(-width_stem / 2, -width_stem, current_z);
        vertices.push(width_stem / 2, -width_stem, current_z);
        current_z += min_length_stem;
        y = this.getVauleOnParabola(curvature, current_z, z_zero, y_zero);
        width_stem -= stem_decrease_value;
        vertices.push((-width_stem / 2), y, min_length_stem);
        vertices.push((width_stem / 2), y, min_length_stem);
        vertices.push((-width_stem / 2), y - width_stem, min_length_stem);
        vertices.push((width_stem / 2), y - width_stem, min_length_stem);
        faces.push(0, 1, 3);
        faces.push(0, 3, 2);
        faces.push(0, 4, 1);
        faces.push(1, 4, 5);
        faces.push(2, 4, 0);
        faces.push(1, 5, 3);
        faces.push(4, 2, 6);
        faces.push(5, 7, 3);
        faces.push(5, 4, 6);
        faces.push(6, 7, 5);
        faces.push(2, 3, 7);
        faces.push(7, 6, 2);
        key_last_vertex = 7;
        const apertura = leaf_z_space * leaf_width;
        const space_between_leaves = leaf_z_space - apertura;
        for (let i = 0; i < n_leaves; i++){
            //draw stem between the leaves
            current_z += apertura;
            y = this.getVauleOnParabola(curvature, current_z, z_zero, y_zero);
            width_stem -= stem_decrease_value;
            vertices.push((-width_stem / 2), y, current_z);
            vertices.push((width_stem / 2), y, current_z);
            vertices.push((-width_stem / 2), y - width_stem, current_z);
            vertices.push((width_stem / 2), y - width_stem, current_z);
            faces.push(key_last_vertex - 3, key_last_vertex - 1, key_last_vertex);
            faces.push(key_last_vertex, key_last_vertex - 2, key_last_vertex - 3);
            faces.push(key_last_vertex - 2, key_last_vertex - 3, key_last_vertex + 1);
            faces.push(key_last_vertex + 1, key_last_vertex + 2, key_last_vertex - 2);
            faces.push(key_last_vertex + 1, key_last_vertex + 3, key_last_vertex + 4);
            faces.push(key_last_vertex + 4, key_last_vertex + 2, key_last_vertex + 1);
            faces.push(key_last_vertex - 1, key_last_vertex + 3, key_last_vertex + 4);
            faces.push(key_last_vertex - 1, key_last_vertex, key_last_vertex + 4);
            faces.push(key_last_vertex + 4, key_last_vertex + 3, key_last_vertex - 1);
            key_last_vertex += 4;
            //11
            //leaf dx, looking from the beginning of the stem in direction end of the leaf
            const inclined_z = (current_z + ((leaf_z_space * 4) * leaf_inclination));
            const z_foglia = (inclined_z >= length) ? length : inclined_z;
            x = this.getVauleOnParabola(curvature_border, z_foglia, z_zero, x_zero);
            vertices.push(
                ((-width_stem / 2) + (x * -1)),
                this.getVauleOnParabola(curvature, z_foglia, z_zero, y_zero) + leaf_up,
                z_foglia);
            faces.push(key_last_vertex - 7, key_last_vertex + 1, key_last_vertex - 3);
            faces.push(key_last_vertex + 1, key_last_vertex - 7, key_last_vertex - 5);
            faces.push(key_last_vertex - 1, key_last_vertex - 3, key_last_vertex + 1);
            faces.push(key_last_vertex - 5, key_last_vertex - 1, key_last_vertex + 1);
            key_last_vertex += 1;
            //12

            // //leaf sx
            x = this.getVauleOnParabola(curvature_border, z_foglia, z_zero, x_zero);
            vertices.push(
                ((width_stem / 2) + x),
                this.getVauleOnParabola(curvature, z_foglia, z_zero, y_zero) + leaf_up,
                z_foglia);

            faces.push(key_last_vertex - 7, key_last_vertex - 3, key_last_vertex + 1);
            faces.push(key_last_vertex - 7, key_last_vertex + 1, key_last_vertex - 5);
            faces.push(key_last_vertex + 1, key_last_vertex - 3, key_last_vertex - 1);
            faces.push(key_last_vertex - 1, key_last_vertex - 5, key_last_vertex + 1);
            key_last_vertex += 1;
            //13

            //draw the stem between the leaves, unless it is not the last iteration
            if (!(i === n_leaves - 1)){
                current_z += space_between_leaves;
                y = this.getVauleOnParabola(curvature, current_z, z_zero, y_zero);
                width_stem -= stem_decrease_value;
                vertices.push((-width_stem / 2), y, current_z);
                vertices.push((width_stem / 2), y, current_z);
                vertices.push((-width_stem / 2), y - width_stem, current_z);
                vertices.push((width_stem / 2), y - width_stem, current_z);

                faces.push(key_last_vertex - 4, key_last_vertex - 5, key_last_vertex + 1);
                faces.push(key_last_vertex + 1, key_last_vertex + 2, key_last_vertex - 4);
                faces.push(key_last_vertex + 2, key_last_vertex + 1, key_last_vertex + 3);//front
                faces.push(key_last_vertex + 3, key_last_vertex + 3, key_last_vertex + 2);
                faces.push(key_last_vertex - 3, key_last_vertex - 2, key_last_vertex + 4);//bottom
                faces.push(key_last_vertex + 4, key_last_vertex + 3, key_last_vertex - 3);

                faces.push(key_last_vertex + 1, key_last_vertex - 5, key_last_vertex - 3);
                faces.push(key_last_vertex - 3, key_last_vertex + 3, key_last_vertex + 1);

                faces.push(key_last_vertex - 2, key_last_vertex - 4, key_last_vertex + 2);
                faces.push(key_last_vertex + 2, key_last_vertex + 4, key_last_vertex - 2);
                key_last_vertex += 4;
                //17
            }
        }

        const geometry = new BufferGeometry();
        const positionNumComponents = 3;
        const uvNumComponents = 2;
        const fake_uvs = new Array(vertices.length / 3 * 2).fill(0);
        geometry.setAttribute(
            'position',
            new BufferAttribute(new Float32Array(vertices), positionNumComponents));
        geometry.setAttribute(
            'uv',
            new BufferAttribute(new Float32Array(fake_uvs), uvNumComponents));

        geometry.setIndex(faces);
        geometry.computeVertexNormals();
        return geometry;
    }

    getVauleOnParabola(curvature, z, z_zero, y_zero){
        const y = (curvature * ((z - z_zero) * (z - z_zero))) + y_zero;
        return y;
    }

    defaultOptions(){
        return {
            length: 20,
            length_stem: 4,
            width_stem: 2,
            leaf_width: 0.5,
            leaf_up: 1,
            density: 2,
            curvature: 0.05,
            curvature_border: 0.05,
            leaf_inclination: 0.2
        };
    }

    getPointZero(curvature, length){
        return (-1 * curvature) * ((length / 2.0) * (length / 2.0));
    }
}
