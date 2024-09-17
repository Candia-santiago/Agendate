import React from 'react';
import { useState } from 'react';

function ToDoList() {

const [todoArray, setTodoArray]= useState([
    {
        titulo: "titulo 1",
        descripcion: "descripcion 1",
        isComplete: true,
        id: 1
    },
    {
        titulo: "titulo 2",
        descripcion: "descripcion 2",
        isComplete: false,
        id: 2
    }
])

const tareasCompletadas = todoArray.filter( todo=> todo.isComplete === true).length
const tareasPendientes = todoArray.length-tareasCompletadas

const [formData, setFormData] = useState ({titulo: "", descripcion: ""})
const [todoEditId, setTodoEditId] = useState (null)

const handlerChange = ({target}) =>{
  setFormData ({... formData, [target.name]: target.value})
}

const agregarTarea = (e) =>{
  e.preventDefault ();
  if (todoEditId !== null){
    const newTodo = [... todoArray]
    let todo = newTodo.find ((todo)=> todo.id === todoEditId)
    todo.titulo = formData.titulo
    todo.descripcion = formData.descripcion
    setTodoArray (newTodo)
    setTodoEditId (null)
  
  }
  else{
    if (formData.titulo !== "" && formData.descripcion !== ""){
      const todo = formData
      todo.isComplete = false;
      todo.id = Date.now()
  
      setTodoArray ([... todoArray, todo])
      setFormData ({titulo: "", descripcion: ""})
  
    }
  
  }
}
const eliminarTarea = (id) => {
  const newTodos = todoArray.filter(todo =>  todo.id !==id)
  setTodoArray (newTodos)
}

const estadoDeTareas = (id) =>{
  const newTodo = [... todoArray]
  let todo = newTodo.find((todo)=> todo.id === id)
  todo.isComplete= !todo.isComplete
  setTodoArray (newTodo)
}

const eliminarTareaCompletadas = () => {
  const newTodo= todoArray.filter(todo => todo.isComplete === false)
  setTodoArray (newTodo)
}
const editarTarea = (id) =>{
  const todo = todoArray.find((todo)=> todo.id === id) 
  setFormData({ titulo: todo.titulo, descripcion: todo.descripcion})
  setTodoEditId (id)

}



  return (
    <div className="container w-75">
      <form className="input-group shadow rounded p-3" onSubmit={agregarTarea}>
        <input className="form-control" type="text" name="titulo" placeholder="Titulo" value={formData.titulo} onChange={handlerChange} />
        <input className="form-control" type="text" name="descripcion" placeholder="Descripción" value={formData.descripcion} onChange={handlerChange}/>
        <input className="btn btn-primary" type="submit" value="Agregar todo"/>
      </form>

      <div className="shadow rounded p-3 mt-5 w-100 list-group list-group-flush">
        <div className="d-flex align-items-center justify-content-between list-group-item ">
          <h5>Todo list</h5>
          <button className="btn btn-danger" onClick={eliminarTareaCompletadas}>Eliminar tareas completadas</button>
        </div>
        {
            todoArray.map((todo)=>
                <div key={todo.id} className='d-flex align-items-center list-group-item'>
                    <input type="checkbox" className='form-check-input mx-2' onChange={()=> estadoDeTareas (todo.id)} checked= {todo.isComplete} />
                    <p className={`p-0 m-0 flex-grow-1 ${todo.isComplete ? 'text-decoration-line-through' : ''}`}>
                        {todo.titulo}<br/>
                        <span className='text-muted'>{todo.descripcion}</span>
                    </p>
                    {todo.isComplete && <span className='badge bg-success'>Completada</span>}
                    <button className='btn btn-warning mx-1'onClick={() => editarTarea (todo.id)}>✏</button>
                    <button className='btn btn-danger mx-1' onClick={() => eliminarTarea (todo.id)}>🗑</button>
                </div>
            )
        }
        <div className='list-group-item'>
            <span className='fw-light '>Total de tareas:{todoArray.length} , Completadas: {tareasCompletadas} , Pendientes: {tareasPendientes} </span>

        </div>
      </div>
    </div>
  );
}

export default ToDoList;
