import * as request from '@/app/axios/axios'
export default async function CreateLecture(newLecture: {
  sectionId: number;
  name: string;
  state: string;
  reference: string;
  material: string | null; // Only accept the URL here
}) {

    try {
        
        console.log(newLecture);
        const response = await request.post('/lecture/create', newLecture);

        console.log(response);
        return response;
        } catch (error) {
        console.error('Upload failed:', error);
    }
}
