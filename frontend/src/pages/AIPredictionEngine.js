import React, { useState } from 'react';
import { Brain, Zap, TrendingUp, AlertTriangle, CheckCircle, Clock, Layers, BarChart3 } from 'lucide-react';
import '../theme.css';

export default function AIPredictionEngine() {
  const [selectedScenario, setSelectedScenario] = useState('current');
  const [predictionHours, setPredictionHours] = useState(6);

  // AI Model Information
  const aiModel = {
    name: 'GeoGuard AI v2.0',
    accuracy: 94.2,
    trainingData: '5+ years',
    updateFrequency: 'Real-time',
    parameters: 127,
    confidence: 92
  };

  // Current Predictions
  const predictions = [
    {
      zone: 'Velachery',
      currentRisk: 78,
      predictedRisk: 85,
      change: '+7%',
      timeframe: '6 hours',
      confidence: 94,
      factors: ['Rainfall increasing', 'Water level rising', 'Drainage blocked'],
      recommendation: 'Immediate evacuation recommended'
    },
    {
      zone: 'Tambaram',
      currentRisk: 62,
      predictedRisk: 68,
      change: '+6%',
      timeframe: '6 hours',
      confidence: 91,
      factors: ['Moderate rainfall', 'Water level stable', 'Good drainage'],
      recommendation: 'Prepare evacuation routes'
    },
    {
      zone: 'Guindy',
      currentRisk: 45,
      predictedRisk: 42,
      change: '-3%',
      timeframe: '6 hours',
      confidence: 88,
      factors: ['Rainfall decreasing', 'Water level falling', 'Drainage effective'],
      recommendation: 'Continue monitoring'
    },
    {
      zone: 'Adyar',
      currentRisk: 35,
      predictedRisk: 32,
      change: '-3%',
      timeframe: '6 hours',
      confidence: 89,
      factors: ['Clear weather', 'Water level low', 'No alerts'],
      recommendation: 'Situation under control'
    }
  ];

  // Scenario Analysis
  const scenarios = [
    {
      id: 'current',
      name: 'Current Conditions',
      description: 'Based on real-time data',
      avgRisk: 55,
      affectedPopulation: 450000,
      evacuationNeeded: 125000
    },
    {
      id: 'heavy-rain',
      name: 'Heavy Rainfall (+50mm)',
      description: 'If rainfall increases significantly',
      avgRisk: 72,
      affectedPopulation: 580000,
      evacuationNeeded: 210000
    },
    {
      id: 'drainage-failure',
      name: 'Drainage System Failure',
      description: 'If drainage systems fail',
      avgRisk: 81,
      affectedPopulation: 650000,
      evacuationNeeded: 280000
    },
    {
      id: 'best-case',
      name: 'Best Case Scenario',
      description: 'If conditions improve',
      avgRisk: 28,
      affectedPopulation: 150000,
      evacuationNeeded: 35000
    }
  ];

  // ML Insights
  const insights = [
    {
      title: 'Pattern Recognition',
      description: 'AI detected similar weather pattern from 2019 monsoon',
      confidence: 96,
      impact: 'High'
    },
    {
      title: 'Anomaly Detection',
      description: 'Unusual water level spike detected in Velachery zone',
      confidence: 93,
      impact: 'Critical'
    },
    {
      title: 'Trend Analysis',
      description: 'Risk levels trending upward across all zones',
      confidence: 91,
      impact: 'High'
    },
    {
      title: 'Correlation Analysis',
      description: 'Strong correlation between rainfall and water level',
      confidence: 98,
      impact: 'Medium'
    }
  ];

  // Feature Importance
  const featureImportance = [
    { name: 'Rainfall Intensity', importance: 28, color: '#0ea5e9' },
    { name: 'Water Level', importance: 25, color: '#06b6d4' },
    { name: 'Elevation', importance: 18, color: '#10b981' },
    { name: 'Drainage Capacity', importance: 15, color: '#f59e0b' },
    { name: 'Historical Data', importance: 14, color: '#ef4444' }
  ];

  const currentScenario = scenarios.find(s => s.id === selectedScenario);

  return (
    <div className="main-container">
      {/* Header */}
      <div className="page-header mb-6">
        <div className="flex-between">
          <div>
            <h1 className="page-title">AI Prediction Engine</h1>
            <p className="page-subtitle">Machine learning-powered flood forecasting</p>
          </div>
          <div className="flex items-center gap-2 bg-slate-800/50 rounded-lg px-4 py-2 border border-slate-700">
            <Brain className="w-5 h-5 text-primary" />
            <div>
              <div className="text-xs text-slate-400">Model Accuracy</div>
              <div className="text-lg font-bold text-primary">{aiModel.accuracy}%</div>
            </div>
          </div>
        </div>
      </div>

      {/* Model Info */}
      <div className="grid-4 mb-6">
        <div className="card">
          <div className="text-sm text-slate-400 mb-1">Model Version</div>
          <div className="font-semibold text-white">{aiModel.name}</div>
          <div className="text-xs text-slate-500 mt-1">Latest</div>
        </div>
        <div className="card">
          <div className="text-sm text-slate-400 mb-1">Training Data</div>
          <div className="font-semibold text-white">{aiModel.trainingData}</div>
          <div className="text-xs text-slate-500 mt-1">Historical</div>
        </div>
        <div className="card">
          <div className="text-sm text-slate-400 mb-1">Update Frequency</div>
          <div className="font-semibold text-white">{aiModel.updateFrequency}</div>
          <div className="text-xs text-slate-500 mt-1">Live</div>
        </div>
        <div className="card">
          <div className="text-sm text-slate-400 mb-1">Parameters</div>
          <div className="font-semibold text-white">{aiModel.parameters}</div>
          <div className="text-xs text-slate-500 mt-1">ML Model</div>
        </div>
      </div>

      {/* Scenario Analysis */}
      <div className="section mb-6">
        <h2 className="section-title">Scenario Analysis</h2>
        <div className="grid-2 mb-4">
          {scenarios.map((scenario) => (
            <button
              key={scenario.id}
              onClick={() => setSelectedScenario(scenario.id)}
              className={`card cursor-pointer transition-all ${
                selectedScenario === scenario.id
                  ? 'border-primary bg-slate-800/80'
                  : 'hover:border-primary/50'
              }`}
            >
              <h4 className="font-semibold text-white mb-1">{scenario.name}</h4>
              <p className="text-xs text-slate-400 mb-3">{scenario.description}</p>
              <div className="space-y-2">
                <div className="flex-between">
                  <span className="text-xs text-slate-500">Avg Risk</span>
                  <span className="text-sm font-bold text-primary">{scenario.avgRisk}</span>
                </div>
                <div className="flex-between">
                  <span className="text-xs text-slate-500">Population at Risk</span>
                  <span className="text-sm font-bold text-orange-400">
                    {(scenario.affectedPopulation / 1000).toFixed(0)}K
                  </span>
                </div>
                <div className="flex-between">
                  <span className="text-xs text-slate-500">Evacuation Needed</span>
                  <span className="text-sm font-bold text-red-400">
                    {(scenario.evacuationNeeded / 1000).toFixed(0)}K
                  </span>
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Scenario Details */}
        {currentScenario && (
          <div className="card">
            <h3 className="font-semibold text-white mb-4">{currentScenario.name} - Impact Analysis</h3>
            <div className="grid-3">
              <div>
                <div className="text-sm text-slate-400 mb-2">Average Risk Level</div>
                <div className="text-4xl font-bold text-primary mb-2">{currentScenario.avgRisk}</div>
                <div className="bg-slate-700 rounded h-2">
                  <div
                    className="h-full bg-gradient-to-r from-primary to-secondary rounded"
                    style={{ width: `${currentScenario.avgRisk}%` }}
                  />
                </div>
              </div>
              <div>
                <div className="text-sm text-slate-400 mb-2">Affected Population</div>
                <div className="text-4xl font-bold text-orange-400 mb-2">
                  {(currentScenario.affectedPopulation / 1000).toFixed(0)}K
                </div>
                <div className="text-xs text-slate-500">
                  {((currentScenario.affectedPopulation / 1000000) * 100).toFixed(1)}% of total
                </div>
              </div>
              <div>
                <div className="text-sm text-slate-400 mb-2">Evacuation Required</div>
                <div className="text-4xl font-bold text-red-400 mb-2">
                  {(currentScenario.evacuationNeeded / 1000).toFixed(0)}K
                </div>
                <div className="text-xs text-slate-500">
                  {((currentScenario.evacuationNeeded / currentScenario.affectedPopulation) * 100).toFixed(1)}% of affected
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Predictions */}
      <div className="section mb-6">
        <h2 className="section-title">Zone-wise Predictions (Next {predictionHours} Hours)</h2>
        <div className="space-y-3">
          {predictions.map((pred, idx) => (
            <div key={idx} className="card">
              <div className="flex-between mb-4">
                <h4 className="font-semibold text-white text-lg">{pred.zone}</h4>
                <div className="flex items-center gap-2">
                  <div className="text-right">
                    <div className="text-xs text-slate-400">Confidence</div>
                    <div className="text-sm font-bold text-primary">{pred.confidence}%</div>
                  </div>
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                    <span className="text-xs font-bold text-white">{pred.confidence}%</span>
                  </div>
                </div>
              </div>

              <div className="grid-3 gap-4 mb-4">
                {/* Current Risk */}
                <div>
                  <div className="text-xs text-slate-400 mb-2">Current Risk</div>
                  <div className="text-3xl font-bold text-slate-300">{pred.currentRisk}</div>
                  <div className="bg-slate-700 rounded h-1 mt-2">
                    <div
                      className="h-full bg-slate-500 rounded"
                      style={{ width: `${pred.currentRisk}%` }}
                    />
                  </div>
                </div>

                {/* Predicted Risk */}
                <div>
                  <div className="text-xs text-slate-400 mb-2">Predicted Risk</div>
                  <div className="text-3xl font-bold text-primary">{pred.predictedRisk}</div>
                  <div className="bg-slate-700 rounded h-1 mt-2">
                    <div
                      className="h-full bg-primary rounded"
                      style={{ width: `${pred.predictedRisk}%` }}
                    />
                  </div>
                </div>

                {/* Change */}
                <div>
                  <div className="text-xs text-slate-400 mb-2">Change</div>
                  <div className={`text-3xl font-bold ${pred.change.startsWith('+') ? 'text-red-400' : 'text-green-400'}`}>
                    {pred.change}
                  </div>
                  <div className="text-xs text-slate-500 mt-2">{pred.timeframe}</div>
                </div>
              </div>

              {/* Contributing Factors */}
              <div className="mb-3">
                <div className="text-xs font-semibold text-slate-400 mb-2">Contributing Factors</div>
                <div className="flex flex-wrap gap-2">
                  {pred.factors.map((factor, fidx) => (
                    <span key={fidx} className="badge badge-info text-xs">
                      {factor}
                    </span>
                  ))}
                </div>
              </div>

              {/* Recommendation */}
              <div className="bg-slate-700/50 rounded p-3 border-l-2 border-primary">
                <div className="text-xs text-slate-400 mb-1">Recommendation</div>
                <div className="text-sm text-slate-300 font-semibold">{pred.recommendation}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ML Insights */}
      <div className="section mb-6">
        <h2 className="section-title">Machine Learning Insights</h2>
        <div className="grid-2">
          {insights.map((insight, idx) => (
            <div key={idx} className="card">
              <div className="flex-between mb-3">
                <h4 className="font-semibold text-white">{insight.title}</h4>
                <span
                  className="badge"
                  style={{
                    background: insight.impact === 'Critical' ? '#ef444420' : insight.impact === 'High' ? '#f9731620' : '#f59e0b20',
                    color: insight.impact === 'Critical' ? '#fca5a5' : insight.impact === 'High' ? '#fed7aa' : '#fcd34d',
                    border: 'none'
                  }}
                >
                  {insight.impact}
                </span>
              </div>
              <p className="text-sm text-slate-300 mb-3">{insight.description}</p>
              <div className="flex items-center gap-2">
                <div className="flex-1 bg-slate-700 rounded h-2">
                  <div
                    className="h-full bg-gradient-to-r from-primary to-secondary rounded"
                    style={{ width: `${insight.confidence}%` }}
                  />
                </div>
                <span className="text-xs font-semibold text-primary">{insight.confidence}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Feature Importance */}
      <div className="section">
        <h2 className="section-title">Model Feature Importance</h2>
        <div className="card">
          <p className="text-sm text-slate-400 mb-4">
            These factors have the most influence on flood risk predictions
          </p>
          <div className="space-y-4">
            {featureImportance.map((feature, idx) => (
              <div key={idx}>
                <div className="flex-between mb-2">
                  <span className="text-sm font-semibold text-slate-300">{feature.name}</span>
                  <span className="text-sm font-bold" style={{ color: feature.color }}>
                    {feature.importance}%
                  </span>
                </div>
                <div className="bg-slate-700/50 rounded-full h-3 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{
                      width: `${feature.importance}%`,
                      background: feature.color
                    }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Total */}
          <div className="mt-4 pt-4 border-t border-slate-700">
            <div className="flex-between">
              <span className="text-sm font-semibold text-slate-300">Total Importance</span>
              <span className="text-sm font-bold text-primary">100%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Model Performance */}
      <div className="section mt-6">
        <h2 className="section-title">Model Performance Metrics</h2>
        <div className="grid-4">
          <div className="card">
            <div className="text-sm text-slate-400 mb-2">Accuracy</div>
            <div className="text-3xl font-bold text-primary">94.2%</div>
            <div className="text-xs text-green-400 mt-1">✓ Excellent</div>
          </div>
          <div className="card">
            <div className="text-sm text-slate-400 mb-2">Precision</div>
            <div className="text-3xl font-bold text-primary">92.8%</div>
            <div className="text-xs text-green-400 mt-1">✓ High</div>
          </div>
          <div className="card">
            <div className="text-sm text-slate-400 mb-2">Recall</div>
            <div className="text-3xl font-bold text-primary">91.5%</div>
            <div className="text-xs text-green-400 mt-1">✓ High</div>
          </div>
          <div className="card">
            <div className="text-sm text-slate-400 mb-2">F1 Score</div>
            <div className="text-3xl font-bold text-primary">92.1%</div>
            <div className="text-xs text-green-400 mt-1">✓ Excellent</div>
          </div>
        </div>
      </div>
    </div>
  );
}
