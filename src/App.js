import React, { useState } from 'react';
import './App.css';
import { } from 'react-router-dom';
import Navbar from './Components/Navbar';
import Tasklist from './Components/Tasklist';
import Calendar from './Components/Calendar';

function App() {

  

  return (
    <div className="App">
      <Navbar/>
      <div className='tasklist-calendar'>
      <Tasklist/>
      <Calendar/>
      </div>
      
        
        

      
    </div>
  );
}

export default App;
