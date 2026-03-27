// Post-Disaster Management Module - Frontend Component

import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import api from '../services/api';

const PostDisasterManagementModule = () => {
  const [activeTab, setActiveTab] = useState('damage');
  const [damageAssessments, setDamageAssessments] = useState([]);
  const [missingPersons, setMissingPersons] = useState([]);
  const [resources, setResources] = useState([]);
  const [volunteers, setVolunteers] = useState([]);
  const [shelters, setShelters] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      setLoading(true);
      const [damageRes, missingRes, resourceRes, volunteerRes, shelterRes] = await Promise.all([
        api.get('/api/post-disaster/damage/reports'),
        api.get('/api/post-disaster/missing-persons'),
        api.get('/api/post-disaster/resources'),
        api.get('/api/post-disaster/volunteers'),
        api.get('/api/post-disaster/shelters')
      ]);

      setDamageAssessments(damageRes.data.assessments || []);
      setMissingPersons(missingRes.data.missingPersons || []);
      setResources(resourceRes.data.resources || []);
      setVolunteers(volunteerRes.data.volunteers || []);
      setShelters(shelterRes.data.shelters || []);
    } catch (err) {
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  const getDamageColor = (percentage) => {
    if (percentage < 20) return 'bg-green-100 border-green-500';
    if (percentage < 40) return 'bg-yellow-100 border-yellow-500';
    if (percentage < 60) return 'bg-orange-100 border-orange-500';
    if (percentage < 80) return 'bg-red-100 border-red-500';
    return 'bg-red-900 border-red-900';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">🔧 Post-Disaster Management Module</h1>
          <p className="text-slate-400">Recovery, Relief & Reconstruction Operations</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-6 border-b border-slate-700 overflow-x-auto">
          {[
            { id: 'damage', label: '📊 Damage Assessment', icon: '📊' },
            { id: 'missing', label: '👤 Missing Persons', icon: '👤' },
            { id: 'resources', label: '📦 Resources', icon: '📦' },
            { id: 'volunteers', label: '👥 Volunteers', icon: '👥' },
            { id: 'shelters', label: '🏛️ Shelters', icon: '🏛️' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 font-semibold whitespace-nowrap ${
                activeTab === tab.id
                  ? 'text-blue-400 border-b-2 border-blue-400'
                  : 'text-slate-400 hover:text-slate-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Damage Assessment Tab */}
        {activeTab === 'damage' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white mb-4">Damage Assessment Reports</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {damageAssessments.map((assessment) => (
                <div key={assessment.id} className={`rounded-lg p-4 border-2 ${getDamageColor(assessment.assessment.damagePercentage)}`}>
                  <h3 className="text-lg font-bold mb-2">{assessment.location.area}</h3>
                  <div className="space-y-2 text-sm">
                    <div>Damage: {assessment.assessment.damagePercentage.toFixed(1)}%</div>
                    <div>Level: {assessment.assessment.damageLevel}</div>
                    <div>Area: {assessment.assessment.affectedArea.toFixed(2)} km²</div>
                    <div>Buildings: {assessment.assessment.buildingCount}</div>
                    <div>Confidence: {assessment.assessment.confidence.toFixed(1)}%</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Missing Persons Tab */}
        {activeTab === 'missing' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white mb-4">Missing Persons Database ({missingPersons.length})</h2>
            <div className="space-y-4">
              {missingPersons.map((person) => (
                <div key={person.id} className="bg-slate-800 rounded-lg p-4 border border-slate-700">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="text-lg font-bold text-white">{person.personalInfo.name}</h3>
                      <p className="text-slate-400 text-sm">{person.personalInfo.age} years old</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                      person.status === 'missing' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                    }`}>
                      {person.status.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-slate-300 mb-2">{person.personalInfo.description}</p>
                  <div className="grid grid-cols-2 gap-2 text-sm text-slate-400">
                    <div>📍 Last seen: {person.lastSeen.location}</div>
                    <div>⏰ Time: {new Date(person.lastSeen.time).toLocaleString()}</div>
                  </div>
                  {person.matches.length > 0 && (
                    <div className="mt-3 p-2 bg-blue-900 rounded text-sm text-blue-300">
                      ✓ {person.matches.length} potential match(es) found
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Resources Tab */}
        {activeTab === 'resources' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white mb-4">Relief Resources ({resources.length})</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
                <p className="text-slate-400 text-sm">Total Items</p>
                <p className="text-3xl font-bold text-blue-400">{resources.length}</p>
              </div>
              <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
                <p className="text-slate-400 text-sm">Total Quantity</p>
                <p className="text-3xl font-bold text-green-400">
                  {resources.reduce((sum, r) => sum + r.itemInfo.quantity, 0)}
                </p>
              </div>
              <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
                <p className="text-slate-400 text-sm">Available</p>
                <p className="text-3xl font-bold text-yellow-400">
                  {resources.filter(r => r.status === 'available').length}
                </p>
              </div>
              <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
                <p className="text-slate-400 text-sm">Distributed</p>
                <p className="text-3xl font-bold text-orange-400">
                  {resources.reduce((sum, r) => sum + r.distribution.length, 0)}
                </p>
              </div>
            </div>
            <div className="space-y-4">
              {resources.slice(0, 5).map((resource) => (
                <div key={resource.id} className="bg-slate-800 rounded-lg p-4 border border-slate-700">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-bold text-white">{resource.itemInfo.name}</h3>
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                      resource.status === 'available' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {resource.status.toUpperCase()}
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-sm text-slate-400">
                    <div>Category: {resource.itemInfo.category}</div>
                    <div>Quantity: {resource.itemInfo.quantity}</div>
                    <div>Location: {resource.location.warehouse}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Volunteers Tab */}
        {activeTab === 'volunteers' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white mb-4">Volunteer Management ({volunteers.length})</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
                <p className="text-slate-400 text-sm">Total Volunteers</p>
                <p className="text-3xl font-bold text-blue-400">{volunteers.length}</p>
              </div>
              <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
                <p className="text-slate-400 text-sm">Active</p>
                <p className="text-3xl font-bold text-green-400">
                  {volunteers.filter(v => v.status === 'active').length}
                </p>
              </div>
              <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
                <p className="text-slate-400 text-sm">Total Hours</p>
                <p className="text-3xl font-bold text-yellow-400">
                  {volunteers.reduce((sum, v) => sum + v.performance.hoursWorked, 0)}
                </p>
              </div>
              <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
                <p className="text-slate-400 text-sm">Tasks Completed</p>
                <p className="text-3xl font-bold text-orange-400">
                  {volunteers.reduce((sum, v) => sum + v.performance.tasksCompleted, 0)}
                </p>
              </div>
            </div>
            <div className="space-y-4">
              {volunteers.slice(0, 5).map((volunteer) => (
                <div key={volunteer.id} className="bg-slate-800 rounded-lg p-4 border border-slate-700">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-bold text-white">{volunteer.personalInfo.name}</h3>
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                      volunteer.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {volunteer.status.toUpperCase()}
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-sm text-slate-400 mb-2">
                    <div>📞 {volunteer.personalInfo.phone}</div>
                    <div>⏱️ {volunteer.performance.hoursWorked} hours</div>
                    <div>✓ {volunteer.performance.tasksCompleted} tasks</div>
                  </div>
                  {volunteer.skills.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {volunteer.skills.map((skill, idx) => (
                        <span key={idx} className="bg-slate-700 text-slate-300 text-xs px-2 py-1 rounded">
                          {skill}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Shelters Tab */}
        {activeTab === 'shelters' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white mb-4">Shelter Management ({shelters.length})</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
                <p className="text-slate-400 text-sm">Total Shelters</p>
                <p className="text-3xl font-bold text-blue-400">{shelters.length}</p>
              </div>
              <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
                <p className="text-slate-400 text-sm">Total Capacity</p>
                <p className="text-3xl font-bold text-green-400">
                  {shelters.reduce((sum, s) => sum + s.capacity.total, 0)}
                </p>
              </div>
              <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
                <p className="text-slate-400 text-sm">Current Occupancy</p>
                <p className="text-3xl font-bold text-yellow-400">
                  {shelters.reduce((sum, s) => sum + s.capacity.current, 0)}
                </p>
              </div>
              <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
                <p className="text-slate-400 text-sm">Occupancy %</p>
                <p className="text-3xl font-bold text-orange-400">
                  {(shelters.reduce((sum, s) => sum + s.capacity.current, 0) / 
                    shelters.reduce((sum, s) => sum + s.capacity.total, 0) * 100).toFixed(0)}%
                </p>
              </div>
            </div>
            <div className="space-y-4">
              {shelters.map((shelter) => (
                <div key={shelter.basicInfo.name} className="bg-slate-800 rounded-lg p-4 border border-slate-700">
                  <h3 className="text-lg font-bold text-white mb-2">{shelter.basicInfo.name}</h3>
                  <div className="grid grid-cols-2 gap-2 text-sm text-slate-400 mb-3">
                    <div>📍 {shelter.basicInfo.address}</div>
                    <div>📞 {shelter.staff.contact}</div>
                    <div>👥 Capacity: {shelter.capacity.total}</div>
                    <div>👤 Current: {shelter.capacity.current}</div>
                  </div>
                  <div className="w-full bg-slate-700 rounded-full h-2 mb-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{ width: `${(shelter.capacity.current / shelter.capacity.total) * 100}%` }}
                    />
                  </div>
                  <p className="text-xs text-slate-400">
                    {((shelter.capacity.current / shelter.capacity.total) * 100).toFixed(0)}% Occupied
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PostDisasterManagementModule;
