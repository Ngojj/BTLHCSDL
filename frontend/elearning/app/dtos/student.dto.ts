export interface StudentDto{
    id: number,
    firstName: string,
    lastName: string,
    username: string,
    role: string,
    email: string,
    bankName: string,
    bankAccount: string,
    studentId: string,
    enrollmentDate: Date,
    numberCourseEnrolled: number,
    numberCourseCompleted: number
}

export const defaultStudent: StudentDto = {
    id: 0,
    firstName: '',
    lastName: '',
    username: '',
    role: '',
    email: '',
    bankName: '',
    bankAccount: '',
    studentId: '',
    enrollmentDate: new Date(),
    numberCourseEnrolled: 0,
    numberCourseCompleted: 0
}