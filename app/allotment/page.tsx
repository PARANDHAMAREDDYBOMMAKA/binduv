"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { 
  Search, 
  AlertCircle, 
  CheckCircle, 
  User, 
  FileText, 
  Building, 
  ArrowLeft, 
  Sparkles,
  Shield,
  TrendingUp,
  ArrowRight,
  Eye,
  Download,
  Share2
} from 'lucide-react'
import Link from "next/link"

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger)
}

interface AllotmentCheck {
  registrar: string
  companyName: string
  panNumber: string
  applicationNumber?: string
  dpId?: string
  clientId?: string
}

interface AllotmentResult {
  status: string
  shares: number
  amount: string
  refundAmount: string
  applicationNumber: string
  allotmentDate: string
  listingGains: string
  gainPercentage: string
}

const AllotmentPage = () => {
  const [formData, setFormData] = useState<AllotmentCheck>({
    registrar: "",
    companyName: "",
    panNumber: "",
    applicationNumber: "",
    dpId: "",
    clientId: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<AllotmentResult | null>(null)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [allCompanies, setAllCompanies] = useState<Array<{ name: string; sector: string; status?: string; registrar?: string }>>([])
  const [filteredCompanies, setFilteredCompanies] = useState<Array<{ name: string; sector: string; status?: string; registrar?: string }>>([])
  const [loadingCompanies, setLoadingCompanies] = useState(true)
  const [companiesError, setCompaniesError] = useState<string | null>(null)
  const [registrars, setRegistrars] = useState<Array<{ value: string; label: string; icon: string }>>([])
  const [loadingRegistrars, setLoadingRegistrars] = useState(true)
  const pageRef = useRef<HTMLDivElement>(null)
  const heroRef = useRef<HTMLDivElement>(null)

  // Fetch registrars and companies from API on mount - ONLY scraped data
  useEffect(() => {
    const fetchData = async () => {
      // Fetch companies first
      setLoadingCompanies(true)
      setCompaniesError(null)
      try {
        const response = await fetch('/api/allotment/companies')
        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.message || 'Failed to fetch companies')
        }

        if (data.companies && Array.isArray(data.companies)) {
          setAllCompanies(data.companies)
          setFilteredCompanies(data.companies) // Initially show all
          console.log(`Loaded ${data.companies.length} companies from ${data.source}`)
        } else {
          setAllCompanies([])
          setFilteredCompanies([])
          setCompaniesError('No active IPOs found from registrars')
        }
      } catch (error) {
        console.error('Error fetching companies:', error)
        setAllCompanies([])
        setFilteredCompanies([])
        setCompaniesError(error instanceof Error ? error.message : 'Failed to load companies')
      } finally {
        setLoadingCompanies(false)
      }

      // Fetch registrars
      setLoadingRegistrars(true)
      try {
        const response = await fetch('/api/allotment/registrars')
        const data = await response.json()

        if (data.registrars && Array.isArray(data.registrars)) {
          setRegistrars(data.registrars)
          console.log(`Loaded ${data.registrars.length} active registrars`)
        }
      } catch (error) {
        console.error('Error fetching registrars:', error)
      } finally {
        setLoadingRegistrars(false)
      }
    }

    fetchData()
  }, [])

  // Filter companies when registrar changes
  useEffect(() => {
    if (formData.registrar) {
      const filtered = allCompanies.filter(
        company => company.registrar === formData.registrar
      )
      setFilteredCompanies(filtered)
      console.log(`Filtered to ${filtered.length} companies for registrar: ${formData.registrar}`)

      // Reset company selection if current selection is not in filtered list
      if (formData.companyName && !filtered.find(c => c.name === formData.companyName)) {
        setFormData(prev => ({ ...prev, companyName: '' }))
      }
    } else {
      // Show all companies if no registrar selected
      setFilteredCompanies(allCompanies)
    }
  }, [formData.registrar, allCompanies])

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Enhanced page entry animation
      gsap.timeline()
        .fromTo(pageRef.current, 
          { opacity: 0, y: 50 }, 
          { opacity: 1, y: 0, duration: 1.2, ease: "power3.out" }
        )
        .fromTo(".hero-content", 
          { opacity: 0, y: 30, scale: 0.95 }, 
          { opacity: 1, y: 0, scale: 1, duration: 1, ease: "power3.out", stagger: 0.1 }, 
          "-=0.6"
        )
        .fromTo(".form-container", 
          { opacity: 0, y: 40 }, 
          { opacity: 1, y: 0, duration: 1, ease: "power3.out" }, 
          "-=0.4"
        )

      // Scroll-triggered animations
      ScrollTrigger.batch(".animate-on-scroll", {
        onEnter: (elements) => {
          gsap.fromTo(elements, 
            { opacity: 0, y: 60, scale: 0.9 }, 
            { opacity: 1, y: 0, scale: 1, duration: 0.8, ease: "power3.out", stagger: 0.2 }
          )
        },
        once: true
      })

    }, pageRef)

    return () => ctx.revert()
  }, [])

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.registrar) newErrors.registrar = "Please select a registrar"
    if (!formData.companyName) newErrors.companyName = "Please select a company"
    if (!formData.panNumber) newErrors.panNumber = "PAN number is required"
    if (formData.panNumber && !/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(formData.panNumber)) {
      newErrors.panNumber = "Invalid PAN format (e.g., ABCDE1234F)"
    }

    if (formData.registrar === "link-intime" && !formData.applicationNumber) {
      newErrors.applicationNumber = "Application number is required for Link Intime"
    }

    if (
      (formData.registrar === "kfin" || formData.registrar === "bigshare") &&
      (!formData.dpId || !formData.clientId)
    ) {
      newErrors.dpId = "DP ID is required"
      newErrors.clientId = "Client ID is required"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) return

    setIsLoading(true)

    // Enhanced loading animation
    gsap.to(".form-container", {
      scale: 0.98,
      duration: 0.3,
      ease: "power2.out"
    })

    try {
      // Call the backend API to check allotment status
      const response = await fetch('/api/allotment/check', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          registrar: formData.registrar,
          companyName: formData.companyName,
          panNumber: formData.panNumber,
          applicationNumber: formData.applicationNumber,
          dpId: formData.dpId,
          clientId: formData.clientId,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Failed to check allotment status')
      }

      // Transform API response to match the UI format
      const apiResult: AllotmentResult = {
        status: data.status,
        shares: data.shares || 0,
        amount: data.amount || '₹0',
        refundAmount: data.refundAmount || '₹0',
        applicationNumber: data.applicationNumber || formData.applicationNumber || 'N/A',
        allotmentDate: data.allotmentDate || new Date().toISOString().split('T')[0],
        listingGains: data.listingGains || '₹0',
        gainPercentage: data.gainPercentage || '0%',
      }

      setResult(apiResult)
    } catch (error) {
      console.error('Error checking allotment:', error)
      // Show error result
      setResult({
        status: "error",
        shares: 0,
        amount: "₹0",
        refundAmount: "₹0",
        applicationNumber: "N/A",
        allotmentDate: new Date().toISOString().split('T')[0],
        listingGains: "₹0",
        gainPercentage: "0%",
      })
    } finally {
      setIsLoading(false)

      // Result animation
      gsap.timeline()
        .to(".form-container", {
          scale: 1,
          duration: 0.3,
          ease: "power2.out"
        })
        .fromTo(".result-container",
          { opacity: 0, y: 50, scale: 0.9 },
          { opacity: 1, y: 0, scale: 1, duration: 0.8, ease: "back.out(1.7)" },
          "-=0.2"
        )
    }
  }

  const handleInputChange = (field: keyof AllotmentCheck, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }))
    }
  }

  return (
    <div ref={pageRef} className="min-h-screen pt-24 pb-20 relative overflow-hidden">
      {/* Enhanced Background Effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-20 left-20 w-72 h-72 bg-gradient-to-br from-cyan-500/20 to-teal-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-40 right-20 w-96 h-96 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 left-1/2 w-80 h-80 bg-gradient-to-br from-teal-500/20 to-blue-500/20 rounded-full blur-3xl animate-pulse" />
        
        {/* Geometric patterns */}
        <div className="absolute top-0 left-0 w-full h-full opacity-5">
          <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-white rounded-full animate-pulse" />
          <div className="absolute top-1/3 right-1/3 w-1 h-1 bg-cyan-400 rounded-full animate-pulse delay-700" />
          <div className="absolute bottom-1/4 left-1/2 w-1.5 h-1.5 bg-teal-400 rounded-full animate-pulse delay-1000" />
          <div className="absolute top-1/2 right-1/4 w-1 h-1 bg-cyan-400 rounded-full animate-pulse delay-300" />
        </div>
      </div>

      <div className="container max-w-4xl mx-auto px-6 relative z-10">
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
            className="hero-content space-y-6"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-gradient-to-r from-cyan-500/20 to-teal-500/20 border border-cyan-400/30 backdrop-blur-sm">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span className="text-sm font-medium text-cyan-300">IPO Allotment Checker</span>
            </div>
            
            <h1 className="text-hero">
              Check Your{" "}
              <span className="gradient-text">IPO Allotment</span>
            </h1>
            
            <p className="text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
              Instantly check your IPO allotment status across all major registrars with our advanced tracking system
            </p>

            {/* Stats Row */}
            <div className="flex justify-center space-x-8 pt-8">
              {[
                { label: "Registrars", value: "5+", icon: Building },
                { label: "Success Rate", value: "99.9%", icon: TrendingUp },
                { label: "Secure", value: "SSL", icon: Shield },
              ].map((stat, index) => {
                const Icon = stat.icon
                return (
                  <motion.div
                    key={index}
                    className="text-center"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 + index * 0.1 }}
                  >
                    <div className={`w-12 h-12 bg-gradient-to-br from-cyan-500/20 to-teal-500/20 rounded-xl flex items-center justify-center mx-auto mb-2 backdrop-blur-sm`}>
                      <Icon className="w-6 h-6 text-cyan-400" />
                    </div>
                    <div className="text-lg font-bold text-white">{stat.value}</div>
                    <div className="text-sm text-gray-400">{stat.label}</div>
                  </motion.div>
                )
              })}
            </div>
          </motion.div>
        </div>

        {/* Enhanced Form */}
        <motion.div 
          className="form-container glass-strong rounded-3xl p-8 md:p-12 mb-16 animate-on-scroll"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <form onSubmit={handleSubmit} className="space-y-10">
            {/* Registrar & Company Selection */}
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <label className="block text-sm font-medium text-gray-300 mb-4">
                  <div className="flex items-center space-x-2">
                    <Building className="w-4 h-4 text-cyan-400" />
                    <span>IPO Registrar</span>
                    {loadingRegistrars && (
                      <div className="animate-spin rounded-full h-3 w-3 border-2 border-cyan-400/30 border-t-cyan-400" />
                    )}
                  </div>
                </label>
                <div className="relative">
                  <select
                    value={formData.registrar}
                    onChange={(e) => handleInputChange("registrar", e.target.value)}
                    disabled={loadingRegistrars}
                    className="input w-full appearance-none bg-white/5 border-white/10 focus:border-cyan-500/50 focus:bg-white/10 transition-all duration-300 disabled:opacity-50"
                  >
                    {loadingRegistrars ? (
                      <option value="" className="bg-gray-800">Loading registrars...</option>
                    ) : registrars.length === 0 ? (
                      <option value="" className="bg-gray-800">No active registrars</option>
                    ) : (
                      <>
                        <option value="" className="bg-gray-800">Select Registrar</option>
                        {registrars.map((reg) => (
                          <option key={reg.value} value={reg.value} className="bg-gray-800">
                            {reg.icon} {reg.label}
                          </option>
                        ))}
                      </>
                    )}
                  </select>
                  <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
                {errors.registrar && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-red-400 text-sm flex items-center space-x-2"
                  >
                    <AlertCircle className="w-4 h-4" />
                    <span>{errors.registrar}</span>
                  </motion.p>
                )}
              </div>

              <div className="space-y-4">
                <label className="block text-sm font-medium text-gray-300 mb-4">
                  <div className="flex items-center space-x-2">
                    <Building className="w-4 h-4 text-cyan-400" />
                    <span>Company Name</span>
                    {loadingCompanies && (
                      <div className="animate-spin rounded-full h-3 w-3 border-2 border-cyan-400/30 border-t-cyan-400" />
                    )}
                    {formData.registrar && filteredCompanies.length > 0 && (
                      <span className="text-xs text-cyan-400">({filteredCompanies.length} from {formData.registrar.toUpperCase()})</span>
                    )}
                  </div>
                </label>
                <div className="relative">
                  <select
                    value={formData.companyName}
                    onChange={(e) => handleInputChange("companyName", e.target.value)}
                    disabled={loadingCompanies || !formData.registrar}
                    className="input w-full appearance-none bg-white/5 border-white/10 focus:border-cyan-500/50 focus:bg-white/10 transition-all duration-300 disabled:opacity-50"
                  >
                    {loadingCompanies ? (
                      <option value="" className="bg-gray-800">Loading companies from registrars...</option>
                    ) : !formData.registrar ? (
                      <option value="" className="bg-gray-800">Please select a registrar first</option>
                    ) : filteredCompanies.length === 0 ? (
                      <option value="" className="bg-gray-800">No IPOs for this registrar</option>
                    ) : (
                      <>
                        <option value="" className="bg-gray-800">Select Company ({filteredCompanies.length} available)</option>
                        {filteredCompanies.map((company, index) => (
                          <option key={`${company.name}-${index}`} value={company.name} className="bg-gray-800">
                            {company.name} • {company.sector}
                          </option>
                        ))}
                      </>
                    )}
                  </select>
                  <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
                {companiesError && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-yellow-400 text-sm flex items-center space-x-2"
                  >
                    <AlertCircle className="w-4 h-4" />
                    <span>{companiesError}</span>
                  </motion.p>
                )}
                {errors.companyName && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-red-400 text-sm flex items-center space-x-2"
                  >
                    <AlertCircle className="w-4 h-4" />
                    <span>{errors.companyName}</span>
                  </motion.p>
                )}
              </div>
            </div>

            {/* PAN Number */}
            <div className="space-y-4">
              <label className="block text-sm font-medium text-gray-300 mb-4">
                <div className="flex items-center space-x-2">
                  <User className="w-4 h-4 text-cyan-400" />
                  <span>PAN Number</span>
                </div>
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={formData.panNumber}
                  onChange={(e) => handleInputChange("panNumber", e.target.value.toUpperCase())}
                  placeholder="ABCDE1234F"
                  className="input w-full bg-white/5 border-white/10 focus:border-cyan-500/50 focus:bg-white/10 transition-all duration-300 pl-12"
                />
                <User className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              </div>
              {errors.panNumber && (
                <motion.p 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-red-400 text-sm flex items-center space-x-2"
                >
                  <AlertCircle className="w-4 h-4" />
                  <span>{errors.panNumber}</span>
                </motion.p>
              )}
            </div>

            {/* Conditional Fields */}
            <AnimatePresence>
              {formData.registrar === "link-intime" && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-4"
                >
                  <label className="block text-sm font-medium text-gray-300 mb-4">
                    <div className="flex items-center space-x-2">
                      <FileText className="w-4 h-4 text-cyan-400" />
                      <span>Application Number</span>
                    </div>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={formData.applicationNumber}
                      onChange={(e) => handleInputChange("applicationNumber", e.target.value)}
                      placeholder="Enter application number"
                      className="input w-full bg-white/5 border-white/10 focus:border-cyan-500/50 focus:bg-white/10 transition-all duration-300 pl-12"
                    />
                    <FileText className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  </div>
                  {errors.applicationNumber && (
                    <motion.p 
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-red-400 text-sm flex items-center space-x-2"
                    >
                      <AlertCircle className="w-4 h-4" />
                      <span>{errors.applicationNumber}</span>
                    </motion.p>
                  )}
                </motion.div>
              )}

              {(formData.registrar === "kfin" || formData.registrar === "bigshare") && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="grid md:grid-cols-2 gap-8"
                >
                  <div className="space-y-4">
                    <label className="block text-sm font-medium text-gray-300 mb-4">
                      <div className="flex items-center space-x-2">
                        <FileText className="w-4 h-4 text-cyan-400" />
                        <span>DP ID</span>
                      </div>
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={formData.dpId}
                        onChange={(e) => handleInputChange("dpId", e.target.value)}
                        placeholder="Enter DP ID"
                        className="input w-full bg-white/5 border-white/10 focus:border-cyan-500/50 focus:bg-white/10 transition-all duration-300 pl-12"
                      />
                      <FileText className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    </div>
                    {errors.dpId && (
                      <motion.p 
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-red-400 text-sm flex items-center space-x-2"
                      >
                        <AlertCircle className="w-4 h-4" />
                        <span>{errors.dpId}</span>
                      </motion.p>
                    )}
                  </div>

                  <div className="space-y-4">
                    <label className="block text-sm font-medium text-gray-300 mb-4">
                      <div className="flex items-center space-x-2">
                        <User className="w-4 h-4 text-cyan-400" />
                        <span>Client ID</span>
                      </div>
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={formData.clientId}
                        onChange={(e) => handleInputChange("clientId", e.target.value)}
                        placeholder="Enter Client ID"
                        className="input w-full bg-white/5 border-white/10 focus:border-cyan-500/50 focus:bg-white/10 transition-all duration-300 pl-12"
                      />
                      <User className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    </div>
                    {errors.clientId && (
                      <motion.p 
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-red-400 text-sm flex items-center space-x-2"
                      >
                        <AlertCircle className="w-4 h-4" />
                        <span>{errors.clientId}</span>
                      </motion.p>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Enhanced Submit Button */}
            <motion.button
              type="submit"
              disabled={isLoading}
              className="btn btn-primary w-full relative overflow-hidden group disabled:opacity-50 disabled:cursor-not-allowed"
              whileHover={{ scale: isLoading ? 1 : 1.02 }}
              whileTap={{ scale: isLoading ? 1 : 0.98 }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-600 to-teal-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="relative z-10 flex items-center justify-center space-x-3">
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white/30 border-t-white" />
                    <span>Checking Status...</span>
                  </>
                ) : (
                  <>
                    <Search className="w-5 h-5" />
                    <span>Check Allotment Status</span>
                    <ArrowRight className="w-5 h-5 transform group-hover:translate-x-1 transition-transform duration-300" />
                  </>
                )}
              </div>
            </motion.button>
          </form>
        </motion.div>

        {/* Enhanced Results */}
        <AnimatePresence>
          {result && (
            <motion.div
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 50, scale: 0.9 }}
              className="result-container glass-strong rounded-3xl p-8 md:p-12 mb-16 relative overflow-hidden"
            >
              {/* Success Background Effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 via-transparent to-teal-500/10 rounded-3xl" />
              
              <div className="relative z-10">
                <div className="flex items-center justify-center space-x-3 mb-8">
                  <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-2xl flex items-center justify-center animate-pulse">
                    <CheckCircle className="w-8 h-8 text-white" />
                  </div>
                  <div className="text-center">
                    <h3 className="text-2xl font-bold text-white mb-1">Congratulations!</h3>
                    <p className="text-green-400 font-medium">Your IPO has been allotted</p>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-8 mb-8">
                  <div className="space-y-6">
                    <div className="glass-subtle rounded-2xl p-6">
                      <span className="text-sm text-gray-400 block mb-2">Shares Allotted</span>
                      <p className="text-3xl font-bold text-white">{result.shares}</p>
                    </div>
                    <div className="glass-subtle rounded-2xl p-6">
                      <span className="text-sm text-gray-400 block mb-2">Amount Paid</span>
                      <p className="text-3xl font-bold text-white">{result.amount}</p>
                    </div>
                    <div className="glass-subtle rounded-2xl p-6">
                      <span className="text-sm text-gray-400 block mb-2">Expected Listing Gains</span>
                      <p className="text-3xl font-bold text-green-400">{result.listingGains}</p>
                      <p className="text-sm text-green-400 mt-1">{result.gainPercentage}</p>
                    </div>
                  </div>
                  <div className="space-y-6">
                    <div className="glass-subtle rounded-2xl p-6">
                      <span className="text-sm text-gray-400 block mb-2">Application Number</span>
                      <p className="text-xl font-bold text-white">{result.applicationNumber}</p>
                    </div>
                    <div className="glass-subtle rounded-2xl p-6">
                      <span className="text-sm text-gray-400 block mb-2">Allotment Date</span>
                      <p className="text-xl font-bold text-white">{result.allotmentDate}</p>
                    </div>
                    <div className="glass-subtle rounded-2xl p-6">
                      <span className="text-sm text-gray-400 block mb-2">Refund Amount</span>
                      <p className="text-xl font-bold text-white">{result.refundAmount}</p>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-4 justify-center">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="btn btn-secondary flex items-center space-x-2"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download Certificate</span>
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="btn btn-ghost flex items-center space-x-2"
                  >
                    <Share2 className="w-4 h-4" />
                    <span>Share Result</span>
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="btn btn-ghost flex items-center space-x-2"
                  >
                    <Eye className="w-4 h-4" />
                    <span>View Portfolio</span>
                  </motion.button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Enhanced Help Section */}
        <div className="animate-on-scroll">
          <div className="glass rounded-3xl p-8 md:p-12">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-white mb-4">
                Need <span className="gradient-text">Help?</span>
              </h2>
              <p className="text-gray-300 max-w-2xl mx-auto">
                Different registrars require different information. Here&apos;s what you need for each:
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  title: "Link Intime",
                  description: "Use PAN and Application Number",
                  icon: "🔗",
                  color: "from-cyan-500 to-blue-600"
                },
                {
                  title: "KFin Technologies",
                  description: "Use PAN, DP ID, and Client ID",
                  icon: "⚡",
                  color: "from-teal-500 to-cyan-600"
                },
                {
                  title: "Other Registrars",
                  description: "Follow the required field format",
                  icon: "🏢",
                  color: "from-blue-500 to-indigo-600"
                }
              ].map((item, index) => (
                <motion.div
                  key={index}
                  className="glass-subtle rounded-2xl p-6 text-center hover:scale-105 transition-transform duration-300"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className={`w-16 h-16 bg-gradient-to-br ${item.color} rounded-2xl flex items-center justify-center mx-auto mb-4 text-2xl`}>
                    {item.icon}
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">{item.title}</h3>
                  <p className="text-gray-400">{item.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AllotmentPage