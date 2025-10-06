"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import {
  Calendar,
  TrendingUp,
  Building,
  DollarSign,
  Clock,
  Users,
  Search,
  Briefcase,
  Target,
  ArrowLeft,
  Eye,
  Bell,
  Bookmark,
  Share2,
  Download,
  Award,
  Activity,
  AlertCircle,
  BarChart3,
  PieChart,
} from "lucide-react"
import Link from "next/link"

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger)
}

const UpcomingIPOsPage = () => {

  const [ipoData, setIpoData] = useState<any[]>([]);
  const [selectedFilter, setSelectedFilter] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState("openDate")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [bookmarkedIPOs, setBookmarkedIPOs] = useState<Set<number>>(new Set())
  const containerRef = useRef<HTMLDivElement>(null)
  const heroRef = useRef<HTMLDivElement>(null)

  // Helper function to convert timestamp to date
  const timestampToDate = (timestamp: number) => {
    return new Date(timestamp)
  }

  const getIPOStatus = (ipo: any) => {
    const today = new Date()
    const startDate = timestampToDate(ipo.bidStartTimestamp)
    const endDate = timestampToDate(ipo.bidEndTimestamp)
    
    if (today < startDate) return "upcoming"
    if (today > endDate) return "closed"
    if (today >= startDate && today <= endDate) {
      // Check if closing within 2 days
      const timeDiff = endDate.getTime() - today.getTime()
      const daysDiff = timeDiff / (1000 * 3600 * 24)
      return daysDiff <= 2 ? "closing-soon" : "open"
    }
    return "open"
  }

  // Helper function to get price band from categories
  const getPriceBand = (ipo: any) => {
    if (ipo.categories && ipo.categories.length > 0) {
      const firstCategory = ipo.categories[0]
      if (firstCategory.minPrice && firstCategory.maxPrice) {
        return `₹${firstCategory.minPrice} - ₹${firstCategory.maxPrice}`
      }
    }
    return "N/A"
  }

  // Helper function to format dates
  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    })
  }

  const filters = [
    { id: "all", label: "All IPOs", count: ipoData.length, icon: Building, color: "from-blue-500 to-purple-500" },
    { id: "upcoming", label: "Upcoming", count: ipoData.filter(ipo => getIPOStatus(ipo) === "upcoming").length, icon: Clock, color: "from-purple-500 to-pink-500" },
    { id: "open", label: "Open Now", count: ipoData.filter(ipo => getIPOStatus(ipo) === "open").length, icon: TrendingUp, color: "from-green-500 to-emerald-500" },
    { id: "closing-soon", label: "Closing Soon", count: ipoData.filter(ipo => getIPOStatus(ipo) === "closing-soon").length, icon: AlertCircle, color: "from-red-500 to-orange-500" },
  ];

  const sortOptions = [
    { value: "openDate", label: "Opening Date", icon: Calendar },
    { value: "issueSize", label: "Issue Size", icon: DollarSign },
    { value: "sector", label: "Sector", icon: Building },
    { value: "subscription", label: "Subscription", icon: TrendingUp },
  ];

  useEffect(() => {
    async function fetchIPOs() {
      try {
        const res = await fetch("/api/nse");
        if (!res.ok) throw new Error("Failed to fetch IPOs");
        const data = await res.json();
        // Extract IPO list from the new API response structure
        const ipoList = data.ipoList || [];
        setIpoData(ipoList);
      } catch (err: any) {
        console.error("Failed to fetch IPOs:", err.message || "Unknown error");
      }
    }
    fetchIPOs();
  }, []);

  const filteredIPOs = ipoData.filter((ipo) => {
    const ipoStatus = getIPOStatus(ipo)
    const matchesFilter = selectedFilter === "all" || ipoStatus === selectedFilter
    const matchesSearch =
      ipo.companyName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ipo.symbol?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (ipo.isSme ? "sme" : "regular").toLowerCase().includes(searchTerm.toLowerCase())
    return matchesFilter && matchesSearch
  }).sort((a, b) => {
    if (sortBy === "openDate") return a.bidStartTimestamp - b.bidStartTimestamp
    if (sortBy === "issueSize") return (b.companyCode || 0) - (a.companyCode || 0)
    if (sortBy === "sector") return (a.isSme ? "SME" : "Regular").localeCompare(b.isSme ? "SME" : "Regular")
    if (sortBy === "subscription") return (b.overallSubscription || 0) - (a.overallSubscription || 0)
    return 0
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "upcoming": return "from-blue-500 to-purple-500"
      case "open": return "from-green-500 to-emerald-500"
      case "closing-soon": return "from-red-500 to-orange-500"
      default: return "from-gray-500 to-gray-600"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "upcoming": return "Upcoming"
      case "open": return "Open Now"
      case "closing-soon": return "Closing Soon"
      case "closed": return "Closed"
      default: return "Active"
    }
  }


  const toggleBookmark = (ipoId: number) => {
    setBookmarkedIPOs(prev => {
      const newSet = new Set(prev)
      if (newSet.has(ipoId)) {
        newSet.delete(ipoId)
      } else {
        newSet.add(ipoId)
      }
      return newSet
    })
  }

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Optimized hero animation with reduced complexity
      gsap.timeline({ defaults: { ease: "power2.out" } })
        .fromTo(heroRef.current, 
          { opacity: 0, y: 60, scale: 0.95 }, 
          { opacity: 1, y: 0, scale: 1, duration: 1.2, clearProps: "transform" }
        )
        .fromTo(".hero-stats", 
          { opacity: 0, y: 30 }, 
          { opacity: 1, y: 0, duration: 0.8, stagger: 0.08, clearProps: "transform" }, 
          "-=0.6"
        )

      // Optimized filter animations
      gsap.fromTo(".filter-controls", 
        { opacity: 0, y: 20 }, 
        { opacity: 1, y: 0, duration: 0.6, ease: "power2.out", delay: 0.2, clearProps: "transform" }
      )

      // Optimized card animations with reduced 3D transforms
      ScrollTrigger.batch(".ipo-card", {
        onEnter: (elements) => {
          gsap.fromTo(elements, 
            { opacity: 0, y: 40, scale: 0.96 }, 
            { 
              opacity: 1, 
              y: 0, 
              scale: 1, 
              duration: 0.6, 
              ease: "power2.out", 
              stagger: 0.08,
              clearProps: "transform"
            }
          )
        },
        once: true,
        start: "top 90%"
      })

      // Optimized floating background with ocean-like motion
      gsap.to(".floating-bg-1", {
        x: 20,
        y: -15,
        rotation: 90,
        duration: 12,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
        transformOrigin: "center center"
      })

      gsap.to(".floating-bg-2", {
        x: -15,
        y: 20,
        rotation: -45,
        duration: 15,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
        delay: 1.5,
        transformOrigin: "center center"
      })

    }, containerRef)

    return () => ctx.revert()
  }, [filteredIPOs])

  return (
    <div ref={containerRef} className="min-h-screen pt-24 pb-16 relative overflow-hidden bg-noise">
      {/* Enhanced Ocean Background Effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="floating-bg-1 absolute top-20 left-20 w-96 h-96 bg-gradient-to-br from-cyan-400/8 to-blue-500/12 rounded-full blur-3xl transform-gpu" />
        <div className="floating-bg-2 absolute bottom-20 right-20 w-80 h-80 bg-gradient-to-br from-teal-500/10 to-cyan-600/8 rounded-full blur-3xl transform-gpu" />
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-gradient-to-r from-blue-400/6 to-purple-500/8 rounded-full blur-2xl transform -translate-x-1/2 -translate-y-1/2 animate-pulse" />
      </div>

      <div className="container max-w-7xl mx-auto px-6 relative z-10">
        {/* Enhanced Breadcrumb */}
        <motion.div 
          className="mb-12"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Link 
            href="/" 
            className="group flex items-center space-x-3 text-gray-400 hover:text-white transition-all duration-300 w-fit"
          >
            <div className="p-2 rounded-full bg-white/5 group-hover:bg-white/10 transition-colors duration-300">
              <ArrowLeft className="w-4 h-4" />
            </div>
            <span className="text-sm font-medium">Back to Home</span>
          </Link>
        </motion.div>

        {/* Enhanced Hero Section */}
        <div ref={heroRef} className="text-center mb-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-400/30 backdrop-blur-sm mb-6"
          >
            <Calendar className="w-4 h-4 text-cyan-400" />
            <span className="text-sm font-medium text-cyan-300">IPO Calendar</span>
          </motion.div>

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold leading-tight mb-6">
            Upcoming <span className="bg-gradient-to-r from-cyan-400 via-teal-500 to-blue-600 bg-clip-text text-transparent animate-pulse">IPOs</span>
          </h1>
          
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed mb-12">
            Discover and track the latest IPO opportunities with comprehensive analysis and real-time updates
          </p>

          {/* Enhanced Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {(() => {
              const totalIPOs = ipoData.length
              const openIPOs = ipoData.filter(ipo => getIPOStatus(ipo) === "open").length
              const avgSubscription = ipoData.reduce((sum, ipo) => sum + (ipo.overallSubscription || 0), 0) / Math.max(ipoData.length, 1)
              const smeIPOs = ipoData.filter(ipo => ipo.isSme === true).length
              
              return [
                { 
                  label: "Total IPOs", 
                  value: totalIPOs.toString(), 
                  icon: Building, 
                  color: "from-cyan-500 to-blue-600",
                  change: `${smeIPOs} SME IPOs`
                },
                { 
                  label: "Open Now", 
                  value: openIPOs.toString(), 
                  icon: TrendingUp, 
                  color: "from-emerald-500 to-teal-600",
                  change: "Apply today"
                },
                { 
                  label: "Avg. Subscription", 
                  value: avgSubscription > 0 ? `${avgSubscription.toFixed(1)}x` : "N/A", 
                  icon: Users, 
                  color: "from-teal-500 to-cyan-600",
                  change: "Live data"
                },
                { 
                  label: "BSE Listed", 
                  value: ipoData.filter(ipo => ipo.isBse).length.toString(), 
                  icon: Target, 
                  color: "from-blue-500 to-indigo-600",
                  change: "Exchange wise"
                },
              ]
            })().map((stat, index) => {
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
                  placeholder="Search IPOs, sectors, companies..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="input w-full pl-12 pr-4 bg-white/5 border-white/10 focus:border-purple-500/50 focus:bg-white/10 transition-all duration-300"
                />
              </div>
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

        {/* Enhanced IPO Grid */}
        <div className={`ipo-grid ${viewMode === "grid" ? "grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3" : "space-y-6"} gap-8 mb-16`}>
          <AnimatePresence mode="popLayout">
            {filteredIPOs.map((ipo, index) => {
              const ipoStatus = getIPOStatus(ipo)
              return (
                <motion.div
                  key={ipo.symbol || index}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  className="ipo-card rounded-3xl bg-gradient-to-br from-slate-900/95 to-blue-900/90 shadow-2xl backdrop-blur-lg border border-cyan-500/20 p-0 overflow-hidden group hover:shadow-cyan-400/25 hover:shadow-2xl transition-all duration-500"
                >
                  <div className="relative z-10 p-6 flex flex-col h-full">
                    {/* Header with Company Logo and Info */}
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-500/30 to-teal-500/30 flex items-center justify-center border border-cyan-400/30 overflow-hidden">
                        {ipo.logoUrl ? (
                          <img 
                            src={ipo.logoUrl} 
                            alt={`${ipo.companyName} logo`} 
                            className="w-full h-full object-cover rounded-2xl"
                            onError={(e) => {
                              e.currentTarget.style.display = 'none';
                              e.currentTarget.parentElement!.innerHTML = '<div class="w-7 h-7 text-cyan-300"><svg fill="currentColor" viewBox="0 0 24 24"><path d="M3 21h18V3H3v18zm16-16v14H5V5h14zm-6 8l2.5 3.21 1.79-2.15 2.71 3.94H8l3-4z"/></svg></div>';
                            }}
                          />
                        ) : (
                          <Building className="w-7 h-7 text-cyan-300" />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h2 className="text-xl font-bold text-cyan-100">{ipo.companyName}</h2>
                          {ipo.isSme && (
                            <span className="px-2 py-1 text-xs font-bold bg-orange-500 text-white rounded-full">
                              SME
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-teal-300">{ipo.isSme ? "Small & Medium Enterprises" : "Regular IPO"}</p>
                        <p className="text-xs text-gray-400">{ipo.symbol}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1 bg-yellow-500/20 px-2 py-1 rounded-full">
                          <span className="text-cyan-400 text-xl">⭐</span>
                          <span className="text-sm font-semibold text-cyan-300">4.1</span>
                        </div>
                        <button
                          onClick={() => toggleBookmark(ipo.symbol)}
                          className="p-2 rounded-full hover:bg-white/10 transition-colors"
                          aria-label="Bookmark IPO"
                        >
                          <Bookmark className={`w-5 h-5 ${bookmarkedIPOs.has(ipo.symbol) ? 'text-yellow-400' : 'text-gray-400'}`} />
                        </button>
                      </div>
                    </div>

                    {/* Status Badge */}
                    <div className="mb-6">
                      <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold shadow-lg ${
                        ipoStatus === "closing-soon" || (ipo.status === "Active" && getIPOStatus(ipo) === "open") 
                          ? "bg-gradient-to-r from-red-500 to-orange-500 text-white"
                          : getStatusColor(ipoStatus) === "from-green-500 to-emerald-500"
                          ? "bg-gradient-to-r from-green-500 to-emerald-500 text-white"
                          : "bg-gradient-to-r from-blue-500 to-purple-500 text-white"
                      }`}>
                        <Clock className="w-4 h-4" />
                        {ipoStatus === "closing-soon" || (ipo.status === "Active" && getIPOStatus(ipo) === "open") ? "Closing Soon" : getStatusText(ipoStatus)}
                      </span>
                    </div>

                    {/* Key Details Grid */}
                    <div className="grid grid-cols-2 gap-6 mb-6">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <DollarSign className="w-5 h-5 text-emerald-400" />
                          <span className="text-sm text-teal-300">Issue Size</span>
                        </div>
                        <p className="text-2xl font-bold text-white">
                          {ipo.categories && ipo.categories.length > 0 ? `Lot: ${ipo.categories[0].lotSize}` : "N/A"}
                        </p>
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <Target className="w-5 h-5 text-cyan-400" />
                          <span className="text-sm text-teal-300">Price Band</span>
                        </div>
                        <p className="text-2xl font-bold text-white">{getPriceBand(ipo)}</p>
                      </div>
                    </div>

                    {/* IPO Dates */}
                    <div className="grid grid-cols-2 gap-6 mb-6">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <Calendar className="w-5 h-5 text-blue-400" />
                          <span className="text-sm text-teal-300">IPO Dates</span>
                        </div>
                        <p className="text-lg font-semibold text-white">
                          {formatDate(ipo.bidStartTimestamp)} - {formatDate(ipo.bidEndTimestamp)}
                        </p>
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <TrendingUp className="w-5 h-5 text-emerald-400" />
                          <span className="text-sm text-teal-300">Listing Date</span>
                        </div>
                        <p className="text-lg font-semibold text-white">30/08/2025</p>
                      </div>
                    </div>

                    {/* Subscription */}
                    <div className="mb-8">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-base text-teal-300">Subscription</span>
                        <span className="text-3xl font-bold text-white">
                          {ipo.overallSubscription ? `${ipo.overallSubscription.toFixed(2)}x` : "N/A"}
                        </span>
                      </div>
                      <div className="w-full h-3 bg-slate-800/50 rounded-full overflow-hidden">
                        <div
                          className="h-3 bg-gradient-to-r from-emerald-400 to-teal-500 rounded-full transition-all duration-500"
                          style={{ 
                            width: `${Math.min((ipo.overallSubscription || 0) * 10, 100)}%` 
                          }}
                        />
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-4 mt-auto">
                      <button
                        className="flex-1 flex items-center justify-center gap-2 py-4 rounded-2xl text-lg font-bold bg-gradient-to-r from-cyan-600 to-teal-600 text-white hover:from-cyan-500 hover:to-teal-500 transition-all duration-300 shadow-lg"
                        aria-label="Apply Now"
                      >
                        <Briefcase className="w-5 h-5" />
                        <span>Apply Now</span>
                      </button>
                      <button
                        className="p-4 rounded-2xl bg-blue-700/50 hover:bg-blue-600/50 text-blue-200 hover:text-white transition-colors"
                        aria-label="View Details"
                      >
                        <Eye className="w-5 h-5" />
                      </button>
                      <button
                        className="p-4 rounded-2xl bg-blue-700/50 hover:bg-blue-600/50 text-blue-200 hover:text-white transition-colors"
                        aria-label="Share IPO"
                      >
                        <Share2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </AnimatePresence>
        </div>

        {/* Enhanced Market Analysis */}
        <div className="glass-strong rounded-3xl p-8 md:p-12 mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">
              Market <span className="gradient-text">Analysis</span>
            </h2>
            <p className="text-gray-300 max-w-2xl mx-auto">
              Comprehensive analysis of the current IPO market trends and opportunities
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "Sector Performance",
                subtitle: "Technology leads with 40% of IPOs",
                icon: PieChart,
                color: "from-blue-500 to-purple-500",
                metrics: [
                  { label: "Technology", value: "40%", color: "bg-blue-500" },
                  { label: "Healthcare", value: "25%", color: "bg-green-500" },
                  { label: "Finance", value: "20%", color: "bg-yellow-500" },
                  { label: "Others", value: "15%", color: "bg-purple-500" }
                ]
              },
              {
                title: "Subscription Trends",
                subtitle: "Average oversubscription at 2.8x",
                icon: TrendingUp,
                color: "from-green-500 to-emerald-500",
                metrics: [
                  { label: "Retail", value: "3.2x", color: "bg-green-500" },
                  { label: "HNI", value: "2.8x", color: "bg-blue-500" },
                  { label: "Institutional", value: "2.4x", color: "bg-purple-500" },
                  { label: "Overall", value: "2.8x", color: "bg-orange-500" }
                ]
              },
              {
                title: "Market Sentiment",
                subtitle: "85% positive outlook",
                icon: Award,
                color: "from-purple-500 to-pink-500",
                metrics: [
                  { label: "Bullish", value: "85%", color: "bg-green-500" },
                  { label: "Neutral", value: "10%", color: "bg-yellow-500" },
                  { label: "Bearish", value: "5%", color: "bg-red-500" }
                ]
              }
            ].map((analysis, index) => {
              const Icon = analysis.icon
              return (
                <motion.div
                  key={index}
                  className="glass-subtle rounded-2xl p-6"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="flex items-center space-x-4 mb-6">
                    <div className={`w-12 h-12 bg-gradient-to-br ${analysis.color} rounded-xl flex items-center justify-center`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white">{analysis.title}</h3>
                      <p className="text-sm text-gray-400">{analysis.subtitle}</p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    {analysis.metrics.map((metric, metricIndex) => (
                      <div key={metricIndex} className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <div className={`w-3 h-3 rounded-full ${metric.color}`} />
                          <span className="text-sm text-gray-300">{metric.label}</span>
                        </div>
                        <span className="text-sm font-medium text-white">{metric.value}</span>
                      </div>
                    ))}
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

        {/* Enhanced Upcoming Calendar */}
        <div className="glass-strong rounded-3xl p-8 md:p-12">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">
              IPO <span className="gradient-text">Calendar</span>
            </h2>
            <p className="text-gray-300 max-w-2xl mx-auto">
              Stay updated with upcoming IPO dates and important milestones
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredIPOs.slice(0, 6).map((ipo, index) => {
              const ipoStatus = getIPOStatus(ipo)
              return (
                <motion.div
                  key={ipo.symbol || index}
                  className="glass-subtle rounded-2xl p-6 hover:scale-105 transition-transform duration-300"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-500/20 to-teal-500/20 flex items-center justify-center text-sm font-bold overflow-hidden">
                        {ipo.logoUrl ? (
                          <img 
                            src={ipo.logoUrl} 
                            alt={ipo.companyName} 
                            className="w-full h-full object-cover rounded-lg"
                          />
                        ) : (
                          <span className="text-cyan-300">{ipo.symbol?.slice(0, 2) || "??"}</span>
                        )}
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-white">{ipo.symbol}</h3>
                        <p className="text-sm text-gray-400 truncate max-w-[150px]">{ipo.companyName}</p>
                      </div>
                    </div>
                    <div className={`px-2 py-1 rounded-full text-xs font-medium bg-gradient-to-r ${getStatusColor(ipoStatus)} text-white`}>
                      {getStatusText(ipoStatus)}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-400">Opens</span>
                      <span className="text-white font-medium">{formatDate(ipo.bidStartTimestamp)}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-400">Closes</span>
                      <span className="text-white font-medium">{formatDate(ipo.bidEndTimestamp)}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-400">Subscription</span>
                      <span className="text-white font-medium">{ipo.overallSubscription ? `${ipo.overallSubscription.toFixed(2)}x` : "N/A"}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-400">Price Band</span>
                      <span className="text-white font-medium">
                        {getPriceBand(ipo)}
                      </span>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-white/10">
                    <div className="flex items-center justify-between">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="flex items-center space-x-2 text-purple-400 hover:text-purple-300 transition-colors"
                      >
                        <Bell className="w-4 h-4" />
                        <span className="text-sm">Notify</span>
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors"
                      >
                        <Download className="w-4 h-4" />
                        <span className="text-sm">Export</span>
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

export default UpcomingIPOsPage