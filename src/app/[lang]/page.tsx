"use client";

import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { useRef, useState, useEffect } from "react";
import { OBJLoader } from "three-stdlib";
import { Group, Object3D } from "three";

function Model({ mouseX, hovered, scale, isMobile }: { mouseX: number; hovered: boolean; scale: number; isMobile: boolean }) {
  const ref = useRef<Group>(null);
  const obj = useLoader(OBJLoader, "/model.obj") as Object3D;

  useFrame(() => {
    if (!ref.current) return;

    if (hovered) {
      ref.current.rotation.y += (mouseX - ref.current.rotation.y) * 0.05;
      ref.current.rotation.x += ((mouseX / 10) - ref.current.rotation.x) * 0.02;
    } else {
      ref.current.rotation.y += 0.002;
    }
  });

  return <primitive ref={ref} object={obj} scale={[scale, scale, scale]} position={[0, isMobile ? -1.5 : -2, 0]} />;
}

export default function Home() {
  const [hovered, setHovered] = useState(false);
  const [mouseX, setMouseX] = useState(0);
  const [scale, setScale] = useState(0.15);
  const [isMobile, setIsMobile] = useState(false);

  // Responsive boyut ayarı
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      setIsMobile(width < 768);
      
      if (width < 640) {
        setScale(0.18); // Mobilde daha büyük
      } else if (width < 1024) {
        setScale(0.22); // Tablette daha büyük
      } else {
        setScale(0.2); // Masaüstü
      }
    };
    
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="w-full flex flex-col items-center pt-20">
      {/* Hero alanı */}
      <div
        className="relative w-full overflow-hidden"
        style={{ height: "500px", backgroundColor: "#DC2626" }}
      >
        {/* Başlık ortada */}
        <h1 className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white text-6xl font-bold z-10">
          Hoşgeldiniz!
        </h1>

        {/* Sağ alt köşede 3D model */}
        <div
          className="absolute z-20"
          style={{
            width: isMobile ? scale * 700 : scale * 900,
            height: isMobile ? scale * 700 : scale * 900,
            bottom: isMobile ? '8%' : '6%',
            right: isMobile ? '8%' : '6%'
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
              position: [0, 0, isMobile ? 12 : 14], 
              fov: isMobile ? 55 : 50 
            }}
          >
            <ambientLight intensity={0.5} />
            <directionalLight position={[5, 5, 5]} intensity={1} />
            <Model mouseX={mouseX} hovered={hovered} scale={scale} isMobile={isMobile} />
          </Canvas>
        </div>
      </div>

      {/* Hero altına diğer içerik */}
      <div className="mt-10 w-[90%] mx-auto">
        <p className="text-gray-700">Buraya diğer sayfa içeriklerini ekleyebilirsin.</p>
      </div>
    </div>
  );
}