'use client';

import { userLoginState } from '@/state';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useRecoilValue } from 'recoil';


const CreateCourse = () => {
  const [courseName, setCourseName] = useState('');
  const [language, setLanguage] = useState('Vietnamese');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState<number>(0);
  const [averageQuizScore, setAverageQuizScore] = useState('');
  const [topics, setTopics] = useState<string[]>([]);
  const [currentTopic, setCurrentTopic] = useState<string>('');
  const [certiName, setCertiName] = useState<string>('');
  const [expirationTime, setExpirationTime] = useState<number>(0);
  const user = useRecoilValue(userLoginState)
  
  const handleAddTopic = () => {
    if (currentTopic.trim() && !topics.includes(currentTopic)) {
      setTopics([...topics, currentTopic]);
      setCurrentTopic('');
    }
  };

  
  const handleAddCourse = async () => {
    if(!courseName || !description || !price || !averageQuizScore || topics.length === 0) {
      alert('Vui lòng điền đầy đủ thông tin!');
      return;
    }
    try{
      if (user.token === undefined || user.token === "") {
        alert('Vui lòng đăng nhập để tạo khóa học');
        return;
      }
      console.log(user)
      const response = await axios.post('http://localhost:4000/course/create', {
        courseName,
        language,
        description,
        price,
        averageQuizScore,
        topics,
        teacherId: user.id
      });
      console.log(response.data);
      alert('Tạo khóa học thành công!');
      window.history.back()
    }catch (e: unknown) {
      if (axios.isAxiosError(e) && e.response) {
        console.log(e.response.data);
        alert("Có lỗi xảy ra, vui lòng thử lại sau");
      }
    }
  }
  const handleRemoveTopic = (topicToRemove: string) => {
    setTopics(topics.filter((topic) => topic !== topicToRemove));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const courseData = {
      courseName,
      language,
      description,
      price,
      averageQuizScore,
      topics,
    };
    console.log('Course Data:', courseData);
  };

  useEffect(() => {
    console.log(user.id);
  }, []);
  const router = useRouter()
  return (
    <div className="mt-10 rounded-xl create-course-container border-solid border-2 shadow-xl px-6 py-12 lg:px-8 m-100" style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <h1 className=" mb-10 text-center text-2xl/9 font-bold tracking-tight text-white bg-hcmutDarkBlue rounded-xl">
        Create Course
      </h1> 
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="courseName">Course Name:</label>
          <input
            type="text"
            id="courseName"
            value={courseName}
            onChange={(e) => setCourseName(e.target.value)}
            required
            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
            className='border-solid border-2 rounded-lg'
          />
        </div>

        <div style={{ marginBottom: '10px' }}>
          <label htmlFor="language">Language:</label>
          <select
            id="language"
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
            className='border-solid border-2 rounded-lg'
          >
            <option value="Vietnamese">Vietnamese</option>
            <option value="English">English</option>
          </select>
        </div>

        <div style={{ marginBottom: '10px' }}>
          <label htmlFor="description">Description:</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            style={{ width: '100%', padding: '8px', marginTop: '5px', minHeight: '100px' }}
            className='border-solid border-2 rounded-lg'
          ></textarea>
        </div>

        <div style={{ marginBottom: '10px' }}>
          <label htmlFor="price">Price (VND):</label>
          <input
            type="number"
            id="price"
            value={price}
            onChange={(e) => setPrice(Number(e.target.value))}
            required
            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
            className='border-solid border-2 rounded-lg'
          />
        </div>

        <div style={{ marginBottom: '10px' }}>
          <label htmlFor="averageQuizScore">Average Quiz Score to Complete:</label>
          <input
            type="number"
            id="averageQuizScore"
            value={averageQuizScore}
            onChange={(e) => setAverageQuizScore(e.target.value)}
            required
            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
            className='border-solid border-2 rounded-lg'
          />
        </div>

        <div style={{ marginBottom: '10px' }}>
          <label htmlFor="topics">Topics:</label>
          <div style={{ display: 'flex', alignItems: 'center', marginTop: '5px' }}>
            <input
              type="text"
              id="topics"
              value={currentTopic}
              onChange={(e) => setCurrentTopic(e.target.value)}
              style={{ flex: 1, padding: '8px' }}
              className='border-solid border-2 rounded-lg'
            />
            <button
              type="button"
              onClick={handleAddTopic}
              className=' rounded-xl text-white px-8 py-12 ml-10 cursor-pointer bg-hcmutDarkBlue hover:bg-hcmutLightBlue'
              style={{ padding: '8px 12px', marginLeft: '10px', cursor: 'pointer' }}
            >
              Add
            </button>
          </div>
          <div style={{ marginTop: '10px' }}>
            {topics.map((topic, index) => (
              <span
                key={index}
                style={{
                  display: 'inline-block',
                  background: '#ddd',
                  padding: '5px 10px',
                  margin: '5px',
                  borderRadius: '5px',
                  cursor: 'pointer',
                }}
                onClick={() => handleRemoveTopic(topic)}
              >
                {topic} &times;
              </span>
            ))}
          </div>

        </div>
        <h1 className=" mb-2 text-center text-2xl/9 font-bold tracking-tight text-white bg-orange-600 rounded-lg">
          Course Certificate
        </h1> 
        <div style={{ marginBottom: '10px' }}>
          <label htmlFor="courseName">Certificate Name:</label>
          <input
            type="text"
            id="courseName"
            value={certiName}
            onChange={(e) => setCertiName(e.target.value)}
            required
            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
            className='border-solid border-2 rounded-lg'
          />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label htmlFor="price">Expiration time after completion:</label>
          <input
            type="number"
            id="price"
            value={expirationTime}
            onChange={(e) => setExpirationTime(Number(e.target.value))}
            required
            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
            className='border-solid border-2 rounded-lg'
          />
        </div>
        

        {/* BUTTON */}
        <div className='flex justify-between'>
          <button type="submit" 
            className='bg-hcmutDarkBlue px-2 py-2 text-white cursor-pointer hover:bg-hcmutLightBlue rounded-xl'
              onClick={handleAddCourse}
          >
            Create Course
          </button>
          <button type="button" 
            className='bg-red-600 px-2 py-2 text-white cursor-pointer hover:bg-red-700 rounded-xl'
            onClick={() => router.back()}
          >
            Quay lại
          </button>
        </div>
        
        
      </form>
    </div>
  );
};

export default CreateCourse;
