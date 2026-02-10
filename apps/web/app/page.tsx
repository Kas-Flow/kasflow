'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Zap, ArrowRight, Wallet, ShieldCheck, Globe, Coins, 
  Link as LinkIcon, Star
} from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Navbar } from '@/components/navbar';

export default function Home() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(timer);
  }, []);

  if (!mounted) return null;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: 'spring' as const, stiffness: 100 },
    },
  };

  const floatingVariants = {
    animate: {
      y: [0, -15, 0],
      rotate: [-1, 1, -1],
      transition: {
        duration: 5,
        repeat: Infinity,
        ease: "easeInOut" as const
      }
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden selection:bg-neo-green selection:text-black transition-colors duration-500">
      <Navbar />

      {/* --- HERO SECTION --- */}
      <section className="relative pt-20 pb-20 lg:pt-32 lg:pb-32 overflow-hidden">
        {/* Background Blobs */}
        <motion.div 
          animate={{ scale: [1, 1.1, 1], opacity: [0.2, 0.3, 0.2] }}
          transition={{ duration: 8, repeat: Infinity }}
          className="absolute top-20 right-[10%] w-64 h-64 bg-neo-pink rounded-full border-4 border-black blur-3xl"
        />
        <motion.div 
          animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 10, repeat: Infinity, delay: 1 }}
          className="absolute bottom-20 left-[5%] w-72 h-72 bg-neo-cyan rounded-full border-4 border-black blur-3xl"
        />
        
        {/* --- FLOATING ELEMENTS --- */}
        <motion.div 
          variants={floatingVariants}
          animate="animate"
          className="absolute top-32 left-[5%] hidden md:flex items-center justify-center w-24 h-24 bg-neo-yellow border-4 border-border rounded-full shadow-[6px_6px_0px_0px_var(--border)]"
        >
           <Zap className="w-12 h-12 text-black" fill="currentColor" />
        </motion.div>

        <motion.div 
          animate={{ 
            y: [0, 20, 0], 
            rotate: [12, -5, 12],
            transition: { duration: 7, repeat: Infinity }
          }}
          className="absolute top-40 right-[10%] hidden md:flex items-center justify-center w-20 h-20 bg-neo-cyan border-4 border-border rounded-full shadow-[5px_5px_0px_0px_var(--border)]"
        >
           <ShieldCheck className="w-10 h-10 text-black" />
        </motion.div>

        <motion.div 
          animate={{ 
            y: [0, -30, 0],
            transition: { duration: 4, repeat: Infinity, ease: "easeOut" }
          }}
          className="absolute bottom-10 right-[5%] hidden lg:flex items-center justify-center w-32 h-32 bg-neo-green border-4 border-border rounded-full shadow-[8px_8px_0px_0px_var(--border)]"
        >
           <Wallet className="w-16 h-16 text-black" />
        </motion.div>

        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-32 left-[15%] hidden lg:flex items-center justify-center w-16 h-16 bg-neo-pink border-4 border-border rounded-full shadow-[3px_3px_0px_0px_var(--border)]"
        >
           <LinkIcon className="w-8 h-8 text-black" />
        </motion.div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-7xl mx-auto px-4 relative z-10 text-center"
        >
          {/* Badge */}
          <motion.div variants={itemVariants} className="inline-flex items-center gap-2 bg-card border-2 border-border px-6 py-2 rounded-full shadow-[4px_4px_0px_0px_var(--border)] mb-8 transform hover:scale-105 transition-transform cursor-default">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-neo-green opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-neo-green"></span>
            </span>
            <span className="font-bold text-sm tracking-wide font-mono uppercase">Live on Kaspa Mainnet</span>
          </motion.div>

          {/* Main Heading */}
          <motion.h1 variants={itemVariants} className="text-5xl sm:text-7xl lg:text-8xl font-black leading-[0.9] tracking-tighter mb-8">
            ACCEPT <br />
            <span className="relative inline-block px-4 mx-2">
              <motion.span 
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{ delay: 0.8, duration: 0.5 }}
                className="absolute inset-0 bg-neo-cyan border-4 border-border transform -rotate-2 shadow-[8px_8px_0px_0px_var(--border)]"
              ></motion.span>
              <span className="relative text-black">KASPA</span>
            </span>
            <br /> IN MILLISECONDS
          </motion.h1>

          <motion.p variants={itemVariants} className="text-xl sm:text-2xl font-bold text-muted-foreground max-w-3xl mx-auto mb-12 leading-relaxed font-sans">
            Create payment links, showcase Kaspa&apos;s speed with
            <span className="mx-2 bg-neo-yellow px-2 border-2 border-border rounded-md text-black shadow-[2px_2px_0px_0px_var(--border)] inline-block transform rotate-1">instant</span> 
            confirmations. No backend needed.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <Button size="lg" variant="neo" className="h-16 px-8 text-xl" asChild>
              <Link href="/create">
                Create Payment Link
                <ArrowRight className="ml-2 w-6 h-6" />
              </Link>
            </Button>
            
            <Button size="lg" variant="outline" className="h-16 px-8 text-xl bg-card" asChild>
              <Link href="/docs">
                Read Documentation
              </Link>
            </Button>
          </motion.div>

          {/* Social Proof */}
          <motion.div variants={itemVariants} className="mt-16 flex items-center justify-center gap-4">
             <div className="flex items-center gap-1">
                {[1,2,3,4,5].map(i => (
                  <motion.div
                    key={i}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 1.2 + i * 0.1 }}
                  >
                    <Star className="h-5 w-5 fill-neo-yellow text-black" />
                  </motion.div>
                ))}
              </div>
              <p className="font-bold text-lg">Powered by BlockDAG Technology</p>
          </motion.div>
        </motion.div>
      </section>

      {/* --- MARQUEE SECTION --- */}
      <div className="border-y-4 border-border bg-neo-pink overflow-hidden py-6 -rotate-1 scale-105 z-20 relative">
        <motion.div 
          animate={{ x: [0, -1000] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="flex whitespace-nowrap"
        >
          {[...Array(20)].map((_, i) => (
            <div key={i} className="flex items-center mx-8">
              <span className="text-4xl font-black text-white stroke-black" style={{WebkitTextStroke: "2px black"}}>INSTANT FINALITY</span>
              <Zap className="w-8 h-8 ml-8 text-black fill-neo-yellow" />
              <span className="text-4xl font-black text-white stroke-black" style={{WebkitTextStroke: "2px black"}}>PASSKEY WALLETS</span>
              <Wallet className="w-8 h-8 ml-8 text-black fill-neo-cyan" />
              <span className="text-4xl font-black text-white stroke-black" style={{WebkitTextStroke: "2px black"}}>NO BACKEND</span>
              <LinkIcon className="w-8 h-8 ml-8 text-black" />
            </div>
          ))}
        </motion.div>
      </div>

      {/* --- FEATURES SECTION --- */}
      <section className="py-24 px-4 bg-background">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-5xl md:text-7xl font-black mb-4">
              WHY <span className="bg-neo-green px-4 border-4 border-border shadow-[6px_6px_0px_0px_var(--border)] inline-block transform rotate-1 text-black">KASFLOW?</span>
            </h2>
            <p className="text-2xl font-bold text-muted-foreground">The fastest way to accept crypto payments.</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Instant Confirmations",
                desc: "Leverage Kaspa's BlockDAG for sub-second finality. Don't make your users wait.",
                icon: Zap,
                color: "bg-neo-yellow",
                iconColor: "text-neo-yellow",
                rotate: 3
              },
              {
                title: "Passkey Security",
                desc: "Non-custodial wallets secured by device biometrics. No seed phrases to lose.",
                icon: ShieldCheck,
                color: "bg-neo-cyan",
                iconColor: "text-neo-cyan",
                rotate: -2
              },
              {
                title: "Simple Links",
                desc: "Generate payment links instantly. Share anywhere. No complex backend setup required.",
                icon: LinkIcon,
                color: "bg-neo-pink",
                iconColor: "text-neo-pink",
                rotate: 2
              }
            ].map((feature, i) => (
              <motion.div
                key={i}
                initial={{ scale: 0.9, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                whileHover={{ y: -10, rotate: feature.rotate }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2 }}
                className={`${feature.color} border-4 border-border p-8 shadow-[8px_8px_0px_0px_var(--border)] transition-all group cursor-default`}
              >
                <div className="w-16 h-16 bg-black rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform border-2 border-black">
                  <feature.icon className={`h-8 w-8 ${feature.iconColor}`} />
                </div>
                <h3 className="text-3xl font-black mb-4 text-black">{feature.title}</h3>
                <p className="text-lg font-bold text-black/80">
                  {feature.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* --- STATS SECTION --- */}
      <section className="py-24 border-t-4 border-border bg-neo-purple relative overflow-hidden">
         {/* Background Pattern */}
         <div className="absolute inset-0 opacity-10" style={{backgroundImage: 'radial-gradient(#000 2px, transparent 2px)', backgroundSize: '20px 20px'}}></div>
         
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { label: 'Confirmation', value: '~1s', icon: Zap },
              { label: 'Backend Code', value: '0', icon: Coins },
              { label: 'Security', value: 'Biometric', icon: ShieldCheck },
              { label: 'License', value: 'MIT', icon: Globe }
            ].map((stat, idx) => (
              <motion.div 
                key={idx}
                initial={{ y: 20, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="bg-card border-4 border-border p-6 rounded-2xl shadow-[6px_6px_0px_0px_var(--border)] hover:-translate-y-2 transition-transform"
              >
                <div className="flex justify-center mb-4">
                   <stat.icon className="w-8 h-8 text-foreground" />
                </div>
                <div className="text-4xl md:text-5xl font-black mb-2">{stat.value}</div>
                <div className="text-sm font-black uppercase tracking-widest text-muted-foreground">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* --- CTA SECTION --- */}
      <section className="py-24 px-4 bg-neo-green border-t-4 border-border">
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto text-center"
        >
          <h2 className="text-5xl md:text-7xl font-black mb-8 text-black">
            READY TO START?
          </h2>
          <p className="text-2xl font-bold mb-12 max-w-2xl mx-auto text-black/80">
            Create your first Kaspa payment link in seconds. It&apos;s free and open source.
          </p>
          <Button size="lg" className="h-20 px-12 text-2xl bg-black text-white border-4 border-white hover:bg-gray-900 shadow-[8px_8px_0px_0px_#fff]" asChild>
            <Link href="/create">
              Get Started Now
            </Link>
          </Button>
        </motion.div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="bg-black text-white py-16 border-t-4 border-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center text-center gap-6">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-neo-green rounded-lg flex items-center justify-center border-2 border-white shadow-[3px_3px_0px_0px_#fff]">
                <span className="text-black font-black text-lg">K</span>
              </div>
              <span className="font-black text-2xl">KasFlow</span>
            </div>

            {/* Tagline */}
            <p className="text-gray-400 font-bold max-w-md">
              The fastest way to accept Kaspa payments. Open source and free forever.
            </p>

            {/* Divider */}
            <div className="w-24 h-1 bg-neo-green rounded-full" />

            {/* Copyright */}
            <p className="text-gray-500 text-sm font-medium">
              © 2026 KasFlow. Built with passion for the Kaspathon.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
