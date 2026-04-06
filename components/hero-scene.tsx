"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Float, MeshTransmissionMaterial, PerspectiveCamera } from "@react-three/drei";
import { useRef } from "react";
import * as THREE from "three";

function OrbitalAssembly() {
  const groupRef = useRef<THREE.Group>(null);
  const haloRef = useRef<THREE.Mesh>(null);
  const shardRef = useRef<THREE.Mesh>(null);
  const coreRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const time = state.clock.elapsedTime;
    const mouseX = state.pointer.x * 0.24;
    const mouseY = state.pointer.y * 0.18;

    if (groupRef.current) {
      groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, mouseX, 0.06);
      groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, -mouseY, 0.06);
      groupRef.current.position.y = Math.sin(time * 0.7) * 0.08;
    }

    if (haloRef.current) {
      haloRef.current.rotation.z += 0.0024;
      haloRef.current.rotation.x = Math.sin(time * 0.35) * 0.2;
    }

    if (shardRef.current) {
      shardRef.current.rotation.x += 0.003;
      shardRef.current.rotation.y -= 0.0022;
    }

    if (coreRef.current) {
      coreRef.current.rotation.y += 0.004;
      coreRef.current.rotation.z = Math.sin(time * 0.48) * 0.22;
    }
  });

  return (
    <group ref={groupRef}>
      <Float speed={1.2} rotationIntensity={0.16} floatIntensity={0.5}>
        <mesh ref={coreRef} position={[0.15, 0.25, 0]}>
          <icosahedronGeometry args={[1.5, 8]} />
          <MeshTransmissionMaterial
            thickness={0.85}
            roughness={0.04}
            transmission={1}
            ior={1.18}
            chromaticAberration={0.03}
            anisotropy={0.2}
            distortion={0.2}
            distortionScale={0.18}
            temporalDistortion={0.12}
            color="#f5e5cd"
            attenuationColor="#b27535"
            attenuationDistance={1.5}
          />
        </mesh>
      </Float>

      <Float speed={1} rotationIntensity={0.12} floatIntensity={0.3}>
        <mesh ref={haloRef} rotation={[1.05, 0.3, 0.2]} position={[0.2, 0.25, 0]}>
          <torusGeometry args={[2.5, 0.035, 32, 220]} />
          <meshStandardMaterial
            color="#f4e1c2"
            emissive="#bf7f3b"
            emissiveIntensity={0.62}
            transparent
            opacity={0.85}
          />
        </mesh>
      </Float>

      <Float speed={1.6} rotationIntensity={0.22} floatIntensity={0.6}>
        <mesh ref={shardRef} position={[-1.55, -0.95, 1.15]} rotation={[0.4, 0.8, 0.25]}>
          <octahedronGeometry args={[0.68, 0]} />
          <meshPhysicalMaterial
            color="#2c5a51"
            emissive="#3e8274"
            emissiveIntensity={0.45}
            roughness={0.18}
            metalness={0.65}
            clearcoat={1}
            clearcoatRoughness={0.12}
          />
        </mesh>
      </Float>

      <Float speed={1.3} rotationIntensity={0.16} floatIntensity={0.44}>
        <mesh position={[1.85, 1.15, -0.6]} rotation={[0.5, 0.3, 0.8]}>
          <dodecahedronGeometry args={[0.56, 0]} />
          <meshPhysicalMaterial
            color="#c59256"
            emissive="#8f5e2d"
            emissiveIntensity={0.35}
            roughness={0.25}
            metalness={0.45}
            clearcoat={0.9}
          />
        </mesh>
      </Float>

      <mesh position={[0, -2.2, -0.8]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[4.4, 96]} />
        <meshBasicMaterial color="#f9e8cf" transparent opacity={0.1} />
      </mesh>
    </group>
  );
}

export function HeroScene() {
  return (
    <Canvas className="hero-canvas" dpr={[1, 1.5]}>
      <color attach="background" args={["#000000"]} />
      <PerspectiveCamera makeDefault position={[0, 0, 7.2]} fov={34} />
      <fog attach="fog" args={["#090806", 5.5, 12]} />
      <ambientLight intensity={0.8} color="#f4ead8" />
      <pointLight position={[3.8, 4.2, 4.8]} intensity={60} color="#ffd7a1" />
      <pointLight position={[-4, -2, 3]} intensity={18} color="#5ca191" />
      <spotLight
        position={[0, 5.5, 6]}
        angle={0.32}
        penumbra={1}
        intensity={50}
        color="#fef0db"
      />
      <OrbitalAssembly />
    </Canvas>
  );
}
