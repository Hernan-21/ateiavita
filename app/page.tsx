import { Navbar } from "@/components/layout/Navbar"
import { Footer } from "@/components/layout/Footer"
import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { StudentDashboard } from "@/components/student/student-dashboard"


export default async function Home() {
  const session = await auth()

  if (!session?.user?.email) {
    redirect("/welcome")
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email }
  });

  if (!user) {
    redirect("/welcome");
  }

  // Fetch Enrollments and Visible Courses
  const enrollments = await prisma.enrollment.findMany({
    where: { userId: user.id },
    include: {
      class: {
        include: {
          courses: {
            where: {
              status: { in: ['teaching', 'taught'] }
            },
            include: {
              course: true
            },
            orderBy: {
              assignedAt: 'desc'
            }
          }
        }
      }
    },
    orderBy: {
      joinedAt: 'desc'
    }
  });

  const formattedClasses = enrollments.map(e => ({
    id: e.class.id,
    name: e.class.name,
    description: e.class.description,
    courses: e.class.courses.map(c => ({
      course: c.course,
      status: c.status
    }))
  }));

  return (
    <div className="min-h-screen flex flex-col bg-background font-sans">
      <Navbar />

      <main className="flex-1 container mx-auto px-4 md:px-8 py-8">


        {/* Student Dashboard handles the Classes section */}
        <StudentDashboard initialClasses={formattedClasses} />
      </main>

      <Footer />
    </div>
  )
}
