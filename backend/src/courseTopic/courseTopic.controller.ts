import { Request, Response } from 'express';
import courseTopicService from './courseTopic.service';
class courseTopicController {
    public getAllCourseTopic = async (req: Request, res: Response) => {
        try {
            const allCourseTopic = await courseTopicService.getAllCourseTopic();
            

            return res.status(200).json( {
                message: 'Successfully',
                data: allCourseTopic
            })
        }catch(err) {
            return res.status(500).json( {
                status: 500,
                message: 'Internal Server Error: ' + err,
            })
        }
    }

    public getCourseTopicById = async (req: Request, res: Response) => {
        try {
            const courseId = req.params.courseId;
            const courseTopicByCourseId = await courseTopicService.getCourseTopicById(Number(courseId));

            return res.status(200).json( {
                message: 'Successfully',
                data: courseTopicByCourseId
            })
        }catch(err) {
            return res.status(500).json( {
                status: 500,
                message: 'Internal Server Error: ' + err,
            })
        }
    }

    public createCourseTopic = async (req: Request, res: Response) => {
        try {
            const courseId = req.body.courseId;
            const topic = req.body.topic;
            const newCourseTopic : any = await courseTopicService.createCourseTopic(courseId, topic);

            return res.status(newCourseTopic.status).send(newCourseTopic);
        }catch(err) {
            return res.status(500).json( {
                status: 500,
                message: 'Internal Server Error: ' + err,
            })
        }
    }

    public updateCourseTopic = async (req: Request, res: Response) => {
        try {
            const courseId = req.body.courseId;
            const topic = req.body.topic;
            const newCourseTopic : any = await courseTopicService.updateCourseTopic(courseId, topic);

            return res.status(newCourseTopic.status).send(newCourseTopic);
        }catch(err) {
            return res.status(500).json( {
                status: 500,
                message: 'Internal Server Error: ' + err,
            })
        }
    }

    public deleteCourseTopic = async (req: Request, res: Response) => {
        try {
            const courseId = req.params.courseId;
            const newCourseTopic : any = await courseTopicService.deleteCourseTopic(Number(courseId));

            if (newCourseTopic.status !== 200){
                return res.status(newCourseTopic.status).json( {
                    message: newCourseTopic.message,
                    status: newCourseTopic.status,
                })
            }
            return res.status(200).json( {
                message: newCourseTopic.message,
                status: 200
            })
        }catch(err) {
            return res.status(500).json( {
                status: 500,
                message: 'Internal Server Error: ' + err,
            })
        }
    }
}

export default new courseTopicController();