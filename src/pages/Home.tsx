import { useState, lazy, Suspense } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MapPin, Search, Navigation, Menu, X, ArrowRight, Car, CheckCircle2, Smartphone, Map
} from 'lucide-react';

// Lazy load heavy components
const LiquidButton = lazy(() => import('@/components/ui/liquid-glass-button').then(m => ({ default: m.LiquidButton })));
const BeamsBackground = lazy(() => import('@/components/ui/beams-background').then(m => ({ default: m.BeamsBackground })));
const StaggerTestimonials = lazy(() => import('@/components/ui/stagger-testimonials').then(m => ({ default: m.StaggerTestimonials })));
const GlobePulse = lazy(() => import('@/components/ui/cobe-globe-pulse').then(m => ({ default: m.GlobePulse })));
const AnimatedRoadmap = lazy(() => import('@/components/ui/hero-section-5').then(m => ({ default: m.AnimatedRoadmap })));
const DarkGrid = lazy(() => import('@/components/ui/dark-grid'));

// Loading fallback
const LoadingFallback = () => <div className="w-full h-full flex items-center justify-center"><div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" /></div>;

const fadeUp = { hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0 } };

function GlassNavFilter() {
  return (
    <svg className="hidden" aria-hidden="true">
      <defs>
        <filter id="nav-glass" x="0%" y="0%" width="100%" height="100%" colorInterpolationFilters="sRGB">
          <feTurbulence type="fractalNoise" baseFrequency="0.65 0.65" numOctaves={1} seed={2} result="turbulence" />
          <feGaussianBlur in="turbulence" stdDeviation={1} result="blurredNoise" />
          <feDisplacementMap in="SourceGraphic" in2="blurredNoise" scale={8} xChannelSelector="R" yChannelSelector="B" result="displaced" />
          <feGaussianBlur in="displaced" stdDeviation={0.5} result="finalBlur" />
          <feComposite in="finalBlur" in2="finalBlur" operator="over" />
        </filter>
      </defs>
    </svg>
  );
}

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <motion.div
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="fixed top-4 left-0 right-0 z-50 flex justify-center px-4"
    >
      <GlassNavFilter />

      {/* Glass pill container */}
      <div className="relative w-full max-w-4xl">
        {/* Glass distortion layer */}
        <div
          className="absolute inset-0 rounded-2xl overflow-hidden -z-10"
          style={{ backdropFilter: 'blur(20px) url("#nav-glass") saturate(180%)' }}
        />
        {/* Glass surface */}
        <div className="relative rounded-2xl border border-white/10 bg-white/5 shadow-[0_0_0_1px_rgba(255,255,255,0.05),0_8px_32px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.1),inset_0_-1px_0_rgba(0,0,0,0.2)] overflow-hidden">
          {/* Top highlight streak */}
          <div className="absolute top-0 left-8 right-8 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />

          <div className="px-5 py-3 flex items-center justify-between gap-4">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2.5 flex-shrink-0">
              <img src="/logo.png" alt="ParkNav Logo" className="w-8 h-8 rounded-xl object-cover shadow-md" />
              <span className="text-base font-bold text-white tracking-tight">ParkNav</span>
            </Link>

            {/* Nav links */}
            <div className="hidden md:flex items-center gap-6">
              {['Features', 'How it Works', 'Pricing', 'About'].map(item => (
                <a
                  key={item}
                  href={`#${item.toLowerCase().replace(/ /g, '-')}`}
                  className="text-sm font-medium text-white/60 hover:text-white transition-colors duration-200"
                >
                  {item}
                </a>
              ))}
            </div>

            {/* CTA buttons */}
            <div className="hidden md:flex items-center gap-2">
              <button className="px-4 py-1.5 text-sm font-medium text-white/60 hover:text-white transition-colors">
                Login
              </button>
              <Suspense fallback={<div className="w-20 h-8 bg-blue-600/50 rounded-xl animate-pulse" />}>
                <LiquidButton
                  size="sm"
                  className="!rounded-xl text-white font-semibold"
                  onClick={() => window.location.href = '/dashboard'}
                >
                  Sign Up
                </LiquidButton>
              </Suspense>
            </div>

            {/* Mobile hamburger */}
            <button className="md:hidden p-1.5 text-white/60 hover:text-white transition-colors" onClick={() => setMenuOpen(!menuOpen)}>
              {menuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>

          {/* Mobile menu */}
          <AnimatePresence>
            {menuOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden border-t border-white/10"
              >
                <div className="px-5 py-4 space-y-1">
                  {['Features', 'How it Works', 'Pricing', 'About'].map(item => (
                    <a
                      key={item}
                      href={`#${item.toLowerCase().replace(/ /g, '-')}`}
                      className="block py-2.5 text-sm font-medium text-white/60 hover:text-white transition-colors border-b border-white/5 last:border-0"
                      onClick={() => setMenuOpen(false)}
                    >
                      {item}
                    </a>
                  ))}
                  <div className="flex gap-3 pt-3">
                    <Suspense fallback={<div className="flex-1 h-9 bg-gray-800 rounded-xl animate-pulse" />}>
                      <LiquidButton size="sm" className="flex-1 bg-white/10 text-white/70 rounded-xl border border-white/20">Login</LiquidButton>
                      <LiquidButton size="sm" className="flex-1 bg-blue-600/80 text-white rounded-xl border border-blue-500/50">
                        <Link to="/dashboard">Sign Up</Link>
                      </LiquidButton>
                    </Suspense>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}

function HeroSection() {
  return (
    <div className="min-h-screen pt-28 pb-16 flex items-center">
      <div className="max-w-7xl mx-auto px-6 w-full">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div variants={fadeUp} initial="hidden" animate="visible" transition={{ duration: 0.7 }} className="space-y-6">
            <div className="inline-flex items-center gap-2 bg-blue-950/50 border border-blue-900 text-blue-400 text-sm font-medium px-4 py-2 rounded-full">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              Live parking available across Delhi
            </div>
            <h1 className="text-5xl lg:text-6xl font-bold text-white leading-tight">
              Find Parking{' '}<span className="text-blue-400">Instantly</span><br />
              <span className="text-3xl lg:text-4xl text-gray-400 font-semibold">Park Smarter, Not Harder</span>
            </h1>
            <p className="text-lg text-gray-400 leading-relaxed max-w-lg">
              Real-time parking availability across Delhi. Navigate, reserve, and park with confidence using AI-powered smart routing.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/dashboard">
                <Suspense fallback={<div className="w-36 h-12 bg-blue-600/50 rounded-xl animate-pulse" />}>
                  <LiquidButton size="lg" className="bg-blue-600/80 text-white font-semibold rounded-xl border border-blue-500/50">
                    <Search size={18} /> Find Parking
                  </LiquidButton>
                </Suspense>
              </Link>
              <Link to="/map">
                <Suspense fallback={<div className="w-36 h-12 bg-gray-800 rounded-xl animate-pulse" />}>
                  <LiquidButton size="lg" className="bg-white/10 text-white/80 font-semibold rounded-xl border border-white/20">
                    <Map size={18} /> Explore Map
                  </LiquidButton>
                </Suspense>
              </Link>
            </div>
            <div className="flex gap-8 pt-4">
              {[{ label: 'Parking Spots', value: '500+' }, { label: 'Happy Drivers', value: '50K+' }, { label: 'Cities', value: '12' }].map(stat => (
                <div key={stat.label}>
                  <div className="text-2xl font-bold text-white">{stat.value}</div>
                  <div className="text-sm text-gray-500">{stat.label}</div>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, delay: 0.2 }} className="relative flex gap-4 items-start justify-center">
            <Suspense fallback={<LoadingFallback />}>
              {/* Combined: AnimatedRoadmap + parking card info at bottom */}
              <div className="relative w-full max-w-[280px] flex-shrink-0 mt-32 -ml-24">
                <AnimatedRoadmap
                  mapImageSrc="https://www.thiings.co/_next/image?url=https%3A%2F%2Flftz25oez4aqbxpq.public.blob.vercel-storage.com%2Fimage-SsfjxCJh43Hr1dqzkbFWUGH3ICZQbH.png&w=320&q=75"
                  milestones={[
                    { id: 1, name: 'Find Spot', status: 'complete', position: { top: '72%', left: '2%' } },
                    { id: 2, name: 'Navigate', status: 'complete', position: { top: '18%', left: '18%' } },
                    { id: 3, name: 'Book Now', status: 'in-progress', position: { top: '48%', left: '52%' } },
                    { id: 4, name: 'Park!', status: 'pending', position: { top: '12%', right: '2%' } },
                  ]}
                />
              {/* Parking info card at bottom of roadmap */}
              <div className="mt-2 bg-gray-900/80 backdrop-blur-sm rounded-2xl border border-white/10 p-3 flex items-center gap-2 shadow-xl">
                <div className="w-8 h-8 bg-green-900/40 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Car size={15} className="text-green-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-semibold text-white truncate">Connaught Place</div>
                  <div className="text-[10px] text-gray-500">45 spots · ₹60/hr</div>
                </div>
                <Link to="/dashboard" className="px-2.5 py-1 bg-blue-600 text-white text-[10px] font-bold rounded-lg hover:bg-blue-500 transition-colors flex-shrink-0">
                  Book
                </Link>
                <Link to="/map" className="px-2.5 py-1 border border-gray-700 text-gray-400 text-[10px] font-medium rounded-lg hover:bg-gray-800 transition-colors flex-shrink-0 flex items-center gap-1">
                  <Navigation size={10} /> Go
                </Link>
              </div>
              {/* Live updates badge */}
              <motion.div className="absolute -bottom-2 -left-4 bg-gray-900/90 backdrop-blur border border-white/10 rounded-xl shadow-xl p-1.5 flex items-center gap-1.5"
                animate={{ y: [0, 4, 0] }} transition={{ duration: 3, repeat: Infinity, delay: 1 }}>
                <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
                <div className="text-[10px] font-semibold text-gray-300">Live Updates</div>
              </motion.div>
              </div>
            </Suspense>

            {/* Globe */}
            <Suspense fallback={<div className="w-96 h-96 bg-gray-900/50 rounded-full animate-pulse" />}>
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1, delay: 0.5 }}
                className="flex-shrink-0 w-96 lg:w-[480px]"
              >
                <GlobePulse className="w-full" speed={0.004} />
                <p className="text-center text-xs text-gray-500 mt-2">Live across India</p>
              </motion.div>
            </Suspense>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

function FeaturesSection() {
  return (
    <section id="features" className="py-24">
      <Suspense fallback={<LoadingFallback />}>
        <DarkGrid />
      </Suspense>
    </section>
  );
}

function HowItWorksSection() {
  const steps = [
    { num: '01', title: 'Open ParkNav', desc: 'Launch the app and allow location access for personalized results.' },
    { num: '02', title: 'Search Destination', desc: 'Type your destination or choose from suggested locations near you.' },
    { num: '03', title: 'Choose Parking Spot', desc: 'Browse available spots with prices, distance and amenities info.' },
    { num: '04', title: 'Book Instantly', desc: 'Reserve your spot in one tap with instant payment confirmation.' },
    { num: '05', title: 'Navigate & Park', desc: 'Follow turn-by-turn directions and use QR code for entry.' },
  ];

  return (
    <section id="how-it-works" className="py-24">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }}>
            <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl p-8 text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2" />
              <Smartphone size={40} className="mb-6 relative z-10" />
              <h3 className="text-2xl font-bold mb-4 relative z-10">Download ParkNav</h3>
              <p className="text-blue-100 mb-6 relative z-10">Available for iOS and Android. Join 50,000+ drivers who park smarter every day.</p>
              <div className="bg-white/20 rounded-2xl p-4 backdrop-blur relative z-10">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 bg-white/30 rounded-xl flex items-center justify-center"><MapPin size={16} /></div>
                  <div className="flex-1 h-8 bg-white/20 rounded-lg flex items-center px-3">
                    <span className="text-xs text-white/70">Search parking near Connaught Place...</span>
                  </div>
                </div>
                {[{ name: 'CP Parking A', price: '₹60/hr', spots: '45 spots', color: 'bg-green-400' }, { name: 'Palika Bazaar', price: '₹80/hr', spots: '8 spots', color: 'bg-amber-400' }].map((item, i) => (
                  <div key={i} className="flex items-center gap-3 py-2 border-b border-white/10 last:border-0">
                    <div className={`w-3 h-3 ${item.color} rounded-full`} />
                    <span className="text-xs text-white flex-1">{item.name}</span>
                    <span className="text-xs text-white/70">{item.price}</span>
                    <span className="text-xs text-white/50">{item.spots}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          <div>
            <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} transition={{ duration: 0.6 }} className="mb-10">
              <span className="text-blue-400 font-semibold text-sm uppercase tracking-widest">How It Works</span>
              <h2 className="text-4xl font-bold text-white mt-3">Park in 5 simple steps</h2>
            </motion.div>
            <div className="space-y-5">
              {steps.map((step, i) => (
                <motion.div key={step.num} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }} className="flex gap-5 items-start">
                  <div className="w-12 h-12 bg-blue-600 text-white rounded-2xl flex items-center justify-center font-bold text-sm flex-shrink-0">{step.num}</div>
                  <div className="flex-1 pt-1">
                    <h3 className="text-base font-semibold text-white mb-1">{step.title}</h3>
                    <p className="text-sm text-gray-500 leading-relaxed">{step.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
            <div className="flex gap-4 mt-8">
              <Link to="/dashboard" className="relative inline-flex items-center gap-2 h-9 px-4 bg-blue-600/80 text-white font-semibold rounded-xl border border-blue-500/50 hover:bg-blue-600 transition-all shadow-md shadow-blue-950/50">
                Try Demo <ArrowRight size={16} />
              </Link>
              <Suspense fallback={<div className="w-28 h-9 bg-gray-800 rounded-xl animate-pulse" />}>
                <LiquidButton size="default" className="bg-blue-950/60 text-blue-400 font-semibold rounded-xl border border-blue-700/60">
                  Learn More
                </LiquidButton>
              </Suspense>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function AnalyticsSection() {
  const stats = [
    { label: 'Avg. Time Saved', value: '15 min', sub: 'Per parking search', color: 'text-blue-400' },
    { label: 'Parking Spots', value: '500+', sub: 'Across 12 cities', color: 'text-green-400' },
    { label: 'Success Rate', value: '94%', sub: 'Booking accuracy', color: 'text-amber-400' },
    { label: 'Active Users', value: '50K+', sub: 'Daily drivers', color: 'text-indigo-400' },
  ];

  return (
    <section className="py-24">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} transition={{ duration: 0.7 }}>
            <span className="text-blue-400 font-semibold text-sm uppercase tracking-widest">Intelligence</span>
            <h2 className="text-4xl font-bold text-white mt-3 mb-6">Smart Parking Intelligence</h2>
            <p className="text-gray-500 text-lg leading-relaxed mb-8">
              ParkNav analyzes city parking patterns to show you the fastest available spots. Our AI predicts demand so you always find a spot when you need it.
            </p>
            <div className="space-y-3">
              {['Traffic aware routing', 'Live availability updates', 'Smart spot recommendations', 'EV charging station finder'].map(item => (
                <div key={item} className="flex items-center gap-3">
                  <CheckCircle2 size={20} className="text-green-400 flex-shrink-0" />
                  <span className="text-gray-300 font-medium">{item}</span>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }} className="grid grid-cols-2 gap-4">
            {stats.map((stat, i) => (
              <motion.div key={stat.label} initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}
                transition={{ delay: i * 0.1 }} whileHover={{ y: -4 }}
                className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:border-white/20 transition-all backdrop-blur-sm">
                <div className={`text-3xl font-bold ${stat.color} mb-2`}>{stat.value}</div>
                <div className="text-white font-semibold text-sm">{stat.label}</div>
                <div className="text-gray-600 text-xs mt-1">{stat.sub}</div>
              </motion.div>
            ))}
            <div className="col-span-2 bg-white/5 border border-white/10 rounded-2xl p-5 backdrop-blur-sm">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-semibold text-white">Parking Demand Heatmap</span>
                <span className="text-xs text-gray-600">Live</span>
              </div>
              <div className="grid grid-cols-8 gap-1">
                {[...Array(32)].map((_, i) => {
                  const heat = Math.random();
                  return <div key={i} className="h-5 rounded" style={{ backgroundColor: heat > 0.7 ? '#EF4444' : heat > 0.4 ? '#F59E0B' : '#10B981', opacity: 0.6 + heat * 0.4 }} />;
                })}
              </div>
              <div className="flex gap-4 mt-3 text-xs text-gray-600">
                <span className="flex items-center gap-1"><span className="w-2 h-2 bg-green-400 rounded inline-block" /> Low</span>
                <span className="flex items-center gap-1"><span className="w-2 h-2 bg-amber-400 rounded inline-block" /> Medium</span>
                <span className="flex items-center gap-1"><span className="w-2 h-2 bg-red-400 rounded inline-block" /> High</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function TestimonialsSection() {
  return (
    <section className="py-24">
      <div className="max-w-5xl mx-auto px-6">
        <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-center mb-12">
          <span className="text-blue-400 font-semibold text-sm uppercase tracking-widest">Testimonials</span>
          <h2 className="text-4xl font-bold text-white mt-3">Loved by drivers across Delhi</h2>
        </motion.div>
        <Suspense fallback={<LoadingFallback />}>
          <StaggerTestimonials />
        </Suspense>
      </div>
    </section>
  );
}

function CTASection() {
  return (
    <section className="py-24 bg-gradient-to-r from-blue-700 to-indigo-800 relative overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="absolute rounded-full border-2 border-white"
            style={{ width: 200 + i * 150, height: 200 + i * 150, right: -50 + i * 20, top: '50%', transform: 'translateY(-50%)' }} />
        ))}
      </div>
      <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
        <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} transition={{ duration: 0.6 }}>
          <h2 className="text-5xl font-bold text-white mb-5">Ready to park smarter?</h2>
          <p className="text-blue-200 text-lg mb-10 max-w-xl mx-auto">Join 50,000+ drivers who save time every day with ParkNav's intelligent parking system.</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Suspense fallback={<div className="w-40 h-14 bg-white/50 rounded-xl animate-pulse" />}>
              <LiquidButton size="xl" className="bg-white/90 text-blue-700 font-bold rounded-xl border border-white/50">
                <Smartphone size={20} /> Download App
              </LiquidButton>
              <LiquidButton size="xl" className="bg-white/10 text-white font-bold rounded-xl border border-white/30">
                <Link to="/dashboard" className="flex items-center gap-2"><MapPin size={20} /> Open Dashboard</Link>
              </LiquidButton>
            </Suspense>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function Footer() {
  const cols = [
    { title: 'ParkNav', links: ['About Us', 'Our Mission', 'Blog', 'Careers'] },
    { title: 'Features', links: ['Smart Search', 'Live Map', 'Booking', 'Analytics'] },
    { title: 'Company', links: ['Press', 'Partners', 'Investors', 'Legal'] },
    { title: 'Resources', links: ['Documentation', 'API', 'Community', 'Status'] },
    { title: 'Support', links: ['Help Center', 'Contact Us', 'FAQ', 'Report Issue'] },
  ];

  return (
    <footer className="border-t border-white/10 text-gray-500 pt-16 pb-8 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 pb-12 border-b border-white/10">
          {cols.map(col => (
            <div key={col.title}>
              <h4 className="text-white font-semibold mb-4 text-sm">{col.title}</h4>
              <ul className="space-y-2">
                {col.links.map(link => (
                  <li key={link}><a href="#" className="text-sm hover:text-blue-400 transition-colors">{link}</a></li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-blue-600 rounded-lg flex items-center justify-center"><MapPin size={14} color="white" /></div>
            <span className="text-white font-bold">ParkNav</span>
          </div>
          <p className="text-sm text-gray-600">© 2026 ParkNav. All rights reserved. Smart parking for smart cities.</p>
          <div className="flex gap-4 text-sm">
            <a href="#" className="hover:text-blue-400 transition-colors">Privacy</a>
            <a href="#" className="hover:text-blue-400 transition-colors">Terms</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default function Home() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-950 flex items-center justify-center"><LoadingFallback /></div>}>
      <BeamsBackground className="min-h-screen" intensity="strong">
        <Navbar />
        <HeroSection />
        <FeaturesSection />
        <HowItWorksSection />
        <AnalyticsSection />
        <TestimonialsSection />
        <CTASection />
        <Footer />
      </BeamsBackground>
    </Suspense>
  );
}
