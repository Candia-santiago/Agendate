import logo from './logo.svg';
import './App.css';
import React, {useState} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/css/bootstrap.min.css';

import ToDoList from './components/toDoList';
import MyCalendar from './components/calendar';

function App() {
  const [todoArray, setTodoArray] = useState([]);

  return (
    <div className="App">
      <h1>Agendate</h1>
      <ToDoList setTodoArray={setTodoArray} todoArray={todoArray} ></ToDoList>
      <MyCalendar todoArray={todoArray}></MyCalendar>   
    </div>
  );
}

export default App;
