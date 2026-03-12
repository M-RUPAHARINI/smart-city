import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, BarChart2, Shield, Clock, MapPin, CheckCircle, Smartphone } from 'lucide-react';
import { motion } from 'framer-motion';

const Home = () => {
    const fadeIn = {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.6 }
    };

    return (
        <div className="flex flex-col">
            {/* Hero Section */}
            <section className="relative bg-[#1E3A8A] py-32 px-6 overflow-hidden">
                {/* Abstract Background Elements */}
                <div className="absolute top-0 right-0 -m-20 w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-[120px]"></div>
                <div className="absolute -bottom-40 -left-20 w-[400px] h-[400px] bg-accent/10 rounded-full blur-[100px]"></div>

                <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center relative z-10 text-left">
                    <motion.div {...fadeIn}>
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 text-white text-xs font-black uppercase tracking-widest mb-8">
                            <div className="w-2 h-2 rounded-full bg-accent animate-pulse"></div>
                            Civic-Tech Evolution
                        </div>
                        <h1 className="text-5xl md:text-7xl font-black text-white mb-8 leading-[1.1]">
                            The Future of <br />
                            <span className="text-secondary">Public Service.</span>
                        </h1>
                        <p className="text-xl text-blue-100/80 mb-12 max-w-xl leading-relaxed font-medium">
                            Join thousands of citizens using our AI-powered ecosystem to streamline governance, track infrastructure, and build resilient communities together.
                        </p>
                        <div className="flex flex-wrap gap-4">
                            <Link to="/register" className="btn bg-white text-primary hover:bg-slate-100 px-10 py-5 text-lg shadow-2xl shadow-black/20">
                                Start Your Report
                                <ArrowRight className="ml-2" size={20} />
                            </Link>
                            <Link to="/login" className="btn bg-white/10 text-white hover:bg-white/20 border border-white/20 backdrop-blur-md px-10 py-5 text-lg">
                                Admin Access
                            </Link>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8 }}
                        className="hidden lg:block relative"
                    >
                        {/* Fake Dashboard Mockup */}
                        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-4 shadow-2xl rotate-3">
                            <div className="bg-slate-900 rounded-[2rem] overflow-hidden aspect-square flex flex-col items-center justify-center p-12 text-center text-white relative">
                                <div className="absolute inset-0 bg-gradient-to-br from-primary/50 to-transparent"></div>
                                <Smartphone size={120} className="text-accent mb-6 relative" />
                                <h3 className="text-2xl font-bold relative">Smart CRM 2.0</h3>
                                <p className="text-slate-400 mt-2 relative">Mobile first. Citizen centric.</p>
                            </div>
                        </div>
                        {/* Floating elements */}
                        <div className="absolute -top-10 -right-10 bg-accent text-white p-6 rounded-3xl shadow-xl -rotate-6 animate-bounce transition-all duration-[3000ms]">
                            <CheckCircle size={32} />
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-32 px-6 bg-white dark:bg-slate-950">
                <div className="max-w-7xl mx-auto">
                    <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
                        <div className="max-w-2xl">
                            <h2 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white mb-6">Designed for Governance.</h2>
                            <p className="text-xl text-slate-500 font-medium">Our platform bridges the gap between citizens and administration through advanced technology.</p>
                        </div>
                        <div className="hidden md:block h-px flex-1 bg-slate-100 dark:bg-slate-800 mx-12 mb-6"></div>
                    </div>

                    <div className="grid md:grid-cols-3 gap-12">
                        {[
                            {
                                icon: Shield,
                                title: "Encrypted Reporting",
                                desc: "High-security data processing for all citizen submissions and feedback loops.",
                                color: "text-primary bg-primary/5"
                            },
                            {
                                icon: Clock,
                                title: "Real-Time Tracking",
                                desc: "Stay informed with push notifications as your report moves through municipal stages.",
                                color: "text-amber-500 bg-amber-500/5 transition-all"
                            },
                            {
                                icon: BarChart2,
                                title: "Open Data Analytics",
                                desc: "Admins gain deep insights into city hotspots and resource allocation priorities.",
                                color: "text-accent bg-accent/5"
                            }
                        ].map((feature, i) => (
                            <motion.div
                                key={i}
                                whileHover={{ y: -10 }}
                                className="p-8 rounded-[2.5rem] bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 transition-all cursor-default"
                            >
                                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-10 ${feature.color}`}>
                                    <feature.icon size={32} />
                                </div>
                                <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-4">{feature.title}</h3>
                                <p className="text-slate-500 dark:text-slate-400 font-medium leading-relaxed">{feature.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Stats Section / Trusted By */}
            <section className="py-24 bg-slate-50 dark:bg-slate-900/50">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
                        {[
                            { val: "24h", label: "Avg Resolution" },
                            { val: "15k+", label: "Reports Fixed" },
                            { val: "100%", label: "Transparency" },
                            { val: "24/7", label: "Smart Support" }
                        ].map((stat, i) => (
                            <div key={i}>
                                <p className="text-4xl font-black text-primary mb-2">{stat.val}</p>
                                <p className="text-xs font-bold uppercase tracking-widest text-slate-400">{stat.label}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;
