"use client"

import { useEffect, useRef, useCallback } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Link from 'next/link'
import {
  TrendingUp,
  BarChart3,
  Search,
  Building,
  Users,
  Award,
  ArrowRight,
  CheckCircle,
  Shield,
  Zap,
  Globe,
  Calendar,
  Eye,
  Sparkles,
  Brain,
} from 'lucide-react'

// Register GSAP plugins only once
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger)
}

export default function HomePage() {
  const containerRef = useRef<HTMLDivElement>(null)
  const heroRef = useRef<HTMLDivElement>(null)
  const prefersReducedMotion = useReducedMotion()
  const animationsRef = useRef<{ [key: string]: gsap.core.Tween | gsap.core.Timeline | ScrollTrigger[] }>({})

  // Memoized animation configurations
  const animationConfig = {
    duration: prefersReducedMotion ? 0.1 : 1.2,
    ease: "power3.out",
    stagger: prefersReducedMotion ? 0 : 0.1
  }

  // Cleanup function to prevent memory leaks
  const cleanupAnimations = useCallback(() => {
    Object.values(animationsRef.current).forEach(animation => {
      if (animation) {
        if (Array.isArray(animation)) {
          animation.forEach(trigger => trigger.kill())
        } else if (typeof animation.kill === "function") {
          animation.kill()
        }
      }
    })
    animationsRef.current = {}
    ScrollTrigger.getAll().forEach(trigger => trigger.kill())
  }, [])

  useEffect(() => {
    if (prefersReducedMotion) return

    const ctx = gsap.context(() => {
      // Optimized hero animation with performance settings
      const heroTimeline = gsap.timeline({
        defaults: { ease: animationConfig.ease }
      })
      
      heroTimeline
        .fromTo(heroRef.current, 
          { opacity: 0, y: 60, scale: 0.95 }, 
          { 
            opacity: 1, 
            y: 0, 
            scale: 1, 
            duration: animationConfig.duration,
          }
        )
        .fromTo(".hero-text", 
          { opacity: 0, y: 30 }, 
          { 
            opacity: 1, 
            y: 0, 
            duration: animationConfig.duration * 0.8, 
            stagger: animationConfig.stagger,
          }, 
          "-=0.6"
        )
        .fromTo(".hero-buttons", 
          { opacity: 0, y: 20 }, 
          { 
            opacity: 1, 
            y: 0, 
            duration: animationConfig.duration * 0.6,
          }, 
          "-=0.4"
        )

      animationsRef.current.heroTimeline = heroTimeline

      // Optimized ScrollTrigger batch animations
      const featureCards = ScrollTrigger.batch(".feature-card", {
        onEnter: (elements) => {
          const tween = gsap.fromTo(elements, 
            { opacity: 0, y: 50, scale: 0.95 }, 
            { 
              opacity: 1, 
              y: 0, 
              scale: 1, 
              duration: animationConfig.duration * 0.6, 
              ease: animationConfig.ease, 
              stagger: animationConfig.stagger,
              clearProps: "transform"
            }
          )
          animationsRef.current.featureCards = tween
        },
        once: true,
        start: "top 85%"
      })

      const statsAnimation = ScrollTrigger.batch(".stat-item", {
        onEnter: (elements) => {
          const tween = gsap.fromTo(elements, 
            { opacity: 0, scale: 0.8 }, 
            { 
              opacity: 1, 
              scale: 1, 
              duration: animationConfig.duration * 0.5, 
              ease: "back.out(1.7)", 
              stagger: animationConfig.stagger,
              clearProps: "transform"
            }
          )
          animationsRef.current.statsAnimation = tween
        },
        once: true,
        start: "top 90%"
      })

      // Store batch animations for cleanup
      animationsRef.current.featureCards = featureCards
      animationsRef.current.statsAnimation = statsAnimation

    }, containerRef)

    return () => {
      ctx.revert()
      cleanupAnimations()
    }
  }, [prefersReducedMotion, animationConfig, cleanupAnimations])

  const features = [
    {
      title: "IPO Allotment Checker",
      description: "Check your IPO allotment status across all major registrars instantly",
      icon: Search,
      color: "from-cyan-500 to-blue-600",
      href: "/allotment",
      stats: "99.9% accuracy"
    },
    {
      title: "Upcoming IPOs",
      description: "Stay updated with the latest IPO opportunities and market trends",
      icon: Calendar,
      color: "from-emerald-500 to-teal-600",
      href: "/upcoming",
      stats: "500+ IPOs tracked"
    },
    {
      title: "Performance Monitor",
      description: "Track real-time performance of recently listed IPOs",
      icon: TrendingUp,
      color: "from-teal-500 to-cyan-600",
      href: "/monitoring",
      stats: "Real-time data"
    },
    {
      title: "Investment Quiz",
      description: "Test your knowledge and see community investment strategies",
      icon: Brain,
      color: "from-blue-500 to-indigo-600",
      href: "/quiz",
      stats: "10K+ participants"
    },
  ]

  const stats = [
    { label: "Active Users", value: "50K+", icon: Users },
    { label: "IPOs Tracked", value: "500+", icon: Building },
    { label: "Success Rate", value: "99.9%", icon: Award },
    { label: "Countries", value: "25+", icon: Globe },
  ]

  const benefits = [
    {
      title: "Real-time Updates",
      description: "Get instant notifications about IPO status changes and market movements",
      icon: Zap,
      color: "from-cyan-500 to-teal-500"
    },
    {
      title: "Advanced Analytics",
      description: "Deep insights into market trends and investment opportunities",
      icon: BarChart3,
      color: "from-blue-500 to-cyan-600"
    },
    {
      title: "Secure & Reliable",
      description: "Bank-level security with 99.9% uptime guarantee",
      icon: Shield,
      color: "from-emerald-500 to-teal-600"
    },
    {
      title: "Community Driven",
      description: "Learn from a community of 50,000+ active investors",
      icon: Users,
      color: "from-teal-500 to-blue-600"
    },
  ]

  // Optimized motion variants
  const motionVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: prefersReducedMotion ? 0.1 : 0.6 }
    }
  }

  return (
    <div ref={containerRef} className="min-h-screen relative overflow-hidden">
      {/* Hero Section */}
      <section className="relative z-10 pt-32 pb-20">
        <div className="container max-w-7xl mx-auto px-6">
          <div ref={heroRef} className="text-center">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={motionVariants}
              className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-gradient-to-r from-cyan-500/20 to-teal-500/20 border border-cyan-400/30 backdrop-blur-sm mb-8"
            >
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span className="text-sm font-medium text-cyan-300">Premium IPO Platform</span>
            </motion.div>

            <h1 className="hero-text text-4xl md:text-6xl lg:text-7xl font-extrabold leading-tight mb-8">
              Your Gateway to{" "}
              <span className="bg-gradient-to-r from-cyan-400 via-teal-500 to-blue-600 bg-clip-text text-transparent animate-pulse">
                IPO Success
              </span>
            </h1>
            
            <p className="hero-text text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed mb-12">
              Comprehensive IPO tracking, allotment checking, and investment monitoring platform 
              trusted by 50,000+ investors worldwide
            </p>

            <div className="hero-buttons flex flex-wrap justify-center gap-6 mb-16">
              <motion.div 
                whileHover={prefersReducedMotion ? {} : { scale: 1.05 }} 
                whileTap={prefersReducedMotion ? {} : { scale: 0.95 }}
                transition={{ duration: 0.2 }}
              >
                <Link href="/allotment" className="inline-flex items-center space-x-3 px-8 py-4 bg-gradient-to-r from-cyan-500 via-teal-500 to-blue-600 text-white font-semibold rounded-full shadow-lg hover:shadow-xl hover:shadow-cyan-500/25 transition-all duration-300">
                  <Search className="w-5 h-5" />
                  <span>Check Allotment</span>
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </motion.div>
              
              <motion.div 
                whileHover={prefersReducedMotion ? {} : { scale: 1.05 }} 
                whileTap={prefersReducedMotion ? {} : { scale: 0.95 }}
                transition={{ duration: 0.2 }}
              >
                <Link href="/upcoming" className="inline-flex items-center space-x-3 px-8 py-4 bg-white/10 backdrop-blur-sm text-white font-semibold rounded-full border border-white/20 hover:bg-white/20 transition-all duration-300">
                  <Calendar className="w-5 h-5" />
                  <span>Explore IPOs</span>
                </Link>
              </motion.div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
              {stats.map((stat, index) => {
                const Icon = stat.icon
                return (
                  <motion.div
                    key={index}
                    className="stat-item bg-white/5 backdrop-blur-sm rounded-2xl p-6 text-center hover:scale-105 hover:bg-white/10 transition-all duration-300 border border-white/10"
                    initial="hidden"
                    animate="visible"
                    variants={{
                      hidden: { opacity: 0, scale: 0.8 },
                      visible: { 
                        opacity: 1, 
                        scale: 1,
                        transition: { 
                          delay: prefersReducedMotion ? 0 : index * 0.1 + 0.5,
                          duration: prefersReducedMotion ? 0.1 : 0.6
                        }
                      }
                    }}
                  >
                    <div className="w-12 h-12 bg-gradient-to-br from-cyan-500/20 to-teal-500/20 rounded-xl flex items-center justify-center mx-auto mb-3">
                      <Icon className="w-6 h-6 text-cyan-400" />
                    </div>
                    <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
                    <div className="text-sm text-gray-400">{stat.label}</div>
                  </motion.div>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative z-10 py-20">
        <div className="container max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Everything You Need for <span className="bg-gradient-to-r from-cyan-400 via-teal-500 to-blue-600 bg-clip-text text-transparent">IPO Success</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Powerful tools and insights to make informed investment decisions
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <motion.div
                  key={index}
                  className="feature-card group"
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "-10%" }}
                  variants={{
                    hidden: { opacity: 0, y: 50 },
                    visible: { 
                      opacity: 1, 
                      y: 0,
                      transition: { 
                        delay: prefersReducedMotion ? 0 : index * 0.1,
                        duration: prefersReducedMotion ? 0.1 : 0.6
                      }
                    }
                  }}
                >
                  <Link href={feature.href} className="block">
                    <div className="bg-white/5 backdrop-blur-sm rounded-3xl p-8 hover:scale-105 hover:bg-white/10 transition-all duration-300 cursor-pointer group-hover:shadow-2xl border border-white/10">
                      <div className={`w-16 h-16 bg-gradient-to-br ${feature.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                        <Icon className="w-8 h-8 text-white" />
                      </div>
                      
                      <h3 className="text-xl font-bold text-white mb-4 group-hover:text-cyan-300 transition-colors">
                        {feature.title}
                      </h3>
                      
                      <p className="text-gray-400 mb-4 leading-relaxed">
                        {feature.description}
                      </p>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-cyan-400 font-medium">{feature.stats}</span>
                        <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-cyan-400 group-hover:translate-x-1 transition-all duration-300" />
                      </div>
                    </div>
                  </Link>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="relative z-10 py-20">
        <div className="container max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Why Choose <span className="bg-gradient-to-r from-cyan-400 via-teal-500 to-blue-600 bg-clip-text text-transparent">Binduv UI</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Built for modern investors who demand excellence
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon
              return (
                <motion.div
                  key={index}
                  className="text-center"
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "-10%" }}
                  variants={{
                    hidden: { opacity: 0, y: 30 },
                    visible: { 
                      opacity: 1, 
                      y: 0,
                      transition: { 
                        delay: prefersReducedMotion ? 0 : index * 0.1,
                        duration: prefersReducedMotion ? 0.1 : 0.6
                      }
                    }
                  }}
                >
                  <div className={`w-20 h-20 bg-gradient-to-br ${benefit.color} rounded-2xl flex items-center justify-center mx-auto mb-6`}>
                    <Icon className="w-10 h-10 text-white" />
                  </div>
                  
                  <h3 className="text-xl font-bold text-white mb-4">
                    {benefit.title}
                  </h3>
                  
                  <p className="text-gray-400 leading-relaxed">
                    {benefit.description}
                  </p>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 py-20">
        <div className="container max-w-4xl mx-auto px-6">
          <motion.div 
            className="bg-white/5 backdrop-blur-sm rounded-3xl p-8 md:p-12 text-center border border-white/10"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-10%" }}
            variants={motionVariants}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Ready to Start Your <span className="bg-gradient-to-r from-cyan-400 via-teal-500 to-blue-600 bg-clip-text text-transparent">IPO Journey?</span>
            </h2>
            
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Join thousands of investors who trust Binduv UI for their IPO tracking and analysis needs
            </p>
            
            <div className="flex flex-wrap justify-center gap-6">
              <motion.div 
                whileHover={prefersReducedMotion ? {} : { scale: 1.05 }} 
                whileTap={prefersReducedMotion ? {} : { scale: 0.95 }}
                transition={{ duration: 0.2 }}
              >
                <Link href="/allotment" className="inline-flex items-center space-x-3 px-8 py-4 bg-gradient-to-r from-cyan-500 via-teal-500 to-blue-600 text-white font-semibold rounded-full shadow-lg hover:shadow-xl hover:shadow-cyan-500/25 transition-all duration-300">
                  <Search className="w-5 h-5" />
                  <span>Get Started Free</span>
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </motion.div>
              
              <motion.div 
                whileHover={prefersReducedMotion ? {} : { scale: 1.05 }} 
                whileTap={prefersReducedMotion ? {} : { scale: 0.95 }}
                transition={{ duration: 0.2 }}
              >
                <Link href="/upcoming" className="inline-flex items-center space-x-3 px-8 py-4 bg-white/10 backdrop-blur-sm text-white font-semibold rounded-full border border-white/20 hover:bg-white/20 transition-all duration-300">
                  <Eye className="w-5 h-5" />
                  <span>View Demo</span>
                </Link>
              </motion.div>
            </div>
            
            <div className="mt-8 flex items-center justify-center space-x-6 text-sm text-gray-400">
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-400" />
                <span>Free to use</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-400" />
                <span>No signup required</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-400" />
                <span>Real-time data</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}