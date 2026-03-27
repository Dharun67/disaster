import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Star, MapPin, Users, TrendingUp, Award, Shield } from 'lucide-react';

const Featured = () => {
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    fetchFeaturedResources();
  }, []);

  const fetchFeaturedResources = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch('http://localhost:5000/api/featured-resources', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      setFeatured(data);
    } catch (err) {
      console.error('Error fetching featured resources:', err);
      setFeatured(mockFeaturedData);
    } finally {
      setLoading(false);
    }
  };

  const mockFeaturedData = [
    {
      id: 1,
      name: 'Chennai Flood Prevention Initiative',
      category: 'organization',
      rating: 4.8,
      reviews: 342,
      location: 'Chennai, Tamil Nadu',
      description: 'Leading disaster preparedness organization with 15+ years of experience',
      impact: '50,000+ lives protected',
      members: 1200,
      verified: true,
      image: '🏢',
      tags: ['Flood Prevention', 'Training', 'Community']
    },
    {
      id: 2,
      name: 'Emergency Response Team Alpha',
      category: 'team',
      rating: 4.9,
      reviews: 287,
      location: 'Velachery, Chennai',
      description: 'Rapid response team with advanced rescue equipment',
      impact: '2,500+ rescues completed',
      members: 45,
      verified: true,
      image: '🚁',
      tags: ['Rescue', 'Medical', 'Equipment']
    },
    {
      id: 3,
      name: 'Water Management Solutions Ltd',
      category: 'service',
      rating: 4.7,
      reviews: 156,
      location: 'Guindy, Chennai',
      description: 'Advanced drainage and water level monitoring systems',
      impact: '30+ installations',
      members: 85,
      verified: true,
      image: '💧',
      tags: ['Technology', 'Monitoring', 'Infrastructure']
    },
    {
      id: 4,
      name: 'Community Shelter Network',
      category: 'shelter',
      rating: 4.6,
      reviews: 198,
      location: 'Multiple locations',
      description: 'Network of 25 verified shelters with 5,000+ capacity',
      impact: '5,000+ capacity',
      members: 320,
      verified: true,
      image: '🏛️',
      tags: ['Shelter', 'Relief', 'Community']
    },
    {
      id: 5,
      name: 'Medical Emergency Coordination',
      category: 'medical',
      rating: 4.8,
      reviews: 412,
      location: 'Across Chennai',
      description: 'Coordinated medical response during disasters',
      impact: '15 hospitals connected',
      members: 200,
      verified: true,
      image: '🏥',
      tags: ['Medical', 'Hospitals', 'Emergency']
    },
    {
      id: 6,
      name: 'Disaster Risk Reduction Academy',
      category: 'training',
      rating: 4.9,
      reviews: 523,
      location: 'Online & Offline',
      description: 'Certified training programs for disaster management',
      impact: '10,000+ trained',
      members: 450,
      verified: true,
      image: '📚',
      tags: ['Training', 'Certification', 'Education']
    }
  ];

  const categories = [
    { id: 'all', label: 'All Resources', icon: '🌐' },
    { id: 'organization', label: 'Organizations', icon: '🏢' },
    { id: 'team', label: 'Rescue Teams', icon: '🚁' },
    { id: 'service', label: 'Services', icon: '💧' },
    { id: 'shelter', label: 'Shelters', icon: '🏛️' },
    { id: 'medical', label: 'Medical', icon: '🏥' },
    { id: 'training', label: 'Training', icon: '📚' }
  ];

  const filteredFeatured = selectedCategory === 'all' 
    ? featured.length > 0 ? featured : mockFeaturedData
    : (featured.length > 0 ? featured : mockFeaturedData).filter(item => item.category === selectedCategory);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-12"
      >
        <div className="flex items-center gap-3 mb-4">
          <Award className="w-8 h-8 text-amber-400" />
          <h1 className="text-4xl font-bold bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">
            Featured Resources
          </h1>
        </div>
        <p className="text-slate-400 text-lg">
          Discover top-rated disaster prevention organizations, rescue teams, and services
        </p>
      </motion.div>

      {/* Category Filter */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="mb-8 flex flex-wrap gap-3"
      >
        {categories.map(cat => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              selectedCategory === cat.id
                ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg shadow-amber-500/50'
                : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
            }`}
          >
            <span className="mr-2">{cat.icon}</span>
            {cat.label}
          </button>
        ))}
      </motion.div>

      {/* Featured Grid */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {filteredFeatured.map((item, idx) => (
          <motion.div
            key={item.id}
            variants={itemVariants}
            whileHover={{ y: -8 }}
            className="group relative bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl border border-slate-700 overflow-hidden hover:border-amber-500/50 transition-all shadow-lg hover:shadow-amber-500/20"
          >
            {/* Verified Badge */}
            {item.verified && (
              <div className="absolute top-4 right-4 z-10 flex items-center gap-1 bg-green-500/20 border border-green-500/50 px-3 py-1 rounded-full">
                <Shield className="w-4 h-4 text-green-400" />
                <span className="text-xs font-semibold text-green-400">Verified</span>
              </div>
            )}

            {/* Content */}
            <div className="p-6">
              {/* Icon & Title */}
              <div className="flex items-start gap-4 mb-4">
                <div className="text-5xl">{item.image}</div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-white mb-1">{item.name}</h3>
                  <div className="flex items-center gap-2 text-sm text-slate-400">
                    <MapPin className="w-4 h-4" />
                    {item.location}
                  </div>
                </div>
              </div>

              {/* Description */}
              <p className="text-slate-300 text-sm mb-4">{item.description}</p>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="bg-slate-700/50 rounded-lg p-3">
                  <div className="text-xs text-slate-400 mb-1">Impact</div>
                  <div className="text-sm font-bold text-amber-400">{item.impact}</div>
                </div>
                <div className="bg-slate-700/50 rounded-lg p-3">
                  <div className="text-xs text-slate-400 mb-1">Members</div>
                  <div className="text-sm font-bold text-blue-400 flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    {item.members}
                  </div>
                </div>
              </div>

              {/* Rating */}
              <div className="flex items-center gap-2 mb-4 pb-4 border-b border-slate-700">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < Math.floor(item.rating)
                          ? 'fill-amber-400 text-amber-400'
                          : 'text-slate-600'
                      }`}
                    />
                  ))}
                </div>
                <span className="font-bold text-white">{item.rating}</span>
                <span className="text-xs text-slate-400">({item.reviews} reviews)</span>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-4">
                {item.tags.map(tag => (
                  <span
                    key={tag}
                    className="text-xs bg-slate-700/50 text-slate-300 px-2 py-1 rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* Action Button */}
              <button className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-semibold py-2 rounded-lg transition-all">
                View Details
              </button>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Empty State */}
      {filteredFeatured.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <TrendingUp className="w-16 h-16 text-slate-600 mx-auto mb-4" />
          <p className="text-slate-400 text-lg">No resources found in this category</p>
        </motion.div>
      )}
    </div>
  );
};

export default Featured;
