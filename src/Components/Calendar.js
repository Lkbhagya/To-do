import * as React from 'react';
import { useState, useEffect } from 'react';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import Card from '@mui/material/Card';
import {CardContent}  from '@mui/material';
import { Badge } from '@mui/material';
import axios from 'axios';

export default function Calendar() {
  const [taskDates, setTaskDates] = useState([]);

  useEffect(() => {
    fetchTaskDates();
  }, []);



    const fetchTaskDates = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:5000/tasklist');
        const dates = response.data.map(task => task.due_date.split('T')[0]);
        setTaskDates(dates);
      } catch (error) {
        console.error('Error fetching task dates:', error);
      }
    };

    

  const renderDay = (date, selectedDates, DayComponentProps) => {
    
    const dateString = date.toISOString().split('T')[0];
    const hasTask = taskDates.includes(dateString);
    
    return (
      <div>
        <DayComponentProps.defaultRender {...DayComponentProps}/>
        {hasTask && (
          <Badge color='secondary' overlap='circular' badgeContent='' style={{position: 'absolute', bottom: 0, right: 0}}/>
        )}
      </div>)
  };



  return (
    <Card sx = {{minWidth: 275, width: 600 , height: 500 , bgcolor: '#f5f5f5', position: "relative" }}>

      <CardContent>

          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DateCalendar renderDay = {renderDay} style = {{ zoom: 1.4}}/>
          </LocalizationProvider>

      </CardContent>
    </Card>
    
  );
}
