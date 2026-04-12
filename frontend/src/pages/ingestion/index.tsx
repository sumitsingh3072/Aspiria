import { useState } from "react";
import { Database, Play, CheckCircle2, AlertCircle, Search, MapPin, Building2, Loader2, Briefcase } from "lucide-react";
import { toast } from "sonner";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import api from "@/lib/api";

interface Job {
    id: number;
    title: string;
    company: string | null;
    location: string | null;
    description: string | null;
    skills: string[] | null;
}

export default function IngestionPage() {
    const [taskId, setTaskId] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState("");
    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: async () => {
            const response = await api.post("/ingestion/jobs");
            return response.data;
        },
        onSuccess: (data) => {
            setTaskId(data.task_id);
            toast.success("Ingestion started successfully! Jobs will appear shortly.");
            // Refetch jobs after a delay to give Celery time to finish
            setTimeout(() => {
                queryClient.invalidateQueries({ queryKey: ["ingested-jobs"] });
                queryClient.invalidateQueries({ queryKey: ["jobs-count"] });
            }, 5000);
        },
        onError: (error) => {
            toast.error("Failed to start ingestion.");
            console.error(error);
        },
    });

    const { data: jobs, isLoading: jobsLoading } = useQuery<Job[]>({
        queryKey: ["ingested-jobs", searchTerm],
        queryFn: async () => {
            const params: Record<string, string> = {};
            if (searchTerm) params.search = searchTerm;
            const { data } = await api.get("/jobs/", { params });
            return data;
        },
    });

    const { data: countData } = useQuery<{ count: number }>({
        queryKey: ["jobs-count"],
        queryFn: async () => {
            const { data } = await api.get("/jobs/count");
            return data;
        },
    });

    return (
        <div className="flex flex-col gap-6">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">Data Ingestion</h2>
                <p className="text-muted-foreground">
                    Manage and trigger data ingestion pipelines.
                </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Database className="h-5 w-5" />
                            Job Data Pipeline
                        </CardTitle>
                        <CardDescription>
                            Fetch and process latest job listings from external sources.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="text-sm text-muted-foreground space-y-2">
                            <p>
                                This pipeline connects to configured job boards and APIs to
                                retrieve the latest job market data.
                            </p>
                            <ul className="list-disc list-inside space-y-1 ml-2">
                                <li>Fetches raw data</li>
                                <li>Normalizes fields</li>
                                <li>Generates vector embeddings</li>
                                <li>Updates search index</li>
                            </ul>
                        </div>
                        {taskId && (
                            <Alert className="mt-4 border-green-200 bg-green-50 dark:bg-green-900/10 dark:border-green-900">
                                <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
                                <AlertTitle className="text-green-800 dark:text-green-300">
                                    Ingestion Started
                                </AlertTitle>
                                <AlertDescription className="text-green-700 dark:text-green-400">
                                    Task ID: <span className="font-mono">{taskId}</span>
                                </AlertDescription>
                            </Alert>
                        )}
                    </CardContent>
                    <CardFooter>
                        <Button
                            onClick={() => mutation.mutate()}
                            disabled={mutation.isPending}
                            className="w-full sm:w-auto"
                        >
                            <Play className="mr-2 h-4 w-4" />
                            {mutation.isPending ? "Starting..." : "Run Pipeline Now"}
                        </Button>
                    </CardFooter>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Briefcase className="h-5 w-5" />
                            Ingestion Stats
                        </CardTitle>
                        <CardDescription>
                            Overview of your job data warehouse.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-col items-center justify-center py-6">
                            <span className="text-5xl font-bold text-primary">{countData?.count ?? "—"}</span>
                            <span className="text-sm text-muted-foreground mt-2">Total Jobs Ingested</span>
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button
                            variant="outline"
                            className="w-full sm:w-auto"
                            onClick={() => {
                                queryClient.invalidateQueries({ queryKey: ["ingested-jobs"] });
                                queryClient.invalidateQueries({ queryKey: ["jobs-count"] });
                                toast.info("Refreshed job data.");
                            }}
                        >
                            Refresh Data
                        </Button>
                    </CardFooter>
                </Card>
            </div>

            {/* Ingested Jobs Table */}
            <Card>
                <CardHeader>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                            <CardTitle>Ingested Job Listings</CardTitle>
                            <CardDescription>Browse all jobs currently stored in the database.</CardDescription>
                        </div>
                        <div className="relative w-full sm:w-72">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search by title or company..."
                                className="pl-9"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    {jobsLoading ? (
                        <div className="py-12 flex justify-center">
                            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                        </div>
                    ) : jobs && jobs.length > 0 ? (
                        <div className="space-y-3">
                            {jobs.map((job) => (
                                <div
                                    key={job.id}
                                    className="flex flex-col gap-2 p-4 rounded-lg border bg-card hover:border-primary/40 transition-colors"
                                >
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="space-y-1 min-w-0">
                                            <h4 className="font-semibold text-sm truncate">{job.title}</h4>
                                            <div className="flex items-center gap-3 text-xs text-muted-foreground">
                                                {job.company && (
                                                    <span className="flex items-center gap-1">
                                                        <Building2 className="h-3 w-3" /> {job.company}
                                                    </span>
                                                )}
                                                {job.location && (
                                                    <span className="flex items-center gap-1">
                                                        <MapPin className="h-3 w-3" /> {job.location}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                        <Badge variant="outline" className="text-[10px] shrink-0">
                                            ID: {job.id}
                                        </Badge>
                                    </div>
                                    {job.description && (
                                        <p className="text-xs text-muted-foreground line-clamp-2">
                                            {job.description}
                                        </p>
                                    )}
                                    {job.skills && job.skills.length > 0 && (
                                        <div className="flex flex-wrap gap-1 mt-1">
                                            {job.skills.slice(0, 6).map((skill, i) => (
                                                <Badge key={i} variant="secondary" className="text-[10px] px-1.5 py-0">
                                                    {skill}
                                                </Badge>
                                            ))}
                                            {job.skills.length > 6 && (
                                                <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                                                    +{job.skills.length - 6} more
                                                </Badge>
                                            )}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="py-12 text-center border-2 border-dashed rounded-xl border-zinc-200 dark:border-zinc-800">
                            <Database className="h-8 w-8 mx-auto text-zinc-300 dark:text-zinc-600 mb-3" />
                            <p className="text-zinc-500 font-medium">No jobs ingested yet</p>
                            <p className="text-xs text-zinc-400 mt-1">Click "Run Pipeline Now" above to fetch job data.</p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
