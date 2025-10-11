import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function SispendikSkeleton() {
    return (
        <div className="container mx-auto py-6">
            <div className="space-y-8 animate-pulse">
                <div>
                    <Skeleton className="h-9 w-1/2 rounded-md" />
                    <Skeleton className="mt-2 h-5 w-3/4 rounded-md" />
                </div>

                {/* Top Cards Skeleton */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <Card>
                        <CardHeader>
                            <Skeleton className="h-5 w-24 rounded-md" />
                            <Skeleton className="mt-2 h-8 w-20 rounded-md" />
                        </CardHeader>
                    </Card>
                    <Card>
                        <CardHeader>
                            <Skeleton className="h-5 w-28 rounded-md" />
                            <Skeleton className="mt-2 h-8 w-32 rounded-md" />
                        </CardHeader>
                    </Card>
                    <Card>
                        <CardHeader>
                            <Skeleton className="h-5 w-20 rounded-md" />
                            <div className="mt-2 space-y-2">
                                <Skeleton className="h-5 w-full rounded-md" />
                                <Skeleton className="h-5 w-full rounded-md" />
                                <Skeleton className="h-5 w-full rounded-md" />
                            </div>
                        </CardHeader>
                    </Card>
                    <Card>
                        <CardHeader>
                            <Skeleton className="h-5 w-32 rounded-md" />
                            <div className="mt-2 space-y-2">
                                <Skeleton className="h-5 w-full rounded-md" />
                                <Skeleton className="h-5 w-full rounded-md" />
                            </div>
                        </CardHeader>
                    </Card>
                </div>

                {/* Class Ranking Section Skeleton */}
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                    <Card className="lg:col-span-3">
                        <CardHeader>
                            <Skeleton className="h-6 w-48 rounded-md" />
                        </CardHeader>
                        <CardContent>
                            <Skeleton className="h-[350px] w-full rounded-md" />
                        </CardContent>
                    </Card>
                    <Card className="lg:col-span-2">
                        <CardHeader>
                            <Skeleton className="h-6 w-40 rounded-md" />
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2">
                                <Skeleton className="h-10 w-full rounded-md" />
                                <Skeleton className="h-10 w-full rounded-md" />
                                <Skeleton className="h-10 w-full rounded-md" />
                                <Skeleton className="h-10 w-full rounded-md" />
                                <Skeleton className="h-10 w-full rounded-md" />
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Guru Ranking Section Skeleton */}
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                    <Card className="lg:col-span-3">
                        <CardHeader>
                            <Skeleton className="h-6 w-48 rounded-md" />
                        </CardHeader>
                        <CardContent>
                            <Skeleton className="h-[350px] w-full rounded-md" />
                        </CardContent>
                    </Card>
                    <Card className="lg:col-span-2">
                        <CardHeader>
                            <Skeleton className="h-6 w-40 rounded-md" />
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2">
                                <Skeleton className="h-10 w-full rounded-md" />
                                <Skeleton className="h-10 w-full rounded-md" />
                                <Skeleton className="h-10 w-full rounded-md" />
                                <Skeleton className="h-10 w-full rounded-md" />
                                <Skeleton className="h-10 w-full rounded-md" />
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
