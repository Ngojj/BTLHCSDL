export interface certificationDto{
    id: number;
    name: string;
    issueDate: string;
    expDate: string | null;
    courseId: number;
    studentId: number;
}
