import React, { useState, useEffect } from 'react';
import { Brain, TrendingUp, BarChart3, PieChart, LineChart, AlertTriangle, CheckCircle, Zap, Activity } from 'lucide-react';
import '../theme.css';

export default function MLAnalyticsEngine() {
  const [selectedMetric, setSelectedMetric] = useState('rainfall');
  const [timeRange, setTimeRange] = useState('7d');
  const [analysisType, setAnalysisType] = useState('correlation');
  const [loading, setLoading] = useState(false);

  // Historical data for ML analysis
  const historicalData = [
    { date: '2024-01-01', rainfall: 15, waterLevel: 35, alerts: 2, riskScore: 25 },
    { date: '2024-01-02', rainfall: 22, waterLevel: 42, alerts: 4, riskScore: 35 },
    { date: '2024-01-03', rainfall: 32, waterLevel: 55, alerts: 8, riskScore: 48 },
    { date: '2024-01-04', rainfall: 45, waterLevel: 68, alerts: 12, riskScore: 62 },
    { date: '2024-01-05', rainfall: 38, waterLevel: 72, alerts: 15, riskScore: 68 },
    { date: '2024-01-06', rainfall: 28, waterLevel: 65, alerts: 10, riskScore: 55 },
    { date: '2024-01-07', rainfall: 18, waterLevel: 52, alerts: 6, riskScore: 40 }
  ];

  // ML Insights
  const mlInsights = [
    {
      title: 'Rainfall-Risk Correlation',
      description: 'Strong positive correlation (0.94) between rainfall and flood risk',
      confidence: 96,
      impact: 'Critical',
      recommendation: 'Monitor rainfall intensity as primary risk indicator'
    },
    {
      title: 'Water Level Trend',
      description: 'Water levels rising at 2.3% per hour during peak rainfall',
      confidence: 92,
      impact: 'High',
      recommendation: 'Increase monitoring frequency during rainfall events'
    },
    {
      title: 'Alert Pattern Recognition',
      description: 'Alerts typically spike 2-3 hours after rainfall begins',
      confidence: 89,
      impact: 'High',
      recommendation: 'Prepare emergency response 2 hours before predicted peak'
    },
    {
      title: 'Zone Risk Distribution',
      description: 'Velachery zone shows 3x higher risk than other zones',
      confidence: 94,
      impact: 'Critical',
      recommendation: 'Allocate more resources to Velachery zone'
    }
  ];

  // Anomaly Detection Results
  const anomalies = [
    {
      date: '2024-01-05',
      type: 'Unusual Water Level Spike',
      severity: 'High',
      description: 'Water level increased 15% in 1 hour (expected: 5%)',
      cause: 'Possible drainage blockage',
      action: 'Investigate drainage system'
    },
    {
      date: '2024-01-04',
      type: 'Alert Surge',
      severity: 'Medium',
      description: 'Alerts increased 200% compared to rainfall increase',
      cause: 'Possible sensor malfunction or actual emergency',
      action: 'Verify alert sources'
    }
  ];

  // Feature Importance for Predictions
  const featureImportance = [
    { feature: 'Rainfall Intensity', importance: 32, trend: 'up' },
    { feature: 'Water Level', importance: 28, trend: 'up' },
    { feature: 'Drainage Capacity', importance: 18, trend: 'stable' },
    { feature: 'Elevation', importance: 12, trend: 'stable' },
    { feature: 'Historical Patterns', importance: 10, trend: 'down' }
  ];

  // Predictive Models Performance
  const modelPerformance = [
    { model: 'Random Forest', accuracy: 94.2, precision: 92.8, recall: 91.5, f1: 92.1 },
    { model: 'Gradient Boosting', accuracy: 93.8, precision: 92.1, recall: 90.8, f1: 91.4 },
    { model: 'Neural Network', accuracy: 92.5, precision: 91.2, recall: 89.5, f1: 90.3 },
    { model: 'SVM', accuracy: 91.2, precision: 89.8, recall: 88.2, f1: 89.0 }
  ];

  // Clustering Analysis
  const clusterAnalysis = [
    {
      cluster: 'High Risk Zones',
      zones: ['Velachery', 'Tambaram'],
      characteristics: 'Low elevation, poor drainage, high rainfall',
      avgRisk: 72,
      population: 223000,
      recommendation: 'Priority evacuation zones'
    },
    {
      cluster: 'Moderate Risk Zones',
      zones: ['Guindy'],
      characteristics: 'Medium elevation, moderate drainage',
      avgRisk: 45,
      population: 87000,
      recommendation: 'Standard monitoring'
    },
    {
      cluster: 'Low Risk Zones',
      zones: ['Adyar'],
      characteristics: 'High elevation, good drainage',
      avgRisk: 35,
      population: 76000,
      recommendation: 'Routine monitoring'
    }
  ];

  // Time Series Decomposition
  const timeSeriesComponents = [
    { component: 'Trend', value: 'Increasing', description: 'Overall risk increasing over time' },
    { component: 'Seasonality', value: 'Strong', description: 'Clear seasonal pattern detected' },
    { component: 'Cyclical', value: 'Moderate', description: 'Weather cycles influence risk' },
    { component: 'Noise', value: 'Low', description: 'Data quality is high' }
  ];

  // Correlation Matrix
  const correlationMatrix = [
    { var1: 'Rainfall', var2: 'Water Level', correlation: 0.94, strength: 'Very Strong' },
    { var1: 'Rainfall', var2: 'Risk Score', correlation: 0.91, strength: 'Very Strong' },
    { var1: 'Water Level', var2: 'Risk Score', correlation: 0.88, strength: 'Strong' },
    { var1: 'Rainfall', var2: 'Alerts', correlation: 0.85, strength: 'Strong' },
    { var1: 'Water Level', var2: 'Alerts', correlation: 0.82, strength: 'Strong' }
  ];

  // Predictive Recommendations
  const recommendations = [
    {
      priority: 'Critical',
      action: 'Increase monitoring frequency in Velachery zone',
      reason: 'Historical data shows 3x higher risk',
      expectedImpact: 'Reduce response time by 40%'
    },
    {
      priority: 'High',
      action: 'Pre-position rescue teams 2 hours before rainfall peak',
      reason: 'Alert patterns show 2-3 hour lag',
      expectedImpact: 'Improve rescue efficiency by 35%'
    },
    {
      priority: 'High',
      action: 'Implement real-time drainage monitoring',
      reason: 'Anomalies detected in water level spikes',
      expectedImpact: 'Prevent 25% of drainage-related floods'
    },
    {
      priority: 'Medium',
      action: 'Allocate 60% of resources to high-risk zones',
      reason: 'Clustering analysis shows concentration',
      expectedImpact: 'Optimize resource allocation'
    }
  ];

  return (
    <div className="main-container">
      {/* Header */}
      <div className="page-header mb-6">
        <div className="flex-between">
          <div>
            <h1 className="page-title">ML Analytics Engine</h1>
            <p className="page-subtitle">Advanced machine learning analysis for flood prediction</p>
          </div>
          <div className="flex items-center gap-2 bg-slate-800/50 rounded-lg px-4 py-2 border border-slate-700">
            <Brain className="w-5 h-5 text-primary" />
            <div>
              <div className="text-xs text-slate-400">ML Models</div>
              <div className="text-lg font-bold text-primary">4 Active</div>
            </div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="card mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="form-label">Analysis Type</label>
            <select
              value={analysisType}
              onChange={(e) => setAnalysisType(e.target.value)}
              className="form-control"
            >
              <option value="correlation">Correlation Analysis</option>
              <option value="anomaly">Anomaly Detection</option>
              <option value="clustering">Clustering Analysis</option>
              <option value="timeseries">Time Series</option>
              <option value="features">Feature Importance</option>
            </select>
          </div>
          <div>
            <label className="form-label">Metric</label>
            <select
              value={selectedMetric}
              onChange={(e) => setSelectedMetric(e.target.value)}
              className="form-control"
            >
              <option value="rainfall">Rainfall</option>
              <option value="waterLevel">Water Level</option>
              <option value="alerts">Alerts</option>
              <option value="riskScore">Risk Score</option>
            </select>
          </div>
          <div>
            <label className="form-label">Time Range</label>
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="form-control"
            >
              <option value="24h">Last 24 Hours</option>
              <option value="7d">Last 7 Days</option>
              <option value="30d">Last 30 Days</option>
              <option value="90d">Last 90 Days</option>
            </select>
          </div>
        </div>
      </div>

      {/* ML Insights */}
      <div className="section mb-6">
        <h2 className="section-title">🧠 Machine Learning Insights</h2>
        <div className="grid-2">
          {mlInsights.map((insight, idx) => (
            <div key={idx} className="card">
              <div className="flex-between mb-3">
                <h4 className="font-semibold text-white">{insight.title}</h4>
                <span
                  className="badge"
                  style={{
                    background: insight.impact === 'Critical' ? '#ef444420' : '#f9731620',
                    color: insight.impact === 'Critical' ? '#fca5a5' : '#fed7aa',
                    border: 'none'
                  }}
                >
                  {insight.impact}
                </span>
              </div>
              <p className="text-sm text-slate-300 mb-3">{insight.description}</p>
              <div className="flex items-center gap-2 mb-3">
                <div className="flex-1 bg-slate-700 rounded h-2">
                  <div
                    className="h-full bg-gradient-to-r from-primary to-secondary rounded"
                    style={{ width: `${insight.confidence}%` }}
                  />
                </div>
                <span className="text-xs font-semibold text-primary">{insight.confidence}%</span>
              </div>
              <div className="bg-slate-700/50 rounded p-2">
                <div className="text-xs text-slate-400 mb-1">Recommendation</div>
                <div className="text-sm text-slate-300">{insight.recommendation}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Feature Importance */}
      <div className="section mb-6">
        <h2 className="section-title">📊 Feature Importance Analysis</h2>
        <div className="card">
          <p className="text-sm text-slate-400 mb-4">
            These features have the most influence on flood risk predictions
          </p>
          <div className="space-y-4">
            {featureImportance.map((item, idx) => (
              <div key={idx}>
                <div className="flex-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-slate-300">{item.feature}</span>
                    <span className="text-xs text-slate-500">
                      {item.trend === 'up' ? '📈' : item.trend === 'down' ? '📉' : '➡️'}
                    </span>
                  </div>
                  <span className="text-sm font-bold text-primary">{item.importance}%</span>
                </div>
                <div className="bg-slate-700/50 rounded-full h-3 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-primary to-secondary"
                    style={{ width: `${item.importance}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Model Performance */}
      <div className="section mb-6">
        <h2 className="section-title">🤖 ML Model Performance Comparison</h2>
        <div className="overflow-x-auto">
          <table className="table">
            <thead>
              <tr>
                <th>Model</th>
                <th>Accuracy</th>
                <th>Precision</th>
                <th>Recall</th>
                <th>F1 Score</th>
              </tr>
            </thead>
            <tbody>
              {modelPerformance.map((model, idx) => (
                <tr key={idx}>
                  <td className="font-semibold">{model.model}</td>
                  <td>
                    <div className="flex items-center gap-2">
                      <div className="w-16 bg-slate-700 rounded h-2">
                        <div
                          className="h-full bg-primary rounded"
                          style={{ width: `${model.accuracy}%` }}
                        />
                      </div>
                      <span className="text-sm font-semibold">{model.accuracy}%</span>
                    </div>
                  </td>
                  <td>
                    <span className="text-sm font-semibold text-slate-300">{model.precision}%</span>
                  </td>
                  <td>
                    <span className="text-sm font-semibold text-slate-300">{model.recall}%</span>
                  </td>
                  <td>
                    <span className="text-sm font-semibold text-primary">{model.f1}%</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Correlation Analysis */}
      <div className="section mb-6">
        <h2 className="section-title">🔗 Correlation Matrix Analysis</h2>
        <div className="grid-2">
          {correlationMatrix.map((item, idx) => (
            <div key={idx} className="card">
              <div className="flex-between mb-3">
                <h4 className="font-semibold text-white">
                  {item.var1} ↔ {item.var2}
                </h4>
                <span className="badge badge-primary">{item.strength}</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex-1">
                  <div className="flex-between mb-1">
                    <span className="text-xs text-slate-400">Correlation</span>
                    <span className="text-sm font-bold text-primary">{item.correlation}</span>
                  </div>
                  <div className="bg-slate-700 rounded h-2">
                    <div
                      className="h-full bg-gradient-to-r from-primary to-secondary rounded"
                      style={{ width: `${item.correlation * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Anomaly Detection */}
      <div className="section mb-6">
        <h2 className="section-title">⚠️ Anomaly Detection Results</h2>
        <div className="space-y-3">
          {anomalies.map((anomaly, idx) => (
            <div key={idx} className="card border-l-4 border-warning">
              <div className="flex-between mb-2">
                <h4 className="font-semibold text-white">{anomaly.type}</h4>
                <span
                  className="badge"
                  style={{
                    background: anomaly.severity === 'High' ? '#ef444420' : '#f9731620',
                    color: anomaly.severity === 'High' ? '#fca5a5' : '#fed7aa',
                    border: 'none'
                  }}
                >
                  {anomaly.severity}
                </span>
              </div>
              <p className="text-sm text-slate-300 mb-2">{anomaly.description}</p>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-slate-400">Date:</span>
                  <span className="text-slate-300 ml-2">{anomaly.date}</span>
                </div>
                <div>
                  <span className="text-slate-400">Cause:</span>
                  <span className="text-slate-300 ml-2">{anomaly.cause}</span>
                </div>
              </div>
              <div className="mt-2 bg-slate-700/50 rounded p-2">
                <div className="text-xs text-slate-400 mb-1">Recommended Action</div>
                <div className="text-sm text-slate-300">{anomaly.action}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Clustering Analysis */}
      <div className="section mb-6">
        <h2 className="section-title">🎯 Zone Clustering Analysis</h2>
        <div className="grid-2">
          {clusterAnalysis.map((cluster, idx) => (
            <div key={idx} className="card">
              <h4 className="font-semibold text-white mb-3">{cluster.cluster}</h4>
              <div className="space-y-2 mb-3">
                <div>
                  <div className="text-xs text-slate-400 mb-1">Zones</div>
                  <div className="flex flex-wrap gap-1">
                    {cluster.zones.map((zone, zidx) => (
                      <span key={zidx} className="badge badge-info text-xs">
                        {zone}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-slate-400 mb-1">Characteristics</div>
                  <div className="text-sm text-slate-300">{cluster.characteristics}</div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <div className="text-xs text-slate-400">Avg Risk</div>
                    <div className="text-lg font-bold text-primary">{cluster.avgRisk}</div>
                  </div>
                  <div>
                    <div className="text-xs text-slate-400">Population</div>
                    <div className="text-lg font-bold text-orange-400">
                      {(cluster.population / 1000).toFixed(0)}K
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-slate-700/50 rounded p-2">
                <div className="text-xs text-slate-400 mb-1">Recommendation</div>
                <div className="text-sm text-slate-300">{cluster.recommendation}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Time Series Decomposition */}
      <div className="section mb-6">
        <h2 className="section-title">📈 Time Series Decomposition</h2>
        <div className="grid-2">
          {timeSeriesComponents.map((component, idx) => (
            <div key={idx} className="card">
              <h4 className="font-semibold text-white mb-2">{component.component}</h4>
              <div className="mb-3">
                <span className="badge badge-primary">{component.value}</span>
              </div>
              <p className="text-sm text-slate-300">{component.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Predictive Recommendations */}
      <div className="section">
        <h2 className="section-title">💡 ML-Based Recommendations</h2>
        <div className="space-y-3">
          {recommendations.map((rec, idx) => (
            <div key={idx} className="card">
              <div className="flex-between mb-3">
                <h4 className="font-semibold text-white">{rec.action}</h4>
                <span
                  className="badge"
                  style={{
                    background: rec.priority === 'Critical' ? '#ef444420' : '#f9731620',
                    color: rec.priority === 'Critical' ? '#fca5a5' : '#fed7aa',
                    border: 'none'
                  }}
                >
                  {rec.priority}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-3 mb-3">
                <div>
                  <div className="text-xs text-slate-400 mb-1">Reason</div>
                  <div className="text-sm text-slate-300">{rec.reason}</div>
                </div>
                <div>
                  <div className="text-xs text-slate-400 mb-1">Expected Impact</div>
                  <div className="text-sm text-green-400 font-semibold">{rec.expectedImpact}</div>
                </div>
              </div>
              <div className="bg-slate-700/50 rounded p-2 flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
                <span className="text-xs text-slate-300">Ready to implement</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ML Statistics */}
      <div className="section mt-6">
        <h2 className="section-title">📊 ML System Statistics</h2>
        <div className="grid-4">
          <div className="card">
            <div className="text-sm text-slate-400 mb-2">Data Points Analyzed</div>
            <div className="text-3xl font-bold text-primary">2,847</div>
            <div className="text-xs text-slate-500 mt-1">Last 90 days</div>
          </div>
          <div className="card">
            <div className="text-sm text-slate-400 mb-2">Patterns Detected</div>
            <div className="text-3xl font-bold text-primary">24</div>
            <div className="text-xs text-slate-500 mt-1">Unique patterns</div>
          </div>
          <div className="card">
            <div className="text-sm text-slate-400 mb-2">Anomalies Found</div>
            <div className="text-3xl font-bold text-warning">8</div>
            <div className="text-xs text-slate-500 mt-1">Investigated</div>
          </div>
          <div className="card">
            <div className="text-sm text-slate-400 mb-2">Model Accuracy</div>
            <div className="text-3xl font-bold text-success">94.2%</div>
            <div className="text-xs text-slate-500 mt-1">Best model</div>
          </div>
        </div>
      </div>
    </div>
  );
}
