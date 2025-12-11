import { useState } from "react";
import { Database, Play, CheckCircle2, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query";

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
import api from "@/lib/api";

export default function IngestionPage() {
    const [taskId, setTaskId] = useState<string | null>(null);

    const mutation = useMutation({
        mutationFn: async () => {
            const response = await api.post("/ingestion/jobs");
            return response.data;
        },
        onSuccess: (data) => {
            setTaskId(data.task_id);
            toast.success("Ingestion started successfully!");
        },
        onError: (error) => {
            toast.error("Failed to start ingestion.");
            console.error(error);
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

                <Card className="opacity-60 pointer-events-none">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Database className="h-5 w-5" />
                            Market Analysis (Soon)
                        </CardTitle>
                        <CardDescription>
                            Ingest market trends and salary data.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Alert variant="destructive" className="bg-transparent border-dashed">
                            <AlertCircle className="h-4 w-4" />
                            <AlertTitle>Not Configured</AlertTitle>
                            <AlertDescription>
                                This pipeline is currently disabled by administrator.
                            </AlertDescription>
                        </Alert>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
