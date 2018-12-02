import * as THREE from 'three'
import { LeafGeometry } from './LeafGeometry'
import { useMemo} from 'react'

// This component it is used just for debug purposes

export function Leaf() {
    const mesh = useMemo(() => {
        const geometry = new LeafGeometry();
        return new THREE.Mesh( geometry, new THREE.MeshNormalMaterial());
    },[])
    return <primitive object={mesh} position={[0, 0, 0]} />
}
  