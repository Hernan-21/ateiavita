"use client";

import { useState } from "react";
import { Users, BarChart2, MessageSquare, ChevronDown, BookOpen } from "lucide-react";
import { FeedbackModal } from "./feedback-modal";
import { getStudentScores, updateClassCourseStatus } from "@/app/actions/teacher";

interface ClassDashboardProps {
    classId: string;
    className: string;
    students: any[];
    courses: any[];
}

export function ClassDashboard({ classId, className, students: initialStudents, courses: initialCourses }: ClassDashboardProps) {
    const [activeTab, setActiveTab] = useState<'students' | 'scores' | 'courses'>('students');
    const [selectedCourseId, setSelectedCourseId] = useState<string>(initialCourses[0]?.id || "");
    const [scores, setScores] = useState<any[]>([]);
    const [isLoadingScores, setIsLoadingScores] = useState(false);
    const [courses, setCourses] = useState(initialCourses);
    const [updatingStatus, setUpdatingStatus] = useState<string | null>(null);

    // Feedback Modal State
    const [feedbackModalOpen, setFeedbackModalOpen] = useState(false);
    const [selectedStudent, setSelectedStudent] = useState<{ id: string, name: string } | null>(null);

    const handleCourseChange = async (courseId: string) => {
        setSelectedCourseId(courseId);
        if (activeTab === 'scores') {
            loadScores(courseId);
        }
    };

    const loadScores = async (courseId: string) => {
        setIsLoadingScores(true);
        try {
            const data = await getStudentScores(classId, courseId);
            setScores(data);
        } catch (error) {
            console.error("Failed to load scores", error);
        } finally {
            setIsLoadingScores(false);
        }
    };

    const handleStatusChange = async (courseId: string, newStatus: string) => {
        setUpdatingStatus(courseId);
        try {
            await updateClassCourseStatus(classId, courseId, newStatus);
            // Optimistic update
            setCourses(prev => prev.map(c =>
                c.id === courseId ? { ...c, status: newStatus } : c
            ));
        } catch (error) {
            console.error("Failed to update status", error);
            alert("Failed to update status");
        } finally {
            setUpdatingStatus(null);
        }
    };

    const handleOpenFeedback = (student: { id: string, name: string }) => {
        setSelectedStudent(student);
        setFeedbackModalOpen(true);
    };

    return (
        <div className="space-y-6">
            {/* Header / Tabs */}
            <div className="flex items-center gap-4 border-b border-gray-200 pb-1">
                <button
                    onClick={() => setActiveTab('students')}
                    className={`pb-3 px-1 text-sm font-medium flex items-center gap-2 transition-colors relative ${activeTab === 'students' ? 'text-indigo-600' : 'text-gray-500 hover:text-gray-900'
                        }`}
                >
                    <Users className="h-4 w-4" />
                    Students
                    {activeTab === 'students' && (
                        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600 rounded-t-full" />
                    )}
                </button>
                <button
                    onClick={() => {
                        setActiveTab('scores');
                        if (selectedCourseId && scores.length === 0) {
                            loadScores(selectedCourseId);
                        }
                    }}
                    className={`pb-3 px-1 text-sm font-medium flex items-center gap-2 transition-colors relative ${activeTab === 'scores' ? 'text-indigo-600' : 'text-gray-500 hover:text-gray-900'
                        }`}
                >
                    <BarChart2 className="h-4 w-4" />
                    Scores
                    {activeTab === 'scores' && (
                        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600 rounded-t-full" />
                    )}
                </button>
                <button
                    onClick={() => setActiveTab('courses')}
                    className={`pb-3 px-1 text-sm font-medium flex items-center gap-2 transition-colors relative ${activeTab === 'courses' ? 'text-indigo-600' : 'text-gray-500 hover:text-gray-900'
                        }`}
                >
                    <BookOpen className="h-4 w-4" />
                    Courses
                    {activeTab === 'courses' && (
                        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600 rounded-t-full" />
                    )}
                </button>
            </div>

            {/* Course Selector (Only for Scores) */}
            {activeTab === 'scores' && (
                <div className="flex items-center gap-2 mb-4">
                    <span className="text-sm font-medium text-gray-500">Course:</span>
                    <div className="relative">
                        <select
                            value={selectedCourseId}
                            onChange={(e) => handleCourseChange(e.target.value)}
                            className="appearance-none bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5 pr-8"
                        >
                            {courses.map((c) => (
                                <option key={c.id} value={c.id}>
                                    {c.title}
                                </option>
                            ))}
                        </select>
                        <ChevronDown className="absolute right-2 top-3 h-4 w-4 text-gray-500 pointer-events-none" />
                    </div>
                </div>
            )}

            {/* Content */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                {activeTab === 'students' && (
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Student
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Email
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Joined
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {initialStudents.map((student) => (
                                <tr key={student.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-xs mr-3">
                                                {student.image ? (
                                                    <img src={student.image} alt="" className="h-8 w-8 rounded-full" />
                                                ) : (
                                                    student.name?.charAt(0) || "U"
                                                )}
                                            </div>
                                            <div className="text-sm font-medium text-gray-900">{student.name}</div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {student.email}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {new Date(student.joinedAt).toLocaleDateString('es-AR')}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}

                {activeTab === 'scores' && (
                    <div className="overflow-x-auto">
                        {isLoadingScores ? (
                            <div className="p-8 text-center text-gray-500">Loading scores...</div>
                        ) : (
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Student
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Avg. Score
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Tasks Completed
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {scores.map((score) => (
                                        <tr key={score.studentId} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-xs mr-3">
                                                        {score.studentImage ? (
                                                            <img src={score.studentImage} alt="" className="h-8 w-8 rounded-full" />
                                                        ) : (
                                                            score.studentName?.charAt(0) || "U"
                                                        )}
                                                    </div>
                                                    <div className="text-sm font-medium text-gray-900">{score.studentName}</div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${score.averageScore >= 80 ? 'bg-green-100 text-green-800' :
                                                    score.averageScore >= 60 ? 'bg-yellow-100 text-yellow-800' :
                                                        'bg-red-100 text-red-800'
                                                    }`}>
                                                    {score.averageScore}%
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {score.completedTasks}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <button
                                                    onClick={() => handleOpenFeedback({ id: score.studentId, name: score.studentName })}
                                                    className="text-indigo-600 hover:text-indigo-900 flex items-center justify-end gap-1 ml-auto"
                                                >
                                                    <MessageSquare className="h-4 w-4" />
                                                    Feedback
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                    {scores.length === 0 && (
                                        <tr>
                                            <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                                                No scores available or no course selected.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        )}
                    </div>
                )}

                {activeTab === 'courses' && (
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Course Name
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Total Tasks
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Status
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {courses.map((course) => (
                                <tr key={course.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-medium text-gray-900">{course.title}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {course.totalTasks} Tasks
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        <div className="relative w-40">
                                            <select
                                                value={course.status || 'hidden'}
                                                disabled={updatingStatus === course.id}
                                                onChange={(e) => handleStatusChange(course.id, e.target.value)}
                                                className={`appearance-none w-full bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block p-2.5 disabled:opacity-50 ${course.status === 'teaching' ? 'border-green-300 bg-green-50 text-green-900' : ''
                                                    }`}
                                            >
                                                <option value="hidden">Hidden</option>
                                                <option value="prepping">Prepping</option>
                                                <option value="teaching">Teaching</option>
                                                <option value="taught">Taught</option>
                                            </select>
                                            {updatingStatus === course.id && (
                                                <div className="absolute right-2 top-2.5">
                                                    <div className="animate-spin h-4 w-4 border-2 border-indigo-500 rounded-full border-t-transparent"></div>
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            <FeedbackModal
                isOpen={feedbackModalOpen}
                onClose={() => setFeedbackModalOpen(false)}
                studentId={selectedStudent?.id || ""}
                studentName={selectedStudent?.name || ""}
                courseId={selectedCourseId}
                classId={classId}
            />
        </div>
    );
}
