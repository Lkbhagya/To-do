import React, {useState, useEffect} from 'react';
import axios from 'axios';
import { } from 'react-router-dom';
import Card from '@mui/material/Card';
import {Button, CardContent, Typography}  from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/DeleteRounded';
import Chip from '@mui/material/Chip';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import dayjs from 'dayjs';
import Edit from './Edit'
import AddTask from './Addtask';



const Tasklist = () => {

  const [tasks, setTasks] = useState([]);

    useEffect(() => {
        fetchTasks();
    }, []);


    const fetchTasks = async () => {
        try{
            const result = await axios.get('http://127.0.0.1:5000/tasklist');
            // console.log(result.data);
            setTasks(result.data);
        }catch(err){
            console.log('Something Wrong!', err);
        }
    };

    const handleDeleteClick = async (id) => {
        console.log(id);
        await axios.delete('http://127.0.0.1:5000/taskdelete/' + id);
        const newTasks = tasks.filter((item)=>{
            return(
                item.id !== id
            )
        })

        setTasks(newTasks);
    };






//Edit form window pop up visibality
    const [editOpen, setEditOpen] = useState(false);
    const [editTaskId, setEditTaskId] = useState(null);

    const handleEditClick = (id) => {
        setEditTaskId(id);
        setEditOpen(true);
    };


//New Task adding form visibality
    const [addTaskOpen, setAddTaskOpen] = useState(false);

    const handleAddTaskOpen = () => {
        setAddTaskOpen(true);
    };


    const handleAddTaskClose = () => {
        setAddTaskOpen(false);
    };


  return (
    <div className='tasklist-container'>

        <AddTask open = {addTaskOpen} handleClose={handleAddTaskClose} />
        <Edit open = {editOpen} handleClose={() => setEditOpen(false)} taskId={editTaskId}/>


        <Typography variant="caption" display="block" gutterBottom> Task List </Typography>
        <div>
            <Button variant='contained' color='primary' onClick={handleAddTaskOpen}>New Task</Button>
            
            <div className='task-list'>
                {tasks.map(task => (
                    <TaskCard key={task.id} task={task} handleDeleteClick={handleDeleteClick} handleEditClick={handleEditClick}/>
                ))}
                 
            </div>
            </div>
        
    </div>
  );
};

const TaskCard = ({ task, handleDeleteClick, handleEditClick}) => {


    //Date & Time format setting for the card

    const formatDueDate = (dateString) => {
        const date = new Date(dateString);
        const options = {day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit'};
        return new Intl.DateTimeFormat('en-US', options).format(date);
    };

    const formattedDueDate = formatDueDate(task.due_date);



    //Completion status onClick setting
    const [completed, setCompleted] = useState(task.completed);

    const toggleCompletion = async () => {
        setCompleted(!completed);
    


    try{
        const updatedTask = {...task, completed: !completed};
        await axios.put(`http://127.0.0.1:5000/taskupdate/${task.id}`, updatedTask);
    } catch(error) {
        console.error('Faild to update task:', error);
        setCompleted(completed);
        }
    };

   

    return(
        <Card sx = {{minWidth: 275, width: 600 ,marginTop: '1rem', bgcolor: '#f5f5f5', position: 'relative'}}>

            <CardContent style={{ marginBottom: '2rem', justifyContent: 'space-between', alignItems: 'center'}} >

                <Typography variant='button' display='block' component='div'>
                    {task.title} 
                </Typography>

                <Typography variant='button' display="block" component='div' style={{position: 'absolute', right: 20, top: 15}}>
                    {formattedDueDate}
                </Typography>

                <Typography variant='body2'>
                    {task.description}
                </Typography>

            </CardContent>

            <div style={{position: 'absolute', bottom: 10, right: 8 }}>


                {task.completed === true ? (
            <Chip label="Completed" component="" href="" color='success' size='small' icon={<CheckCircleOutlineIcon/>} style={{marginRight: '0.5rem',borderRadius: '5px'}} clickable /> 
            ) : (
                <Chip label='Mark as Completed' size='small' icon={<ErrorOutlineIcon/>} style={{marginRight: '0.5rem', borderRadius: '5px'}} onClick = {toggleCompletion} clickable/>
            ) }

            
            <Chip label='Edit' color='info' size='small' icon={<EditIcon/>} style={{marginRight: '0.5rem', borderRadius: '5px'}} clickable onClick = {() => handleEditClick(task.id)}/>
            <Chip label='Delete' color='error' size='small' icon={<DeleteIcon/>} onClick={()=>handleDeleteClick(task.id)} style={{marginRight: '0.5rem', borderRadius: '5px'}} clickable/>
           
                {/* <EditIcon style={{marginRight: 5, marginLeft:8, color: '#1976d2', cursor: 'pointer'}}/> */}
                {/* <DeleteIcon style={{ marginRight: 5,  color: 'red', cursor: 'pointer' }} onClick={()=>handleDeleteClick(task.id)}/> */}
            </div>

        </Card>
        
            // <div className='task-card col-md '>
            // <h4>{task.title}</h4>
            // <p>{task.description}</p>
            // </div>
        
    );
};

export default Tasklist;