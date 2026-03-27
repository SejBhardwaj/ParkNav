"use client"
import { useEffect, useRef, useCallback } from "react"
import createGlobe from "cobe"

interface PulseMarker {
  id: string
  location: [number, number]
  delay: number
}

interface GlobePulseProps {
  markers?: PulseMarker[]
  className?: string
  speed?: number
}

const allCities: PulseMarker[] = [
  { id: "delhi",     location: [28.61,  77.20],  delay: 0    },
  { id: "mumbai",    location: [19.07,  72.87],  delay: 0.3  },
  { id: "london",    location: [51.51,  -0.13],  delay: 0.6  },
  { id: "newyork",   location: [40.71, -74.01],  delay: 0.9  },
  { id: "tokyo",     location: [35.68, 139.65],  delay: 1.2  },
  { id: "sydney",    location: [-33.87, 151.21], delay: 1.5  },
  { id: "paris",     location: [48.85,   2.35],  delay: 1.8  },
  { id: "dubai",     location: [25.20,  55.27],  delay: 2.1  },
  { id: "singapore", location: [1.35,  103.82],  delay: 0.4  },
  { id: "hongkong",  location: [22.32, 114.17],  delay: 0.7  },
  { id: "beijing",   location: [39.90, 116.40],  delay: 1.0  },
  { id: "shanghai",  location: [31.23, 121.47],  delay: 1.3  },
  { id: "bangkok",   location: [13.75, 100.50],  delay: 1.6  },
  { id: "seoul",     location: [37.57, 126.98],  delay: 1.9  },
  { id: "istanbul",  location: [41.01,  28.98],  delay: 0.5  },
  { id: "moscow",    location: [55.75,  37.62],  delay: 0.8  },
  { id: "berlin",    location: [52.52,  13.40],  delay: 1.1  },
  { id: "madrid",    location: [40.42,  -3.70],  delay: 1.4  },
  { id: "rome",      location: [41.90,  12.50],  delay: 1.7  },
  { id: "amsterdam", location: [52.37,   4.89],  delay: 2.0  },
  { id: "toronto",   location: [43.65, -79.38],  delay: 0.2  },
  { id: "losangeles",location: [34.05,-118.24],  delay: 0.6  },
  { id: "chicago",   location: [41.88, -87.63],  delay: 1.0  },
  { id: "saopaulo",  location: [-23.55,-46.63],  delay: 1.4  },
]

