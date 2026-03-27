import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { motion } from 'framer-motion';

const DigitalTwinPro = () => {
  const containerRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const rendererRef = useRef(null);
  const buildingsRef = useRef([]);
  const waterRef = useRef(null);
  const [waterLevel, setWaterLevel] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [floodProgress, setFloodProgress] = useState(0);
  const [speed, setSpeed] = useState(1);
  const [stats, setStats] = useState({ inundated: 0, safe: 0, critical: 0 });

  useEffect(() => {
    if (!containerRef.current) return;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a0e27);
    scene.fog = new THREE.Fog(0x0a0e27, 100, 200);
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

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFShadowMap;
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(20, 30, 20);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 4096;
    directionalLight.shadow.mapSize.height = 4096;
    directionalLight.shadow.camera.far = 100;
    scene.add(directionalLight);

    // Ground
    const groundGeometry = new THREE.PlaneGeometry(40, 40);
    const groundMaterial = new THREE.MeshStandardMaterial({
      color: 0x2d3748,
      roughness: 0.8,
      metalness: 0.1
    });
    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    ground.position.y = -0.01;
    scene.add(ground);

    // Buildings with different heights
    const buildingPositions = [
      { x: -10, z: -10, w: 3, d: 3, h: 8, c: 0x3b82f6 },
      { x: 0, z: -10, w: 4, d: 3, h: 10, c: 0x06b6d4 },
      { x: 10, z: -10, w: 3, d: 3, h: 6, c: 0x0ea5e9 },
      { x: -10, z: 0, w: 3, d: 4, h: 9, c: 0x0284c7 },
      { x: 0, z: 0, w: 5, d: 5, h: 12, c: 0x0369a1 },
      { x: 10, z: 0, w: 3, d: 4, h: 7, c: 0x075985 },
      { x: -10, z: 10, w: 4, d: 3, h: 6, c: 0x1e40af },
      { x: 0, z: 10, w: 3, d: 3, h: 8, c: 0x1e3a8a },
      { x: 10, z: 10, w: 3, d: 4, h: 7, c: 0x172554 }
    ];

    buildingPositions.forEach(pos => {
      const geometry = new THREE.BoxGeometry(pos.w, pos.h, pos.d);
      const material = new THREE.MeshStandardMaterial({
        color: pos.c,
        roughness: 0.6,
        metalness: 0.2
      });
      const building = new THREE.Mesh(geometry, material);
      building.position.set(pos.x, pos.h / 2, pos.z);
      building.castShadow = true;
      building.receiveShadow = true;
      building.userData = { maxHeight: pos.h, baseColor: pos.c };
      scene.add(building);
      buildingsRef.current.push(building);
    });

    // Water
    const waterGeometry = new THREE.PlaneGeometry(40, 40);
    const waterMaterial = new THREE.MeshStandardMaterial({
      color: 0x0ea5e9,
      metalness: 0.4,
      roughness: 0.3,
      transparent: true,
      opacity: 0.7,
      emissive: 0x0284c7,
      emissiveIntensity: 0.2
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
      camera.position.x = Math.cos(time) * 25;
      camera.position.z = Math.sin(time) * 25;
      camera.lookAt(0, 5, 0);

      // Update water
      water.position.y = waterLevel * 0.1;
      const waveTime = Date.now() * 0.001;
      waterMaterial.emissiveIntensity = 0.2 + Math.sin(waveTime) * 0.1;

      // Update building colors based on water level
      buildingsRef.current.forEach(building => {
        const waterHeight = waterLevel * 0.1;
        if (waterHeight > building.position.y - building.userData.maxHeight / 2) {
          const inundationLevel = Math.min(1, (waterHeight - (building.position.y - building.userData.maxHeight / 2)) / building.userData.maxHeight);
          building.material.color.setHex(0xff4444);
          building.material.emissive.setHex(0xff0000);
          building.material.emissiveIntensity = inundationLevel * 0.5;
        } else {
          building.material.color.setHex(building.userData.baseColor);
          building.material.emissive.setHex(0x000000);
          building.material.emissiveIntensity = 0;
        }
      });

      renderer.render(scene, camera);
    };
    animate();

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
      progress += speed;
      setFloodProgress(progress);
      setWaterLevel(progress);

      // Calculate statistics
      const inundated = buildingsRef.current.filter(b => {
        const waterHeight = progress * 0.1;
        return waterHeight > b.position.y - b.userData.maxHeight / 2;
      }).length;

      setStats({
        inundated,
        safe: buildingsRef.current.length - inundated,
        critical: inundated > 5 ? 'CRITICAL' : inundated > 2 ? 'WARNING' : 'SAFE'
      });

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
    setStats({ inundated: 0, safe: 9, critical: 'SAFE' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white p-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center font-bold">🏙️</div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
            DIGITAL TWIN CITY FLOOD MODEL
          </h1>
        </div>
        <p className="text-cyan-300/70">Real-time 3D Flood Visualization with Building Inundation Analysis</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* 3D Canvas */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="lg:col-span-3 bg-slate-900/60 border-2 border-cyan-500/40 rounded-xl overflow-hidden shadow-2xl shadow-cyan-500/20"
        >
          <div ref={containerRef} className="w-full h-96 lg:h-full min-h-96"></div>
        </motion.div>

        {/* Control Panel */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-4"
        >
          {/* Water Level Control */}
          <div className="bg-slate-900/60 border-2 border-cyan-500/40 rounded-xl p-4 backdrop-blur-sm">
            <h3 className="text-lg font-bold text-cyan-400 mb-4">💧 WATER LEVEL</h3>
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
                  disabled={isAnimating}
                  className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer disabled:opacity-50"
                />
              </div>

              {/* Speed Control */}
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-white/70">Speed</span>
                  <span className="text-sm font-bold text-cyan-400">{speed}x</span>
                </div>
                <input
                  type="range"
                  min="0.5"
                  max="3"
                  step="0.5"
                  value={speed}
                  onChange={(e) => setSpeed(parseFloat(e.target.value))}
                  disabled={isAnimating}
                  className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer disabled:opacity-50"
                />
              </div>

              {/* Flood Progress */}
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-white/70">Progress</span>
                  <span className="text-sm font-bold text-orange-400">{floodProgress.toFixed(0)}%</span>
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
          <div className="bg-slate-900/60 border-2 border-cyan-500/40 rounded-xl p-4 backdrop-blur-sm">
            <h3 className="text-lg font-bold text-cyan-400 mb-4">🎮 CONTROLS</h3>
            <div className="space-y-2">
              <button
                onClick={startFloodSimulation}
                disabled={isAnimating}
                className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 disabled:opacity-50 text-white font-bold py-2 px-4 rounded-lg transition shadow-lg shadow-red-500/30"
              >
                {isAnimating ? '⏸️ SIMULATING...' : '▶️ START FLOOD'}
              </button>
              <button
                onClick={resetSimulation}
                className="w-full bg-gradient-to-r from-slate-600 to-slate-700 hover:from-slate-700 hover:to-slate-800 text-white font-bold py-2 px-4 rounded-lg transition"
              >
                🔄 RESET
              </button>
            </div>
          </div>

          {/* Statistics */}
          <div className="bg-slate-900/60 border-2 border-cyan-500/40 rounded-xl p-4 backdrop-blur-sm">
            <h3 className="text-lg font-bold text-cyan-400 mb-4">📊 STATISTICS</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between items-center">
                <span className="text-white/70">Buildings</span>
                <span className="font-bold text-cyan-300">9</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-white/70">Inundated</span>
                <span className={`font-bold ${stats.inundated > 5 ? 'text-red-400' : stats.inundated > 2 ? 'text-orange-400' : 'text-green-400'}`}>
                  {stats.inundated}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-white/70">Safe</span>
                <span className="font-bold text-green-400">{stats.safe}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-white/70">Status</span>
                <span className={`font-bold px-2 py-1 rounded text-xs ${
                  stats.critical === 'CRITICAL' ? 'bg-red-900 text-red-300' :
                  stats.critical === 'WARNING' ? 'bg-orange-900 text-orange-300' :
                  'bg-green-900 text-green-300'
                }`}>
                  {stats.critical}
                </span>
              </div>
            </div>
          </div>

          {/* Legend */}
          <div className="bg-slate-900/60 border-2 border-cyan-500/40 rounded-xl p-4 backdrop-blur-sm">
            <h3 className="text-lg font-bold text-cyan-400 mb-4">🎨 LEGEND</h3>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-blue-500 rounded"></div>
                <span>Buildings</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-red-500 rounded"></div>
                <span>Inundated</span>
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
        className="mt-6 bg-slate-900/60 border-2 border-cyan-500/40 rounded-xl p-6 backdrop-blur-sm"
      >
        <h3 className="text-xl font-bold text-cyan-400 mb-3">ℹ️ ABOUT DIGITAL TWIN</h3>
        <p className="text-white/80 text-sm leading-relaxed">
          This advanced 3D model simulates real-time flood progression in a city environment. Watch as water levels rise and buildings become progressively inundated.
          The visualization helps emergency planners understand flood impact zones, evacuation priorities, and resource allocation. Use manual controls for precise
          water level adjustment or start an automated simulation to see progressive flooding over time. Building colors change from blue (safe) to red (inundated)
          as water levels rise, providing instant visual feedback on disaster impact.
        </p>
      </motion.div>
    </div>
  );
};

export default DigitalTwinPro;
