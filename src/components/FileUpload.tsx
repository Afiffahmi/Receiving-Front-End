import { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import axios from 'axios';
import { Card, LinearProgress, Input,Button } from '@mui/joy';
import { ToastContainer, toast, Bounce } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Typography from '@mui/joy/Typography';

function App() {
  const [file, setFile] = useState<File | null>(null);
  const [insertedCount, setInsertedCount] = useState<number>(0);
  const [progress, setProgress] = useState<number>(0);
  const [data, setData] = useState<any[]>([]);
  const [insertions, setInsertions] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [date, setDate] = useState<string>(new Date().toISOString().slice(0, 10)); // Set initial date to today
  console.log(insertedCount);
  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      if (loading) {
        const confirmationMessage = 'You have unsaved changes. Are you sure you want to leave?';
        (event || window.event).returnValue = confirmationMessage;
        return confirmationMessage;
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [loading]);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setFile(event.target.files[0]);
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!file) {
      console.error('No file selected.');
      return;
    }

    const formData = new FormData();
    formData.append('excelFile', file);

    setLoading(true);
    toast('Uploading the file into database', {
      position: 'top-center',
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      theme: 'light',
      transition: Bounce,
    });

    try {
      const response = await axios.post('/data/upload-receiving', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      const jsonData = response.data.jsonData;
      setInsertedCount(jsonData.length);
      setData(jsonData);
      let successfulInsertions = 0;
      
      for (const dataObject of jsonData) {
        try {
          // Add the date to the data object before sending it
          dataObject.date = date;

        

          const phpResponse = await axios.post('/api/upload.php', dataObject);
          console.log(phpResponse.data);
          successfulInsertions++;
        } catch (error) {
          console.error('Error sending object:', dataObject, error);
        }

        const calculatedProgress = (successfulInsertions / jsonData.length) * 100;
        setInsertions(successfulInsertions);
        setProgress(calculatedProgress);
      }

      if (progress === 100) {
        toast.success(' Loading Complete!');
      }
    } catch (error) {
      console.error('Error uploading file:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    
      <Card variant='outlined' color='warning'>
        <Typography level='title-md'>File AutoJit Uploader</Typography>
        <LinearProgress determinate value={progress} />
        <form onSubmit={handleSubmit}>
        <Input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
                    sx={{marginBottom: 2}}
                    />
          <Input type="file" onChange={handleFileChange} sx={{marginBottom: 2}}/>
          <Button type="submit" disabled={loading}>
            {loading ? 'Loading...' : 'Upload'}
          </Button>
        </form>
        <p>
          {progress === 100 ? 'Done!' : `${progress.toFixed(1)}%`} inserted ({insertions}/{data?.length})
        </p>
        <ToastContainer
          position="top-center"
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
        />
      </Card>

  );
}

export default App;
