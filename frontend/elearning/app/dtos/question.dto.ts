export interface QuestionDto{
    id: number;
    quizId: number;
    type:   string;
    answer: string;
    content: string;
    creTime: Date;
    teacherId: string;
}