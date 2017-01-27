import Cube from './cube.js';
import * as THREE from 'THREE';

export default class CollectionGeometries{
    constructor(radius){
        let lathePoints = [];
        for ( var i = 0; i < 10; i ++ ) {
	          lathePoints.push( new THREE.Vector2( Math.sin( i * 0.2 ) * 5 + 5, ( i - 5 ) * 2 ) );
        }

        let widthSegments = 32;
        let heightSegments = 32;
        let geometries = {
            "sphere": new THREE.SphereGeometry(radius, widthSegments, heightSegments),
            "box": new THREE.BoxGeometry( radius, radius, radius, 4, 4, 4 ),
            "lathe": new THREE.LatheBufferGeometry( lathePoints ),
            "cone": new THREE.ConeGeometry(radius, 20, 32)
        };
        return geometries;
    }
}


