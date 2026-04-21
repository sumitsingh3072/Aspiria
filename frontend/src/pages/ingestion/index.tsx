import { useState } from "react";
import {
    Database, Zap, Clock, RefreshCw, Search, MapPin, Building2,
    Loader2, Briefcase, Crown, CheckCircle2, ExternalLink,
    ChevronDown, ChevronUp, ChevronLeft, ChevronRight, Tag, Sparkles, ArrowRight
} from "lucide-react";
import { toast } from "sonner";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { AnimatePresence, motion } from "framer-motion";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import CompilePreview from "@/components/resume/CompilePreview";
import api from "@/lib/api";

interface Job {
    id: number;
    title: string;
    company: string | null;
    location: string | null;
    description: string | null;
    skills: string[] | null;
    source: string | null;
    apply_options: { title: string; link: string }[] | null;
    schedule_type: string | null;
    posted_at: string | null;
}

interface IngestionStatus {
    last_pipeline_run: string | null;
    auto_refresh_enabled: boolean;
    can_trigger: boolean;
    cooldown_remaining_minutes: number | null;
    cooldown_total_minutes: number;
}

const JOBS_PER_PAGE = 10;

import { useEffect, useRef } from "react";

export default function IngestionPage() {
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [expandedJobId, setExpandedJobId] = useState<number | null>(null);
    const [tailoringJobId, setTailoringJobId] = useState<number | null>(null);
    const [isTailoring, setIsTailoring] = useState(false);
    const [tailorResult, setTailorResult] = useState<any>(null);
    const [showTailorModal, setShowTailorModal] = useState(false);
    const queryClient = useQueryClient();

    // Auto-trigger pipeline on page load (same as dashboard)
    const triggeredRef = useRef(false);
    useEffect(() => {
        if (!triggeredRef.current) {
            triggeredRef.current = true;
            api.post("/ingestion/auto-trigger").then((res) => {
                if (res.data.triggered) {
                    toast.success("Pipeline triggered! Jobs will appear shortly.");
                    // Refresh data after a delay for Celery to finish
                    setTimeout(() => {
                        queryClient.invalidateQueries({ queryKey: ["ingested-jobs"] });
                        queryClient.invalidateQueries({ queryKey: ["jobs-count"] });
                        queryClient.invalidateQueries({ queryKey: ["ingestion-status"] });
                    }, 15000);
                }
            }).catch(() => {});
        }
    }, []);

    const manualTrigger = useMutation({
        mutationFn: async () => {
            const { data } = await api.post("/ingestion/force-trigger");
            return data;
        },
        onSuccess: (data) => {
            toast.success("Pipeline started! Jobs will appear in ~15 seconds.");
            setTimeout(() => {
                queryClient.invalidateQueries({ queryKey: ["ingested-jobs"] });
                queryClient.invalidateQueries({ queryKey: ["jobs-count"] });
                queryClient.invalidateQueries({ queryKey: ["ingestion-status"] });
            }, 15000);
        },
        onError: () => {
            toast.error("Failed to trigger pipeline.");
        },
    });

    const { data: ingestionStatus, isLoading: statusLoading } = useQuery<IngestionStatus>({
        queryKey: ["ingestion-status"],
        queryFn: async () => {
            const { data } = await api.get("/ingestion/status");
            return data;
        },
        refetchInterval: 30000,
    });

    const { data: jobs, isLoading: jobsLoading } = useQuery<Job[]>({
        queryKey: ["ingested-jobs", searchTerm],
        queryFn: async () => {
            const params: Record<string, string> = { limit: "200" };
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

    const toggleAutoRefresh = useMutation({
        mutationFn: async () => {
            const { data } = await api.post("/ingestion/auto-refresh/toggle");
            return data;
        },
        onSuccess: (data) => {
            toast.success(data.message);
            queryClient.invalidateQueries({ queryKey: ["ingestion-status"] });
        },
        onError: () => {
            toast.error("Failed to toggle auto-refresh.");
        },
    });

    const formatLastRun = (iso: string | null | undefined) => {
        if (!iso) return "Never";
        return new Date(iso).toLocaleString();
    };

    // Pagination logic
    const totalJobs = jobs?.length ?? 0;
    const totalPages = Math.max(1, Math.ceil(totalJobs / JOBS_PER_PAGE));
    const paginatedJobs = jobs?.slice(
        (currentPage - 1) * JOBS_PER_PAGE,
        currentPage * JOBS_PER_PAGE
    ) ?? [];

    // Reset to page 1 when search changes
    const handleSearch = (val: string) => {
        setSearchTerm(val);
        setCurrentPage(1);
        setExpandedJobId(null);
    };

    const handleTailor = async (jobId: number) => {
        setTailoringJobId(jobId);
        setIsTailoring(true);
        setShowTailorModal(true);
        setTailorResult(null);

        try {
            const { data } = await api.post("/resume/tailor", { job_id: jobId });
            setTailorResult(data);
            toast.success("Resume tailored successfully!");
        } catch (error: any) {
            console.error(error);
            toast.error(error.response?.data?.detail || "Failed to tailor resume");
            setShowTailorModal(false);
        } finally {
            setIsTailoring(false);
            setTailoringJobId(null);
        }
    };

    return (
        <div className="flex flex-col gap-6">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">Job Market Data</h2>
                <p className="text-muted-foreground">
                    Live job listings automatically fetched from Google Jobs.
                </p>
            </div>

            {/* Stats Row */}
            <div className="grid gap-6 md:grid-cols-3">
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="flex items-center gap-2 text-sm font-medium">
                            <Briefcase className="h-4 w-4 text-muted-foreground" />
                            Total Jobs
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-4xl font-bold text-primary">{countData?.count ?? "—"}</div>
                        <p className="text-xs text-muted-foreground mt-1">In database</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="flex items-center gap-2 text-sm font-medium">
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            Last Pipeline Run
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-sm font-semibold">
                            {statusLoading ? "..." : formatLastRun(ingestionStatus?.last_pipeline_run)}
                        </div>
                        {ingestionStatus?.cooldown_remaining_minutes != null && ingestionStatus.cooldown_remaining_minutes > 0 ? (
                            <p className="text-xs text-amber-600 dark:text-amber-400 mt-1">
                                Next run available in {ingestionStatus.cooldown_remaining_minutes} min
                                <span className="text-muted-foreground ml-1">
                                    (of {ingestionStatus.cooldown_total_minutes} min cycle)
                                </span>
                            </p>
                        ) : ingestionStatus?.can_trigger ? (
                            <div className="flex items-center gap-2 mt-2">
                                <p className="text-xs text-green-600 dark:text-green-400 flex items-center gap-1">
                                    <CheckCircle2 className="h-3 w-3" /> Ready
                                </p>
                                <Button
                                    size="sm"
                                    variant="outline"
                                    className="text-xs h-7 px-3"
                                    disabled={manualTrigger.isPending}
                                    onClick={() => manualTrigger.mutate()}
                                >
                                    <RefreshCw className={`h-3 w-3 mr-1 ${manualTrigger.isPending ? "animate-spin" : ""}`} />
                                    {manualTrigger.isPending ? "Running..." : "Refresh Now"}
                                </Button>
                            </div>
                        ) : null}
                    </CardContent>
                </Card>

                <Card className="border-primary/20">
                    <CardHeader className="pb-2">
                        <CardTitle className="flex items-center gap-2 text-sm font-medium">
                            <Crown className="h-4 w-4 text-yellow-500" />
                            Auto-Refresh (Premium)
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium">
                                    {ingestionStatus?.auto_refresh_enabled ? "Active" : "Disabled"}
                                </p>
                                <p className="text-xs text-muted-foreground mt-0.5">
                                    {ingestionStatus?.auto_refresh_enabled
                                        ? "Refreshing every 60 min"
                                        : "Default: every 6 hours"}
                                </p>
                            </div>
                            <Switch
                                checked={ingestionStatus?.auto_refresh_enabled ?? false}
                                onCheckedChange={() => toggleAutoRefresh.mutate()}
                                disabled={toggleAutoRefresh.isPending}
                            />
                        </div>
                    </CardContent>
                </Card>
            </div>

            <Alert className="border-blue-200 bg-blue-50/50 dark:bg-blue-950/20 dark:border-blue-900/50">
                <Zap className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                <AlertTitle className="text-blue-800 dark:text-blue-300">Smart Ingestion</AlertTitle>
                <AlertDescription className="text-blue-700 dark:text-blue-400 text-sm">
                    Jobs are automatically refreshed when you log in (if your profile is complete).
                    Enable <strong>Auto-Refresh</strong> above to reduce the cooldown from 6 hours to 60 minutes.
                </AlertDescription>
            </Alert>

            {/* Job Listings */}
            <Card>
                <CardHeader>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                            <CardTitle>Live Job Listings</CardTitle>
                            <CardDescription>
                                Showing {paginatedJobs.length} of {totalJobs} jobs
                                {searchTerm && ` matching "${searchTerm}"`}
                                {" · "}Page {currentPage} of {totalPages}
                            </CardDescription>
                        </div>
                        <div className="flex gap-2 items-center">
                            <div className="relative w-full sm:w-72">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Search by title or company..."
                                    className="pl-9"
                                    value={searchTerm}
                                    onChange={(e) => handleSearch(e.target.value)}
                                />
                            </div>
                            <Button
                                variant="outline"
                                size="icon"
                                onClick={() => {
                                    queryClient.invalidateQueries({ queryKey: ["ingested-jobs"] });
                                    queryClient.invalidateQueries({ queryKey: ["jobs-count"] });
                                    queryClient.invalidateQueries({ queryKey: ["ingestion-status"] });
                                    toast.info("Refreshed.");
                                }}
                            >
                                <RefreshCw className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    {jobsLoading ? (
                        <div className="py-12 flex justify-center">
                            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                        </div>
                    ) : paginatedJobs.length > 0 ? (
                        <div className="space-y-3">
                            {paginatedJobs.map((job) => {
                                const isExpanded = expandedJobId === job.id;
                                return (
                                    <div
                                        key={job.id}
                                        className={`rounded-lg border bg-card transition-colors cursor-pointer ${
                                            isExpanded
                                                ? "border-primary/50 shadow-md"
                                                : "hover:border-primary/30"
                                        }`}
                                        onClick={() => setExpandedJobId(isExpanded ? null : job.id)}
                                    >
                                        {/* Collapsed Header */}
                                        <div className="flex items-center justify-between p-4 gap-4">
                                            <div className="space-y-1 min-w-0 flex-1">
                                                <div className="flex items-center gap-2">
                                                    <h4 className="font-semibold text-sm truncate">{job.title}</h4>
                                                    {job.schedule_type && (
                                                        <Badge variant="secondary" className="text-[10px] shrink-0">
                                                            {job.schedule_type}
                                                        </Badge>
                                                    )}
                                                </div>
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
                                                    {job.posted_at && (
                                                        <span className="text-muted-foreground/60">
                                                            {job.posted_at}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2 shrink-0">
                                                {job.source && (
                                                    <Badge variant="outline" className="text-[10px]">
                                                        {job.source}
                                                    </Badge>
                                                )}
                                                {isExpanded ? (
                                                    <ChevronUp className="h-4 w-4 text-muted-foreground" />
                                                ) : (
                                                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
                                                )}
                                            </div>
                                        </div>

                                        {/* Expanded Details */}
                                        <AnimatePresence>
                                            {isExpanded && (
                                                <motion.div
                                                    initial={{ height: 0, opacity: 0 }}
                                                    animate={{ height: "auto", opacity: 1 }}
                                                    exit={{ height: 0, opacity: 0 }}
                                                    transition={{ duration: 0.2 }}
                                                    className="overflow-hidden"
                                                >
                                                    <div className="px-4 pb-4 pt-0 border-t space-y-4">
                                                        {/* Description */}
                                                        {job.description && (
                                                            <div className="mt-4">
                                                                <h5 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                                                                    Description
                                                                </h5>
                                                                <p className="text-sm text-foreground/80 whitespace-pre-line leading-relaxed max-h-64 overflow-y-auto">
                                                                    {job.description}
                                                                </p>
                                                            </div>
                                                        )}

                                                        {/* Skills */}
                                                        {job.skills && job.skills.length > 0 && (
                                                            <div>
                                                                <h5 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 flex items-center gap-1">
                                                                    <Tag className="h-3 w-3" /> Qualifications
                                                                </h5>
                                                                <div className="flex flex-wrap gap-1.5">
                                                                    {job.skills.map((skill, i) => (
                                                                        <Badge key={i} variant="secondary" className="text-xs px-2 py-0.5">
                                                                            {skill}
                                                                        </Badge>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        )}

                                                        {/* Meta + Apply Links */}
                                                        <div className="pt-3 border-t space-y-3">
                                                            <div className="flex items-center gap-3 text-xs text-muted-foreground">
                                                                {job.source && <span>Source: {job.source}</span>}
                                                                <span>ID: {job.id}</span>
                                                            </div>
                                                            {job.apply_options && job.apply_options.length > 0 && (
                                                                <div>
                                                                    <h5 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 flex items-center gap-1">
                                                                        <ExternalLink className="h-3 w-3" /> Apply via
                                                                    </h5>
                                                                    <div className="flex flex-wrap gap-2">
                                                                        <Button
                                                                            size="sm"
                                                                            className="bg-primary text-primary-foreground hover:bg-primary/90 h-8"
                                                                            onClick={(e) => {
                                                                                e.stopPropagation();
                                                                                handleTailor(job.id);
                                                                            }}
                                                                            disabled={isTailoring}
                                                                        >
                                                                            <Sparkles className="h-3 w-3 mr-1.5" />
                                                                            Tailor Resume
                                                                        </Button>
                                                                        {job.apply_options.map((opt, i) => (
                                                                            <Button
                                                                                key={i}
                                                                                size="sm"
                                                                                variant={i === 0 ? "default" : "outline"}
                                                                                className="text-xs h-8"
                                                                                onClick={(e) => {
                                                                                    e.stopPropagation();
                                                                                    window.open(opt.link, "_blank");
                                                                                }}
                                                                            >
                                                                                <ExternalLink className="h-3 w-3 mr-1.5" />
                                                                                {opt.title}
                                                                            </Button>
                                                                        ))}
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="py-12 text-center border-2 border-dashed rounded-xl border-zinc-200 dark:border-zinc-800">
                            <Database className="h-8 w-8 mx-auto text-zinc-300 dark:text-zinc-600 mb-3" />
                            <p className="text-zinc-500 font-medium">No jobs found</p>
                            <p className="text-xs text-zinc-400 mt-1">
                                {searchTerm
                                    ? "Try a different search term."
                                    : "Jobs will appear automatically when you log in with a complete profile."}
                            </p>
                        </div>
                    )}

                    {/* Pagination Controls */}
                    {totalPages > 1 && (
                        <div className="flex items-center justify-between mt-6 pt-4 border-t">
                            <p className="text-xs text-muted-foreground">
                                Showing {(currentPage - 1) * JOBS_PER_PAGE + 1}–
                                {Math.min(currentPage * JOBS_PER_PAGE, totalJobs)} of {totalJobs}
                            </p>
                            <div className="flex items-center gap-1">
                                <Button
                                    variant="outline"
                                    size="icon"
                                    className="h-8 w-8"
                                    disabled={currentPage <= 1}
                                    onClick={() => { setCurrentPage(p => p - 1); setExpandedJobId(null); }}
                                >
                                    <ChevronLeft className="h-4 w-4" />
                                </Button>
                                {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
                                    let page: number;
                                    if (totalPages <= 7) {
                                        page = i + 1;
                                    } else if (currentPage <= 4) {
                                        page = i + 1;
                                    } else if (currentPage >= totalPages - 3) {
                                        page = totalPages - 6 + i;
                                    } else {
                                        page = currentPage - 3 + i;
                                    }
                                    return (
                                        <Button
                                            key={page}
                                            variant={page === currentPage ? "default" : "outline"}
                                            size="icon"
                                            className="h-8 w-8 text-xs"
                                            onClick={() => { setCurrentPage(page); setExpandedJobId(null); }}
                                        >
                                            {page}
                                        </Button>
                                    );
                                })}
                                <Button
                                    variant="outline"
                                    size="icon"
                                    className="h-8 w-8"
                                    disabled={currentPage >= totalPages}
                                    onClick={() => { setCurrentPage(p => p + 1); setExpandedJobId(null); }}
                                >
                                    <ChevronRight className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Tailor Resume Modal */}
            <Dialog open={showTailorModal} onOpenChange={setShowTailorModal}>
                <DialogContent className="max-w-[90vw] w-full h-[90vh] flex flex-col p-0 overflow-hidden">
                    <DialogHeader className="p-6 pb-2 border-b">
                        <DialogTitle className="flex items-center gap-2 text-2xl">
                            <Sparkles className="h-6 w-6 text-primary" />
                            AI Resume Tailoring
                        </DialogTitle>
                        <DialogDescription>
                            We optimized your base resume to perfectly match this job description.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="flex-1 overflow-auto bg-muted/20">
                        {isTailoring ? (
                            <div className="flex flex-col items-center justify-center h-[50vh] gap-4">
                                <Loader2 className="h-12 w-12 animate-spin text-primary" />
                                <p className="text-lg font-medium animate-pulse">Analyzing job and tailoring your resume...</p>
                            </div>
                        ) : tailorResult ? (
                            <div className="flex flex-col h-full">
                                <div className="flex items-center justify-center gap-6 p-4 bg-background border-b">
                                    <div className="text-center">
                                        <p className="text-sm text-muted-foreground">Original ATS Score</p>
                                        <p className="text-2xl font-bold text-red-500">{tailorResult.score_before?.total_score}%</p>
                                    </div>
                                    <ArrowRight className="h-8 w-8 text-muted-foreground" />
                                    <div className="text-center">
                                        <p className="text-sm text-muted-foreground">Tailored ATS Score</p>
                                        <p className="text-3xl font-bold text-green-500">{tailorResult.score_after?.total_score}%</p>
                                    </div>
                                </div>
                                <div className="flex-1">
                                    <CompilePreview initialLatex={tailorResult.latex} />
                                </div>
                            </div>
                        ) : null}
                    </div>
                </DialogContent>
            </Dialog>

        </div>
    );
}
