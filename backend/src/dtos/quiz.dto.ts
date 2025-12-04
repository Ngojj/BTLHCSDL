export interface quizDto {
    id : number;
    name: string;
    state: string;
    attempt: number;
    duration: number;
    teacherId: number;
    sectionId: number;
    creTime: Date;
}