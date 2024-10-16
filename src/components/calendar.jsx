import React, { useState, useEffect } from 'react';

import { Calendar, momentLocalizer } from 'react-big-calendar';
import "react-big-calendar/lib/css/react-big-calendar.css";
import moment from 'moment';

import { format, parseISO } from 'date-fns'; // Para trabajar con fechas
import { Modal, Button, Form } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

const localizer = momentLocalizer(moment);

function MyCalendar({ todoArray }) {
  const [events, setEvents] = useState([]);
  const [show, setShow] = useState(false);
  const [newEvent, setNewEvent] = useState({ title: "", start: "", end: "" });
  
  // Cargar eventos guardados en localStorage
  useEffect(() => {
    const storedEvents = localStorage.getItem('calendarEvents');
    if (storedEvents) {
      setEvents(JSON.parse(storedEvents));
    }
  }, []);
  
  // Guardar eventos en localStorage
  useEffect(() => {
    localStorage.setItem('calendarEvents', JSON.stringify(events));
  }, [events]);

  // Sincronizar las tareas de ToDoList con el calendario
  useEffect(() => {
    const mappedTodos = todoArray.map(todo => ({
      title: todo.titulo,
      start: parseISO(todo.fecha), 
      end: parseISO(todo.fecha), 
      allDay: true,
    }));
    setEvents(prevEvents => [...prevEvents, ...mappedTodos]);
  }, [todoArray]);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleEventSubmit = () => {
    setEvents([...events, { title: newEvent.title, start: newEvent.start, end: newEvent.end, allDay: true }]);
    setNewEvent({ title: "", start: "", end: "" });
    setShow(false);
  };

  const handleSelectSlot = ({ start, end }) => {
    setNewEvent({ ...newEvent, start, end });
    handleShow();
  };

  return (
    <div className="container mt-4">
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 500, width: 1300 }}
        selectable={true}
        onSelectSlot={handleSelectSlot}
        views={['month', 'week', 'day']}
      />

      {/* Modal para agregar eventos */}
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Agregar nuevo evento</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formBasicTitle">
              <Form.Label>Título</Form.Label>
              <Form.Control
                type="text"
                placeholder="Escribe el título del evento"
                value={newEvent.title}
                onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
              />
            </Form.Group>
            <Form.Group controlId="formBasicStart">
              <Form.Label>Fecha de inicio</Form.Label>
              <Form.Control
                type="date"
                value={newEvent.start ? format(new Date(newEvent.start), 'yyyy-MM-dd') : ""}
                onChange={(e) => setNewEvent({ ...newEvent, start: e.target.value })}
              />
            </Form.Group>
            <Form.Group controlId="formBasicEnd">
              <Form.Label>Fecha de finalización</Form.Label>
              <Form.Control
                type="date"
                value={newEvent.end ? format(new Date(newEvent.end), 'yyyy-MM-dd') : ""}
                onChange={(e) => setNewEvent({ ...newEvent, end: e.target.value })}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>Cancelar</Button>
          <Button variant="primary" onClick={handleEventSubmit}>Guardar evento</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default MyCalendar;
