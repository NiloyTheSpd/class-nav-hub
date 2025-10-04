import { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { PageContainer } from "@/components/PageContainer";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, ChevronLeft, ChevronRight } from "lucide-react";

const ITEMS_PER_PAGE = 5;

const getAttendanceBadge = (attendance: number) => {
  if (attendance > 90) {
    return <Badge className="bg-green-500/10 text-green-600 hover:bg-green-500/20">
      {attendance}%
    </Badge>;
  } else if (attendance >= 75) {
    return <Badge className="bg-yellow-500/10 text-yellow-600 hover:bg-yellow-500/20">
      {attendance}%
    </Badge>;
  } else {
    return <Badge className="bg-red-500/10 text-red-600 hover:bg-red-500/20">
      {attendance}%
    </Badge>;
  }
};

const Students = () => {
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [gradeFilter, setGradeFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await fetch("/api/students");
        if (!response.ok) {
          throw new Error("Failed to fetch students");
        }
        const data = await response.json();
        setStudents(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStudents();
  }, []);

  const filteredStudents = useMemo(() => {
    return students.filter((student) => {
      const matchesSearch = student.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const matchesGrade =
        gradeFilter === "all" || student.grade === gradeFilter;
      return matchesSearch && matchesGrade;
    });
  }, [students, searchQuery, gradeFilter]);

  const totalPages = Math.ceil(filteredStudents.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedStudents = filteredStudents.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

  const handleStudentClick = (id: number) => {
    navigate(`/students/${id}`);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (isLoading) {
    return (
      <PageContainer title="Students">
        <div className="flex items-center justify-center py-12">
          <p className="text-muted-foreground">Loading students...</p>
        </div>
      </PageContainer>
    );
  }

  if (error) {
    return (
      <PageContainer title="Students">
        <div className="flex items-center justify-center py-12">
          <p className="text-red-500">{error}</p>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer title="Students">
      {/* Search and Filter Bar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search students..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            className="pl-9"
          />
        </div>
        <Select
          value={gradeFilter}
          onValueChange={(value) => {
            setGradeFilter(value);
            setCurrentPage(1);
          }}
        >
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Filter by Grade" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Grades</SelectItem>
            <SelectItem value="9th Grade">9th Grade</SelectItem>
            <SelectItem value="10th Grade">10th Grade</SelectItem>
            <SelectItem value="11th Grade">11th Grade</SelectItem>
            <SelectItem value="12th Grade">12th Grade</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Empty State */}
      {paginatedStudents.length === 0 ? (
        <Card className="shadow-soft">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <p className="text-lg font-medium">No students found</p>
            <p className="text-sm text-muted-foreground mt-2">
              Try adjusting your search or filter criteria
            </p>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Desktop Table View */}
          <div className="hidden md:block rounded-lg border shadow-soft overflow-hidden">
            <table className="w-full">
              <thead className="bg-muted/50">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">
                    Grade
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">
                    Attendance %
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">
                    Recent Sessions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {paginatedStudents.map((student) => (
                  <tr
                    key={student.id}
                    onClick={() => handleStudentClick(student.id)}
                    className="cursor-pointer transition-smooth hover:bg-muted/50"
                  >
                    <td className="px-6 py-4 font-medium">{student.name}</td>
                    <td className="px-6 py-4 text-muted-foreground">
                      {student.grade}
                    </td>
                    <td className="px-6 py-4">
                      {getAttendanceBadge(student.attendance)}
                    </td>
                    <td className="px-6 py-4 text-muted-foreground">
                      {student.sessions}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View */}
          <div className="grid gap-4 md:hidden">
            {paginatedStudents.map((student) => (
              <Card
                key={student.id}
                onClick={() => handleStudentClick(student.id)}
                className="cursor-pointer shadow-soft hover:shadow-medium transition-smooth"
              >
                <CardContent className="p-4 space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-semibold">{student.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {student.grade}
                      </p>
                    </div>
                    {getAttendanceBadge(student.attendance)}
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">
                      Recent Sessions
                    </span>
                    <span className="font-medium">{student.sessions}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                Showing {startIndex + 1} to{" "}
                {Math.min(startIndex + ITEMS_PER_PAGE, filteredStudents.length)}{" "}
                of {filteredStudents.length} students
              </p>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <div className="flex items-center gap-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (page) => (
                      <Button
                        key={page}
                        variant={currentPage === page ? "default" : "outline"}
                        size="sm"
                        onClick={() => handlePageChange(page)}
                        className="min-w-[2rem]"
                      >
                        {page}
                      </Button>
                    )
                  )}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </>
      )}
    </PageContainer>
  );
};

export default Students;
