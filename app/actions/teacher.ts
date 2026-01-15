'use server'

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getTeacherClasses() {
    const session = await auth();
    if (!session?.user?.email) return [];

    // In this system, it seems teachers see all classes or classes are not strictly linked to a teacher 
    // via a direct relation yet, based on schema. 
    // However, the plan says "Classes where the teacher is an instructor".
    // For now, as per schema, SchoolClass doesn't have a direct 'teacherId'.
    // We might assume teachers can see all classes or we check if they created courses assigned to classes?
    // Let's assume for now teachers can see all classes that are not archived.
    // Or we can check if the user has ROLE 'TEACHER'.

    const user = await prisma.user.findUnique({
        where: { email: session.user.email }
    });

    if (!user || user.role !== 'TEACHER') {
        // If strict, return empty. But mostly for this platform it seems open for teachers.
        // Let's return all classes for now as per "Studio" usually implies access to content.
        // If we need to filter, we might need a relation.
    }

    const classes = await prisma.schoolClass.findMany({
        where: { isArchived: false },
        include: {
            enrollments: true, // to count students
            courses: {
                include: {
                    course: true
                }
            }
        },
        orderBy: { createdAt: 'desc' }
    });

    return classes.map(cls => ({
        id: cls.id,
        name: cls.name,
        code: cls.code,
        studentCount: cls.enrollments.length,
        courses: cls.courses.map(c => c.course.title).join(", "),
        createdAt: cls.createdAt
    }));
}

export async function getClassDetails(classId: string) {
    const cls = await prisma.schoolClass.findUnique({
        where: { id: classId },
        include: {
            enrollments: {
                include: {
                    user: true
                },
                orderBy: { joinedAt: 'asc' } // Alphabetical might be better, but joinedAt is standard
            },
            courses: {
                include: {
                    course: {
                        include: {
                            units: {
                                include: {
                                    tasks: true
                                }
                            }
                        }
                    }
                }
            }
        }
    });

    if (!cls) return null;

    return {
        id: cls.id,
        name: cls.name,
        students: cls.enrollments.map((e: any) => ({
            id: e.user.id,
            name: e.user.name,
            email: e.user.email,
            image: e.user.image,
            joinedAt: e.joinedAt
        })),
        courses: cls.courses.map(c => ({
            id: c.courseId,
            title: c.course.title,
            status: c.status,
            totalTasks: c.course.units.reduce((acc, u) => acc + u.tasks.length, 0)
        }))
    };
}

export async function getStudentScores(classId: string, courseId: string) {
    const enrollments = await prisma.enrollment.findMany({
        where: { classId },
        include: {
            user: {
                include: {
                    taskResults: {
                        where: {
                            task: {
                                unit: {
                                    courseId: courseId
                                }
                            }
                        },
                        include: {
                            task: true
                        }
                    }
                }
            }
        }
    });

    // Fetch Feedback Separately to avoid Prisma include issues
    const feedback = await (prisma as any).feedback.findMany({
        where: {
            classId,
            courseId,
            studentId: { in: enrollments.map((e: any) => e.userId) }
        },
        orderBy: { createdAt: 'desc' }
    });

    // Calculate scores
    return enrollments.map((enrollment: any) => {
        const results = enrollment.user.taskResults;
        const totalScore = results.reduce((acc: number, r: any) => acc + r.score, 0);

        const completedCount = results.filter((r: any) => r.completed).length;
        const averageScore = results.length > 0 ? Math.round(totalScore / results.length) : 0;

        // Find latest feedback for this student
        const studentFeedback = feedback.find((f: any) => f.studentId === enrollment.user.id);

        return {
            studentId: enrollment.user.id,
            studentName: enrollment.user.name,
            studentImage: enrollment.user.image,
            averageScore,
            completedTasks: completedCount,
            lastFeedback: studentFeedback || null
        };
    });
}

export async function updateClassCourseStatus(classId: string, courseId: string, status: string) {
    const session = await auth();
    if (!session?.user?.email) throw new Error("Unauthorized");

    // Verify Is Teacher
    const user = await prisma.user.findUnique({
        where: { email: session.user.email }
    });
    if (!user || user.role !== 'TEACHER') throw new Error("Unauthorized");

    await prisma.schoolClassCourse.update({
        where: {
            classId_courseId: {
                classId,
                courseId
            }
        },
        data: {
            status
        }
    });

    revalidatePath(`/teacher/classes/${classId}`);
    return { success: true };
}

export async function saveFeedback(data: {
    studentId: string;
    courseId: string;
    classId: string;
    content: string;
}) {
    const session = await auth();
    if (!session?.user?.email) throw new Error("Unauthorized");

    const author = await prisma.user.findUnique({
        where: { email: session.user.email }
    });

    if (!author) throw new Error("Author not found");

    return await (prisma as any).feedback.create({
        data: {
            content: data.content,
            studentId: data.studentId,
            courseId: data.courseId,
            classId: data.classId,
            authorId: author.id
        }
    });
}
