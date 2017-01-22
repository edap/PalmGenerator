import * as THREE from 'THREE';

export default class CollectionMaterials {
    constructor(){
        let materials = {
            "standard": new THREE.MeshStandardMaterial( {color: 0x00ff00} ),
            "wireframe": new THREE.MeshBasicMaterial( {color: 0x00ff00, wireframe: true} ),
            "phong": new THREE.MeshPhongMaterial({color: 0x2194CE}),
            "lambert": new THREE.MeshPhongMaterial({color: 0x2194CE})
        };
        return materials;
    }
}
