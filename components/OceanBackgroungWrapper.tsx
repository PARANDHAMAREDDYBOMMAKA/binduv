"use client"

import React, { useRef, useEffect, useMemo, Suspense, useCallback } from 'react'
import * as THREE from 'three'

interface OceanBackgroundProps {
  className?: string
}

const OceanBackground: React.FC<OceanBackgroundProps> = ({ className = '' }) => {
  const mountRef = useRef<HTMLDivElement>(null)
  const sceneRef = useRef<THREE.Scene | null>(null)
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null)
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null)
  const animationRef = useRef<number | null>(null)
  const oceanRef = useRef<THREE.Mesh | null>(null)
  const dropletRef = useRef<THREE.Mesh | null>(null)
  const rippleRingsRef = useRef<THREE.Mesh[]>([])
  const timeRef = useRef(0)
  const isDroppedRef = useRef(false)
  const dropAnimationRef = useRef(0)
  const rippleRingsMaterialRef = useRef<THREE.MeshBasicMaterial[]>([])

  // Optimized ocean geometry with reduced complexity
  const oceanGeometry = useMemo(() => {
    const geometry = new THREE.PlaneGeometry(40, 40, 64, 64)
    const positions = geometry.attributes.position.array as Float32Array
    
    // Add initial wave displacement
    for (let i = 0; i < positions.length; i += 3) {
      const x = positions[i]
      const y = positions[i + 1]
      positions[i + 2] = Math.sin(x * 0.08) * Math.cos(y * 0.08) * 0.4
    }
    
    geometry.attributes.position.needsUpdate = true
    geometry.computeVertexNormals()
    return geometry
  }, [])

  // Ocean shader material
  const oceanMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        color1: { value: new THREE.Color(0x0891b2) }, // cyan-600
        color2: { value: new THREE.Color(0x0e7490) }, // cyan-700
        color3: { value: new THREE.Color(0x155e75) }, // cyan-800
        opacity: { value: 0.9 },
        rippleCenter: { value: new THREE.Vector2(0, 0) },
        rippleTime: { value: 0 },
        rippleStrength: { value: 0 }
      },
      vertexShader: `
        uniform float time;        
        uniform vec2 rippleCenter;
        uniform float rippleTime;
        uniform float rippleStrength;
        
        varying vec3 vPosition;
        varying vec3 vNormal;
        
        void main() {
          vPosition = position;
          
          float waveSpeed = 0.4;

          // Base wave animation
          float wave1 = sin(position.x * 0.1 + time * waveSpeed) * cos(position.y * 0.1 + time * 0.3) * 0.5;
          float wave2 = sin(position.x * 0.05 + time * 0.3) * sin(position.y * 0.05 + time * 0.4) * 0.3;
          
          // Ripple effect from water drop
          float dist = distance(position.xy, rippleCenter);
          float ripple = 0.0;
          
          if (rippleTime > 0.0) {
            float rippleRadius = rippleTime * 8.0;
            float rippleFade = max(0.0, 1.0 - rippleTime * 0.5);
            
            if (dist < rippleRadius) {
              ripple = sin((dist - rippleRadius) * 3.14159 * 2.0) * rippleStrength * rippleFade * exp(-dist * 0.1);
            }
          }
          
          vec3 newPosition = position;
          newPosition.z += wave1 + wave2 + ripple;
          
          gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
          vNormal = normalMatrix * normal;
        }
      `,
      fragmentShader: `
        uniform vec3 color;
        uniform float opacity;
        
        varying vec3 vPosition;
        varying vec3 vNormal;
        
        void main() {
          vec3 light = normalize(vec3(1.0, 1.0, 1.0));
          float lightIntensity = max(0.3, dot(vNormal, light));
          
          vec3 finalColor = color * lightIntensity;
          
          // Add some shimmer
          float shimmer = sin(vPosition.x * 2.0 + vPosition.y * 2.0) * 0.1 + 0.9;
          finalColor *= shimmer;
          
          gl_FragColor = vec4(finalColor, opacity);
        }
      `,
      transparent: true,
      side: THREE.DoubleSide
    })
  }, [])
  
  // Droplet geometry and material
  const dropletGeometry = useMemo(() => new THREE.SphereGeometry(0.15, 16, 16), [])
  const dropletMaterial = useMemo(() => new THREE.MeshStandardMaterial({
    color: 0x06b6d4, // cyan-500 for droplet
    transparent: true,
    opacity: 0.95,
    roughness: 0.05,
    metalness: 0.1,
    emissive: 0x0891b2,
    emissiveIntensity: 0.1
  }), [])


  // Ripple ring geometry
  const rippleGeometry = useMemo(() => new THREE.RingGeometry(0, 1, 32), [])
  const rippleMaterial = useMemo(() => new THREE.MeshBasicMaterial({
    color: 0xffffff,
    transparent: true,
    opacity: 0.3,
    side: THREE.DoubleSide
  }), [])  

  useEffect(() => {
    if (!mountRef.current) return

    // Scene setup
    const scene = new THREE.Scene()
    scene.fog = new THREE.Fog(0x0e4f4f, 10, 50) // teal-800 fog
    sceneRef.current = scene

    // Camera setup
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
    camera.position.set(0, -8, 12)
    camera.lookAt(0, 0, 0)
    cameraRef.current = camera

    // Renderer setup with optimizations
    const renderer = new THREE.WebGLRenderer({ 
      antialias: false,
      alpha: true,
      powerPreference: "high-performance",
      preserveDrawingBuffer: false,
      failIfMajorPerformanceCaveat: true
    })
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5))
    renderer.setClearColor(0x0e4f4f, 0.9) // teal-800 background
    renderer.shadowMap.enabled = false
    renderer.outputColorSpace = THREE.SRGBColorSpace
    rendererRef.current = renderer

    mountRef.current.appendChild(renderer.domElement)

    // Create ocean
    const ocean = new THREE.Mesh(oceanGeometry, oceanMaterial)
    ocean.rotation.x = -Math.PI / 2
    ocean.position.y = 0
    scene.add(ocean)
    oceanRef.current = ocean

    // Create droplet
    const droplet = new THREE.Mesh(dropletGeometry, dropletMaterial)
    droplet.position.set(0, 15, 0)
    droplet.visible = false
    scene.add(droplet)
    dropletRef.current = droplet

    // Lighting setup
    const ambientLight = new THREE.AmbientLight(0x404040, 0.4)
    scene.add(ambientLight)

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8)
    directionalLight.position.set(5, 10, 5)
    scene.add(directionalLight)

    // Handle resize with debouncing
    let resizeTimeout: NodeJS.Timeout
    const handleResize = () => {
      clearTimeout(resizeTimeout)
      resizeTimeout = setTimeout(() => {
        if (camera && renderer) {
          camera.aspect = window.innerWidth / window.innerHeight
          camera.updateProjectionMatrix()
          renderer.setSize(window.innerWidth, window.innerHeight)
        }
      }, 100)
    }

    window.addEventListener('resize', handleResize)

    // Animation loop
    const animate = () => {
      animationRef.current = requestAnimationFrame(animate)
      
      timeRef.current += 0.008

      // Update ocean waves
      if (oceanMaterial.uniforms) {
        oceanMaterial.uniforms.time.value = timeRef.current
      }

      // Water drop animation
      if (!isDroppedRef.current && timeRef.current > 3) {
        isDroppedRef.current = true
        dropAnimationRef.current = 0
        if (droplet) {
          droplet.visible = true
          droplet.position.set(0, 15, 0)
        }
      }

      // Animate droplet fall
      if (isDroppedRef.current && droplet?.visible) {
        dropAnimationRef.current += 0.02
        const fallSpeed = dropAnimationRef.current * dropAnimationRef.current * 0.5
        droplet.position.y = 15 - fallSpeed

        // Check if droplet hits water
        if (droplet.position.y <= 0.5) {
          droplet.visible = false
          
          // Create ripple effect
          if (oceanMaterial.uniforms) {
            oceanMaterial.uniforms.rippleCenter.value.set(droplet.position.x, droplet.position.z)
            oceanMaterial.uniforms.rippleTime.value = 0
            oceanMaterial.uniforms.rippleStrength.value = 1.0
          }

          // Create visual ripple rings
          createRippleRings(scene, droplet.position.x, droplet.position.z)
          
          // Reset for the next drop
          setTimeout(() => {
            isDroppedRef.current = false
          }, 5000)
        }
      }

      // Update ripple animation
      if (oceanMaterial.uniforms && oceanMaterial.uniforms.rippleTime.value > 0) {
        oceanMaterial.uniforms.rippleTime.value += 0.02
        oceanMaterial.uniforms.rippleStrength.value *= 0.98
        
        if (oceanMaterial.uniforms.rippleTime.value > 4) {
          oceanMaterial.uniforms.rippleTime.value = 0
          oceanMaterial.uniforms.rippleStrength.value = 0
        }
      }

      // Update ripple rings  
      rippleRingsRef.current.forEach((ring, index) => {
        if (ring.parent) {
          const scaleSpeed = 1.04 + Math.sin(timeRef.current * 0.2 + index) * 0.01;
          ring.scale.multiplyScalar(scaleSpeed)
          const material = ring.material as THREE.MeshBasicMaterial

          // Opacity decay with some variation
          const opacityDecay = 0.94 - Math.cos(timeRef.current * 0.1 + index) * 0.01;
          material.opacity *= opacityDecay;
          
          //Color variation
          const baseColor = new THREE.Color(0xADD8E6)
          const colorVariation = Math.sin(timeRef.current * 0.3 + index) * 0.2;
          const currentColor = baseColor.clone().offsetHSL(0, 0, colorVariation)
          material.color = currentColor

          if (material.opacity < 0.02) {
            scene.remove(ring)
            rippleRingsRef.current.splice(index, 1)
          }
        }
      });

      // Subtle camera movement
      if (camera) {
        camera.position.x = Math.sin(timeRef.current * 0.1) * 2
        camera.position.z = 12 + Math.cos(timeRef.current * 0.15) * 1
        camera.lookAt(0, 0, 0)
      }

      renderer.render(scene, camera)
    }

    animate()

    // Create ripple rings function - Extract to useCallback for stability
    const createRippleRings = (scene: THREE.Scene, x: number, z: number) => {
      const numRings = 3;
      for (let i = 0; i < numRings; i++) {
        setTimeout(() => {
          const ring = new THREE.Mesh(rippleGeometry, rippleMaterial.clone())
          ring.position.set(x, 0.2, z)
          ring.rotation.x = -Math.PI / 2
          const initialScale = 0.05 + i * 0.02;
          ring.scale.set(initialScale, initialScale, initialScale)
          ring.material.opacity = 0.5 - i * 0.1
          scene.add(ring)
          rippleRingsMaterialRef.current.push(ring.material)
          rippleRingsRef.current.push(ring)
        }, i * 200)
      }
    }

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize)
      clearTimeout(resizeTimeout)
      
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
      
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement)
      }
      
      //Dispose of ripple ring materials
      rippleRingsMaterialRef.current.forEach(material => material.dispose())
      rippleRingsMaterialRef.current = []

      // Dispose of geometries and materials      
      oceanGeometry.dispose()
      oceanMaterial.dispose()
      dropletGeometry.dispose()
      dropletMaterial.dispose()
      rippleGeometry.dispose()
      rippleMaterial.dispose()
      
      renderer.dispose()
    }    
  }, [oceanGeometry, oceanMaterial, dropletGeometry, dropletMaterial, rippleGeometry, rippleMaterial])  

  return (
    <div 
      ref={mountRef} 
      className={`fixed inset-0 -z-10 bg-gradient-to-b from-slate-900 via-cyan-900 to-teal-800 ${className}`}
    />
  )
}

// Loading fallback component
const LoadingFallback: React.FC = () => (
  <div className="fixed inset-0 -z-10 bg-gradient-to-b from-gray-900 via-blue-900 to-blue-800">
    <div className="absolute inset-0 opacity-20">
      <div className="w-full h-full bg-[url('data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\' opacity=\'0.05\'/%3E%3C/svg%3E')]" />
    </div>
  </div>
)

// Main export with Suspense wrapper
const OceanBackgroundWrapper: React.FC<OceanBackgroundProps> = (props) => (
  <Suspense fallback={<LoadingFallback />}>
    <OceanBackground {...props} />
  </Suspense>
)

export default OceanBackgroundWrapper