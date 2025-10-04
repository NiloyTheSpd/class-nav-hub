import { useState, useEffect } from "react";
import { PageContainer } from "@/components/PageContainer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, TrendingUp, Calendar, DollarSign } from "lucide-react";
import { SignedIn, SignedOut, SignInButton, SignUpButton, UserButton } from "@clerk/clerk-react";

const Dashboard = () => {
  const [stats, setStats] = useState([]);
  const [recentStudents, setRecentStudents] = useState([]);
  const [upcomingSessions, setUpcomingSessions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [studentsRes, tutorsRes, sessionsRes] = await Promise.all([
          fetch("/api/students"),
          fetch("/api/tutors"),
          fetch("/api/sessions"),
        ]);

        if (!studentsRes.ok || !tutorsRes.ok || !sessionsRes.ok) {
          throw new Error("Failed to fetch data");
        }

        const students = await studentsRes.json();
        const tutors = await tutorsRes.json();
        const sessions = await sessionsRes.json();

        // Process data for stats, recent students, and upcoming sessions
        const newStats = [
          {
            title: "Active Students",
            value: students.length,
            icon: Users,
            bgColor: "bg-primary/10",
            iconColor: "text-primary",
          },
          {
            title: "Attendance Rate",
            value: "N/A", // Needs calculation
            icon: TrendingUp,
            bgColor: "bg-accent/10",
            iconColor: "text-accent",
          },
          {
            title: "Upcoming Sessions",
            value: sessions.length,
            icon: Calendar,
            bgColor: "bg-purple-500/10",
            iconColor: "text-purple-600",
          },
          {
            title: "Tutor Earnings",
            value: "N/A", // Needs calculation
            icon: DollarSign,
            bgColor: "bg-green-500/10",
            iconColor: "text-green-600",
          },
        ];

        setStats(newStats);
        setRecentStudents(students.slice(0, 5)); // Example
        setUpcomingSessions(sessions.slice(0, 5)); // Example

      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading) {
    return (
      <PageContainer title="Dashboard">
        <div className="flex items-center justify-center py-12">
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </PageContainer>
    );
  }

  if (error) {
    return (
      <PageContainer title="Dashboard">
        <div className="flex items-center justify-center py-12">
          <p className="text-red-500">{error}</p>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer title="Dashboard">
      <SignedOut>
        <div className="flex flex-col items-center justify-center py-12">
          <h2 className="text-2xl font-semibold mb-4">Welcome to the Dashboard</h2>
          <p className="text-muted-foreground mb-6">Please sign in to continue</p>
          <div className="flex gap-4">
            <SignInButton />
            <SignUpButton />
          </div>
        </div>
      </SignedOut>
      <SignedIn>
        <div className="mb-4">
          <UserButton />
        </div>
        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <Card key={stat.title} className="shadow-soft hover:shadow-medium transition-smooth">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <div className={`rounded-lg p-2 ${stat.bgColor}`}>
                  <stat.icon className={`h-4 w-4 ${stat.iconColor}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Recent Students & Upcoming Sessions */}
        <div className="grid gap-4 md:grid-cols-2">
          {/* Recent Students */}
          <Card className="shadow-soft">
            <CardHeader>
              <CardTitle>Recent Students</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentStudents.map((student) => (
                  <div
                    key={student.id}
                    className="flex items-center justify-between border-b pb-3 last:border-0 last:pb-0"
                  >
                    <div>
                      <p className="font-medium">{student.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {student.grade}
                      </p>
                    </div>
                    <div className="text-sm font-medium">
                      {student.attendance}%
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Upcoming Sessions */}
          <Card className="shadow-soft">
            <CardHeader>
              <CardTitle>Upcoming Sessions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {upcomingSessions.map((session, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between border-b pb-3 last:border-0 last:pb-0"
                  >
                    <div>
                      <p className="font-medium">{session.title}</p>
                      <p className="text-sm text-muted-foreground">
                        {session.studentId}
                      </p>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {new Date(session.startTime).toLocaleDateString()}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </SignedIn>
    </PageContainer>
  );
};

export default Dashboard;
