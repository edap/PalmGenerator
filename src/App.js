// TODO:
// get curve right
// check buffers, if not, remove it
// clean palm generator.
// add export .obj
// test it on an element in the website

import { Canvas } from '@react-three/fiber'
import { Palm } from './Palm'
// import { Leaf } from './Leaf'
import { OrbitControls } from '@react-three/drei'
import { StrictMode } from 'react'
import { useMemo } from 'react'
import { useControls } from 'leva'
import {Vector3, CatmullRomCurve3} from 'three'

function getCurve(){
  return new CatmullRomCurve3( [
      new Vector3( -40, 150, 0 ),
      new Vector3( -40, 100, 0 ),
      new Vector3( 0, 60, 0 ),
      new Vector3( 0, 0, 0 ),
  ] )
}

export default function App() {
  const palm_options = useMemo(() => {
    return {
      spread: { value: 0.21, min: 0, max: 0.7, step: 0.01 },
      angle: { value: 137.5, min: 132.0, max: 138.0, step: 0.01 },
      num: { value: 406, min: 60, max: 1200, step: 1 },
      growth: { value: 0.12, min: 0.04, max: 0.25, step: 0.01 }, 
      foliage_start_at: { value: 56.1974, min: 0, max: 320, step: 1 },
      trunk_regular: false,
      vertex_colors: true,
      vertex_colors_hsb_range: { value: 46, min: 1, max: 360, step: 1 },
      angle_open: { value: 36.1743, min: 0, max: 80, step: 0.01 },
      starting_angle_open: { value: 50, min: 50, max: 100, step: 1 },
    }
  }, [])

  const leaf_options = useMemo(() => {
    return {
      length: { value: 60, min: 20, max: 90, step: 1 },
      length_stem: { value: 20, min: 2, max: 40, step: 1 },
      width_stem: { value: 0.2, min: 0.2, max: 2.4, step: 0.1 },
      leaf_width: { value: 0.8, min: 0.1, max: 1.0, step: 0.1 },
      leaf_up: { value: 1.5, min: 0.1, max: 6.0, step: 0.1 },
      density: { value: 11, min: 3, max: 30, step: 1 },
      curvature: { value: 0.04, min: 0.01, max: 0.06, step: 0.01 },
      curvature_border: { value: 0.005, min: 0.001, max: 0.01, step: 0.001 },
      leaf_inclination: { value: 0.9, min: 0.1, max: 1.0, step: 0.01 },
    }
  }, [])

  const mat_options = useMemo(() => {
    return {
      color: '#b9ff00',
      emissive: '#224534',
      roughness: {value: 0.55, min: 0, max:1, step: 0.01},
      metalness: {value: 1.0, min: 0, max:1, step: 0.01},
      clearcoatRoughness: {value: 1.0, min: 0, max:1, step: 0.01},
      clearcoat: {value: 0.0, min: 0, max:1, step: 0.01},
      ior:{value: 1.3, min: 1, max: 2.33, step: 0.01},
      reflectivity:{value: 0.74, min: 0, max: 1, step: 0.01},
      iridescence:{value: 0.64, min: 0, max: 1, step: 0.01},
      iridescenceIOR:{value: 0.71, min: 0, max: 1, step: 0.01},
      sheen:{value: 0.6, min: 0, max: 1, step: 0.01},
      sheenRoughness:{value: 0.2, min:0, max: 1, step: 0.01},
      sheenColor: '#f59300',
    }
  })

  const curve = useMemo(() => {
    return getCurve();
  },[])

  const palm = useControls('Palm', palm_options)
  const leaf = useControls('Leaf', leaf_options)
  const mat = useControls('Material', mat_options);
  mat.vertexColors = palm.vertex_colors;
  return (
    <StrictMode>
      <Canvas
        frameloop='demand'
        camera={ {
          fov:45,
          position: [0, 120, 70]
        } }
      >
      <OrbitControls />
        {/* <Leaf/> */}
        <Palm 
          rotation={[180, 0, 0]}
          scale={10.015}
          palm_options= {palm}
          leaf_options= {leaf}
          material_options = {mat}
          // debug curve. Uncomment to see it in action
          // curve={curve}
          />
        <directionalLight position={[0, 200, 0]} intensity={0.3} />
        <directionalLight position={[100, 200, 100]} intensity={0.3} />
        <directionalLight position={[-100, -200, -100]} intensity={0.3} />
      </Canvas>
    </StrictMode>
  )
}
