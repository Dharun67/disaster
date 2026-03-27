import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, AlertTriangle, CheckCircle, Clock, Zap, Activity, BarChart3, PieChart, LineChart } from 'lucide-react';
import '../theme.css';

export default function AdvancedAnalytics() {
  const [timeRange, setTimeRange] = useState('24h');
  const [selectedMetric, setSelectedMetric] = useState('all');
  const [loading, setLoading] = useState(false);

  // Real-time metrics
  const metrics = {
    activeAlerts: 24,
    activeAlertsChange: 12,
    affectedPopulation: 450000,
    affectedPopulationChange: -8,
    evacuated: 125000,
    evacuatedChange: 15,
    shelterCapacity: 85,
    shelterCapacityChange: 5,
    responseTime: 4.2,
    responseTimeChange: -2,
    teamDeployed: 18,
    teamDeployedChange: 3
  };

  // Zone statistics
  const zoneStats = [
    { name: 'Velachery', risk: 78, population: 125000, alerts: 12, status: 'Critical' },
    { name: 'Tambaram', risk: 62, population: 98000, alerts: 8, status: 'High' },
    { name: 'Guindy', risk: 45, population: 87000, alerts: 4, status: 'Moderate' },
    { name: 'Adyar', risk: 35, population: 76000, alerts: 1, status: 'Low' }
  ];

  // Hourly trend data
  const hourlyTrend = [
    { hour: '00:00', alerts: 5, waterLevel: 35, rainfall: 2 },
    { hour: '04:00', alerts: 8, waterLevel: 42, rainfall: 5 },
    { hour: '08:00', alerts: 12, waterLevel: 55, rainfall: 15 },
    { hour: '12:00', alerts: 18, waterLevel: 68, rainfall: 28 },
    { hour: '16:00', alerts: 24, waterLevel: 75, rainfall: 35 },
    { hour: '20:00', alerts: 20, waterLevel: 72, rainfall: 32 },
    { hour: '24:00', alerts: 15, waterLevel: 65, rainfall: 20 }
  ];

  // Predictions
  const predictions = [
    { time: 'Next 2 hours', riskChange: '+15%', confidence: 92, action: 'Increase alert level' },
    { time: 'Next 6 hours', riskChange: '+8%', confidence: 85, action: 'Prepare evacuation' },
    { time: 'Next 12 hours', riskChange: '-5%', confidence: 78, action: 'Monitor situation' },
    { time: 'Next 24 hours', riskChange: '-20%', confidence: 72, action: 'Begin recovery' }
  ];

  const MetricCard = ({ icon: Icon, label, value, change, unit, trend }) => (
    <div className="card">
      <div className="flex-between mb-3">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-primary/20 rounded-lg">
            <Icon className="w-5 h-5 text-primary" />
          </div>
          <span className="text-sm text-slate-400">{label}</span>
        </div>
        <div className={`flex items-center gap-1 text-sm font-semibold ${trend > 0 ? 'text-red-400' : 'text-green-400'}`}>
          {trend > 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
          {Math.abs(change)}%
        </div>
      </div>
      <div className="text-3xl font-bold text-white mb-1">
        {value.toLocaleString()}
        <span className="text-sm text-slate-400 ml-1">{unit}</span>
      </div>
      <div className="text-xs text-slate-500">
        {trend > 0 ? '↑' : '↓'} {Math.abs(change)}% from previous period
      </div>
    </div>
  );

  return (
    <div className="main-container">
      {/* Header */}
      <div className="page-header mb-6">
        <div className="flex-between">
          <div>
            <h1 className="page-title">Advanced Analytics Dashboard</h1>
            <p className="page-subtitle">Real-time metrics and predictive insights</p>
          </div>
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="form-control w-40"
          >
            <option value="1h">Last 1 Hour</option>
            <option value="6h">Last 6 Hours</option>
            <option value="24h">Last 24 Hours</option>
            <option value="7d">Last 7 Days</option>
          </select>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid-3 mb-6">
        <MetricCard
          icon={AlertTriangle}
          label="Active Alerts"
          value={metrics.activeAlerts}
          change={metrics.activeAlertsChange}
          unit="alerts"
          trend={1}
        />
        <MetricCard
          icon={Activity}
          label="Affected Population"
          value={metrics.affectedPopulation}
          change={metrics.affectedPopulationChange}
          unit="people"
          trend={-1}
        />
        <MetricCard
          icon={CheckCircle}
          label="Evacuated"
          value={metrics.evacuated}
          change={metrics.evacuatedChange}
          unit="people"
          trend={1}
        />
        <MetricCard
          icon={Zap}
          label="Shelter Occupancy"
          value={metrics.shelterCapacity}
          change={metrics.shelterCapacityChange}
          unit="%"
          trend={1}
        />
        <MetricCard
          icon={Clock}
          label="Avg Response Time"
          value={metrics.responseTime}
          change={metrics.responseTimeChange}
          unit="min"
          trend={-1}
        />
        <MetricCard
          icon={TrendingUp}
          label="Teams Deployed"
          value={metrics.teamDeployed}
          change={metrics.teamDeployedChange}
          unit="teams"
          trend={1}
        />
      </div>

      {/* Charts Section */}
      <div className="grid-2 mb-6">
        {/* Trend Chart */}
        <div className="card">
          <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
            <LineChart className="w-5 h-5 text-primary" />
            24-Hour Trend
          </h3>
          <div className="space-y-4">
            {/* Alerts Trend */}
            <div>
              <div className="flex-between mb-2">
                <span className="text-sm text-slate-400">Active Alerts</span>
                <span className="text-sm font-semibold text-primary">24</span>
              </div>
              <div className="flex gap-1 h-12 items-end">
                {hourlyTrend.map((data, idx) => (
                  <div
                    key={idx}
                    className="flex-1 bg-gradient-to-t from-primary to-primary/50 rounded-t transition-all hover:opacity-80"
                    style={{ height: `${(data.alerts / 24) * 100}%` }}
                    title={`${data.hour}: ${data.alerts} alerts`}
                  />
                ))}
              </div>
            </div>

            {/* Water Level Trend */}
            <div>
              <div className="flex-between mb-2">
                <span className="text-sm text-slate-400">Water Level</span>
                <span className="text-sm font-semibold text-blue-400">75%</span>
              </div>
              <div className="flex gap-1 h-12 items-end">
                {hourlyTrend.map((data, idx) => (
                  <div
                    key={idx}
                    className="flex-1 bg-gradient-to-t from-blue-500 to-blue-500/50 rounded-t transition-all hover:opacity-80"
                    style={{ height: `${(data.waterLevel / 75) * 100}%` }}
                    title={`${data.hour}: ${data.waterLevel}%`}
                  />
                ))}
              </div>
            </div>

            {/* Rainfall Trend */}
            <div>
              <div className="flex-between mb-2">
                <span className="text-sm text-slate-400">Rainfall</span>
                <span className="text-sm font-semibold text-cyan-400">35mm</span>
              </div>
              <div className="flex gap-1 h-12 items-end">
                {hourlyTrend.map((data, idx) => (
                  <div
                    key={idx}
                    className="flex-1 bg-gradient-to-t from-cyan-500 to-cyan-500/50 rounded-t transition-all hover:opacity-80"
                    style={{ height: `${(data.rainfall / 35) * 100}%` }}
                    title={`${data.hour}: ${data.rainfall}mm`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Risk Distribution */}
        <div className="card">
          <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
            <PieChart className="w-5 h-5 text-primary" />
            Risk Distribution
          </h3>
          <div className="space-y-3">
            {[
              { label: 'Critical', value: 25, color: '#ef4444' },
              { label: 'High', value: 35, color: '#f97316' },
              { label: 'Moderate', value: 25, color: '#f59e0b' },
              { label: 'Low', value: 15, color: '#10b981' }
            ].map((item) => (
              <div key={item.label}>
                <div className="flex-between mb-1">
                  <span className="text-sm text-slate-400">{item.label}</span>
                  <span className="text-sm font-semibold" style={{ color: item.color }}>
                    {item.value}%
                  </span>
                </div>
                <div className="bg-slate-700/50 rounded-full h-2 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{ width: `${item.value}%`, background: item.color }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Zone Statistics */}
      <div className="card mb-6">
        <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-primary" />
          Zone-wise Statistics
        </h3>
        <div className="overflow-x-auto">
          <table className="table">
            <thead>
              <tr>
                <th>Zone Name</th>
                <th>Risk Score</th>
                <th>Population</th>
                <th>Active Alerts</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {zoneStats.map((zone, idx) => (
                <tr key={idx}>
                  <td className="font-semibold">{zone.name}</td>
                  <td>
                    <div className="flex items-center gap-2">
                      <div className="w-16 bg-slate-700 rounded h-2">
                        <div
                          className="h-full rounded transition-all"
                          style={{
                            width: `${zone.risk}%`,
                            background: zone.risk > 75 ? '#ef4444' : zone.risk > 55 ? '#f97316' : zone.risk > 30 ? '#f59e0b' : '#10b981'
                          }}
                        />
                      </div>
                      <span className="text-sm font-semibold">{zone.risk}</span>
                    </div>
                  </td>
                  <td>{(zone.population / 1000).toFixed(0)}K</td>
                  <td>
                    <span className="badge badge-danger">{zone.alerts}</span>
                  </td>
                  <td>
                    <span
                      className="badge"
                      style={{
                        background: zone.risk > 75 ? '#ef444420' : zone.risk > 55 ? '#f9731620' : zone.risk > 30 ? '#f59e0b20' : '#10b98120',
                        color: zone.risk > 75 ? '#fca5a5' : zone.risk > 55 ? '#fed7aa' : zone.risk > 30 ? '#fcd34d' : '#86efac',
                        border: 'none'
                      }}
                    >
                      {zone.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Predictions */}
      <div className="section">
        <h2 className="section-title">AI-Powered Predictions</h2>
        <div className="grid-2">
          {predictions.map((pred, idx) => (
            <div key={idx} className="card">
              <div className="flex-between mb-3">
                <h4 className="font-semibold text-white">{pred.time}</h4>
                <div className="flex items-center gap-2">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                    <span className="text-sm font-bold text-white">{pred.confidence}%</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <div>
                  <div className="text-sm text-slate-400 mb-1">Risk Change</div>
                  <div className={`text-2xl font-bold ${pred.riskChange.startsWith('+') ? 'text-red-400' : 'text-green-400'}`}>
                    {pred.riskChange}
                  </div>
                </div>

                <div className="bg-slate-700/50 rounded p-2">
                  <div className="text-xs text-slate-400 mb-1">Recommended Action</div>
                  <div className="text-sm text-slate-300">{pred.action}</div>
                </div>

                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <div className="w-2 h-2 rounded-full bg-primary"></div>
                  Confidence: {pred.confidence}%
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="section mt-6">
        <h2 className="section-title">System Performance</h2>
        <div className="grid-4">
          <div className="card">
            <div className="text-sm text-slate-400 mb-2">API Response Time</div>
            <div className="text-2xl font-bold text-primary">145ms</div>
            <div className="text-xs text-green-400 mt-1">✓ Optimal</div>
          </div>
          <div className="card">
            <div className="text-sm text-slate-400 mb-2">Data Accuracy</div>
            <div className="text-2xl font-bold text-primary">98.5%</div>
            <div className="text-xs text-green-400 mt-1">✓ Excellent</div>
          </div>
          <div className="card">
            <div className="text-sm text-slate-400 mb-2">System Uptime</div>
            <div className="text-2xl font-bold text-primary">99.9%</div>
            <div className="text-xs text-green-400 mt-1">✓ Reliable</div>
          </div>
          <div className="card">
            <div className="text-sm text-slate-400 mb-2">Alert Delivery</div>
            <div className="text-2xl font-bold text-primary">2.1s</div>
            <div className="text-xs text-green-400 mt-1">✓ Fast</div>
          </div>
        </div>
      </div>
    </div>
  );
}
