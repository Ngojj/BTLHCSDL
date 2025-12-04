export interface JoinFullDto{
    courseId: number
    studentId: number
    dateComplete: Date | null
    dateStart: Date
    progress: number
    GPA: number
    courseName: string
    description: string
    price: number
    creationTime: Date
    teacherId: number
    teacherFirstName: string
    teacherLastName: string
}