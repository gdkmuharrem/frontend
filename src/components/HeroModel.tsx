"use client";

import { useRef, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Group } from "three";

interface ModelProps {
  mouseX: number;
  hovered: boolean;
  scale: number;
  isMobile: boolean;
  isLargeScreen: boolean;
  isExtraLargeScreen: boolean;
  modelPath: string;
}

function ModelComponent({ 
  mouseX, 
  hovered, 
  scale, 
  isMobile, 
  isLargeScreen,
  modelPath 
}: ModelProps) {
  const ref = useRef<Group>(null);
  const [model, setModel] = useState<Group | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadModel = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const { OBJLoader } = await import("three-stdlib");
        const loader = new OBJLoader();
        
        // Model path'i temizle ve full URL oluştur
        const cleanPath = modelPath.startsWith('/') ? modelPath.slice(1) : modelPath;
        const fullPath = `${process.env.NEXT_PUBLIC_API_BASE_URL}/${cleanPath}`;
        
        console.log('Loading model from:', fullPath);
        const loadedModel = await loader.loadAsync(fullPath);
        setModel(loadedModel);
        
      } catch (error) {
        console.error("Model yüklenemedi:", error);
        setError("Model yüklenemedi");
        
        // Fallback model denemesi
        try {
          const { OBJLoader } = await import("three-stdlib");
          const loader = new OBJLoader();
          const fallbackModel = await loader.loadAsync("/model.obj");
          setModel(fallbackModel);
        } catch (fallbackError) {
          console.error("Fallback model de yüklenemedi:", fallbackError);
        }
      } finally {
        setLoading(false);
      }
    };

    if (modelPath) {
      loadModel();
    }
  }, [modelPath]);

  useFrame(() => {
    if (!ref.current || !model) return;

    if (hovered) {
      ref.current.rotation.y += (mouseX - ref.current.rotation.y) * 0.05;
      ref.current.rotation.x += ((mouseX / 10) - ref.current.rotation.x) * 0.02;
    } else {
      ref.current.rotation.y += 0.002;
    }
  });

  if (loading) {
    return null; // Loading state
  }

  if (error || !model) {
    return null; // Error state
  }

  return (
    <primitive
      ref={ref}
      object={model}
      scale={[scale, scale, scale]}
      position={[0, isMobile ? -1.5 : isLargeScreen ? -1.8 : -2, 0]}
    />
  );
}

interface HeroModelProps {
  modelPath: string;
  scale: number;
  isMobile: boolean;
  isLargeScreen: boolean;
  isExtraLargeScreen: boolean;
  position?: {
    bottom?: string;
    right?: string;
    width?: number;
    height?: number;
  };
}

export default function HeroModel({ 
  modelPath, 
  scale, 
  isMobile, 
  isLargeScreen, 
  isExtraLargeScreen,
  position = {}
}: HeroModelProps) {
  const [hovered, setHovered] = useState(false);
  const [mouseX, setMouseX] = useState(0);

  const getCameraDistance = () => {
    if (isMobile) return 12;
    if (isLargeScreen) return 20;
    if (isExtraLargeScreen) return 24;
    return 14;
  };

  if (!modelPath) {
    return null; // Model path yoksa render etme
  }

  return (
    <div
      className="absolute z-20"
      style={{
        width: position.width || (isMobile ? scale * 700 : scale * 900),
        height: position.height || (isMobile ? scale * 700 : scale * 900),
        bottom: position.bottom || (isMobile ? "10%" : isLargeScreen ? "8%" : isExtraLargeScreen ? "10%" : "6%"),
        right: position.right || (isMobile ? "10%" : isLargeScreen ? "8%" : isExtraLargeScreen ? "10%" : "6%"),
      }}
      onMouseMove={(e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        setMouseX(x * Math.PI);
      }}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      <Canvas
        style={{ width: "100%", height: "100%", display: "block" }}
        camera={{
          position: [0, 0, getCameraDistance()],
          fov: isMobile ? 55 : isLargeScreen ? 40 : isExtraLargeScreen ? 35 : 50,
        }}
      >
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 5, 5]} intensity={1} />
        <ModelComponent
          mouseX={mouseX}
          hovered={hovered}
          scale={scale}
          isMobile={isMobile}
          isLargeScreen={isLargeScreen}
          isExtraLargeScreen={isExtraLargeScreen}
          modelPath={modelPath}
        />
      </Canvas>
    </div>
  );
}