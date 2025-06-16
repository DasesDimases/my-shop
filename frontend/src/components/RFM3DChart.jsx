import React, { useEffect, useState, useRef } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { OrbitControls, Html } from "@react-three/drei"
import { fetchRFMClusters } from "../services/analyticsService"

const clusterColors = [
  { color: "hotpink", label: "Кластер 0" },
  { color: "skyblue", label: "Кластер 1" },
  { color: "limegreen", label: "Кластер 2" },
  { color: "gold", label: "Кластер 3" },
  { color: "orange", label: "Кластер 4" }
]

function RFMPoint({ x, y, z, color, label }) {
  const ref = useRef()
  const [hovered, setHovered] = useState(false)

  useFrame(() => {
    if (ref.current) {
      ref.current.scale.setScalar(hovered ? 2.2 : 1.5)
    }
  })

  return (
    <group>
      <mesh
        ref={ref}
        position={[x, y, z]}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <sphereGeometry args={[1.5, 16, 16]} />
        <meshStandardMaterial color={color} />
      </mesh>
      {hovered && (
        <Html distanceFactor={10}>
          <div style={{
            background: "white",
            padding: "4px 6px",
            borderRadius: "4px",
            border: "1px solid #ccc",
            fontSize: "0.8em"
          }}>
            {label}<br />({x.toFixed(1)}, {y}, {z.toFixed(1)})
          </div>
        </Html>
      )}
    </group>
  )
}

export default function RFM3DChart() {
  const [points, setPoints] = useState([])

  useEffect(() => {
    fetchRFMClusters().then(data => {
      if (!data || data.length === 0) {
        console.warn("Нет данных для RFM-кластеров")
        return
      }

      console.log("RFM raw data:", data)

      const scale = 0.1
      const pts = data.map(c => ({
        x: c.recency ?? 0,
        y: c.frequency ?? 0,
        z: (c.monetary ?? 0) * scale,
        color: clusterColors[c.cluster % clusterColors.length].color,
        label: c.name || c.email,
        cluster: c.cluster
      }))

      console.log("RFM points:", pts)
      setPoints(pts)
    })
  }, [])

  return (
    <div>
      <div style={{ display: "flex", gap: "12px", marginBottom: "10px" }}>
        {clusterColors.map((c, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <div style={{
              width: 16,
              height: 16,
              borderRadius: "50%",
              backgroundColor: c.color
            }} />
            <span style={{ fontSize: "0.9em" }}>{c.label}</span>
          </div>
        ))}
      </div>

      <div style={{ width: "100%", height: "600px" }}>
        <Canvas camera={{ position: [60, 60, 100], fov: 60 }}>
          <ambientLight intensity={0.5} />
          <pointLight position={[100, 100, 100]} />
          <OrbitControls />
          {points.length === 0 ? (
            <Html center>
              <div>Нет данных</div>
            </Html>
          ) : (
            points.map((p, i) => <RFMPoint key={i} {...p} />)
          )}
        </Canvas>
      </div>
    </div>
  )
}
