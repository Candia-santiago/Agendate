import React, { useState, useEffect } from 'react';

function ToDoList() {
  const [todoArray, setTodoArray] = useState([]);
  const [formData, setFormData] = useState({ titulo: "", descripcion: "", fecha: "", categoria: "Estudio" });
  const [todoEditId, setTodoEditId] = useState(null);
  const [filtroCategoria, setFiltroCategoria] = useState("Todos");

  // Cargar datos de localStorage al iniciar
  useEffect(() => {
    const data = localStorage.getItem('todoItems');
    if (data) {
      try {
        setTodoArray(JSON.parse(data)); 
      } catch (e) {
        console.error("Error al cargar datos de localStorage", e);
      }
    }
  }, []);

  // Guardar datos en localStorage cada vez que se actualice el array
  useEffect(() => {
    if (todoArray.length > 0) {
      localStorage.setItem('todoItems', JSON.stringify(todoArray));
    } else {
      localStorage.removeItem('todoItems'); // Limpiar el storage si no hay tareas
    }
  }, [todoArray]);

  const handlerChange = ({ target }) => {
    setFormData({ ...formData, [target.name]: target.value });
  };

  const agregarTarea = (e) => {
    e.preventDefault();
    if (todoEditId !== null) {
      const newTodo = [...todoArray];
      let todo = newTodo.find((todo) => todo.id === todoEditId);
      todo.titulo = formData.titulo;
      todo.descripcion = formData.descripcion;
      todo.fecha = formData.fecha;
      todo.categoria = formData.categoria;
      setTodoArray(newTodo);
      setTodoEditId(null);
    } else {
      if (formData.titulo !== "" && formData.descripcion !== "" && formData.fecha !== "") {
        const todo = { ...formData, isComplete: false, id: Date.now() };
        setTodoArray([...todoArray, todo]);
        setFormData({ titulo: "", descripcion: "", fecha: "", categoria: "Estudio" });
      }
    }
  };

  const eliminarTarea = (id) => {
    const newTodos = todoArray.filter(todo => todo.id !== id);
    setTodoArray(newTodos);
  };
  
  const estadoDeTareas = (id) => {
    const newTodo = [...todoArray];
    let todo = newTodo.find(todo => todo.id === id);
    todo.isComplete = !todo.isComplete;
    setTodoArray(newTodo);
  };

  const eliminarTareaCompletadas = () => {
    const newTodo = todoArray.filter(todo => !todo.isComplete);
    setTodoArray(newTodo);
  };

  const editarTarea = (id) => {
    const todo = todoArray.find(todo => todo.id === id);
    setFormData({ titulo: todo.titulo, descripcion: todo.descripcion, fecha: todo.fecha, categoria: todo.categoria });
    setTodoEditId(id);
  };

  const tareasCompletadas = todoArray.filter(todo => todo.isComplete).length;
  const tareasPendientes = todoArray.length - tareasCompletadas;

  const tareasFiltradas = filtroCategoria === "Todos" ? todoArray : todoArray.filter(todo => todo.categoria === filtroCategoria);

  return (
    <div className="container w-75">
      <form className="input-group shadow rounded p-3" onSubmit={agregarTarea}>
        <input className="form-control" type="text" name="titulo" placeholder="Titulo" value={formData.titulo} onChange={handlerChange} />
        <input className="form-control" type="text" name="descripcion" placeholder="Descripción" value={formData.descripcion} onChange={handlerChange} />
        <input className="form-control" type="date" name="fecha" placeholder="Fecha" value={formData.fecha} onChange={handlerChange} />
        <select className="form-select" name="categoria" value={formData.categoria} onChange={handlerChange}>
          <option value="Estudio">Estudio</option>
          <option value="Trabajo">Trabajo</option>
          <option value="Doméstico">Doméstico</option>
          <option value="Otros">Otros</option>
        </select>
        <input className="btn btn-primary" type="submit" value={todoEditId ? "Editar tarea" : "Agregar tarea"} />
      </form>

      <div className="shadow rounded p-3 mt-5 w-100 list-group list-group-flush">
        <div className="d-flex align-items-center justify-content-between list-group-item">
          <h5>Todo list</h5>
          <button className="btn btn-danger" onClick={eliminarTareaCompletadas}>Eliminar tareas completadas</button>
        </div>

        <div className="d-flex justify-content-between my-2">
          <label className="me-2">Filtrar por categoría:</label>
          <select className="form-select w-25" value={filtroCategoria} onChange={(e) => setFiltroCategoria(e.target.value)}>
            <option value="Todos">ToDoS</option>
            <option value="Estudio">Estudio</option>
            <option value="Trabajo">Trabajo</option>
            <option value="Doméstico">Doméstico</option>
            <option value="Otros">Otros</option>
          </select>
        </div>

        {tareasFiltradas.map((todo) => (
          <div key={todo.id} className="d-flex align-items-center list-group-item">
            <input type="checkbox" className="form-check-input mx-2" onChange={() => estadoDeTareas(todo.id)} checked={todo.isComplete} />
            <p className={`p-0 m-0 flex-grow-1 ${todo.isComplete ? 'text-decoration-line-through' : ''}`}>
              {todo.titulo} - {todo.categoria}
              <br />
              <span className="text-muted">{todo.descripcion}</span>
              <br />
              <small className="text-muted">Fecha: {todo.fecha}</small>
            </p>
            {todo.isComplete && <span className="badge bg-success">Completada</span>}
            <button className="btn btn-warning mx-1" onClick={() => editarTarea(todo.id)}>✏</button>
            <button className="btn btn-danger mx-1" onClick={() => eliminarTarea(todo.id)}>🗑</button>
          </div>
        ))}
        <div className="list-group-item">
          <span className="fw-light">
            Total de tareas: {todoArray.length}, Completadas: {tareasCompletadas}, Pendientes: {tareasPendientes}
          </span>
        </div>
      </div>
    </div>
  );
}

export default ToDoList;
