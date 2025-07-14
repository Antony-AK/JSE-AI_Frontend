import React, { Suspense, useEffect, useRef, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, useGLTF } from '@react-three/drei'

function Model({ position, rotation, scale }) {
  const { scene } = useGLTF('/models/JSE-Robo.glb')
  return (
    <primitive
      object={scene}
      scale={scale}
      position={position}
      rotation={rotation}
    />
  )
}


export default function ModelViewer() {
  const [scrollY, setScrollY] = useState(0)
  const [stage, setStage] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      const y = window.scrollY
      setScrollY(y)

      // Divide into stages based on scrollY ranges
      if (y < 300) setStage(0)
      else if (y >= 300 && y < 700) setStage(1)
      else if (y >= 700 && y < 1100) setStage(2)
      else setStage(3)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // 👇 Define transformation for each stage
  const animations = [
    {
      position: [0, 0, 0],
      rotation: [0, 0, 0],
      scale: 1,
    },
    {
      position: [-1.5, 0.5, 0],
      rotation: [0, Math.PI / 4, 0],
      scale: 1.4,
    },
    {
      position: [1.2, -0.3, 0],
      rotation: [0, -Math.PI / 6, 0],
      scale: 0.8,
    },
    {
      position: [0, 0.8, 0],
      rotation: [0, Math.PI / 2, 0],
      scale: 1.2,
    },
  ]

  const current = animations[stage]

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 100,
        left: window.innerWidth / 2 - 150,
        width: 300,
        height: 300,
        zIndex: 30,
        pointerEvents: 'none',
        transition: 'all 0.5s ease-in-out',
      }}
    >
      <Canvas
        camera={{ position: [0.8, 0.8, 0.8], fov: 45 }}
        gl={{ alpha: true }}
        style={{ background: 'transparent' }}
      >
        <ambientLight intensity={1} color="#ffe7c7" />
        <hemisphereLight skyColor={'white'} groundColor={'gray'} intensity={0.1} />
        <directionalLight position={[5, 5, 5]} intensity={15} />
        <directionalLight position={[-5, 5, -5]} intensity={15} />
        <directionalLight position={[-5, -5, 5]} intensity={15} />
        <directionalLight position={[5, -5, -5]} intensity={15} />

        <Suspense fallback={null}>
          <Model
            position={current.position}
            rotation={current.rotation}
            scale={current.scale}
          />
        </Suspense>

        <OrbitControls
          enableZoom={false}
          enablePan={false}
          enableRotate={false}
          minPolarAngle={Math.PI / 2}
          maxPolarAngle={Math.PI / 2}
        />
      </Canvas>
    </div>
  )
}