export function GlobePulse({
  markers = allCities,
  className = "",
  speed = 0.003,
}: GlobePulseProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const pointerInteracting = useRef<{ x: number; y: number } | null>(null)
  const dragOffset = useRef({ phi: 0, theta: 0 })
  const phiOffsetRef = useRef(0)
  const thetaOffsetRef = useRef(0)
  const isPausedRef = useRef(false)

  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    pointerInteracting.current = { x: e.clientX, y: e.clientY }
    if (canvasRef.current) canvasRef.current.style.cursor = "grabbing"
    isPausedRef.current = true
  }, [])

  const handlePointerUp = useCallback(() => {
    if (pointerInteracting.current !== null) {
      phiOffsetRef.current += dragOffset.current.phi
      thetaOffsetRef.current += dragOffset.current.theta
      dragOffset.current = { phi: 0, theta: 0 }
    }
    pointerInteracting.current = null
    if (canvasRef.current) canvasRef.current.style.cursor = "grab"
    isPausedRef.current = false
  }, [])

  useEffect(() => {
    const handlePointerMove = (e: PointerEvent) => {
      if (pointerInteracting.current !== null) {
        dragOffset.current = {
          phi: (e.clientX - pointerInteracting.current.x) / 300,
          theta: (e.clientY - pointerInteracting.current.y) / 1000,
        }
      }
    }
    window.addEventListener("pointermove", handlePointerMove, { passive: true })
    window.addEventListener("pointerup", handlePointerUp, { passive: true })
    return () => {
      window.removeEventListener("pointermove", handlePointerMove)
      window.removeEventListener("pointerup", handlePointerUp)
    }
  }, [handlePointerUp])

  useEffect(() => {
    if (!canvasRef.current) return
    const canvas = canvasRef.current
    let globe: ReturnType<typeof createGlobe> | null = null
    let animationId: number
    let phi = 0

    function init() {
      const width = canvas.offsetWidth
      if (width === 0 || globe) return

      globe = createGlobe(canvas, {
        devicePixelRatio: Math.min(window.devicePixelRatio || 1, 1.5), // Cap DPR
        width,
        height: width,
        phi: 0,
        theta: 0.2,
        dark: 1,
        diffuse: 1.5,
        mapSamples: 12000, // Reduced from 20000
        mapBrightness: 10,
        baseColor: [0.1, 0.15, 0.3],
        markerColor: [0.2, 0.8, 0.9],
        glowColor: [0.05, 0.1, 0.25],
        markerElevation: 0,
        markers: markers.slice(0, 12).map((m) => ({ location: m.location, size: 0.025, id: m.id })), // Limit markers
        arcs: [],
        arcColor: [0.3, 0.85, 0.95],
        arcWidth: 0.5,
        arcHeight: 0.25,
        opacity: 0.7,
      })

      function animate() {
        if (!isPausedRef.current) phi += speed
        globe!.update({
          phi: phi + phiOffsetRef.current + dragOffset.current.phi,
          theta: 0.2 + thetaOffsetRef.current + dragOffset.current.theta,
        })
        animationId = requestAnimationFrame(animate)
      }
      animate()
      setTimeout(() => canvas && (canvas.style.opacity = "1"))
    }

    if (canvas.offsetWidth > 0) {
      init()
    } else {
      const ro = new ResizeObserver((entries) => {
        if (entries[0]?.contentRect.width > 0) {
          ro.disconnect()
          init()
        }
      })
      ro.observe(canvas)
    }

    return () => {
      if (animationId) cancelAnimationFrame(animationId)
      if (globe) globe.destroy()
    }
  }, [markers, speed])

  return (
    <div className={`relative aspect-square select-none ${className}`}>
      <style>{`
        @keyframes pulse-expand {
          0%   { transform: scaleX(0.3) scaleY(0.3); opacity: 0.8; }
          100% { transform: scaleX(1.5) scaleY(1.5); opacity: 0; }
        }
      `}</style>
      <canvas
        ref={canvasRef}
        onPointerDown={handlePointerDown}
        style={{
          width: "100%", height: "100%", cursor: "grab", opacity: 0,
          transition: "opacity 1.2s ease", borderRadius: "50%", touchAction: "none",
        }}
      />
      {markers.map((m) => (
        <div
          key={m.id}
          style={{
            position: "absolute",
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore CSS Anchor Positioning
            positionAnchor: `--cobe-${m.id}`,
            bottom: "anchor(center)",
            left: "anchor(center)",
            translate: "-50% 50%",
            width: 40,
            height: 40,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            pointerEvents: "none" as const,
            opacity: `var(--cobe-visible-${m.id}, 0)`,
            filter: `blur(calc((1 - var(--cobe-visible-${m.id}, 0)) * 6px))`,
            transition: "opacity 0.3s, filter 0.3s, transform 0.1s",
            transform: `scale(var(--cobe-visible-${m.id}, 0))`,
          }}
        >
          <span style={{
            position: "absolute", inset: 0,
            border: "2px solid rgba(51, 204, 221, 0.8)", borderRadius: "50%", opacity: 0,
            animation: `pulse-expand 2s ease-out infinite ${m.delay}s`,
          }} />
          <span style={{
            position: "absolute", inset: 0,
            border: "2px solid rgba(51, 204, 221, 0.6)", borderRadius: "50%", opacity: 0,
            animation: `pulse-expand 2s ease-out infinite ${m.delay + 0.5}s`,
          }} />
          <span style={{
            position: "absolute", inset: 0,
            border: "2px solid rgba(51, 204, 221, 0.4)", borderRadius: "50%", opacity: 0,
            animation: `pulse-expand 2s ease-out infinite ${m.delay + 1}s`,
          }} />
          <span style={{
            width: 10, height: 10, background: "#33ccdd", borderRadius: "50%",
            boxShadow: "0 0 0 2px rgba(17, 17, 17, 0.8), 0 0 0 4px rgba(51, 204, 221, 0.6), 0 0 12px rgba(51, 204, 221, 0.8)",
          }} />
        </div>
      ))}
    </div>
  )
}
