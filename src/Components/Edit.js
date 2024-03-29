import React, { useState, useEffect} from 'react';
import axios from 'axios';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  TextField, 
  Button, 
  DialogActions, 
  Box 
} from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers';
import {AdapterDayjs} from '@mui/x-date-pickers/AdapterDayjs';
import {LocalizationProvider} from '@mui/x-date-pickers/LocalizationProvider';
import Chip from '@mui/material/Chip';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';


dayjs.extend(utc);
dayjs.extend(timezone); 



const Edit = ({open, handleClose, taskId}) => {

  const [task, setTask] = useState({
    title : '',
    description: '',
    due_date : '',
    completed : false
  });


  useEffect(() => {
    if (taskId) {
      fetchTaskDetails(taskId);
    }
  }, [taskId]);


  const fetchTaskDetails = async (id) => {
    try{
      const result = await axios.get( `http://localhost:5000/taskdetails/${id}`);
      const duedate = result.data.due_date ? dayjs(result.data.due_date).tz('Asia/Colombo').format('YYYY-MM-DDTHH:mm:ss') : null;
      // console.log("Due Date:", duedate);
      setTask({...result.data, due_date: duedate});
    }catch (err) {
      console.error('Error fetching Task Details:', err);
    }
  };


  const handleInputChange = (e) => {
    const {name, value} = e.target;
    setTask ({...task, [name]: value });
  };

  const handleDateChange = (date) => {
    setTask ({...task, due_date: date});
    const localDatetime = dayjs(date).tz('Asia/Colombo').format('YYYY-MM-DDTHH:mm:ss');
    setTask({...task, due_date: localDatetime});

    
  };

  
  



  const toggleCompletion = () => {
    setTask({...task, completed: !task.completed});
  };




  const handleUpdate = async () => {
    try{
      await axios.put(`http://localhost:5000/taskupdate/${taskId}`, task);
      handleClose();
    }catch (err) {
      console.error('Error Updaing Task:', err);
    }
  };




  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Edit Task</DialogTitle>
      <DialogContent>
          <TextField 
            autoFocus 
            margin="dense" 
            label="Title" 
            type="text" 
            fullWidth  
            name="title" 
            value={task.title} 
            onChange={handleInputChange} 
          />
          <TextField  
            margin="dense" 
            label="Description" 
            type="text" 
            fullWidth 
            name="description" 
            value={task.description} 
            onChange={handleInputChange} 
          />

        <Box mt = {1} > 
             <LocalizationProvider dateAdapter = {AdapterDayjs}>
                <DateTimePicker
                   label = 'Date & Time'
                    // value = {task.due_date}
                     onChange = {handleDateChange}
                     renderInput = {(params) => <TextField  {...params } fullWidth margin='dense'/>}
                  />
             </LocalizationProvider>

            

            
            </Box>


            <Box mt= {1.5} style = {{width: '100%'}}>
              {task.completed ? (
                <Chip label='Completed' icon={<CheckCircleOutlineIcon/>}  color ='success' style={{marginRight: '0rem', borderRadius: '5px', width: '100%', height: '56px'}} onClick={toggleCompletion} clickable/>
              ) : (
                <Chip label="Mark as Completed" icon={<ErrorOutlineIcon/>} style={{marginRight: '0rem', borderRadius: '5px', width: '100%', height: '56px'}} onClick={toggleCompletion} clickable/>
              )}    
            </Box>
        {/* <TextField  margin="dense" label="Date & Time" type="datetime" fullWidth name="description" value={task.due_date} onChange={handleInputChange} /> */}
        {/* <TextField  margin="dense" label="Completed" type="" fullWidth name="description" value={task.completed} onChange={handleInputChange} /> */}

      </DialogContent>

      <DialogActions>

        <Button onClick={handleClose}>Close</Button>
        <Button onClick={handleUpdate}>Update</Button>
      </DialogActions>
    </Dialog>
  );
}

export default Edit;