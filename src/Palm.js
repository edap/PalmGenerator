import * as THREE from 'three'
import { LeafGeometry } from './LeafGeometry'
import { PalmGenerator} from './PalmGenerator'
import { useMemo} from 'react'


export function Palm({palm_options, leaf_options, curve, material_options, ...props}) {
  const palmGeometry = useMemo(() => {
    const trunkGeometry = new THREE.BoxGeometry(5,5,5)
    const leafGeometry = new LeafGeometry(leaf_options)
    return new PalmGenerator(leafGeometry,trunkGeometry,palm_options, curve)
  },[palm_options, leaf_options, curve])

  const material = useMemo(() => {
    return new THREE.MeshPhysicalMaterial(material_options);
  },[material_options])

  const mesh = new THREE.Mesh(palmGeometry, material);
  
    
  return <primitive object={mesh} position={[0, 0, 0]} rotation = {props.rotation} />
}
