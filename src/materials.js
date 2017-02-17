import * as THREE from 'three';

export default class CollectionMaterials {
    constructor(){
        let materials = {
            "standard": new THREE.MeshStandardMaterial( {
                color: 0xefff00,
                emissive: 0x4ca078,
                roughness:0.55,
                metalness:0.89
            }),
            "wireframe": new THREE.MeshBasicMaterial( {color: 0xf8ff8e, wireframe: true} ),
            "phong": new THREE.MeshPhongMaterial({
                color: 0xa2300c,
                emissive: 0x2d2d2d,
                specular: 0x413e0f,
                shininess: 26
            }),
            "lambert": new THREE.MeshLambertMaterial({color: 0xffffff, emissive: 0x4ec84c})
        };
        return materials;
    }
}
