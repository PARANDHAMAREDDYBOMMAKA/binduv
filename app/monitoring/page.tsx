"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import {
  TrendingUp,
  BarChart3,
  Search,
  ArrowUpRight,
  ArrowDownRight,
  Eye,
  Star,
  Building,
  Activity,
  RefreshCw,
  Share2,
  Bookmark,
  TrendingDown,
  DollarSign,
  Calendar,
  Users,
  Zap,
  Target,
  Award,
  LineChart,
  PieChart
} from "lucide-react"
import type { IPOPerformance } from "../../types"
import { usePerformanceOptimization } from '../../utils/PerformanceManager'

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger)
}

const MonitoringPage = () => {
  const [selectedFilter, setSelectedFilter] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState("gainPercent")
  const [, setSelectedIPO] = useState<IPOPerformance | null>(null)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const containerRef = useRef(null)
  const heroRef = useRef(null)
  const { prefersReducedMotion, getAnimationDuration } = usePerformanceOptimization()

  const filters = [
    { id: "all", label: "All IPOs", count: 15, icon: Building, color: "from-cyan-500 to-blue-600" },
    { id: "gainers", label: "Top Gainers", count: 8, icon: TrendingUp, color: "from-emerald-500 to-teal-600" },
    { id: "losers", label: "Top Losers", count: 3, icon: TrendingDown, color: "from-red-500 to-orange-500" },
    { id: "recent", label: "Recently Listed", count: 4, icon: Calendar, color: "from-blue-500 to-indigo-600" },
  ]

  const sortOptions = [
    { value: "gainPercent", label: "Gain Percentage", icon: TrendingUp },
    { value: "volume", label: "Volume", icon: Activity },
    { value: "listingDate", label: "Listing Date", icon: Calendar },
    { value: "marketCap", label: "Market Cap", icon: DollarSign },
  ]

  const ipoPerformanceData: IPOPerformance[] = [
    {
      companyName: "TechCorp Industries",
      symbol: "TECH",
      listingDate: "2024-06-15",
      ipoPrice: 220,
      currentPrice: 318,
      gainPercent: 44.5,
      volume: 2500000,
      marketCap: "₹15,900 Cr",
      sector: "Technology",
    },
    {
      companyName: "Green Energy Solutions",
      symbol: "GREEN",
      listingDate: "2024-06-10",
      ipoPrice: 110,
      currentPrice: 145,
      gainPercent: 31.8,
      volume: 1800000,
      marketCap: "₹8,700 Cr",
      sector: "Renewable Energy",
    },
    {
      companyName: "Healthcare Innovations",
      symbol: "HEALTH",
      listingDate: "2024-06-05",
      ipoPrice: 290,
      currentPrice: 385,
      gainPercent: 32.8,
      volume: 1200000,
      marketCap: "₹23,100 Cr",
      sector: "Healthcare",
    },
    {
      companyName: "Digital Banking Corp",
      symbol: "DBANK",
      listingDate: "2024-05-28",
      ipoPrice: 400,
      currentPrice: 520,
      gainPercent: 30.0,
      volume: 3200000,
      marketCap: "₹31,200 Cr",
      sector: "Financial Services",
    },
    {
      companyName: "E-commerce Logistics",
      symbol: "ELOG",
      listingDate: "2024-05-20",
      ipoPrice: 100,
      currentPrice: 85,
      gainPercent: -15.0,
      volume: 900000,
      marketCap: "₹5,100 Cr",
      sector: "Logistics",
    },
    {
      companyName: "AI Robotics Ltd",
      symbol: "ROBOT",
      listingDate: "2024-05-15",
      ipoPrice: 320,
      currentPrice: 445,
      gainPercent: 39.1,
      volume: 1600000,
      marketCap: "₹26,700 Cr",
      sector: "Artificial Intelligence",
    },
  ]

  const filteredIPOs = ipoPerformanceData
    .filter((ipo) => {
      const matchesFilter =
        selectedFilter === "all" ||
        (selectedFilter === "gainers" && ipo.gainPercent > 0) ||
        (selectedFilter === "losers" && ipo.gainPercent < 0) ||
        (selectedFilter === "recent" && new Date(ipo.listingDate) > new Date("2024-06-01"))

      const matchesSearch =
        ipo.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ipo.sector.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ipo.symbol.toLowerCase().includes(searchTerm.toLowerCase())

      return matchesFilter && matchesSearch
    })
    .sort((a, b) => {
      if (sortBy === "gainPercent") return b.gainPercent - a.gainPercent
      if (sortBy === "volume") return b.volume - a.volume
      if (sortBy === "listingDate") return new Date(b.listingDate).getTime() - new Date(a.listingDate).getTime()
      return 0
    })

  useEffect(() => {
    if (prefersReducedMotion()) return
    const ctx = gsap.context(() => {
      // Enhanced hero animation
      const tl = gsap.timeline()
      tl.fromTo(heroRef.current, 
        { opacity: 0, y: 100, scale: 0.9 }, 
        { opacity: 1, y: 0, scale: 1, duration: getAnimationDuration(1.5), ease: "power3.out" }
      )
      tl.fromTo(".hero-stats", 
        { opacity: 0, y: 50, stagger: 0.1 }, 
        { opacity: 1, y: 0, duration: getAnimationDuration(1), ease: "power3.out", stagger: prefersReducedMotion() ? 0 : 0.1 }, 
        "-=0.8"
      )

      // Enhanced filter animations
      gsap.fromTo(".filter-controls", 
        { opacity: 0, y: 30 }, 
        { opacity: 1, y: 0, duration: 0.8, ease: "power3.out", delay: 0.3 }
      )

      // Enhanced card animations
      ScrollTrigger.batch(".performance-card", {
        onEnter: (elements) => {
          gsap.fromTo(elements, 
            { opacity: 0, y: 100, rotateX: -15, scale: 0.9 }, 
            { 
              opacity: 1, 
              y: 0, 
              rotateX: 0, 
              scale: 1, 
              duration: 0.8, 
              ease: "power3.out", 
              stagger: 0.1,
              transformOrigin: "center bottom"
            }
          )
        },
        once: true
      })

      // Floating background elements
      gsap.to(".floating-bg-1", {
        x: 40,
        y: -30,
        rotation: 180,
        duration: 8,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
      })

      gsap.to(".floating-bg-2", {
        x: -35,
        y: 25,
        rotation: -180,
        duration: 10,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
        delay: 2,
      })

      gsap.to(".floating-bg-3", {
        x: 20,
        y: -40,
        rotation: 90,
        duration: 12,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
        delay: 4,
      })

    }, containerRef)

    return () => ctx.revert()
  }, [filteredIPOs, prefersReducedMotion, getAnimationDuration])

  const handleRefresh = async () => {
    setIsRefreshing(true)
    await new Promise(resolve => setTimeout(resolve, 1500))
    setIsRefreshing(false)
  }

  const formatVolume = (volume: number) => {
    if (volume >= 1000000) {
      return `${(volume / 1000000).toFixed(1)}M`
    }
    if (volume >= 1000) {
      return `${(volume / 1000).toFixed(1)}K`
    }
    return volume.toString()
  }

  const getSectorColor = (sector: string) => {
    const colors = {
      "Technology": "from-blue-500 to-cyan-500",
      "Healthcare": "from-green-500 to-teal-500",
      "Financial Services": "from-yellow-500 to-orange-500",
      "Renewable Energy": "from-green-400 to-emerald-500",
      "Logistics": "from-purple-500 to-pink-500",
      "Artificial Intelligence": "from-cyan-500 to-blue-500",
    }
    return colors[sector as keyof typeof colors] || "from-gray-500 to-gray-600"
  }

  return (
    <div ref={containerRef} className="min-h-screen pt-24 pb-16 relative overflow-hidden bg-noise">
      {/* Enhanced Background Effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="floating-bg-1 absolute top-20 left-20 w-96 h-96 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-full blur-3xl" />
        <div className="floating-bg-2 absolute top-40 right-20 w-80 h-80 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-full blur-3xl" />
        <div className="floating-bg-3 absolute bottom-20 left-1/2 w-72 h-72 bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-full blur-3xl" />
        
        {/* Animated grid pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.3) 1px, transparent 0)`,
            backgroundSize: '50px 50px'
          }} />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Enhanced Hero Section */}
        <div ref={heroRef} className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 backdrop-blur-sm mb-6"
          >
            <LineChart className="w-4 h-4 text-purple-400" />
            <span className="text-sm font-medium text-purple-300">Live Performance Tracking</span>
          </motion.div>

          <h1 className="text-hero mb-6">
            IPO <span className="gradient-text">Performance Monitor</span>
          </h1>
          
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed mb-12">
            Track real-time performance of recently listed IPOs with advanced analytics and market insights
          </p>

          {/* Enhanced Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {[
              { 
                label: "Active IPOs", 
                value: filteredIPOs.length.toString(), 
                icon: Building, 
                color: "from-blue-500 to-purple-500",
                change: "+12%"
              },
              { 
                label: "Avg. Returns", 
                value: `${(filteredIPOs.reduce((acc, ipo) => acc + ipo.gainPercent, 0) / filteredIPOs.length).toFixed(1)}%`, 
                icon: TrendingUp, 
                color: "from-green-500 to-emerald-500",
                change: "+8.3%"
              },
              { 
                label: "Total Volume", 
                value: formatVolume(filteredIPOs.reduce((acc, ipo) => acc + ipo.volume, 0)), 
                icon: Activity, 
                color: "from-orange-500 to-red-500",
                change: "+15%"
              },
              { 
                label: "Success Rate", 
                value: `${Math.round((filteredIPOs.filter((ipo) => ipo.gainPercent > 0).length / filteredIPOs.length) * 100)}%`, 
                icon: Star, 
                color: "from-purple-500 to-pink-500",
                change: "+2.1%"
              },
            ].map((stat, index) => {
              const Icon = stat.icon
              return (
                <motion.div
                  key={index}
                  className="hero-stats glass-strong rounded-2xl p-6 text-center hover:scale-105 transition-transform duration-300"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 + 0.3 }}
                >
                  <div className={`inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br ${stat.color} rounded-xl mb-3`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
                  <div className="text-sm text-gray-300 mb-2">{stat.label}</div>
                  <div className="text-xs text-green-400 font-medium">{stat.change}</div>
                </motion.div>
              )
            })}
          </div>
        </div>

        {/* Enhanced Controls */}
        <div className="filter-controls mb-12 space-y-8">
          {/* Search and Actions */}
          <div className="flex flex-col lg:flex-row gap-6 items-center justify-between">
            <div className="flex items-center space-x-4 w-full lg:w-auto">
              <div className="relative flex-1 lg:w-80">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search IPOs, sectors, symbols..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="input w-full pl-12 pr-4 bg-white/5 border-white/10 focus:border-purple-500/50 focus:bg-white/10 transition-all duration-300"
                />
              </div>
              
              <motion.button
                onClick={handleRefresh}
                disabled={isRefreshing}
                className="btn btn-secondary p-3 disabled:opacity-50"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <RefreshCw className={`w-5 h-5 ${isRefreshing ? 'animate-spin' : ''}`} />
              </motion.button>
            </div>

            <div className="flex items-center space-x-4">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="input bg-white/5 border-white/10 focus:border-purple-500/50 min-w-[180px]"
              >
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value} className="bg-gray-800">
                    {option.label}
                  </option>
                ))}
              </select>

              <div className="flex items-center space-x-2 bg-white/5 rounded-lg p-1">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 rounded-md transition-colors ${
                    viewMode === "grid" ? "bg-purple-500 text-white" : "text-gray-400 hover:text-white"
                  }`}
                >
                  <BarChart3 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 rounded-md transition-colors ${
                    viewMode === "list" ? "bg-purple-500 text-white" : "text-gray-400 hover:text-white"
                  }`}
                >
                  <Activity className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Enhanced Filter Buttons */}
          <div className="flex flex-wrap justify-center gap-4">
            {filters.map((filter) => {
              const Icon = filter.icon
              return (
                <motion.button
                  key={filter.id}
                  onClick={() => setSelectedFilter(filter.id)}
                  className={`group relative overflow-hidden px-6 py-3 rounded-2xl font-medium transition-all duration-300 ${
                    selectedFilter === filter.id
                      ? `bg-gradient-to-r ${filter.color} text-white shadow-lg`
                      : "glass text-gray-300 hover:text-white hover:scale-105"
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {selectedFilter !== filter.id && (
                    <div className={`absolute inset-0 bg-gradient-to-r ${filter.color} opacity-0 group-hover:opacity-20 transition-opacity duration-300`} />
                  )}
                  <div className="relative z-10 flex items-center space-x-2">
                    <Icon className="w-4 h-4" />
                    <span>{filter.label}</span>
                    <span className="text-xs opacity-75">({filter.count})</span>
                  </div>
                </motion.button>
              )
            })}
          </div>
        </div>

        {/* Enhanced Performance Grid */}
        <div className={`performance-grid ${viewMode === "grid" ? "grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3" : "space-y-4"} gap-6 mb-16`}>
          <AnimatePresence mode="popLayout">
            {filteredIPOs.map((ipo, index) => (
              <motion.div
                key={ipo.symbol}
                layout
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="performance-card glass-strong rounded-3xl overflow-hidden hover:scale-105 transition-transform duration-300 cursor-pointer group"
                onClick={() => setSelectedIPO(ipo)}
              >
                {/* Card Background Gradient */}
                <div className={`absolute inset-0 bg-gradient-to-br ${getSectorColor(ipo.sector)} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />
                
                <div className="relative z-10 p-8">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-6">
                    <div>
                      <h3 className="text-xl font-bold text-white group-hover:text-purple-300 transition-colors mb-1">
                        {ipo.companyName}
                      </h3>
                      <div className="flex items-center space-x-3">
                        <span className="text-sm text-purple-400 font-medium">{ipo.symbol}</span>
                        <span className="text-xs text-gray-500">•</span>
                        <span className="text-xs text-gray-400">{ipo.sector}</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="p-2 rounded-full bg-white/5 hover:bg-white/10 transition-colors"
                      >
                        <Bookmark className="w-4 h-4 text-gray-400" />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="p-2 rounded-full bg-white/5 hover:bg-white/10 transition-colors"
                      >
                        <Share2 className="w-4 h-4 text-gray-400" />
                      </motion.button>
                    </div>
                  </div>

                  {/* Performance Badge */}
                  <div className={`inline-flex items-center space-x-2 px-3 py-1 rounded-full text-sm font-medium mb-6 ${
                    ipo.gainPercent >= 0 
                      ? "bg-green-500/20 text-green-400 border border-green-500/30" 
                      : "bg-red-500/20 text-red-400 border border-red-500/30"
                  }`}>
                    {ipo.gainPercent >= 0 ? (
                      <ArrowUpRight className="w-4 h-4" />
                    ) : (
                      <ArrowDownRight className="w-4 h-4" />
                    )}
                    <span>
                      {ipo.gainPercent > 0 ? "+" : ""}
                      {ipo.gainPercent.toFixed(1)}%
                    </span>
                  </div>

                  {/* Price Information */}
                  <div className="grid grid-cols-2 gap-6 mb-6">
                    <div className="glass-subtle rounded-xl p-4">
                      <p className="text-xs text-gray-400 mb-2">IPO Price</p>
                      <p className="text-white font-bold text-lg">₹{ipo.ipoPrice}</p>
                    </div>
                    <div className="glass-subtle rounded-xl p-4">
                      <p className="text-xs text-gray-400 mb-2">Current Price</p>
                      <p className="text-white font-bold text-lg">₹{ipo.currentPrice}</p>
                    </div>
                  </div>

                  {/* Additional Info */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-400 flex items-center space-x-2">
                        <Activity className="w-4 h-4" />
                        <span>Volume</span>
                      </span>
                      <span className="text-white font-medium">{formatVolume(ipo.volume)}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-400 flex items-center space-x-2">
                        <DollarSign className="w-4 h-4" />
                        <span>Market Cap</span>
                      </span>
                      <span className="text-white font-medium">{ipo.marketCap}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-400 flex items-center space-x-2">
                        <Calendar className="w-4 h-4" />
                        <span>Listed On</span>
                      </span>
                      <span className="text-white font-medium">{new Date(ipo.listingDate).toLocaleDateString()}</span>
                    </div>
                  </div>

                  {/* Action Button */}
                  <motion.button
                    className="w-full mt-6 py-3 px-4 bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 text-white rounded-xl hover:from-purple-500/30 hover:to-pink-500/30 transition-all duration-300 flex items-center justify-center space-x-2"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Eye className="w-4 h-4" />
                    <span>View Details</span>
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Enhanced Market Summary */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {[
            {
              label: "Market Leaders",
              value: "3",
              subtitle: "Above 40% gains",
              icon: Award,
              color: "from-yellow-500 to-orange-500",
              trend: "+2"
            },
            {
              label: "Sector Diversity",
              value: "6",
              subtitle: "Different sectors",
              icon: PieChart,
              color: "from-purple-500 to-pink-500",
              trend: "+1"
            },
            {
              label: "Trading Volume",
              value: "₹2.4K Cr",
              subtitle: "Today's volume",
              icon: TrendingUp,
              color: "from-green-500 to-emerald-500",
              trend: "+18%"
            },
            {
              label: "Market Sentiment",
              value: "Bullish",
              subtitle: "85% positive",
              icon: Target,
              color: "from-blue-500 to-cyan-500",
              trend: "+5%"
            },
          ].map((stat, index) => {
            const Icon = stat.icon
            return (
              <motion.div
                key={index}
                className="glass-strong rounded-2xl p-6 hover:scale-105 transition-transform duration-300"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-sm text-green-400 font-medium">{stat.trend}</div>
                </div>
                <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
                <div className="text-sm text-gray-300 mb-2">{stat.label}</div>
                <div className="text-xs text-gray-400">{stat.subtitle}</div>
              </motion.div>
            )
          })}
        </div>

        {/* Enhanced Market Insights */}
        <div className="glass-strong rounded-3xl p-8 md:p-12 mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">
              Market <span className="gradient-text">Insights</span>
            </h2>
            <p className="text-gray-300 max-w-2xl mx-auto">
              Real-time analysis and trends from the IPO market
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "Technology Sector Leading",
                description: "Tech IPOs showing average gains of 35% post-listing",
                icon: Zap,
                color: "from-blue-500 to-purple-500",
                metric: "35%",
                trend: "up"
              },
              {
                title: "High Subscription Rates",
                description: "Recent IPOs oversubscribed by 3.2x on average",
                icon: Users,
                color: "from-green-500 to-emerald-500",
                metric: "3.2x",
                trend: "up"
              },
              {
                title: "Strong Retail Participation",
                description: "65% of applications from retail investors",
                icon: TrendingUp,
                color: "from-purple-500 to-pink-500",
                metric: "65%",
                trend: "up"
              },
              {
                title: "Market Volatility",
                description: "Moderate volatility with stable performance",
                icon: Activity,
                color: "from-orange-500 to-red-500",
                metric: "±12%",
                trend: "stable"
              },
              {
                title: "Listing Success Rate",
                description: "92% of IPOs listed above issue price",
                icon: Target,
                color: "from-cyan-500 to-blue-500",
                metric: "92%",
                trend: "up"
              },
              {
                title: "Average Holding Period",
                description: "Investors holding for 6+ months average",
                icon: Calendar,
                color: "from-pink-500 to-rose-500",
                metric: "6M+",
                trend: "up"
              },
            ].map((insight, index) => {
              const Icon = insight.icon
              return (
                <motion.div
                  key={index}
                  className="glass-subtle rounded-2xl p-6 hover:scale-105 transition-transform duration-300"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="flex items-start space-x-4">
                    <div className={`w-12 h-12 bg-gradient-to-br ${insight.color} rounded-xl flex items-center justify-center flex-shrink-0`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-lg font-semibold text-white">{insight.title}</h3>
                        <div className="flex items-center space-x-1">
                          <span className="text-xl font-bold text-white">{insight.metric}</span>
                          {insight.trend === "up" && <ArrowUpRight className="w-4 h-4 text-green-400" />}
                          {insight.trend === "down" && <ArrowDownRight className="w-4 h-4 text-red-400" />}
                        </div>
                      </div>
                      <p className="text-gray-400 text-sm">{insight.description}</p>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>

        {/* Enhanced Empty State */}
        {filteredIPOs.length === 0 && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            className="text-center py-20"
          >
            <div className="w-32 h-32 mx-auto mb-8 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-full flex items-center justify-center">
              <Search className="w-16 h-16 text-gray-400" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-4">No IPOs Found</h3>
            <p className="text-gray-400 max-w-md mx-auto mb-8">
              Try adjusting your search criteria or filters to find the IPOs you&apos;re looking for.
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                setSearchTerm("")
                setSelectedFilter("all")
              }}
              className="btn btn-primary"
            >
              Reset Filters
            </motion.button>
          </motion.div>
        )}

        {/* Enhanced Performance Chart Preview */}
        <div className="glass-strong rounded-3xl p-8 md:p-12">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">
                Performance <span className="gradient-text">Overview</span>
              </h2>
              <p className="text-gray-400">Market trends and performance metrics</p>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="btn btn-secondary flex items-center space-x-2"
            >
              <LineChart className="w-4 h-4" />
              <span>View Full Chart</span>
            </motion.button>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Performance Breakdown */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-white">Performance Breakdown</h3>
              {[
                { label: "Strong Performers (>30%)", value: 40, color: "from-green-500 to-emerald-500" },
                { label: "Moderate Performers (10-30%)", value: 35, color: "from-yellow-500 to-orange-500" },
                { label: "Stable Performers (0-10%)", value: 20, color: "from-blue-500 to-purple-500" },
                { label: "Underperformers (<0%)", value: 5, color: "from-red-500 to-pink-500" },
              ].map((item, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-300">{item.label}</span>
                    <span className="text-white font-medium">{item.value}%</span>
                  </div>
                  <div className="w-full bg-gray-800 rounded-full h-2">
                    <motion.div
                      className={`h-2 bg-gradient-to-r ${item.color} rounded-full`}
                      initial={{ width: 0 }}
                      whileInView={{ width: `${item.value}%` }}
                      transition={{ duration: 1, delay: index * 0.2 }}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Market Sentiment */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-white">Market Sentiment</h3>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: "Bullish", value: "68%", color: "text-green-400" },
                  { label: "Neutral", value: "22%", color: "text-yellow-400" },
                  { label: "Bearish", value: "10%", color: "text-red-400" },
                  { label: "Volatile", value: "15%", color: "text-purple-400" },
                ].map((sentiment, index) => (
                  <div key={index} className="glass-subtle rounded-xl p-4 text-center">
                    <div className={`text-2xl font-bold ${sentiment.color} mb-1`}>
                      {sentiment.value}
                    </div>
                    <div className="text-sm text-gray-400">{sentiment.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MonitoringPage