"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import {
  Environment,
  Float,
  MeshTransmissionMaterial,
  PerspectiveCamera,
  RoundedBox,
  Sparkles
} from "@react-three/drei";
import { useRef } from "react";
import * as THREE from "three";

function Sculpture() {
  const groupRef = useRef<THREE.Group>(null);
  const ringRef = useRef<THREE.Mesh>(null);
  const pearlRef = useRef<THREE.Mesh>(null);
  const panelRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const time = state.clock.elapsedTime;
    const targetX = state.pointer.y * 0.16;
    const targetY = state.pointer.x * 0.28;

    if (groupRef.current) {
      groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, targetX, 0.06);
      groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, targetY, 0.06);
      groupRef.current.position.y = Math.sin(time * 0.75) * 0.08;
    }

    if (ringRef.current) {
      ringRef.current.rotation.z += 0.0024;
      ringRef.current.rotation.x = 0.75 + Math.sin(time * 0.42) * 0.08;
    }

    if (pearlRef.current) {
      pearlRef.current.rotation.y += 0.0042;
    }

    if (panelRef.current) {
      panelRef.current.rotation.z = Math.sin(time * 0.3) * 0.08;
    }
  });

  return (
    <group ref={groupRef}>
      <Float speed={1.15} rotationIntensity={0.18} floatIntensity={0.5}>
        <mesh ref={ringRef} rotation={[0.75, 0.32, 0.1]} position={[0, 0.1, -0.2]}>
          <torusGeometry args={[2.65, 0.05, 36, 240]} />
          <meshPhysicalMaterial
            color="#f8fafc"
            emissive="#cfd7e7"
            emissiveIntensity={0.42}
            roughness={0.08}
            metalness={0.86}
            clearcoat={1}
            clearcoatRoughness={0.08}
          />
        </mesh>
      </Float>

      <Float speed={1.05} rotationIntensity={0.12} floatIntensity={0.28}>
        <mesh ref={panelRef} position={[0, 0.12, 0]}>
          <RoundedBox args={[2.9, 1.76, 0.08]} radius={0.18} smoothness={8}>
            <MeshTransmissionMaterial
              thickness={0.52}
              roughness={0.04}
              transmission={1}
              ior={1.1}
              chromaticAberration={0.015}
              anisotropy={0.2}
              distortion={0.06}
              distortionScale={0.08}
              temporalDistortion={0.05}
              backside
              color="#f8fbff"
              attenuationColor="#cfe2ff"
              attenuationDistance={1.4}
            />
          </RoundedBox>
        </mesh>
      </Float>

      <Float speed={1.22} rotationIntensity={0.2} floatIntensity={0.34}>
        <mesh position={[-1.48, 1.08, 0.25]} rotation={[0.55, -0.5, 0.24]}>
          <RoundedBox args={[1.42, 0.88, 0.06]} radius={0.16} smoothness={8}>
            <MeshTransmissionMaterial
              thickness={0.42}
              roughness={0.05}
              transmission={1}
              ior={1.08}
              chromaticAberration={0.01}
              color="#ffffff"
              attenuationColor="#d7ddf8"
              attenuationDistance={1.1}
            />
          </RoundedBox>
        </mesh>
      </Float>

      <Float speed={1.32} rotationIntensity={0.18} floatIntensity={0.3}>
        <mesh position={[1.62, -0.92, 0.52]} rotation={[0.45, 0.68, -0.28]}>
          <RoundedBox args={[1.32, 0.76, 0.06]} radius={0.16} smoothness={8}>
            <MeshTransmissionMaterial
              thickness={0.4}
              roughness={0.06}
              transmission={1}
              ior={1.08}
              color="#ffffff"
              attenuationColor="#ffe0c6"
              attenuationDistance={1.1}
            />
          </RoundedBox>
        </mesh>
      </Float>

      <Float speed={1.4} rotationIntensity={0.18} floatIntensity={0.4}>
        <mesh ref={pearlRef} position={[0.12, 0.1, 0.5]}>
          <sphereGeometry args={[0.78, 64, 64]} />
          <MeshTransmissionMaterial
            thickness={1.1}
            roughness={0.03}
            transmission={1}
            ior={1.18}
            chromaticAberration={0.02}
            anisotropy={0.16}
            distortion={0.08}
            distortionScale={0.08}
            temporalDistortion={0.04}
            color="#fcfdff"
            attenuationColor="#dde5ff"
            attenuationDistance={1.2}
          />
        </mesh>
      </Float>

      <mesh position={[0, -2.25, -0.6]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[2.35, 3.75, 80]} />
        <meshBasicMaterial color="#ffffff" opacity={0.14} transparent />
      </mesh>

      <Sparkles count={28} scale={[7.5, 4.8, 5]} size={2.2} speed={0.35} color="#b9c8ff" />
    </group>
  );
}

export function HeroScene() {
  return (
    <Canvas className="hero-canvas" dpr={[1, 1.8]} gl={{ alpha: true, antialias: true }}>
      <PerspectiveCamera makeDefault position={[0, 0, 7.1]} fov={34} />
      <fog attach="fog" args={["#edf1f5", 6.2, 11.5]} />
      <ambientLight intensity={1.2} color="#ffffff" />
      <pointLight position={[4.6, 3.8, 5.2]} intensity={42} color="#fff5ea" />
      <pointLight position={[-4.4, 1.4, 4.2]} intensity={28} color="#dbe4ff" />
      <pointLight position={[0, -2.2, 3.4]} intensity={18} color="#fffaf4" />
      <spotLight position={[0, 5.5, 6]} angle={0.32} penumbra={1} intensity={36} color="#ffffff" />
      <Environment preset="city" />
      <Sculpture />
    </Canvas>
  );
}
