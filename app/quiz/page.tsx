"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import {
  TrendingUp,
  TrendingDown,
  Minus,
  BarChart3,
  Users,
  Vote,
  Eye,
  MessageCircle,
  Share2,
  Award,
  Target,
  Sparkles,
  Brain,
  Trophy,
  CheckCircle,
  Star,
  Zap,
  Activity,
  RefreshCw,
  Download,
} from "lucide-react"
import type { QuizOption } from "../../types"
import { usePerformanceOptimization } from '../../utils/PerformanceManager'

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger)
}

const QuizPage = () => {
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({})
  const [showResults, setShowResults] = useState<Record<string, boolean>>({})
  const [userVotes, setUserVotes] = useState<Record<string, string>>({})
  const [activeFilter, setActiveFilter] = useState("all")
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [userScore, setUserScore] = useState(0)
  const [quizCompleted, setQuizCompleted] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const heroRef = useRef<HTMLDivElement>(null)
  const { prefersReducedMotion, getAnimationDuration } = usePerformanceOptimization()

  const filters = [
    { id: "all", label: "All Questions", icon: Brain, color: "from-cyan-500 to-blue-600" },
    { id: "trending", label: "Trending", icon: TrendingUp, color: "from-emerald-500 to-teal-600" },
    { id: "completed", label: "Completed", icon: CheckCircle, color: "from-teal-500 to-cyan-600" },
    { id: "popular", label: "Popular", icon: Star, color: "from-blue-500 to-indigo-600" },
  ]

  const quizData: QuizOption[] = [
    {
      id: "tech-corp",
      companyName: "TechCorp Industries IPO",
      longterm: 45,
      shortterm: 30,
      notParticipating: 15,
      listingGains: 10,
    },
    {
      id: "green-energy",
      companyName: "Green Energy Solutions IPO",
      longterm: 55,
      shortterm: 25,
      notParticipating: 12,
      listingGains: 8,
    },
    {
      id: "healthcare",
      companyName: "Healthcare Innovations IPO",
      longterm: 38,
      shortterm: 35,
      notParticipating: 18,
      listingGains: 9,
    },
    {
      id: "digital-bank",
      companyName: "Digital Banking Corp IPO",
      longterm: 42,
      shortterm: 28,
      notParticipating: 20,
      listingGains: 10,
    },
    {
      id: "ai-robotics",
      companyName: "AI Robotics Ltd IPO",
      longterm: 48,
      shortterm: 32,
      notParticipating: 13,
      listingGains: 7,
    },
    {
      id: "fintech-startup",
      companyName: "FinTech Startup IPO",
      longterm: 52,
      shortterm: 28,
      notParticipating: 15,
      listingGains: 5,
    },
  ]

  const voteOptions = [
    {
      id: "longterm",
      label: "Long-term Hold",
      icon: TrendingUp,
      color: "from-green-500 to-emerald-500",
      description: "Hold for 1+ years",
      emoji: "📈"
    },
    {
      id: "shortterm",
      label: "Short-term Trade",
      icon: BarChart3,
      color: "from-blue-500 to-cyan-500",
      description: "Trade within months",
      emoji: "⚡"
    },
    {
      id: "notParticipating",
      label: "Not Participating",
      icon: Minus,
      color: "from-gray-500 to-gray-600",
      description: "Skip this IPO",
      emoji: "❌"
    },
    {
      id: "listingGains",
      label: "Listing Gains Only",
      icon: Target,
      color: "from-orange-500 to-red-500",
      description: "Sell on listing day",
      emoji: "🎯"
    },
  ]

  useEffect(() => {
    if (prefersReducedMotion()) return
    const ctx = gsap.context(() => {
      // Enhanced hero animation
      gsap.timeline()
        .fromTo(heroRef.current, 
          { opacity: 0, y: 100, scale: 0.9 }, 
          { opacity: 1, y: 0, scale: 1, duration: getAnimationDuration(1.5), ease: "power3.out" }
        )
        .fromTo(".hero-content", 
          { opacity: 0, y: 50 }, 
          { opacity: 1, y: 0, duration: getAnimationDuration(1), ease: "power3.out", stagger: prefersReducedMotion() ? 0 : 0.1 }, 
          "-=0.8"
        )

      // Enhanced quiz card animations
      ScrollTrigger.batch(".quiz-card", {
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
              stagger: 0.2,
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
        duration: 7,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
      })

      gsap.to(".floating-bg-2", {
        x: -35,
        y: 25,
        rotation: -90,
        duration: 5,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
        delay: 1,
      })

      gsap.to(".floating-bg-3", {
        x: 25,
        y: -40,
        rotation: 45,
        duration: 9,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
        delay: 3,
      })

    }, containerRef)

    return () => ctx.revert()
  }, [prefersReducedMotion, getAnimationDuration])

  const handleVote = (quizId: string, option: string) => {
    setSelectedOptions((prev) => ({ ...prev, [quizId]: option }))
    setUserVotes((prev) => ({ ...prev, [quizId]: option }))

    // Update score
    setUserScore(prev => prev + 10)

    // Show results after voting
    setTimeout(() => {
      setShowResults((prev) => ({ ...prev, [quizId]: true }))
    }, 500)

    // Check if quiz is completed
    const totalAnswered = Object.keys(userVotes).length + 1
    if (totalAnswered === quizData.length) {
      setQuizCompleted(true)
    }
  }

  const getOptionPercentage = (quiz: QuizOption, optionId: string) => {
    const total = quiz.longterm + quiz.shortterm + quiz.notParticipating + quiz.listingGains
    switch (optionId) {
      case "longterm":
        return (quiz.longterm / total) * 100
      case "shortterm":
        return (quiz.shortterm / total) * 100
      case "notParticipating":
        return (quiz.notParticipating / total) * 100
      case "listingGains":
        return (quiz.listingGains / total) * 100
      default:
        return 0
    }
  }

  const getTotalVotes = (quiz: QuizOption) => {
    return quiz.longterm + quiz.shortterm + quiz.notParticipating + quiz.listingGains
  }

  const getFilteredQuizzes = () => {
    switch (activeFilter) {
      case "completed":
        return quizData.filter(quiz => showResults[quiz.id])
      case "trending":
        return quizData.filter(quiz => getTotalVotes(quiz) > 80)
      case "popular":
        return quizData.filter(quiz => getTotalVotes(quiz) > 90)
      default:
        return quizData
    }
  }

  const handleRefresh = async () => {
    setIsRefreshing(true)
    await new Promise(resolve => setTimeout(resolve, 1000))
    setIsRefreshing(false)
  }

  return (
    <div ref={containerRef} className="min-h-screen pt-24 pb-16 relative overflow-hidden bg-noise">
      {/* Enhanced Background Effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="floating-bg-1 absolute top-20 left-20 w-96 h-96 bg-gradient-to-br from-cyan-500/10 to-teal-500/10 rounded-full blur-3xl" />
        <div className="floating-bg-2 absolute bottom-20 right-20 w-80 h-80 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-full blur-3xl" />
        <div className="floating-bg-3 absolute top-1/2 left-1/2 w-72 h-72 bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-full blur-3xl" />
        
        {/* Animated particles */}
        <div className="absolute inset-0 opacity-20">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-gradient-to-r from-cyan-400 to-teal-400 rounded-full animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${2 + Math.random() * 2}s`
              }}
            />
          ))}
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Enhanced Hero Section */}
        <div ref={heroRef} className="text-center mb-20">
          <motion.div
            className="hero-content"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-gradient-to-r from-cyan-500/20 to-teal-500/20 border border-cyan-500/30 backdrop-blur-sm mb-6">
              <Brain className="w-4 h-4 text-cyan-400" />
              <span className="text-sm font-medium text-cyan-300">Investment Quiz</span>
            </div>
            
            <h1 className="text-hero mb-6">
              IPO <span className="gradient-text">Investment Quiz</span>
            </h1>
            
            <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed mb-12">
              Test your investment knowledge and see how your strategies align with the community
            </p>

            {/* Enhanced Progress & Score Display */}
            <div className="flex justify-center space-x-8 mb-8">
              <div className="glass-strong rounded-2xl p-6 text-center">
                <div className="flex items-center justify-center space-x-2 mb-2">
                  <Trophy className="w-6 h-6 text-yellow-400" />
                  <span className="text-2xl font-bold text-white">{userScore}</span>
                </div>
                <div className="text-sm text-gray-400">Your Score</div>
              </div>
              
              <div className="glass-strong rounded-2xl p-6 text-center">
                <div className="flex items-center justify-center space-x-2 mb-2">
                  <Target className="w-6 h-6 text-blue-400" />
                  <span className="text-2xl font-bold text-white">{Object.keys(userVotes).length}/{quizData.length}</span>
                </div>
                <div className="text-sm text-gray-400">Progress</div>
              </div>
              
              <div className="glass-strong rounded-2xl p-6 text-center">
                <div className="flex items-center justify-center space-x-2 mb-2">
                  <Users className="w-6 h-6 text-green-400" />
                  <span className="text-2xl font-bold text-white">2.5K+</span>
                </div>
                <div className="text-sm text-gray-400">Participants</div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="max-w-md mx-auto mb-8">
              <div className="flex justify-between text-sm text-gray-400 mb-2">
                <span>Quiz Progress</span>
                <span>{Math.round((Object.keys(userVotes).length / quizData.length) * 100)}%</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-3">
                <motion.div
                  className="h-3 bg-gradient-to-r from-cyan-500 to-teal-500 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${(Object.keys(userVotes).length / quizData.length) * 100}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
            </div>
          </motion.div>
        </div>

        {/* Enhanced Filter Controls */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {filters.map((filter) => {
            const Icon = filter.icon
            return (
              <motion.button
                key={filter.id}
                onClick={() => setActiveFilter(filter.id)}
                className={`group relative overflow-hidden px-6 py-3 rounded-2xl font-medium transition-all duration-300 ${
                  activeFilter === filter.id
                    ? `bg-gradient-to-r ${filter.color} text-white shadow-lg`
                    : "glass text-gray-300 hover:text-white hover:scale-105"
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {activeFilter !== filter.id && (
                  <div className={`absolute inset-0 bg-gradient-to-r ${filter.color} opacity-0 group-hover:opacity-20 transition-opacity duration-300`} />
                )}
                <div className="relative z-10 flex items-center space-x-2">
                  <Icon className="w-4 h-4" />
                  <span>{filter.label}</span>
                </div>
              </motion.button>
            )
          })}
          
          <motion.button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="glass text-gray-300 hover:text-white px-4 py-3 rounded-2xl transition-all duration-300 disabled:opacity-50"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          </motion.button>
        </div>

        {/* Enhanced Quiz Container */}
        <div className="quiz-container space-y-8 mb-16">
          <AnimatePresence mode="wait">
            {getFilteredQuizzes().map((quiz, index) => (
              <motion.div
                key={quiz.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="quiz-card glass-strong rounded-3xl overflow-hidden"
              >
                {/* Quiz Header */}
                <div className="p-8 pb-6 border-b border-white/10">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-16 h-16 bg-gradient-to-br from-cyan-500/20 to-teal-500/20 rounded-2xl flex items-center justify-center text-2xl backdrop-blur-sm">
                        🏢
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold text-white mb-2">{quiz.companyName}</h3>
                        <p className="text-gray-300">What&apos;s your investment strategy for this IPO?</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="glass-subtle rounded-xl p-3 text-center">
                        <div className="flex items-center space-x-2 text-gray-400">
                          <Users className="w-4 h-4" />
                          <span className="text-sm">{getTotalVotes(quiz)} votes</span>
                        </div>
                      </div>
                      {showResults[quiz.id] && (
                        <div className="glass-subtle rounded-xl p-3">
                          <CheckCircle className="w-6 h-6 text-green-400" />
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Voting Options */}
                <div className="p-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    {voteOptions.map((option) => {
                      // const Icon = option.icon // Removed unused variable
                      const isSelected = selectedOptions[quiz.id] === option.id
                      const hasVoted = showResults[quiz.id]
                      const percentage = getOptionPercentage(quiz, option.id)

                      return (
                        <motion.button
                          key={option.id}
                          onClick={() => !hasVoted && handleVote(quiz.id, option.id)}
                          disabled={hasVoted}
                          className={`relative p-6 rounded-2xl border transition-all duration-300 overflow-hidden group ${
                            isSelected && hasVoted
                              ? "border-cyan-500 bg-cyan-500/20 shadow-lg"
                              : hasVoted
                                ? "border-white/20 bg-white/5"
                                : "border-white/20 bg-white/5 hover:border-cyan-500/50 hover:bg-white/10 hover:scale-105"
                          } ${hasVoted ? "cursor-default" : "cursor-pointer"}`}
                          whileHover={!hasVoted ? { scale: 1.02 } : {}}
                          whileTap={!hasVoted ? { scale: 0.98 } : {}}
                        >
                          {/* Progress Bar Background */}
                          {hasVoted && (
                            <motion.div
                              className={`absolute inset-0 bg-gradient-to-r ${option.color} opacity-20 rounded-2xl`}
                              initial={{ width: 0 }}
                              animate={{ width: `${percentage}%` }}
                              transition={{ duration: 1, delay: 0.5 }}
                            />
                          )}

                          <div className="relative z-10 flex items-center space-x-4">
                            <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${option.color} flex items-center justify-center text-2xl shadow-lg`}>
                              {option.emoji}
                            </div>
                            <div className="flex-1 text-left">
                              <div className="flex items-center justify-between mb-2">
                                <div className="font-bold text-white text-lg">{option.label}</div>
                                {hasVoted && (
                                  <div className="text-right">
                                    <div className="text-2xl font-bold text-white">{percentage.toFixed(1)}%</div>
                                    {isSelected && <div className="text-xs text-cyan-400 font-medium">Your choice ✓</div>}
                                  </div>
                                )}
                              </div>
                              <div className="text-gray-400 text-sm mb-3">{option.description}</div>
                              {hasVoted && (
                                <div className="w-full bg-gray-700 rounded-full h-2">
                                  <motion.div
                                    className={`h-2 bg-gradient-to-r ${option.color} rounded-full`}
                                    initial={{ width: 0 }}
                                    animate={{ width: `${percentage}%` }}
                                    transition={{ duration: 1, delay: 0.8 }}
                                  />
                                </div>
                              )}
                            </div>
                          </div>
                        </motion.button>
                      )
                    })}
                  </div>

                  {/* Results Summary */}
                  {showResults[quiz.id] && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      className="border-t border-white/10 pt-6"
                    >
                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="glass-subtle rounded-2xl p-6">
                          <h4 className="text-lg font-semibold text-white mb-4">Community Sentiment</h4>
                          <div className="space-y-3">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-2">
                                <TrendingUp className="w-4 h-4 text-green-400" />
                                <span className="text-sm text-gray-300">Bullish</span>
                              </div>
                              <span className="text-sm font-medium text-white">
                                {(getOptionPercentage(quiz, "longterm") + getOptionPercentage(quiz, "shortterm")).toFixed(0)}%
                              </span>
                            </div>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-2">
                                <TrendingDown className="w-4 h-4 text-red-400" />
                                <span className="text-sm text-gray-300">Bearish</span>
                              </div>
                              <span className="text-sm font-medium text-white">
                                {getOptionPercentage(quiz, "notParticipating").toFixed(0)}%
                              </span>
                            </div>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-2">
                                <Target className="w-4 h-4 text-orange-400" />
                                <span className="text-sm text-gray-300">Short-term</span>
                              </div>
                              <span className="text-sm font-medium text-white">
                                {getOptionPercentage(quiz, "listingGains").toFixed(0)}%
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="glass-subtle rounded-2xl p-6">
                          <h4 className="text-lg font-semibold text-white mb-4">Market Insights</h4>
                          <div className="space-y-3">
                            <div className="flex items-center space-x-3">
                              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                                <Activity className="w-4 h-4 text-white" />
                              </div>
                              <div>
                                <div className="text-sm font-medium text-white">High Interest</div>
                                <div className="text-xs text-gray-400">Active community discussion</div>
                              </div>
                            </div>
                            <div className="flex items-center space-x-3">
                              <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
                                <TrendingUp className="w-4 h-4 text-white" />
                              </div>
                              <div>
                                <div className="text-sm font-medium text-white">Positive Outlook</div>
                                <div className="text-xs text-gray-400">Majority bullish sentiment</div>
                              </div>
                            </div>
                            <div className="flex items-center space-x-3">
                              <div className="w-8 h-8 bg-gradient-to-br from-cyan-500 to-teal-500 rounded-lg flex items-center justify-center">
                                <Users className="w-4 h-4 text-white" />
                              </div>
                              <div>
                                <div className="text-sm font-medium text-white">Community Favorite</div>
                                <div className="text-xs text-gray-400">Top voted this week</div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex items-center justify-between mt-8 pt-6 border-t border-white/10">
                    <div className="flex items-center space-x-4">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors"
                      >
                        <MessageCircle className="w-4 h-4" />
                        <span className="text-sm">Discuss</span>
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors"
                      >
                        <Share2 className="w-4 h-4" />
                        <span className="text-sm">Share</span>
                      </motion.button>
                    </div>

                    {showResults[quiz.id] && (
                      <motion.button
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="flex items-center space-x-2 text-cyan-400 hover:text-cyan-300 transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                        <span className="text-sm">View Analysis</span>
                      </motion.button>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Enhanced Community Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          {[
            {
              label: "Active Participants",
              value: "2.5K+",
              icon: Users,
              color: "from-blue-500 to-cyan-500",
              change: "+150 today"
            },
            {
              label: "Live Polls",
              value: quizData.length.toString(),
              icon: Vote,
              color: "from-green-500 to-emerald-500",
              change: "+2 this week"
            },
            {
              label: "Community Score",
              value: "4.8/5",
              icon: Award,
              color: "from-yellow-500 to-orange-500",
              change: "+0.2 this month"
            },
            {
              label: "Accuracy Rate",
              value: "73%",
              icon: Target,
              color: "from-cyan-500 to-teal-500",
              change: "+5% vs last month"
            },
          ].map((stat, index) => {
            const Icon = stat.icon
            return (
              <motion.div
                key={index}
                className="glass-strong rounded-2xl p-6 text-center hover:scale-105 transition-transform duration-300"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
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

        {/* Enhanced Leaderboard */}
        <div className="glass-strong rounded-3xl p-8 md:p-12 mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">
              Community <span className="gradient-text">Leaderboard</span>
            </h2>
            <p className="text-gray-300 max-w-2xl mx-auto">
              See how you rank against other investors in our community
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Top Performers */}
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-white flex items-center space-x-2">
                <Trophy className="w-5 h-5 text-yellow-400" />
                <span>Top Performers</span>
              </h3>
              <div className="space-y-4">
                {[
                  { rank: 1, name: "InvestorPro", score: 2450, badge: "🏆" },
                  { rank: 2, name: "MarketGuru", score: 2380, badge: "🥈" },
                  { rank: 3, name: "StockWizard", score: 2320, badge: "🥉" },
                  { rank: 4, name: "You", score: userScore, badge: "🎯" },
                  { rank: 5, name: "TradeMaster", score: 2180, badge: "⭐" },
                ].map((player, index) => (
                  <motion.div
                    key={index}
                    className={`flex items-center space-x-4 p-4 rounded-xl transition-all duration-300 ${
                      player.name === "You" 
                        ? "bg-gradient-to-r from-cyan-500/20 to-teal-500/20 border border-cyan-500/30" 
                        : "bg-white/5 hover:bg-white/10"
                    }`}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <div className="text-2xl">{player.badge}</div>
                    <div className="flex-1">
                      <div className="font-semibold text-white">{player.name}</div>
                      <div className="text-sm text-gray-400">Rank #{player.rank}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-xl font-bold text-white">{player.score}</div>
                      <div className="text-xs text-gray-400">points</div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Your Stats */}
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-white flex items-center space-x-2">
                <Zap className="w-5 h-5 text-cyan-400" />
                <span>Your Performance</span>
              </h3>
              <div className="space-y-4">
                <div className="glass-subtle rounded-2xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-gray-300">Current Score</span>
                    <span className="text-2xl font-bold text-white">{userScore}</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-3">
                    <motion.div
                      className="h-3 bg-gradient-to-r from-cyan-500 to-teal-500 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min((userScore / 2500) * 100, 100)}%` }}
                      transition={{ duration: 1 }}
                    />
                  </div>
                  <div className="text-xs text-gray-400 mt-2">
                    {Math.round((userScore / 2500) * 100)}% to next level
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="glass-subtle rounded-xl p-4 text-center">
                    <div className="text-2xl font-bold text-white mb-1">{Object.keys(userVotes).length}</div>
                    <div className="text-xs text-gray-400">Polls Answered</div>
                  </div>
                  <div className="glass-subtle rounded-xl p-4 text-center">
                    <div className="text-2xl font-bold text-white mb-1">85%</div>
                    <div className="text-xs text-gray-400">Accuracy</div>
                  </div>
                  <div className="glass-subtle rounded-xl p-4 text-center">
                    <div className="text-2xl font-bold text-white mb-1">12</div>
                    <div className="text-xs text-gray-400">Streak</div>
                  </div>
                  <div className="glass-subtle rounded-xl p-4 text-center">
                    <div className="text-2xl font-bold text-white mb-1">4.6</div>
                    <div className="text-xs text-gray-400">Avg Rating</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Call to Action */}
        <div className="text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="glass-strong rounded-3xl p-8 md:p-12"
          >
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-white mb-4">
                {quizCompleted ? "Quiz Completed! 🎉" : "Join the Investment Community"}
              </h2>
              <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                {quizCompleted 
                  ? "You've answered all questions! Share your insights and help others make better investment decisions."
                  : "Share your insights, learn from others, and make better investment decisions together."
                }
              </p>
            </div>

            <div className="flex flex-wrap justify-center gap-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="btn btn-primary flex items-center space-x-2"
              >
                <Sparkles className="w-4 h-4" />
                <span>Create Your Poll</span>
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="btn btn-secondary flex items-center space-x-2"
              >
                <Download className="w-4 h-4" />
                <span>Download Results</span>
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="btn btn-ghost flex items-center space-x-2"
              >
                <Share2 className="w-4 h-4" />
                <span>Share with Friends</span>
              </motion.button>
            </div>

            {quizCompleted && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mt-8 p-6 bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30 rounded-2xl"
              >
                <div className="flex items-center justify-center space-x-3 mb-4">
                  <Trophy className="w-8 h-8 text-yellow-400" />
                  <span className="text-xl font-bold text-white">Achievement Unlocked!</span>
                </div>
                <p className="text-green-400 text-center">
                  You&apos;ve completed the IPO Investment Quiz with a score of {userScore} points!
                </p>
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default QuizPage