import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import {
  ArrowLeft,
  Mail,
  Phone,
  Calendar,
  FileText,
  Download,
} from "lucide-react";

const mockStudents = [
  { id: "1", name: "Emma Wilson", grade: "10th Grade", attendance: 98, sessions: 24 },
  { id: "2", name: "Liam Johnson", grade: "9th Grade", attendance: 95, sessions: 22 },
  { id: "3", name: "Olivia Davis", grade: "11th Grade", attendance: 92, sessions: 28 },
  { id: "4", name: "Noah Martinez", grade: "10th Grade", attendance: 88, sessions: 20 },
  { id: "5", name: "Ava Anderson", grade: "12th Grade", attendance: 96, sessions: 30 },
  { id: "6", name: "Ethan Brown", grade: "9th Grade", attendance: 72, sessions: 18 },
  { id: "7", name: "Sophia Taylor", grade: "11th Grade", attendance: 89, sessions: 26 },
  { id: "8", name: "Mason Thomas", grade: "10th Grade", attendance: 94, sessions: 25 },
  { id: "9", name: "Isabella Moore", grade: "12th Grade", attendance: 91, sessions: 29 },
  { id: "10", name: "Lucas White", grade: "9th Grade", attendance: 68, sessions: 16 },
];

const recentSessions = [
  { date: "Mar 28, 2025", subject: "Mathematics", status: "Completed" },
  { date: "Mar 25, 2025", subject: "Physics", status: "Completed" },
  { date: "Mar 22, 2025", subject: "Chemistry", status: "Completed" },
  { date: "Apr 2, 2025", subject: "Mathematics", status: "Upcoming" },
  { date: "Apr 5, 2025", subject: "English", status: "Upcoming" },
];

const getAttendanceBadge = (attendance: number) => {
  if (attendance > 90) {
    return (
      <Badge className="bg-green-500/10 text-green-600 hover:bg-green-500/20">
        {attendance}%
      </Badge>
    );
  } else if (attendance >= 75) {
    return (
      <Badge className="bg-yellow-500/10 text-yellow-600 hover:bg-yellow-500/20">
        {attendance}%
      </Badge>
    );
  } else {
    return (
      <Badge className="bg-red-500/10 text-red-600 hover:bg-red-500/20">
        {attendance}%
      </Badge>
    );
  }
};

const getInitials = (name: string) => {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();
};

const StudentProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const student = mockStudents.find((s) => s.id === id);

  if (!student) {
    return (
      <div className="flex min-h-screen items-center justify-center p-6">
        <Card className="max-w-md shadow-soft">
          <CardContent className="pt-6 text-center">
            <p className="text-lg font-medium">Student not found</p>
            <Button
              variant="outline"
              onClick={() => navigate("/students")}
              className="mt-4"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Students
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const progress = Math.min((student.sessions / 30) * 100, 100);

  return (
    <div className="flex flex-col gap-6 p-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-2">
          <Button
            variant="ghost"
            onClick={() => navigate("/students")}
            className="-ml-2 mb-2"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Students
          </Button>
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarFallback className="text-lg gradient-primary text-white">
                {getInitials(student.name)}
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">
                {student.name}
              </h1>
              <div className="flex flex-wrap items-center gap-2 mt-1">
                <span className="text-muted-foreground">{student.grade}</span>
                <span className="text-muted-foreground">•</span>
                {getAttendanceBadge(student.attendance)}
              </div>
            </div>
          </div>
        </div>
        <Button className="gradient-primary text-white">
          <Download className="mr-2 h-4 w-4" />
          Generate Report
        </Button>
      </div>

      {/* Main Content */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Student Overview */}
        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle>Student Overview</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <p className="text-sm text-muted-foreground">Full Name</p>
                <p className="font-medium">{student.name}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Grade</p>
                <p className="font-medium">{student.grade}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Attendance</p>
                <div className="mt-1">{getAttendanceBadge(student.attendance)}</div>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Sessions</p>
                <p className="font-medium">{student.sessions}</p>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Course Progress</span>
                <span className="font-medium">{Math.round(progress)}%</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>

            <div className="space-y-3 pt-2 border-t">
              <div className="flex items-center gap-2 text-sm">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span>student{id}@school.edu</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span>+1 (555) 000-{id?.padStart(4, "0")}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span>Enrolled: Sept 2024</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent Sessions */}
        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle>Recent Sessions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentSessions.map((session, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between border-b pb-3 last:border-0 last:pb-0"
                >
                  <div>
                    <p className="font-medium">{session.subject}</p>
                    <p className="text-sm text-muted-foreground">
                      {session.date}
                    </p>
                  </div>
                  <Badge
                    variant={
                      session.status === "Completed" ? "secondary" : "default"
                    }
                  >
                    {session.status}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Notes / Progress Log */}
      <Card className="shadow-soft">
        <CardHeader>
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            <CardTitle>Notes & Progress Log</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <p className="text-sm font-medium">Recent Notes:</p>
            <div className="rounded-lg bg-muted/50 p-4 space-y-2">
              <p className="text-sm">
                <span className="font-medium">Mar 28, 2025:</span> Excellent
                progress in algebra. Student shows strong understanding of
                quadratic equations.
              </p>
              <p className="text-sm">
                <span className="font-medium">Mar 22, 2025:</span> Needs more
                practice with stoichiometry problems. Assigned additional
                homework.
              </p>
              <p className="text-sm">
                <span className="font-medium">Mar 15, 2025:</span> Great
                improvement in problem-solving speed. Confidence is growing.
              </p>
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Add New Note:</label>
            <Textarea
              placeholder="Type your notes here..."
              className="min-h-[100px]"
            />
            <Button className="w-full sm:w-auto">Save Note</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StudentProfile;
