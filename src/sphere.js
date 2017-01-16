import {SphereBufferGeometry,SphereGeometry, MeshBasicMaterial, Mesh} from 'three';
const widthSegments = 32;
const heightSegments = 32;

export default class Sphere {
    constructor(x, y, radius){
        let geometry = new SphereGeometry(radius, widthSegments, heightSegments);
        var material = new MeshBasicMaterial( {color: 0x00ff00} );
        var sphere = new Mesh( geometry, material );
        this.mesh = sphere;
        //this.mesh.position.set(x, y, 100);
    };

    update(){
      this.mesh.rotation.x += 1;
	    this.mesh.rotation.y += 0.1;
    };
};
