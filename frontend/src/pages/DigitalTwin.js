import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { motion } from 'framer-motion';

const DigitalTwin = () => {
  const containerRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const rendererRef = useRef(null);
  const buildingsRef = useRef([]);
  const waterRef = useRef(null);
  const [waterLevel, setWaterLevel] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [floodProgress, setFloodProgress] = useState(0);

  useEffect(() => {
    if (!containerRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0f172a);
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(
      75,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.set(15, 15, 15);
    camera.lookAt(0, 0, 0);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    renderer.shadowMap.enabled = true;
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(10, 20, 10);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    scene.add(directionalLight);

    // Ground
    const groundGeometry = new THREE.PlaneGeometry(30, 30);
    const groundMaterial = new THREE.MeshStandardMaterial({ color: 0x4b5563 });
    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    scene.add(ground);

    // Create buildings
    const buildingPositions = [
      { x: -8, z: -8, width: 3, depth: 3, height: 6, color: 0x3b82f6 },
      { x: 0, z: -8, width: 4, depth: 3, height: 8, color: 0x06b6d4 },
      { x: 8, z: -8, width: 3, depth: 3, height: 5, color: 0x0ea5e9 },
      { x: -8, z: 0, width: 3, depth: 4, height: 7, color: 0x0284c7 },
      { x: 0, z: 0, width: 5, depth: 5, height: 10, color: 0x0369a1 },
      { x: 8, z: 0, width: 3, depth: 4, height: 6, color: 0x075985 },
      { x: -8, z: 8, width: 4, depth: 3, height: 5, color: 0x1e40af },
      { x: 0, z: 8, width: 3, depth: 3, height: 7, color: 0x1e3a8a },
      { x: 8, z: 8, width: 3, depth: 4, height: 6, color: 0x172554 }
    ];

    buildingPositions.forEach(pos => {
      const geometry = new THREE.BoxGeometry(pos.width, pos.height, pos.depth);
      const material = new THREE.MeshStandardMaterial({ color: pos.color });
      const building = new THREE.Mesh(geometry, material);
      building.position.set(pos.x, pos.height / 2, pos.z);
      building.castShadow = true;
      building.receiveShadow = true;
      building.userData = { maxHeight: pos.height };
      scene.add(building);
      buildingsRef.current.push(building);
    });

    // Water
    const waterGeometry = new THREE.PlaneGeometry(30, 30);
    const waterMaterial = new THREE.MeshStandardMaterial({
      color: 0x0ea5e9,
      metalness: 0.3,
      roughness: 0.4,
      transparent: true,
      opacity: 0.7
    });
    const water = new THREE.Mesh(waterGeometry, waterMaterial);
    water.rotation.x = -Math.PI / 2;
    water.position.y = 0.01;
    water.receiveShadow = true;
    scene.add(water);
    waterRef.current = water;

    // Animation loop
    let animationId;
    const animate = () => {
      animationId = requestAnimationFrame(animate);

      // Rotate camera
      const time = Date.now() * 0.0001;
      camera.position.x = Math.cos(time) * 20;
      camera.position.z = Math.sin(time) * 20;
      camera.lookAt(0, 5, 0);

      // Update water level
      water.position.y = waterLevel * 0.1;
      water.scale.y = 1 + waterLevel * 0.05;

      // Wave animation
      const waveTime = Date.now() * 0.001;
      waterMaterial.color.setHSL(0.55 + Math.sin(waveTime) * 0.05, 0.8, 0.5);

      renderer.render(scene, camera);
    };
    animate();

    // Handle resize
    const handleResize = () => {
      if (!containerRef.current) return;
      const width = containerRef.current.clientWidth;
      const height = containerRef.current.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationId);
      renderer.dispose();
      containerRef.current?.removeChild(renderer.domElement);
    };
  }, []);

  const startFloodSimulation = () => {
    setIsAnimating(true);
    setFloodProgress(0);

    let progress = 0;
    const interval = setInterval(() => {
      progress += 1;
      setFloodProgress(progress);
      setWaterLevel(progress);

      if (progress >= 100) {
        clearInterval(interval);
        setIsAnimating(false);
      }
    }, 50);
  };

  const resetSimulation = () => {
    setWaterLevel(0);
    setFloodProgress(0);
    setIsAnimating(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white p-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent mb-2">
          🏙️ DIGITAL TWIN CITY FLOOD MODEL
        </h1>
        <p className="text-cyan-300">3D Real-time Flood Visualization with Building Inundation</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* 3D Canvas */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="lg:col-span-3 bg-slate-800/50 border border-cyan-500/30 rounded-lg overflow-hidden shadow-xl"
        >
          <div ref={containerRef} className="w-full h-96 lg:h-full min-h-96"></div>
        </motion.div>

        {/* Controls */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-4"
        >
          {/* Water Level Control */}
          <div className="bg-slate-800/50 border border-cyan-500/30 rounded-lg p-4 shadow-xl">
            <h3 className="text-lg font-bold text-cyan-400 mb-4">💧 Water Level</h3>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-white/70">Level</span>
                  <span className="text-sm font-bold text-cyan-400">{waterLevel.toFixed(1)}m</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={waterLevel}
                  onChange={(e) => setWaterLevel(parseFloat(e.target.value))}
                  className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer"
                />
              </div>

              {/* Flood Progress */}
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-white/70">Flood Progress</span>
                  <span className="text-sm font-bold text-orange-400">{floodProgress}%</span>
                </div>
                <div className="w-full bg-slate-700 rounded-full h-3 overflow-hidden">
                  <div
                    className="h-3 bg-gradient-to-r from-cyan-500 to-blue-500 transition-all duration-300"
                    style={{ width: `${floodProgress}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          {/* Simulation Controls */}
          <div className="bg-slate-800/50 border border-cyan-500/30 rounded-lg p-4 shadow-xl">
            <h3 className="text-lg font-bold text-cyan-400 mb-4">🎮 Controls</h3>
            <div className="space-y-2">
              <button
                onClick={startFloodSimulation}
                disabled={isAnimating}
                className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 disabled:opacity-50 text-white font-bold py-2 px-4 rounded-lg transition"
              >
                {isAnimating ? '⏸️ Simulating...' : '▶️ Start Flood'}
              </button>
              <button
                onClick={resetSimulation}
                className="w-full bg-gradient-to-r from-slate-600 to-slate-700 hover:from-slate-700 hover:to-slate-800 text-white font-bold py-2 px-4 rounded-lg transition"
              >
                🔄 Reset
              </button>
            </div>
          </div>

          {/* Statistics */}
          <div className="bg-slate-800/50 border border-cyan-500/30 rounded-lg p-4 shadow-xl">
            <h3 className="text-lg font-bold text-cyan-400 mb-4">📊 Statistics</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-white/70">Buildings</span>
                <span className="font-bold text-cyan-300">9</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/70">Max Height</span>
                <span className="font-bold text-cyan-300">10m</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/70">Area</span>
                <span className="font-bold text-cyan-300">30×30m</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/70">Inundation</span>
                <span className={`font-bold ${waterLevel > 50 ? 'text-red-400' : waterLevel > 25 ? 'text-orange-400' : 'text-green-400'}`}>
                  {waterLevel > 50 ? 'Critical' : waterLevel > 25 ? 'High' : 'Low'}
                </span>
              </div>
            </div>
          </div>

          {/* Legend */}
          <div className="bg-slate-800/50 border border-cyan-500/30 rounded-lg p-4 shadow-xl">
            <h3 className="text-lg font-bold text-cyan-400 mb-4">🎨 Legend</h3>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-blue-500 rounded"></div>
                <span>Buildings</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-cyan-500 rounded"></div>
                <span>Water</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-gray-500 rounded"></div>
                <span>Ground</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Info Panel */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-6 bg-slate-800/50 border border-cyan-500/30 rounded-lg p-6 shadow-xl"
      >
        <h3 className="text-xl font-bold text-cyan-400 mb-3">ℹ️ About Digital Twin</h3>
        <p className="text-white/80 text-sm leading-relaxed">
          This 3D model simulates real-time flood progression in a city. Watch as water levels rise and buildings become inundated.
          The visualization helps emergency planners understand flood impact zones and evacuation priorities. Use the water level slider
          to manually adjust flood levels or start an automated simulation to see progressive flooding over time.
        </p>
      </motion.div>
    </div>
  );
};

export default DigitalTwin;
