import logo from './logo.svg';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import ToDoList from './components/toDoList';


function App() {
  return (
    <div className="App">
      <h1>Agendate</h1>
      <ToDoList></ToDoList>
    </div>
  );
}

export default App;
