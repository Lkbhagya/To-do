import React, { useState} from 'react';
import axios from 'axios';
import { Dialog, DialogTitle, DialogContent, TextField, Button, DialogActions, Box } from '@mui/material';
import dayjs from 'dayjs';
import { DateTimePicker } from '@mui/x-date-pickers';
import {AdapterDayjs} from '@mui/x-date-pickers/AdapterDayjs';
import {LocalizationProvider} from '@mui/x-date-pickers/LocalizationProvider';
import Chip from '@mui/material/Chip';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';



const Addtask = ({open, handleClose}) => {

    const [task, setTask] = useState ({
        title : '',
        description : '',
        due_date : '',
        completed : false
    });


    const handleInputChange = (e) => {
        const {name, value} = e.target;
        setTask({...task, [name]: value});
    };


    const handleDateChange = (date) => {
        setTask({...task, due_date: date});
    };



    const handleAdd = async () => {
        try{
            await axios.post('http://localhost:5000/addtask', task);
            handleClose();
        } catch(err) {
            console.error('Error Adding Task:', err);
        }
    };

   



  return (
    <Dialog open = {open} onClose={handleClose}>
        <DialogTitle>Add Task</DialogTitle>
        <DialogContent>
            

            <TextField  autoFocus margin="dense" label="Title" type="text" fullWidth name="title" value={task.title} onChange={handleInputChange} />
            <TextField margin="dense"  label="Description" type="text"  fullWidth name="description" value={task.description} onChange={handleInputChange} />

            <Box mt = {1} style={{ width: '100%'}}>
            <LocalizationProvider dateAdapter = {AdapterDayjs} >
                <DateTimePicker
                    label = 'Date & Time'
                    
                    onChange = {handleDateChange}
                    renderInput = {(params) => <TextField {...params} value = {task.due_date} fullwidth margin='dense' style={{width: '100%'}}/>}
                    fullWidth
                    />
            </LocalizationProvider>
            </Box>

            <Box mt= {1.5} style = {{width: '100%'}}>
                <Chip label='Mark as Completed' value={task.completed} icon={<ErrorOutlineIcon/>}  style={{marginRight: '0rem', borderRadius: '5px', width: '100%', height: '56px'}} clickable/>     
            </Box>
        </DialogContent>

        <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button onClick={handleAdd}>Add</Button>
        </DialogActions>
    </Dialog>
  )
}

export default Addtask