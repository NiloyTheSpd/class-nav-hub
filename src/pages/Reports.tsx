import { PageContainer } from "@/components/PageContainer";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { Skeleton } from "@/components/ui/skeleton";
import { FileDown, FileText, Calendar, User, BookOpen, TrendingUp } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

type ReportStatus = "Upcoming" | "Completed" | "Canceled";

interface Report {
  id: number;
  date: string;
  student: string;
  subject: string;
  status: ReportStatus;
  attendance: number;
}

const mockReports: Report[] = [
  { id: 1, date: "2025-01-15", student: "Emma Wilson", subject: "Mathematics", status: "Upcoming", attendance: 95 },
  { id: 2, date: "2025-01-14", student: "Liam Johnson", subject: "Physics", status: "Completed", attendance: 88 },
  { id: 3, date: "2025-01-13", student: "Sophia Brown", subject: "Chemistry", status: "Completed", attendance: 92 },
  { id: 4, date: "2025-01-12", student: "Noah Davis", subject: "Biology", status: "Completed", attendance: 85 },
  { id: 5, date: "2025-01-11", student: "Olivia Martinez", subject: "English", status: "Canceled", attendance: 0 },
  { id: 6, date: "2025-01-10", student: "Ethan Anderson", subject: "History", status: "Completed", attendance: 90 },
  { id: 7, date: "2025-01-09", student: "Ava Taylor", subject: "Mathematics", status: "Completed", attendance: 94 },
  { id: 8, date: "2025-01-16", student: "James Thomas", subject: "Physics", status: "Upcoming", attendance: 0 },
  { id: 9, date: "2025-01-08", student: "Isabella Lee", subject: "Chemistry", status: "Completed", attendance: 87 },
  { id: 10, date: "2025-01-07", student: "Michael White", subject: "Biology", status: "Canceled", attendance: 0 },
  { id: 11, date: "2025-01-17", student: "Emma Wilson", subject: "English", status: "Upcoming", attendance: 0 },
  { id: 12, date: "2025-01-06", student: "Sophia Brown", subject: "History", status: "Completed", attendance: 91 },
];

const Reports = () => {
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [studentFilter, setStudentFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading] = useState(false);
  const { toast } = useToast();

  const itemsPerPage = 5;

  // Get unique students for filter
  const uniqueStudents = Array.from(new Set(mockReports.map((r) => r.student)));

  const filteredReports = mockReports.filter((report) => {
    if (studentFilter !== "all" && report.student !== studentFilter) return false;
    if (statusFilter !== "all" && report.status !== statusFilter) return false;
    if (dateFrom && report.date < dateFrom) return false;
    if (dateTo && report.date > dateTo) return false;
    return true;
  });

  const totalPages = Math.ceil(filteredReports.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedReports = filteredReports.slice(startIndex, startIndex + itemsPerPage);

  const getStatusBadgeVariant = (status: ReportStatus) => {
    switch (status) {
      case "Upcoming":
        return "default";
      case "Completed":
        return "secondary";
      case "Canceled":
        return "destructive";
      default:
        return "outline";
    }
  };

  const handleExportCSV = () => {
    toast({
      title: "Export CSV",
      description: "CSV export feature will be implemented soon.",
    });
  };

  const handleExportPDF = () => {
    toast({
      title: "Export PDF",
      description: "PDF export feature will be implemented soon.",
    });
  };

  if (isLoading) {
    return (
      <PageContainer title="Reports">
        <div className="space-y-4">
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-64 w-full" />
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer title="Reports">
      <div className="space-y-6">
        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Filters</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">From Date</label>
                <Input
                  type="date"
                  value={dateFrom}
                  onChange={(e) => setDateFrom(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">To Date</label>
                <Input
                  type="date"
                  value={dateTo}
                  onChange={(e) => setDateTo(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Student</label>
                <Select value={studentFilter} onValueChange={setStudentFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="All students" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Students</SelectItem>
                    {uniqueStudents.map((student) => (
                      <SelectItem key={student} value={student}>
                        {student}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Session Type</label>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="All types" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="Upcoming">Upcoming</SelectItem>
                    <SelectItem value="Completed">Completed</SelectItem>
                    <SelectItem value="Canceled">Canceled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Export Buttons */}
        <div className="flex flex-wrap gap-3">
          <Button onClick={handleExportCSV} variant="outline" className="gap-2">
            <FileText className="h-4 w-4" />
            Export CSV
          </Button>
          <Button onClick={handleExportPDF} variant="outline" className="gap-2">
            <FileDown className="h-4 w-4" />
            Export PDF
          </Button>
        </div>

        {/* Empty State */}
        {paginatedReports.length === 0 && (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <FileText className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No reports found</h3>
              <p className="text-muted-foreground text-center">
                Try adjusting your filters to find reports.
              </p>
            </CardContent>
          </Card>
        )}

        {/* Desktop Table View */}
        {paginatedReports.length > 0 && (
          <>
            <div className="hidden md:block">
              <Card>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Student</TableHead>
                      <TableHead>Subject</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Attendance %</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedReports.map((report) => (
                      <TableRow key={report.id}>
                        <TableCell className="font-medium">{report.date}</TableCell>
                        <TableCell>{report.student}</TableCell>
                        <TableCell>{report.subject}</TableCell>
                        <TableCell>
                          <Badge variant={getStatusBadgeVariant(report.status)}>
                            {report.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{report.attendance}%</span>
                            {report.attendance > 0 && (
                              <TrendingUp
                                className={`h-4 w-4 ${
                                  report.attendance > 90
                                    ? "text-green-500"
                                    : report.attendance > 75
                                    ? "text-yellow-500"
                                    : "text-red-500"
                                }`}
                              />
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Card>
            </div>

            {/* Mobile Card View */}
            <div className="md:hidden space-y-4">
              {paginatedReports.map((report) => (
                <Card key={report.id} className="animate-fade-in">
                  <CardContent className="pt-6 space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">{report.date}</span>
                      </div>
                      <Badge variant={getStatusBadgeVariant(report.status)}>
                        {report.status}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span>{report.student}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <BookOpen className="h-4 w-4 text-muted-foreground" />
                      <span>{report.subject}</span>
                    </div>
                    <div className="flex items-center justify-between pt-2 border-t">
                      <span className="text-sm text-muted-foreground">Attendance</span>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold">{report.attendance}%</span>
                        {report.attendance > 0 && (
                          <TrendingUp
                            className={`h-4 w-4 ${
                              report.attendance > 90
                                ? "text-green-500"
                                : report.attendance > 75
                                ? "text-yellow-500"
                                : "text-red-500"
                            }`}
                          />
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                    />
                  </PaginationItem>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <PaginationItem key={page}>
                      <PaginationLink
                        onClick={() => setCurrentPage(page)}
                        isActive={currentPage === page}
                        className="cursor-pointer"
                      >
                        {page}
                      </PaginationLink>
                    </PaginationItem>
                  ))}
                  <PaginationItem>
                    <PaginationNext
                      onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                      className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            )}
          </>
        )}
      </div>
    </PageContainer>
  );
};

export default Reports;
