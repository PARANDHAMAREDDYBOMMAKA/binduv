'use client'

import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { 
  TrendingUp, 
  Mail, 
  Phone, 
  MapPin, 
  Github, 
  Twitter, 
  Linkedin,
  Instagram,
  Youtube,
  Send,
  ArrowUp,
  Sparkles,
  Shield,
  Award,
  Users,
  Globe,
  Heart,
  Star,
  Zap
} from 'lucide-react'

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger)
}

const Footer = () => {
  const currentYear = new Date().getFullYear()
  const footerRef = useRef<HTMLElement>(null)
  const newsletterRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Animate footer elements on scroll
      gsap.fromTo('.footer-section', {
        opacity: 0,
        y: 50
      }, {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: 'power3.out',
        stagger: 0.2,
        scrollTrigger: {
          trigger: footerRef.current,
          start: 'top 90%',
          end: 'bottom 20%',
          toggleActions: 'play none none none'
        }
      })

    }, footerRef)

    return () => ctx.revert()
  }, [])

  const quickLinks = [
    { href: '/allotment', label: 'IPO Allotment', icon: TrendingUp },
    { href: '/upcoming', label: 'Upcoming IPOs', icon: Sparkles },
    { href: '/monitoring', label: 'Performance Monitor', icon: TrendingUp },
    { href: '/quiz', label: 'IPO Quiz', icon: Star },
  ]

  const supportLinks = [
    { href: '/help', label: 'Help Center', icon: Shield },
    { href: '/faq', label: 'FAQ', icon: Users },
    { href: '/contact', label: 'Contact Us', icon: Mail },
    { href: '/privacy', label: 'Privacy Policy', icon: Shield },
  ]

  const socialLinks = [
    { href: '#', label: 'Github', icon: Github, color: 'hover:text-gray-300' },
    { href: '#', label: 'Twitter', icon: Twitter, color: 'hover:text-blue-400' },
    { href: '#', label: 'LinkedIn', icon: Linkedin, color: 'hover:text-blue-600' },
    { href: '#', label: 'Instagram', icon: Instagram, color: 'hover:text-pink-400' },
    { href: '#', label: 'YouTube', icon: Youtube, color: 'hover:text-red-500' },
  ]

  const stats = [
    { label: 'Active Users', value: '50K+', icon: Users },
    { label: 'IPOs Tracked', value: '500+', icon: TrendingUp },
    { label: 'Success Rate', value: '99.9%', icon: Award },
    { label: 'Countries', value: '25+', icon: Globe },
  ]

  return (
    <footer ref={footerRef} className="relative z-20 bg-slate-900/80 backdrop-blur-xl border-t border-white/10 overflow-hidden min-h-[600px]">
      {/* Background Effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-20 w-64 h-64 bg-gradient-to-br from-cyan-500/10 to-teal-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-20 w-80 h-80 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute inset-0 opacity-5">
          <div
            className="w-full h-full"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.05'/%3E%3C/svg%3E")`
            }}
          ></div>
        </div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-6 lg:px-8">
        {/* Newsletter Section */}
        <div ref={newsletterRef} className="footer-section py-16 border-b border-white/10">
          <div className="text-center mb-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-gradient-to-r from-cyan-500/20 to-teal-500/20 border border-cyan-400/30 backdrop-blur-sm mb-6"
            >
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span className="text-sm font-medium text-cyan-300">Stay Updated</span>
            </motion.div>
            
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Never Miss an <span className="bg-gradient-to-r from-cyan-400 via-teal-500 to-blue-600 bg-clip-text text-transparent">IPO Opportunity</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Get the latest IPO updates, market insights, and exclusive analysis delivered to your inbox
            </p>
          </div>

          <div className="max-w-md mx-auto">
            <div className="flex items-center space-x-4">
              <div className="relative flex-1">
                <input
                  type="email"
                  placeholder="Enter your email address"
                  className="w-full px-4 py-3 pl-12 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-cyan-500/50 focus:bg-white/10 transition-all duration-300"
                />
                <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-3 bg-gradient-to-r from-cyan-500 via-blue-500 to-blue-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center space-x-2"
              >
                <Send className="w-4 h-4" />
                <span>Subscribe</span>
              </motion.button>
            </div>
            <p className="text-xs text-gray-500 mt-3 text-center">
              Join 50,000+ investors. No spam, unsubscribe anytime.
            </p>
          </div>
        </div>

        {/* Stats Section */}
        <div className="footer-section py-16 border-b border-white/10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon
              return (
                <motion.div
                  key={index}
                  className="text-center"
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="w-16 h-16 bg-gradient-to-br from-cyan-500/20 to-teal-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4 animate-pulse">
                    <Icon className="w-8 h-8 text-cyan-400" />
                  </div>
                  <div className="text-3xl font-bold text-white mb-2">{stat.value}</div>
                  <div className="text-sm text-gray-400">{stat.label}</div>
                </motion.div>
              )
            })}
          </div>
        </div>

        {/* Main Footer Content */}
        <div className="footer-section py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            {/* Company Info */}
            <div className="space-y-6">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-teal-400 rounded-xl flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
                <span className="text-2xl font-bold bg-gradient-to-r from-cyan-400 via-blue-500 to-blue-600 bg-clip-text text-transparent">Binduv UI</span>
              </div>
              <p className="text-gray-400 leading-relaxed">
                Your comprehensive platform for IPO tracking, allotment checking, and investment monitoring. 
                Built with cutting-edge technology for modern investors.
              </p>
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <Shield className="w-4 h-4" />
                <span>Trusted by 50,000+ investors</span>
              </div>
            </div>

            {/* Quick Links */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-white">Quick Links</h3>
              <ul className="space-y-3">
                {quickLinks.map((link, index) => {
                  const Icon = link.icon
                  return (
                    <li key={index}>
                      <motion.a
                        href={link.href}
                        className="group flex items-center space-x-3 text-gray-400 hover:text-white transition-colors duration-300"
                        whileHover={{ x: 5 }}
                      >
                        <Icon className="w-4 h-4 group-hover:text-cyan-400 transition-colors" />
                        <span>{link.label}</span>
                      </motion.a>
                    </li>
                  )
                })}
              </ul>
            </div>

            {/* Support */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-white">Support</h3>
              <ul className="space-y-3">
                {supportLinks.map((link, index) => {
                  const Icon = link.icon
                  return (
                    <li key={index}>
                      <motion.a
                        href={link.href}
                        className="group flex items-center space-x-3 text-gray-400 hover:text-white transition-colors duration-300"
                        whileHover={{ x: 5 }}
                      >
                        <Icon className="w-4 h-4 group-hover:text-cyan-400 transition-colors" />
                        <span>{link.label}</span>
                      </motion.a>
                    </li>
                  )
                })}
              </ul>
            </div>

            {/* Contact & Social */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-white">Get in Touch</h3>
              <div className="space-y-4">
                <div className="flex items-center space-x-3 text-gray-400">
                  <div className="w-8 h-8 bg-white/5 rounded-lg flex items-center justify-center">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-white">Email</div>
                    <div className="text-sm">info@binduv.com</div>
                  </div>
                </div>
                <div className="flex items-center space-x-3 text-gray-400">
                  <div className="w-8 h-8 bg-white/5 rounded-lg flex items-center justify-center">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-white">Phone</div>
                    <div className="text-sm">+91 12345 67890</div>
                  </div>
                </div>
                <div className="flex items-center space-x-3 text-gray-400">
                  <div className="w-8 h-8 bg-white/5 rounded-lg flex items-center justify-center">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-white">Location</div>
                    <div className="text-sm">Hyderabad, India</div>
                  </div>
                </div>
              </div>

              {/* Social Links */}
              <div className="space-y-4">
                <h4 className="text-sm font-medium text-white">Follow Us</h4>
                <div className="flex space-x-3">
                  {socialLinks.map((social, index) => {
                    const Icon = social.icon
                    return (
                      <motion.a
                        key={index}
                        href={social.href}
                        className={`w-10 h-10 bg-white/5 rounded-lg flex items-center justify-center text-gray-400 transition-colors duration-300 ${social.color}`}
                        whileHover={{ scale: 1.1, y: -2 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <Icon className="w-5 h-5" />
                      </motion.a>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="footer-section border-t border-white/10 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
            <div className="flex items-center space-x-4 text-gray-400 text-sm">
              <span>© {currentYear} Binduv UI. All rights reserved.</span>
              <span className="hidden md:block">•</span>
              <span className="hidden md:flex items-center space-x-1">
                <span>Made with</span>
                <Heart className="w-4 h-4 text-red-500" />
                <span>in India</span>
              </span>
            </div>
            
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2 text-sm text-gray-400">
                <Zap className="w-4 h-4 text-green-400" />
                <span>System Status: All Good</span>
              </div>
              <motion.button
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-teal-500 rounded-full flex items-center justify-center hover:shadow-lg transition-shadow duration-300"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <ArrowUp className="w-5 h-5 text-white" />
              </motion.button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer