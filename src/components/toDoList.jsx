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

  return (
    <div className="container w-75">
      <form className="input-group shadow rounded p-3">
        <input className="form-control" type="text" name="titulo" placeholder="Titulo" />
        <input className="form-control" type="text" name="descripcion" placeholder="Descripción"/>
        <input className="btn btn-primary" type="submit" value="Agregar todo"/>
      </form>

      <div className="shadow rounded p-3 mt-5 w-100">
        <div className="d-flex align-items-center justify-content-between list-group-item">
          <h5>Todo list</h5>
          <button className="btn btn-danger">Eliminar tareas completadas</button>
        </div>
        {
            todoArray.map((todo)=>
                <div key={todo.id} className='d-flex align-items-center list-group-item'>
                    <input type="checkbox" className='form-check-input mx-2' checked= {todo.isComplete} />
                    <p className={`p-0 m-0 flex-grow-1 ${todo.isComplete ? 'text-decoration-line-through' : ''}`}>
                        {todo.titulo}<br/>
                        <span className='text-muted'>{todo.descripcion}</span>
                    </p>
                    {todo.isComplete && <span className='badge bg-success'>Completada</span>}
                    <button className='btn btn-warning mx-1'>✏</button>
                    <button className='btn btn-danger mx-1'>🗑</button>
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
