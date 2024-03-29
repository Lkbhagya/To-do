import React, { useState, useEffect} from 'react';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import Card from '@mui/material/Card';
import {CardContent, Typography} from '@mui/material';
import dayjs from 'dayjs';
import Badge from '@mui/material/Badge';
import { PickersDay } from '@mui/x-date-pickers/PickersDay';
import { DayCalendarSkeleton } from '@mui/x-date-pickers/DayCalendarSkeleton';
import axios from 'axios';
import Slide from '@mui/material/Slide';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';




function ServerDay(props) {
  const { highlightedDays = [], day, outsideCurrentMonth, tasks, handleDateClick,  ...other } = props;
  const isSelected = !props.outsideCurrentMonth && highlightedDays.indexOf(props.day.date()) >= 0;

    // const hasTasks = tasks.find(task => dayjs(task.due_date).isSame(day, 'day'));

    const tasksForSelectedDate = tasks.filter(task => dayjs(task.due_date).isSame(day, 'day'));

    const incompleteTasks = tasksForSelectedDate.filter(task => !task.completed);

  return (
    <Badge
      color="warning"
      variant="dot"
      overlap="circular"
      badgeContent=" "
      invisible={!isSelected || incompleteTasks.length === 0}
      onClick = {() => handleDateClick(day)}
    >
      <PickersDay {...other} outsideCurrentMonth={outsideCurrentMonth} day={day} />
    </Badge>
  );
}

export default function Calendar() {
  const [highlightedDays, setHighlightedDays] = useState([]);
  const [tasks, setTasks] = useState ([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedDateTasks, setSelectedDateTasks] = useState([]);
  const [expandedTaskId, setExpandedTaskId] = useState(null);


  useEffect(() => {
    axios.get('http://127.0.0.1:5000/tasklist')
    .then(response => {

      const dueDates = response.data.map(task => dayjs(task.due_date).date());
      setHighlightedDays(dueDates);
      setTasks(response.data);
    })
    .catch(error => {
      console.error('Error fetching tasks:', error);
    });
  }, []);



  const handleDateClick = (day) => {
    setSelectedDate(day);
    const tasksForSelectedDate = tasks.filter(task =>
      dayjs(task.due_date).isSame(day, 'day') && !task.completed
      );
    setSelectedDateTasks(tasksForSelectedDate);
    setOpenDialog(true);
  };


  const handleCloseDialog = () => {
    setOpenDialog(false);
  };
  

  const handleToggleDescription = (taskId) => { 
    setExpandedTaskId(prevId => (prevId === taskId ? null : taskId));
  };

  return (
    <Card sx={{ minWidth: 275, width: 600, height: 500, bgcolor: '#f5f5f5', position: "relative" }}>
      <CardContent>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DateCalendar defaultValue={dayjs}
            renderLoading={() => <DayCalendarSkeleton />}
            slots={{
              day: (props) => <ServerDay {...props} tasks={tasks} handleDateClick={handleDateClick}/>,
            }}
            slotProps={{
              day: {
                highlightedDays,
              },
            }}
            style = {{zoom: 1.4}}
          />
        </LocalizationProvider>
      </CardContent>

      <Dialog
        open = {openDialog}
        TransitionComponent={Slide}
        keepMounted
        onClose={handleCloseDialog}
        aria-describedby='alert-dialog-slide-description'
      >
        <DialogTitle>{selectedDate ? `Tasks for ${selectedDate.format('MMMM DD, YYYY')}` : 'No Tasks for Today'}</DialogTitle>

        <DialogContent>
          <DialogContentText id = 'alert-dialog-slide-description'>

          {selectedDateTasks.length > 0 ? (
              selectedDateTasks.map(task => (
                <div key={task.id}>
                  
            <Button onClick={() => handleToggleDescription(task.id)} style={{ textTransform: 'none' }}>
                <Typography variant="button">{task.title}</Typography>
            </Button>
          
          {expandedTaskId === task.id && (
            <Slide direction="down" in={expandedTaskId === task.id} mountOnEnter unmountOnExit>
                <Typography variant="body1">{task.description}</Typography>
            </Slide>
          )}
                  </div>
              ))
            ) : (
              <Typography variant="button">No tasks for Today.</Typography>
            )}

          </DialogContentText>
        </DialogContent>

        <DialogActions>
          <Button onClick={handleCloseDialog}>Close</Button>
        </DialogActions>
      </Dialog>
    </Card>
  );
}

