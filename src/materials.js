import * as THREE from 'THREE';

export default class CollectionMaterials {
    constructor(){
        let materials = {
            "standard": new THREE.MeshStandardMaterial( {color: 0x00ff00} ),
            "wireframe": new THREE.MeshBasicMaterial( {color: 0x00ff00, wireframe: true} )
        };
        return materials;
    }
}
