import { PageContainer } from "@/components/PageContainer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, TrendingUp, Calendar, DollarSign } from "lucide-react";

const stats = [
  {
    title: "Active Students",
    value: "120",
    icon: Users,
    bgColor: "bg-primary/10",
    iconColor: "text-primary",
  },
  {
    title: "Attendance Rate",
    value: "94.5%",
    icon: TrendingUp,
    bgColor: "bg-accent/10",
    iconColor: "text-accent",
  },
  {
    title: "Upcoming Sessions",
    value: "18",
    icon: Calendar,
    bgColor: "bg-purple-500/10",
    iconColor: "text-purple-600",
  },
  {
    title: "Tutor Earnings",
    value: "$8,420",
    icon: DollarSign,
    bgColor: "bg-green-500/10",
    iconColor: "text-green-600",
  },
];

const recentStudents = [
  { name: "Emma Wilson", grade: "10th Grade", attendance: "98%" },
  { name: "Liam Johnson", grade: "9th Grade", attendance: "95%" },
  { name: "Olivia Davis", grade: "11th Grade", attendance: "92%" },
  { name: "Noah Martinez", grade: "10th Grade", attendance: "88%" },
  { name: "Ava Anderson", grade: "12th Grade", attendance: "96%" },
];

const upcomingSessions = [
  { date: "Apr 2, 2025", subject: "Mathematics", student: "Emma Wilson" },
  { date: "Apr 2, 2025", subject: "Physics", student: "Liam Johnson" },
  { date: "Apr 3, 2025", subject: "Chemistry", student: "Olivia Davis" },
  { date: "Apr 3, 2025", subject: "English", student: "Noah Martinez" },
  { date: "Apr 4, 2025", subject: "Biology", student: "Ava Anderson" },
];

const Dashboard = () => {
  return (
    <PageContainer title="Dashboard">
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
                  key={student.name}
                  className="flex items-center justify-between border-b pb-3 last:border-0 last:pb-0"
                >
                  <div>
                    <p className="font-medium">{student.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {student.grade}
                    </p>
                  </div>
                  <div className="text-sm font-medium">
                    {student.attendance}
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
                    <p className="font-medium">{session.subject}</p>
                    <p className="text-sm text-muted-foreground">
                      {session.student}
                    </p>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {session.date}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  );
};

export default Dashboard;
