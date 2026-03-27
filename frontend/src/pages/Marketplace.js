import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ShoppingCart, Star, MapPin, Truck, Clock, Filter, Search } from 'lucide-react';

const Marketplace = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('popular');

  useEffect(() => {
    fetchMarketplaceProducts();
  }, []);

  const fetchMarketplaceProducts = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch('http://localhost:5000/api/marketplace-products', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      setProducts(data);
    } catch (err) {
      console.error('Error fetching products:', err);
      setProducts(mockProducts);
    } finally {
      setLoading(false);
    }
  };

  const mockProducts = [
    {
      id: 1,
      name: 'Emergency Water Purifier Kit',
      category: 'water',
      price: 2499,
      originalPrice: 3499,
      rating: 4.7,
      reviews: 234,
      image: '💧',
      seller: 'SafeWater Solutions',
      location: 'Chennai',
      inStock: true,
      quantity: 150,
      description: 'Portable water purification system for emergency situations',
      features: ['Filters 1000L', 'Portable', 'Long shelf life'],
      delivery: '2-3 days',
      verified: true
    },
    {
      id: 2,
      name: 'First Aid Emergency Kit',
      category: 'medical',
      price: 1899,
      originalPrice: 2499,
      rating: 4.8,
      reviews: 512,
      image: '🏥',
      seller: 'MediCare Plus',
      location: 'Chennai',
      inStock: true,
      quantity: 300,
      description: 'Comprehensive first aid kit with 50+ medical supplies',
      features: ['50+ items', 'WHO certified', 'Waterproof case'],
      delivery: '1-2 days',
      verified: true
    },
    {
      id: 3,
      name: 'Portable LED Emergency Light',
      category: 'lighting',
      price: 599,
      originalPrice: 899,
      rating: 4.6,
      reviews: 189,
      image: '💡',
      seller: 'BrightTech India',
      location: 'Bangalore',
      inStock: true,
      quantity: 500,
      description: '10-hour battery life, 500 lumens brightness',
      features: ['10-hour battery', 'USB rechargeable', 'Waterproof'],
      delivery: '1-2 days',
      verified: true
    },
    {
      id: 4,
      name: 'Disaster Survival Backpack',
      category: 'survival',
      price: 3499,
      originalPrice: 4999,
      rating: 4.9,
      reviews: 421,
      image: '🎒',
      seller: 'SurvivalGear Co',
      location: 'Delhi',
      inStock: true,
      quantity: 80,
      description: 'Complete survival kit with 30+ essential items',
      features: ['30+ items', 'Weather resistant', 'Ergonomic design'],
      delivery: '2-3 days',
      verified: true
    },
    {
      id: 5,
      name: 'Portable Water Tank (50L)',
      category: 'water',
      price: 1299,
      originalPrice: 1799,
      rating: 4.5,
      reviews: 156,
      image: '🛢️',
      seller: 'AquaStore',
      location: 'Chennai',
      inStock: true,
      quantity: 120,
      description: 'Food-grade plastic water storage tank',
      features: ['50L capacity', 'Stackable', 'Durable'],
      delivery: '3-4 days',
      verified: true
    },
    {
      id: 6,
      name: 'Emergency Communication Device',
      category: 'communication',
      price: 4999,
      originalPrice: 6999,
      rating: 4.8,
      reviews: 267,
      image: '📡',
      seller: 'CommTech Solutions',
      location: 'Hyderabad',
      inStock: true,
      quantity: 45,
      description: 'Satellite communicator for disaster zones',
      features: ['Satellite enabled', 'GPS tracking', '72-hour battery'],
      delivery: '2-3 days',
      verified: true
    },
    {
      id: 7,
      name: 'Rescue Rope & Harness Set',
      category: 'rescue',
      price: 2199,
      originalPrice: 3299,
      rating: 4.7,
      reviews: 198,
      image: '🪢',
      seller: 'RescueGear Pro',
      location: 'Mumbai',
      inStock: true,
      quantity: 60,
      description: 'Professional-grade rescue equipment',
      features: ['50m rope', 'Safety harness', 'Carabiners included'],
      delivery: '2-3 days',
      verified: true
    },
    {
      id: 8,
      name: 'Portable Air Purifier',
      category: 'air',
      price: 3999,
      originalPrice: 5499,
      rating: 4.6,
      reviews: 234,
      image: '🌬️',
      seller: 'AirClean Tech',
      location: 'Pune',
      inStock: true,
      quantity: 90,
      description: 'HEPA filter air purifier for emergency shelters',
      features: ['HEPA filter', 'Portable', 'Quiet operation'],
      delivery: '2-3 days',
      verified: true
    },
    {
      id: 9,
      name: 'Emergency Food Rations (30 days)',
      category: 'food',
      price: 2899,
      originalPrice: 3999,
      rating: 4.8,
      reviews: 445,
      image: '🍲',
      seller: 'NutriSafe Foods',
      location: 'Chennai',
      inStock: true,
      quantity: 200,
      description: 'High-calorie emergency food with 5-year shelf life',
      features: ['30-day supply', '5-year shelf life', 'Balanced nutrition'],
      delivery: '1-2 days',
      verified: true
    }
  ];

  const categories = [
    { id: 'all', label: 'All Products', icon: '🛍️' },
    { id: 'water', label: 'Water & Purification', icon: '💧' },
    { id: 'medical', label: 'Medical Supplies', icon: '🏥' },
    { id: 'lighting', label: 'Lighting', icon: '💡' },
    { id: 'survival', label: 'Survival Kits', icon: '🎒' },
    { id: 'communication', label: 'Communication', icon: '📡' },
    { id: 'rescue', label: 'Rescue Equipment', icon: '🪢' },
    { id: 'food', label: 'Emergency Food', icon: '🍲' }
  ];

  const filteredProducts = (selectedCategory === 'all' 
    ? (products.length > 0 ? products : mockProducts)
    : (products.length > 0 ? products : mockProducts).filter(p => p.category === selectedCategory)
  ).filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === 'price-low') return a.price - b.price;
    if (sortBy === 'price-high') return b.price - a.price;
    if (sortBy === 'rating') return b.rating - a.rating;
    return b.reviews - a.reviews;
  });

  const addToCart = (product) => {
    const existing = cart.find(item => item.id === product.id);
    if (existing) {
      setCart(cart.map(item =>
        item.id === product.id
          ? { ...item, cartQty: item.cartQty + 1 }
          : item
      ));
    } else {
      setCart([...cart, { ...product, cartQty: 1 }]);
    }
  };

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

  const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.cartQty), 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <ShoppingCart className="w-8 h-8 text-blue-400" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-cyan-500 bg-clip-text text-transparent">
              Emergency Marketplace
            </h1>
          </div>
          {cart.length > 0 && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-4 py-2 rounded-lg font-semibold"
            >
              Cart: ₹{totalPrice.toLocaleString()}
            </motion.div>
          )}
        </div>
        <p className="text-slate-400 text-lg">
          Essential supplies and equipment for disaster preparedness
        </p>
      </motion.div>

      {/* Search & Filter */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="mb-8 space-y-4"
      >
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-4 top-3 w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
          />
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                selectedCategory === cat.id
                  ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg shadow-blue-500/50'
                  : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
              }`}
            >
              <span className="mr-2">{cat.icon}</span>
              {cat.label}
            </button>
          ))}
        </div>

        {/* Sort Options */}
        <div className="flex items-center gap-4">
          <Filter className="w-5 h-5 text-slate-400" />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500"
          >
            <option value="popular">Most Popular</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="rating">Highest Rated</option>
          </select>
        </div>
      </motion.div>

      {/* Products Grid */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8"
      >
        {sortedProducts.map((product) => (
          <motion.div
            key={product.id}
            variants={itemVariants}
            whileHover={{ y: -8 }}
            className="group relative bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl border border-slate-700 overflow-hidden hover:border-blue-500/50 transition-all shadow-lg hover:shadow-blue-500/20"
          >
            {/* Discount Badge */}
            {product.originalPrice > product.price && (
              <div className="absolute top-4 left-4 z-10 bg-red-500/20 border border-red-500/50 px-3 py-1 rounded-full">
                <span className="text-xs font-bold text-red-400">
                  {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
                </span>
              </div>
            )}

            {/* Verified Badge */}
            {product.verified && (
              <div className="absolute top-4 right-4 z-10 bg-green-500/20 border border-green-500/50 px-3 py-1 rounded-full">
                <span className="text-xs font-bold text-green-400">✓ Verified</span>
              </div>
            )}

            {/* Content */}
            <div className="p-6">
              {/* Product Icon & Name */}
              <div className="mb-4">
                <div className="text-5xl mb-3">{product.image}</div>
                <h3 className="text-lg font-bold text-white mb-2">{product.name}</h3>
                <div className="flex items-center gap-2 text-sm text-slate-400 mb-2">
                  <MapPin className="w-4 h-4" />
                  {product.seller} • {product.location}
                </div>
              </div>

              {/* Description */}
              <p className="text-slate-300 text-sm mb-3">{product.description}</p>

              {/* Features */}
              <div className="mb-4 space-y-1">
                {product.features.map((feature, idx) => (
                  <div key={idx} className="text-xs text-slate-400">
                    ✓ {feature}
                  </div>
                ))}
              </div>

              {/* Rating & Delivery */}
              <div className="grid grid-cols-2 gap-3 mb-4 pb-4 border-b border-slate-700">
                <div>
                  <div className="flex items-center gap-1 mb-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3 h-3 ${
                          i < Math.floor(product.rating)
                            ? 'fill-amber-400 text-amber-400'
                            : 'text-slate-600'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-xs text-slate-400">{product.rating} ({product.reviews})</span>
                </div>
                <div className="flex items-center gap-1 text-xs text-slate-400">
                  <Clock className="w-4 h-4" />
                  {product.delivery}
                </div>
              </div>

              {/* Price */}
              <div className="mb-4">
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold text-blue-400">₹{product.price.toLocaleString()}</span>
                  {product.originalPrice > product.price && (
                    <span className="text-sm text-slate-500 line-through">₹{product.originalPrice.toLocaleString()}</span>
                  )}
                </div>
                <div className="text-xs text-slate-400 mt-1">
                  {product.quantity} in stock
                </div>
              </div>

              {/* Add to Cart Button */}
              <button
                onClick={() => addToCart(product)}
                className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-semibold py-2 rounded-lg transition-all flex items-center justify-center gap-2"
              >
                <ShoppingCart className="w-4 h-4" />
                Add to Cart
              </button>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Empty State */}
      {sortedProducts.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <ShoppingCart className="w-16 h-16 text-slate-600 mx-auto mb-4" />
          <p className="text-slate-400 text-lg">No products found</p>
        </motion.div>
      )}
    </div>
  );
};

export default Marketplace;
