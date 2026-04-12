import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Briefcase,
    Target,
    TrendingUp,
    Award,
    MoveRight,
    Building2,
    MapPin,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import api from "@/lib/api";
import { Badge } from "@/components/ui/badge";

interface Job {
    id: number;
    title: string;
    company: string | null;
    location: string | null;
    description: string | null;
    skills: string[] | null;
}

const container = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1
        }
    }
};

const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 }
};

export default function DashboardPage() {
    // Auto-trigger pipeline on login (runs once per mount)
    const triggeredRef = useRef(false);
    useEffect(() => {
        if (!triggeredRef.current) {
            triggeredRef.current = true;
            api.post("/ingestion/auto-trigger").catch(() => {
                // Silently fail — profile might be incomplete or cooldown active
            });
        }
    }, []);

    const { data: countData } = useQuery<{ count: number }>({
        queryKey: ["jobs-count"],
        queryFn: async () => {
            const { data } = await api.get("/jobs/count");
            return data;
        },
    });

    const { data: recentJobs } = useQuery<Job[]>({
        queryKey: ["recent-jobs-dashboard"],
        queryFn: async () => {
            const { data } = await api.get("/jobs/?limit=5");
            return data;
        },
    });

    const jobCount = countData?.count ?? 0;

    return (
        <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="flex flex-1 flex-col gap-4 p-4 pt-0"
        >
            <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
                <div className="flex gap-2">
                    <div className="px-2 py-1 rounded-md bg-primary/10 text-primary text-xs font-medium border border-primary/20">Vertex AI Active</div>
                    <div className="px-2 py-1 rounded-md bg-muted text-muted-foreground text-xs font-medium border border-border">Global Mode</div>
                </div>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {[
                    { title: "Profile Strength", icon: Award, value: "85%", sub: "Top 15% of candidates" },
                    { title: "Jobs Ingested", icon: Briefcase, value: `${jobCount}`, sub: jobCount > 0 ? "From latest pipeline run" : "Run pipeline to ingest" },
                    { title: "Skills Verified", icon: Target, value: "14/20", sub: "2 pending verification" },
                    { title: "Interview Readiness", icon: TrendingUp, value: "High", sub: "Based on recent mock tests" }
                ].map((stat, i) => (
                    <motion.div variants={item} key={i}>
                        <Card className="hover:border-primary/50 transition-colors cursor-pointer shadow-sm">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">
                                    {stat.title}
                                </CardTitle>
                                <stat.icon className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{stat.value}</div>
                                <p className="text-xs text-muted-foreground">
                                    {stat.sub}
                                </p>
                            </CardContent>
                        </Card>
                    </motion.div>
                ))}
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <motion.div variants={item} className="col-span-4">
                    <Card className="col-span-4 shadow-sm h-full">
                        <CardHeader>
                            <CardTitle>Skill Growth Analysis</CardTitle>
                            <CardDescription>
                                Your proficiency progress over the last 6 months.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="pl-2">
                            <div className="h-[200px] flex items-center justify-center text-muted-foreground border-2 border-dashed border-border rounded-md bg-muted/20">
                                Chart Area: Python, React, Data Analysis
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
                <motion.div variants={item} className="col-span-3">
                    <Card className="col-span-3 shadow-sm h-full">
                        <CardHeader>
                            <CardTitle>Latest Ingested Jobs</CardTitle>
                            <CardDescription>
                                Most recent jobs from the data pipeline.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-5">
                                {recentJobs && recentJobs.length > 0 ? (
                                    recentJobs.map((job) => (
                                        <div key={job.id} className="flex items-start group cursor-pointer">
                                            <div className="space-y-1 min-w-0 flex-1">
                                                <p className="text-sm font-medium leading-none group-hover:text-primary transition-colors truncate">
                                                    {job.title}
                                                </p>
                                                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                                    {job.company && (
                                                        <span className="flex items-center gap-1 truncate">
                                                            <Building2 className="h-3 w-3 shrink-0" /> {job.company}
                                                        </span>
                                                    )}
                                                    {job.location && (
                                                        <span className="flex items-center gap-1 truncate">
                                                            <MapPin className="h-3 w-3 shrink-0" /> {job.location}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                            <Badge variant="outline" className="text-[10px] ml-2 shrink-0">#{job.id}</Badge>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center py-4 text-sm text-muted-foreground">
                                        No jobs ingested yet. Run the pipeline first.
                                    </div>
                                )}

                                <Button variant="outline" className="w-full text-xs h-8" asChild>
                                    <Link to="/ingestion">
                                        View All Jobs <MoveRight className="ml-2 h-3 w-3" />
                                    </Link>
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>
        </motion.div>
    );
}

