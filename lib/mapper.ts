import {
    Course as PrismaCourse,
    Unit as PrismaUnit,
    Task as PrismaTask
} from "@prisma/client";
import {
    Level,
    LessonUnit,
    Task,
    TaskType
} from "@/types/content";

export function mapPrismaTaskToTask(pTask: PrismaTask): Task {
    return {
        id: pTask.id,
        title: pTask.title,
        type: pTask.type as TaskType,
        // Parse JSON strings back to objects
        payload: JSON.parse(pTask.content),
        settings: JSON.parse(pTask.settings)
    } as Task;
}

export function mapPrismaUnitToUnit(pUnit: PrismaUnit & { tasks?: PrismaTask[] }): LessonUnit {
    return {
        id: pUnit.id,
        title: pUnit.title,
        tasks: pUnit.tasks ? pUnit.tasks.map(mapPrismaTaskToTask) : []
    };
}

export function mapPrismaCourseToLevel(pCourse: PrismaCourse & { units?: (PrismaUnit & { tasks?: PrismaTask[] })[] }): Level {
    return {
        id: pCourse.id,
        title: pCourse.title,
        description: pCourse.description || "",
        accessCode: "TODO", // Prisma schema needs accessCode if we want to keep this
        color: pCourse.color,
        iconChar: pCourse.iconChar,
        units: pCourse.units ? pCourse.units.map(mapPrismaUnitToUnit) : []
    };
}
