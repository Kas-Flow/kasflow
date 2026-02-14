'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Zap, ArrowRight, Wallet, ShieldCheck, Globe, Coins,
  Link as LinkIcon, Star, Check, Code, Sparkles, ChevronRight
} from 'lucide-react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Navbar } from '@/components/navbar';

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '50%']);

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(timer);
  }, []);

  if (!mounted) return null;

  const features = [
    {
      icon: Zap,
      title: "Sub-Second Confirmations",
      description: "Kaspa's BlockDAG delivers instant payment finality. Watch transactions confirm in real-time.",
      color: "bg-neo-yellow",
    },
    {
      icon: ShieldCheck,
      title: "Passkey Security",
      description: "No seed phrases. No passwords. Just your fingerprint. Built on WebAuthn standards.",
      color: "bg-neo-cyan",
    },
    {
      icon: LinkIcon,
      title: "Zero Infrastructure",
      description: "Payment links encode everything in the URL. No database. No server. No monthly fees.",
      color: "bg-neo-pink",
    },
  ];

  const stats = [
    { value: "<100ms", label: "Block Time" },
    { value: "0", label: "Backend Code" },
    { value: "100%", label: "Open Source" },
    { value: "2", label: "npm Packages" },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden selection:bg-neo-green selection:text-black transition-colors duration-500">
      <Navbar />

      {/* --- DIAGONAL HERO SECTION --- */}
      <section className="relative min-h-[90vh] overflow-hidden">
        {/* Animated Grid Background */}
        <div className="absolute inset-0 opacity-20">
          <motion.div
            style={{ y }}
            className="absolute inset-0"
            initial={{ backgroundPosition: '0% 0%' }}
            animate={{ backgroundPosition: ['0% 0%', '100% 100%'] }}
            transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
          >
            <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="1" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
            </svg>
          </motion.div>
        </div>

        {/* Diagonal Split Design */}
        <div className="relative z-10 grid lg:grid-cols-2 gap-0 min-h-[90vh]">
          {/* Left Side - Text Content */}
          <div className="flex items-center justify-center p-8 lg:p-16 bg-gradient-to-br from-background to-muted/30">
            <div className="max-w-xl">
              <motion.div
                initial={{ x: -100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.6 }}
              >
                {/* Badge */}
                <div className="inline-flex items-center gap-2 bg-neo-green border-2 border-border px-4 py-2 rounded-full mb-6 transform -rotate-1 shadow-[4px_4px_0px_0px_var(--border)]">
                  <Sparkles className="w-4 h-4" />
                  <span className="font-black text-sm tracking-wide">FIRST PASSKEY WALLET FOR KASPA</span>
                </div>

                {/* Main Heading */}
                <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black leading-tight mb-6">
                  Payment Links<br />
                  <span className="relative inline-block">
                    <span className="text-muted-foreground">That Just</span>
                    <motion.span
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: 1 }}
                      transition={{ delay: 0.5, duration: 0.5 }}
                      className="absolute bottom-2 left-0 w-full h-3 bg-neo-cyan -z-10"
                    />
                  </span>
                  <br />
                  <span className="bg-neo-pink px-4 inline-block transform rotate-1 border-4 border-border shadow-[6px_6px_0px_0px_var(--border)]">
                    WORK
                  </span>
                </h1>

                <p className="text-xl font-bold text-muted-foreground mb-8 leading-relaxed">
                  No backend. No database. No seed phrases. <br />
                  Just <span className="text-neo-green font-black">instant Kaspa payments</span> with a link.
                </p>

                {/* CTAs */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button size="lg" className="text-lg h-14" asChild>
                    <Link href="/create">
                      Create Payment
                      <ArrowRight className="ml-2 w-5 h-5" />
                    </Link>
                  </Button>
                  <Button size="lg" variant="outline" className="text-lg h-14 bg-card" asChild>
                    <Link href="/docs">
                      <Code className="mr-2 w-5 h-5" />
                      View SDK
                    </Link>
                  </Button>
                </div>

                {/* Tech Stack Pills */}
                <div className="flex flex-wrap gap-3 mt-8">
                  {['WebAuthn', 'Next.js', 'TypeScript', 'Open Source'].map((tech, i) => (
                    <motion.span
                      key={tech}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.8 + i * 0.1 }}
                      className="px-3 py-1 bg-muted border-2 border-border rounded-md text-sm font-bold"
                    >
                      {tech}
                    </motion.span>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>

          {/* Right Side - Visual Demo */}
          <div className="relative flex items-center justify-center p-8 lg:p-16 bg-muted/50">
            <motion.div
              initial={{ x: 100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative w-full max-w-md"
            >
              {/* Floating Card Stack */}
              <div className="relative">
                {/* Card 3 - Back */}
                <motion.div
                  animate={{ rotate: [0, -2, 0], y: [0, -5, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                  className="absolute inset-0 bg-neo-purple border-4 border-border rounded-2xl shadow-[12px_12px_0px_0px_var(--border)] transform rotate-6 scale-95 opacity-60"
                />

                {/* Card 2 - Middle */}
                <motion.div
                  animate={{ rotate: [0, 2, 0], y: [0, 5, 0] }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
                  className="absolute inset-0 bg-neo-cyan border-4 border-border rounded-2xl shadow-[10px_10px_0px_0px_var(--border)] transform rotate-3 scale-97 opacity-80"
                />

                {/* Card 1 - Front (Main) */}
                <motion.div
                  whileHover={{ scale: 1.02, rotate: 0 }}
                  className="relative bg-card border-4 border-border rounded-2xl p-8 shadow-[8px_8px_0px_0px_var(--border)] transform -rotate-2"
                >
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-12 h-12 bg-neo-green rounded-full border-2 border-border flex items-center justify-center">
                      <Wallet className="w-6 h-6" />
                    </div>
                    <span className="text-xs font-bold px-3 py-1 bg-neo-yellow border-2 border-border rounded-full">
                      ACTIVE
                    </span>
                  </div>

                  <div className="mb-6">
                    <p className="text-sm font-bold text-muted-foreground mb-2">SEND TO</p>
                    <p className="font-mono text-xs bg-muted px-3 py-2 rounded border-2 border-border break-all">
                      kaspa:qr7x...8k2m
                    </p>
                  </div>

                  <div className="flex justify-between items-end">
                    <div>
                      <p className="text-sm font-bold text-muted-foreground mb-1">AMOUNT</p>
                      <p className="text-3xl font-black">100 KAS</p>
                    </div>
                    <div className="w-16 h-16 bg-muted border-2 border-border rounded-lg"></div>
                  </div>

                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: '100%' }}
                    transition={{ delay: 1, duration: 1 }}
                    className="absolute bottom-0 left-0 h-2 bg-neo-green"
                  />
                </motion.div>
              </div>

              {/* Floating Icons */}
              <motion.div
                animate={{ y: [-10, 10, -10] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="absolute -top-8 -right-8 w-16 h-16 bg-neo-yellow border-4 border-border rounded-full flex items-center justify-center shadow-[6px_6px_0px_0px_var(--border)]"
              >
                <Zap className="w-8 h-8 fill-black" />
              </motion.div>

              <motion.div
                animate={{ y: [10, -10, 10] }}
                transition={{ duration: 2.5, repeat: Infinity }}
                className="absolute -bottom-6 -left-6 w-14 h-14 bg-neo-pink border-4 border-border rounded-full flex items-center justify-center shadow-[5px_5px_0px_0px_var(--border)]"
              >
                <ShieldCheck className="w-7 h-7" />
              </motion.div>
            </motion.div>
          </div>
        </div>

        {/* Diagonal Divider */}
        <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none">
          <svg className="relative block w-full h-24" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path d="M1200 0L0 120H1200z" fill="currentColor" className="text-muted"></path>
          </svg>
        </div>
      </section>

      {/* --- STATS BAR --- */}
      <section className="relative bg-muted border-y-4 border-border py-12 px-4 transform -skew-y-1">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 transform skew-y-1">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ scale: 0, rotate: -180 }}
              whileInView={{ scale: 1, rotate: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, type: 'spring' }}
              className="text-center"
            >
              <p className="text-4xl md:text-5xl font-black mb-2">{stat.value}</p>
              <p className="text-sm md:text-base font-bold text-muted-foreground uppercase tracking-wide">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* --- FEATURES SECTION (Card Flip Style) --- */}
      <section className="py-24 px-4 bg-background">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-6xl font-black mb-4">
              Why KasFlow?
            </h2>
            <p className="text-xl font-bold text-muted-foreground max-w-2xl mx-auto">
              Built for the speed of Kaspa, designed for the simplicity developers crave.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ y: 100, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                whileHover={{ y: -8, rotate: i === 1 ? 2 : i === 0 ? -2 : 1 }}
                className="group relative bg-card border-4 border-border rounded-2xl p-8 shadow-[8px_8px_0px_0px_var(--border)] hover:shadow-[12px_12px_0px_0px_var(--border)] transition-all cursor-pointer"
              >
                <div className={`inline-flex w-16 h-16 ${feature.color} border-4 border-border rounded-2xl items-center justify-center mb-6 transform group-hover:scale-110 group-hover:rotate-12 transition-transform`}>
                  <feature.icon className="w-8 h-8 text-black" />
                </div>

                <h3 className="text-2xl font-black mb-4">{feature.title}</h3>
                <p className="text-base font-bold text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>

                {/* Arrow indicator */}
                <div className="absolute bottom-8 right-8 opacity-0 group-hover:opacity-100 transition-opacity">
                  <ChevronRight className="w-6 h-6" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* --- CODE SHOWCASE SECTION --- */}
      <section className="py-24 px-4 bg-muted">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl md:text-5xl font-black mb-4">
              Dead Simple SDK
            </h2>
            <p className="text-lg font-bold text-muted-foreground">
              Install. Import. Ship. Three lines to passkey wallets.
            </p>
          </motion.div>

          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            className="bg-card border-4 border-border rounded-2xl overflow-hidden shadow-[12px_12px_0px_0px_var(--border)]"
          >
            {/* Terminal Header */}
            <div className="bg-neo-cyan border-b-4 border-border px-6 py-3 flex items-center gap-2">
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-neo-pink border-2 border-border"></div>
                <div className="w-3 h-3 rounded-full bg-neo-yellow border-2 border-border"></div>
                <div className="w-3 h-3 rounded-full bg-neo-green border-2 border-border"></div>
              </div>
              <span className="font-mono text-sm font-black ml-4 text-black">wallet.ts</span>
            </div>

            {/* Code Content - Dark background in BOTH modes */}
            <div className="p-8 font-mono text-sm bg-gray-950 text-gray-100">
              <div className="mb-4">
                <span className="text-purple-400 font-bold">import</span>{' '}
                <span className="text-cyan-400 font-bold">{`{ PasskeyWallet }`}</span>{' '}
                <span className="text-purple-400 font-bold">from</span>{' '}
                <span className="text-green-400 font-bold">'@kasflow/passkey-wallet'</span>;
              </div>

              <div className="mb-4 text-gray-500 italic">
                <span>{'// Create wallet with Face ID'}</span>
              </div>

              <div className="mb-2">
                <span className="text-purple-400 font-bold">const</span>{' '}
                <span className="text-gray-100">wallet</span>{' '}
                <span className="text-purple-400 font-bold">=</span>{' '}
                <span className="text-purple-400 font-bold">await</span>{' '}
                <span className="text-cyan-400 font-bold">PasskeyWallet</span>
                <span className="text-gray-100">.</span>
                <span className="text-amber-400 font-bold">create</span>
                <span className="text-gray-100">();</span>
              </div>

              <div className="mb-2">
                <span className="text-purple-400 font-bold">await</span>{' '}
                <span className="text-gray-100">wallet.</span>
                <span className="text-amber-400 font-bold">sendWithAuth</span>
                <span className="text-gray-100">({'{'}</span>
              </div>

              <div className="ml-4 mb-2">
                <span className="text-green-400 font-bold">to</span>
                <span className="text-gray-100">: </span>
                <span className="text-green-400 font-bold">'kaspa:qr...'</span>
                <span className="text-gray-100">,</span>
              </div>

              <div className="ml-4 mb-2">
                <span className="text-green-400 font-bold">amount</span>
                <span className="text-gray-100">: </span>
                <span className="text-pink-400 font-bold">100n</span>
              </div>

              <div>
                <span className="text-gray-100">{'});'}</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* --- CTA SECTION --- */}
      <section className="py-24 px-4 bg-neo-green border-y-4 border-border">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-6xl font-black mb-6 text-black">
              Start Accepting Kaspa Now
            </h2>
            <p className="text-xl font-bold text-black/80 mb-8">
              Free forever. Open source. No credit card required.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button size="lg" variant="neo" className="text-lg h-16 px-8" asChild>
                <Link href="/create">
                  Create Your First Payment
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="text-lg h-16 px-8 bg-card text-foreground border-4" asChild>
                <Link href="https://github.com/Kas-Flow/kasflow" target="_blank">
                  <Globe className="mr-2 w-5 h-5" />
                  View on GitHub
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="bg-black text-white py-16 border-t-4 border-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center text-center gap-6">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center">
                <Image src="/logo.svg" alt="KasFlow" width={40} height={40} className="w-10 h-10 invert" />
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
