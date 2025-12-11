import { Link } from "react-router-dom";
import { ArrowRight, Bot, Globe, Cpu, Network, Layout, Target, FileText, Box, Hexagon, Triangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { BrowserFrame } from "@/components/ui/browser-frame";
import { BentoGrid, BentoGridItem } from "@/components/ui/bento-grid";
import { ModeToggle } from "@/components/mode-toggle";
import { GridPattern } from "@/components/ui/grid-pattern";
import { cn } from "@/lib/utils";
import { Logo, APP_NAME } from "@/components/ui/logo";

export default function LandingPage() {
    return (
        <div className="flex flex-col min-h-screen bg-background font-sans selection:bg-primary/30 text-foreground overflow-x-hidden transition-colors duration-300">
            {/* Header */}
            <header className="fixed top-0 w-full z-50 border-b border-border/40 bg-background/60 backdrop-blur-2xl">
                <div className="container mx-auto px-6 h-16 flex items-center justify-between">
                    <Logo />
                    {/* Navbar Links Removed as requested */}
                    <div className="flex items-center gap-4">
                        <ModeToggle />
                        <Link to="/auth/login" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                            Sign In
                        </Link>
                        <Button asChild size="sm" className="rounded-full px-6 shadow-md">
                            <Link to="/auth/register">
                                Get Started
                            </Link>
                        </Button>
                    </div>
                </div>
            </header>

            {/* Hero Section */}
            <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden bg-background perspectiva-3d">
                <GridPattern
                    width={50}
                    height={50}
                    x={-1}
                    y={-1}
                    className={cn("[mask-image:radial-gradient(900px_circle_at_center,white,transparent)] opacity-40")}
                />

                {/* Geometric Shapes */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    {/* Cube-like */}
                    <motion.div
                        animate={{ rotate: [0, 90, 180, 270, 360], y: [0, -20, 0] }}
                        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                        className="absolute top-20 left-[10%] opacity-20 text-primary"
                    >
                        <Box className="w-24 h-24 stroke-1" />
                    </motion.div>

                    {/* Hexagon */}
                    <motion.div
                        animate={{ rotate: [360, 0], scale: [1, 1.1, 1] }}
                        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                        className="absolute bottom-40 right-[10%] opacity-20 text-blue-500"
                    >
                        <Hexagon className="w-32 h-32 stroke-1" />
                    </motion.div>

                    {/* Triangle/Pyramid hint */}
                    <motion.div
                        animate={{ rotate: [0, -10, 0], y: [0, 10, 0] }}
                        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute top-40 right-[20%] opacity-10 text-purple-500"
                    >
                        <Triangle className="w-16 h-16 stroke-1 fill-purple-500/10" />
                    </motion.div>

                    <motion.div
                        animate={{ rotate: [0, 45, 0], x: [0, -50, 0] }}
                        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute bottom-1/4 left-1/4 w-40 h-40 border border-primary/10 rounded-full blur-3xl bg-primary/5"
                    />
                </div>

                <div className="container mx-auto px-6 relative z-10 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="inline-flex items-center gap-2 rounded-full border border-border bg-muted/50 px-4 py-1.5 text-sm font-medium text-primary mb-8 backdrop-blur-sm"
                    >
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                        </span>
                        Powered by Vertex AI & Multi-Agent Workflows
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-8 text-foreground relative"
                    >
                        Start Your Career <br /> with <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-rose-600">Superhuman Insight.</span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed"
                    >
                        {APP_NAME} analyzes your profile against millions of data points using Google Cloud's Vertex AI to deliver hyper-personalized career paths, skill gap analysis, and real-time job matches.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                        className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20"
                    >
                        <Button size="lg" className="h-14 px-8 rounded-full text-base font-semibold shadow-lg shadow-primary/20" asChild>
                            <Link to="/dashboard">
                                Evaluate My Profile <ArrowRight className="ml-2 h-5 w-5" />
                            </Link>
                        </Button>
                        <Button size="lg" variant="outline" className="h-14 px-8 rounded-full text-base font-medium" asChild>
                            <Link to="#">
                                View Live Demo
                            </Link>
                        </Button>
                    </motion.div>

                    {/* Browser Frame Mockup */}
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                        className="relative mx-auto max-w-5xl rounded-xl shadow-2xl"
                    >
                        <div className="rounded-xl border bg-background/50 backdrop-blur-sm p-2 ring-1 ring-inset ring-foreground/10 lg:rounded-2xl lg:p-4">
                            <BrowserFrame className="shadow-none border-0 bg-transparent">
                                <div className="aspect-[16/9] w-full bg-slate-100 dark:bg-slate-900 overflow-hidden relative group">
                                    {/* Abstract representation of Dashbaord since we don't have a real screenshot */}
                                    <div className="absolute inset-x-0 top-0 h-16 bg-background border-b flex items-center px-6 justify-between">
                                        <div className="h-4 w-32 bg-muted rounded animate-pulse" />
                                        <div className="flex gap-2">
                                            <div className="h-8 w-8 rounded-full bg-muted animate-pulse" />
                                            <div className="h-8 w-8 rounded-full bg-muted animate-pulse" />
                                        </div>
                                    </div>
                                    <div className="absolute inset-0 top-16 p-6 grid grid-cols-4 gap-4">
                                        <div className="col-span-1 space-y-4">
                                            <div className="h-32 rounded-lg bg-primary/5 border border-primary/10 animate-pulse delay-100" />
                                            <div className="h-32 rounded-lg bg-muted border border-border animate-pulse delay-200" />
                                        </div>
                                        <div className="col-span-3 space-y-4">
                                            <div className="h-48 rounded-lg bg-card border border-border shadow-sm animate-pulse delay-300" />
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="h-32 rounded-lg bg-card border border-border animate-pulse delay-400" />
                                                <div className="h-32 rounded-lg bg-card border border-border animate-pulse delay-500" />
                                            </div>
                                        </div>
                                    </div>
                                    {/* Overlay Text */}
                                    <div className="absolute inset-0 flex items-center justify-center bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <div className="bg-background/80 backdrop-blur text-foreground px-4 py-2 rounded-full text-sm font-semibold shadow-lg">
                                            Live Dashboard Preview
                                        </div>
                                    </div>
                                </div>
                            </BrowserFrame>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Features Section (Bento Grid) */}
            <section className="py-32 bg-muted/20 border-t border-border relative">
                <GridPattern
                    width={30}
                    height={30}
                    x={-1}
                    y={-1}
                    className={cn("[mask-image:radial-gradient(800px_circle_at_center,white,transparent)] opacity-30")}
                />
                <div className="container mx-auto px-6 relative z-10">
                    <div className="text-center max-w-2xl mx-auto mb-20">
                        <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-6">Architected for Precision</h2>
                        <p className="text-muted-foreground text-lg">Detailed analysis powered by a multi-agent system that never sleeps.</p>
                    </div>

                    <BentoGrid>
                        <BentoGridItem
                            title="Skill Gap Analysis"
                            description="Visualize your strengths and weaknesses against market demands."
                            icon={<Target className="h-6 w-6 text-primary" />}
                            className="md:col-span-1"
                            header={<div className="flex-1 w-full h-full min-h-[6rem] rounded-xl bg-card border border-border flex items-center justify-center p-4">
                                <div className="text-xs text-muted-foreground font-mono">def analyze_gap(user, job):<br />&nbsp;&nbsp;return diff(user.skills, job.reqs)</div>
                            </div>}
                        />
                        <BentoGridItem
                            title="Global Job Market"
                            description="Real-time ingestion of job listings from 50+ countries."
                            icon={<Globe className="h-6 w-6 text-blue-500" />}
                            className="md:col-span-1"
                            header={<div className="flex-1 w-full h-full min-h-[6rem] rounded-xl bg-card border border-border flex items-center justify-center relative overflow-hidden">
                                <div className="absolute inset-0 animate-pulse bg-blue-500/5 rounded-xl" />
                                <Globe className="h-12 w-12 text-blue-500/50" />
                            </div>}
                        />
                        <BentoGridItem
                            title="AI Resume Optimization"
                            description="Agentic editor that rewrites your CV to pass ATS filters."
                            icon={<FileText className="h-6 w-6 text-green-500" />}
                            className="md:col-span-1"
                            header={<div className="flex-1 w-full h-full min-h-[6rem] rounded-xl bg-card border border-border p-4 space-y-2">
                                <div className="h-2 w-3/4 bg-muted-foreground/20 rounded animate-pulse" />
                                <div className="h-2 w-1/2 bg-muted-foreground/20 rounded animate-pulse" />
                                <div className="h-2 w-5/6 bg-green-500/20 rounded animate-pulse" />
                            </div>}
                        />
                        <BentoGridItem
                            title="Multi-Agent Workflow"
                            description="Orchestrating specialized agents for research, drafting, and verified insights."
                            icon={<Network className="h-6 w-6 text-purple-500" />}
                            className="md:col-span-3"
                            header={<div className="flex-1 w-full h-full min-h-[6rem] rounded-xl bg-card border border-border flex items-center justify-center gap-8 relative overflow-hidden">
                                <Bot className="h-12 w-12 text-purple-500/50 animate-bounce delay-0" />
                                <div className="h-px w-16 bg-gradient-to-r from-transparent via-border to-transparent" />
                                <Cpu className="h-12 w-12 text-primary/50 animate-bounce delay-100" />
                                <div className="h-px w-16 bg-gradient-to-r from-transparent via-border to-transparent" />
                                <Layout className="h-12 w-12 text-blue-500/50 animate-bounce delay-200" />
                            </div>}
                        />
                    </BentoGrid>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-12 border-t border-border bg-background">
                <div className="container mx-auto px-6">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                        <div className="flex items-center gap-2">
                            <Logo className="scale-75 origin-left" />
                        </div>
                        <div className="text-sm text-muted-foreground">
                            &copy; {new Date().getFullYear()} {APP_NAME} Inc. All rights reserved.
                        </div>
                        <div className="flex gap-6 text-sm text-muted-foreground">
                            <Link to="#" className="hover:text-primary transition-colors">Privacy</Link>
                            <Link to="#" className="hover:text-primary transition-colors">Terms</Link>
                            <Link to="#" className="hover:text-primary transition-colors">Contact</Link>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}
