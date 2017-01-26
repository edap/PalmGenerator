import * as THREE from 'THREE';

export default class CollectionMaterials {
    constructor(){
        let materials = {
            "standard": new THREE.MeshStandardMaterial( {color: 0x00ff00} ),
            "wireframe": new THREE.MeshBasicMaterial( {color: 0x00ff00, wireframe: true} ),
            "phong": new THREE.MeshPhongMaterial({
                color: 0xa2300c,
                emissive: 0x280000,
                specular: 0x413e0f,
                shininess: 26
            }),
            "lambert": new THREE.MeshPhongMaterial({color: 0x2194CE})
        };
        return materials;
    }
}
