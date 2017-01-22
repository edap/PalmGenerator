import {Vector3, Face3, Geometry} from 'three';

export default class LeafGeometry{
    constructor(){

        let side = 4.0;
        let high = side * 4;
        var vertices = [
            new Vector3(side, high/2, side),
            new Vector3(side, high/2, -side),
            new Vector3(side, -high/2, side),
            new Vector3(side, -high/2, -side),
            new Vector3(-side, high/2, -side),
            new Vector3(-side, high/2, side),
            new Vector3(-side, -high/2, -side),
            new Vector3(-side, -high/2, side)
        ];
        var faces = [
            new Face3(0, 2, 1),
            new Face3(2, 3, 1),
            new Face3(4, 6, 5),
            new Face3(6, 7, 5),
            new Face3(4, 5, 1),
            new Face3(5, 0, 1),
            new Face3(7, 6, 2),
            new Face3(6, 3, 2),
            new Face3(5, 7, 0),
            new Face3(7, 2, 0),
            new Face3(1, 3, 4),
            new Face3(3, 6, 4),
        ];
        var geom = new Geometry();
        geom.vertices = vertices;
        geom.faces = faces;
        geom.computeFaceNormals();
        return geom;
    }



}
