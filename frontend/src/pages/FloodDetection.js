import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';

export default function FloodDetection() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [zone, setZone] = useState('Velachery');
  const [source, setSource] = useState('satellite');
  const [detection, setDetection] = useState(null);
  const [loading, setLoading] = useState(false);
  const [detections, setDetections] = useState([]);
  const fileInputRef = useRef(null);

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onload = (event) => {
        setPreview(event.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const analyzeImage = async () => {
    if (!selectedImage) return;
    
    setLoading(true);
    try {
      const reader = new FileReader();
      reader.onload = async (event) => {
        const base64 = event.target.result.split(',')[1];
        const res = await axios.post('http://localhost:5001/detect-flood', {
          image: base64,
          zone,
          source
        });
        
        setDetection(res.data);
        if (res.data.flood_detected) {
          setDetections([res.data, ...detections]);
        }
      };
      reader.readAsDataURL(selectedImage);
    } catch (err) {
      console.error('Detection error:', err);
    } finally {
      setLoading(false);
    }
  };

  const getRiskColor = (risk) => {
    const colors = { Low: '#10b981', Moderate: '#f59e0b', High: '#f97316', Critical: '#ef4444' };
    return colors[risk] || '#6b7280';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 to-slate-900 text-white">
      <div className="backdrop-blur-md bg-slate-900/80 border-b border-slate-700/50 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">🛰️ AI Satellite & Drone Flood Detection</h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Upload Section */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="lg:col-span-2 rounded-xl border border-slate-700 bg-gradient-to-br from-slate-800 to-slate-900 p-6 shadow-xl">
            <h2 className="text-xl font-bold mb-6 text-cyan-400">Upload Image for Analysis</h2>
            
            {/* Source Selection */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-300 mb-3">Image Source</label>
              <div className="flex gap-4">
                {['satellite', 'drone'].map(s => (
                  <motion.button
                    key={s}
                    whileHover={{ scale: 1.05 }}
                    onClick={() => setSource(s)}
                    className={`px-6 py-2 rounded-lg font-semibold transition-all ${source === s ? 'bg-gradient-to-r from-blue-600 to-cyan-600 shadow-lg' : 'bg-slate-700 hover:bg-slate-600'}`}
                  >
                    {s === 'satellite' ? '🛰️ Satellite' : '🚁 Drone'}
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Zone Selection */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-300 mb-3">Zone</label>
              <select value={zone} onChange={(e) => setZone(e.target.value)} className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white">
                <option>Velachery</option>
                <option>T Nagar</option>
                <option>Adyar</option>
                <option>Anna Nagar</option>
                <option>Mylapore</option>
                <option>Tambaram</option>
              </select>
            </div>

            {/* Image Upload */}
            <div className="mb-6">
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-slate-600 rounded-lg p-8 text-center cursor-pointer hover:border-cyan-500 transition-all"
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageSelect}
                  className="hidden"
                />
                <div className="text-4xl mb-3">📸</div>
                <p className="text-gray-300">Click to upload or drag image</p>
                <p className="text-sm text-gray-400 mt-2">Satellite or drone image</p>
              </div>
            </div>

            {/* Preview */}
            {preview && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-6">
                <img src={preview} alt="Preview" className="w-full rounded-lg max-h-64 object-cover" />
              </motion.div>
            )}

            {/* Analyze Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={analyzeImage}
              disabled={!selectedImage || loading}
              className="w-full py-3 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 disabled:from-gray-600 disabled:to-gray-700 rounded-lg font-bold transition-all"
            >
              {loading ? 'Analyzing...' : 'Analyze Image'}
            </motion.button>
          </motion.div>

          {/* Results Section */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="rounded-xl border border-slate-700 bg-gradient-to-br from-slate-800 to-slate-900 p-6 shadow-xl h-fit">
            <h2 className="text-xl font-bold mb-4 text-orange-400">Detection Results</h2>
            
            {detection ? (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                <div className={`p-4 rounded-lg ${detection.flood_detected ? 'bg-red-900/50 border border-red-700' : 'bg-green-900/50 border border-green-700'}`}>
                  <p className="font-bold text-lg">{detection.flood_detected ? '🚨 FLOOD DETECTED' : '✓ No Flood'}</p>
                </div>

                {detection.flood_detected && (
                  <>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Severity</span>
                        <span className="font-bold" style={{ color: getRiskColor(detection.severity) }}>{detection.severity}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Risk Score</span>
                        <span className="font-bold text-cyan-400">{detection.risk_score}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Water %</span>
                        <span className="font-bold text-cyan-400">{detection.water_percentage}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Confidence</span>
                        <span className="font-bold text-cyan-400">{detection.confidence}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Source</span>
                        <span className="font-bold text-cyan-400">{detection.source === 'satellite' ? '🛰️ Satellite' : '🚁 Drone'}</span>
                      </div>
                    </div>

                    <div className="p-3 bg-slate-700/50 rounded-lg">
                      <p className="text-sm text-gray-300">{detection.message}</p>
                    </div>

                    <motion.div initial={{ width: 0 }} animate={{ width: '100%' }} transition={{ duration: 1 }} className="h-2 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-full" />
                  </>
                )}
              </motion.div>
            ) : (
              <p className="text-gray-400 text-center py-8">Upload an image to analyze</p>
            )}
          </motion.div>
        </div>

        {/* Detection History */}
        {detections.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="mt-8 rounded-xl border border-slate-700 bg-gradient-to-br from-slate-800 to-slate-900 p-6 shadow-xl">
            <h2 className="text-xl font-bold mb-4 text-cyan-400">🚨 Flood Detections</h2>
            <div className="space-y-3">
              {detections.map((det, idx) => (
                <motion.div key={idx} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.05 }} className="p-4 rounded-lg bg-slate-700/50 border-l-4" style={{ borderColor: getRiskColor(det.severity) }}>
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-bold text-gray-300">{det.zone}</p>
                      <p className="text-sm text-gray-400 mt-1">{det.source === 'satellite' ? '🛰️ Satellite' : '🚁 Drone'} - {det.water_percentage}% water</p>
                    </div>
                    <span className="px-3 py-1 rounded-full text-sm font-bold" style={{ background: getRiskColor(det.severity), color: 'white' }}>{det.severity}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
