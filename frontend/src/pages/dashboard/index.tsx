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
    MoveRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

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
                    { title: "Jobs Matched", icon: Briefcase, value: "+12", sub: "4 new today" },
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
                            <CardTitle>Recommended Jobs</CardTitle>
                            <CardDescription>
                                AI-selected roles matching your profile.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-6">
                                {[
                                    { role: "Senior Frontend Engineer", crop: "TechCorp Inc.", loc: "Remote", match: "98%", color: "text-green-600" },
                                    { role: "AI Solutions Architect", crop: "InnovateAI", loc: "New York, NY", match: "92%", color: "text-green-600" },
                                    { role: "Full Stack Developer", crop: "StartupHub", loc: "San Francisco, CA", match: "85%", color: "text-yellow-600" }
                                ].map((job, i) => (
                                    <div key={i} className="flex items-center group cursor-pointer">
                                        <div className="space-y-1">
                                            <p className="text-sm font-medium leading-none group-hover:text-primary transition-colors">
                                                {job.role}
                                            </p>
                                            <p className="text-xs text-muted-foreground">
                                                {job.crop} • {job.loc}
                                            </p>
                                        </div>
                                        <div className={`ml-auto font-medium text-sm ${job.color}`}>{job.match}</div>
                                    </div>
                                ))}

                                <Button variant="outline" className="w-full text-xs h-8">
                                    View All Recommendations <MoveRight className="ml-2 h-3 w-3" />
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>
        </motion.div>
    );
}
