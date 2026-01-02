
import { useEffect } from "react";
import { useBlogStore } from "@/lib/store";
import { Layout } from "@/components/layout/Layout";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Loader2, ChevronLeft, ChevronRight } from "lucide-react";
import { format } from "date-fns";

const AuditLog = () => {
    const {
        fetchAuditLogs,
        auditLogs,
        auditPagination,
        isLoading
    } = useBlogStore();

    useEffect(() => {
        fetchAuditLogs(1);
    }, [fetchAuditLogs]);

    const handlePageChange = (newPage: number) => {
        fetchAuditLogs(newPage);
    };

    return (
        <Layout>
            <div className="container mx-auto max-w-5xl px-4 py-8">
                <h1 className="mb-6 font-serif text-3xl font-bold text-foreground">Audit Logs</h1>
                <div className="rounded-md border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Time</TableHead>
                                <TableHead>IP Address</TableHead>
                                <TableHead>Resolution</TableHead>
                                <TableHead>Referrer</TableHead>
                                <TableHead>Device / User Agent</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {isLoading && auditLogs.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={7} className="h-24 text-center">
                                        <Loader2 className="mx-auto h-6 w-6 animate-spin" />
                                    </TableCell>
                                </TableRow>
                            ) : auditLogs.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={7} className="h-24 text-center">
                                        No audit logs found.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                auditLogs.map((log) => (
                                    <TableRow key={log.id}>
                                        <TableCell className="whitespace-nowrap">
                                            {format(new Date(log.visitedAt), "MMM d, yyyy HH:mm:ss")}
                                        </TableCell>
                                        <TableCell>{log.ip}</TableCell>
                                        <TableCell>{log.screenResolution || '-'}</TableCell>
                                        <TableCell className="break-all">
                                            {log.referrer || '-'}
                                        </TableCell>
                                        <TableCell className="break-all">
                                            {log.userAgent}
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>

                {/* Pagination */}
                {auditPagination && auditPagination.totalPages > 1 && (
                    <div className="flex items-center justify-end space-x-2 py-4">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handlePageChange(auditPagination.page - 1)}
                            disabled={auditPagination.page <= 1 || isLoading}
                        >
                            <ChevronLeft className="h-4 w-4" />
                            Previous
                        </Button>
                        <div className="text-sm text-muted-foreground">
                            Page {auditPagination.page} of {auditPagination.totalPages}
                        </div>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handlePageChange(auditPagination.page + 1)}
                            disabled={auditPagination.page >= auditPagination.totalPages || isLoading}
                        >
                            Next
                            <ChevronRight className="h-4 w-4" />
                        </Button>
                    </div>
                )}
            </div>
        </Layout>
    );
};

export default AuditLog;
