import React, { useState, useEffect } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import "react-big-calendar/lib/css/react-big-calendar.css";
import moment from 'moment';
import { Modal, Button, Form, Alert } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import localforage from 'localforage';

const localizer = momentLocalizer(moment);

function MyCalendar({ todoArray }) {
  const [events, setEvents] = useState([]);
  const [show, setShow] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [newEvent, setNewEvent] = useState({ title: "", start: new Date(), end: new Date(), category: "General" });
  const [showNotification, setShowNotification] = useState(null);

  // Configurar el almacenamiento en `localforage`
  useEffect(() => {
    localforage.config({
      name: 'calendarApp',
      storeName: 'events',
    });
  }, []);

  // Cargar eventos desde `localForage` y mezclar con todoArray al iniciar
  useEffect(() => {
    const loadEvents = async () => {
      const storedEvents = await localforage.getItem('calendarEvents') || [];
      const todoEvents = todoArray.map(todo => ({
        title: todo.titulo,
        start: new Date(todo.fecha),
        end: new Date(todo.fecha),
        allDay: false,
        category: "To-Do"
      }));
      const combinedEvents = [...storedEvents, ...todoEvents];
      setEvents(combinedEvents);
    };
    loadEvents();
  }, [todoArray]);

  // Guardar eventos en `localForage` cada vez que cambien
  useEffect(() => {
    localforage.setItem('calendarEvents', events).catch((err) => {
      console.error("Error saving to localForage", err);
    });
  }, [events]);

  const handleShow = (edit = false, event = {}) => {
    setEditMode(edit);
    setNewEvent(event);
    setShow(true);
  };

  const handleClose = () => {
    setShow(false);
    setEditMode(false);
    setNewEvent({ title: "", start: new Date(), end: new Date(), category: "General" });
  };

  const handleEventSubmit = () => {
    const updatedEvents = editMode
      ? events.map(event => (event === newEvent ? newEvent : event))
      : [...events, { ...newEvent, allDay: false }];
    setEvents(updatedEvents);
    handleClose();
  };

  const handleSelectSlot = ({ start, end }) => {
    setNewEvent({ title: "", start: start, end: end, category: "General" });
    handleShow();
  };

  const handleDeleteEvent = (event) => {
    const updatedEvents = events.filter(e => e !== event);
    setEvents(updatedEvents);
  };

  // Notificación para eventos próximos
  useEffect(() => {
    const checkUpcomingEvents = () => {
      const now = new Date();
      const upcomingEvent = events.find(event => {
        const eventDate = new Date(event.start);
        return eventDate > now && eventDate - now < 60000;
      });
      if (upcomingEvent) {
        setShowNotification(`¡Recuerda! Tienes el evento: ${upcomingEvent.title} en breve.`);
      }
    };
    const interval = setInterval(checkUpcomingEvents, 60000);
    return () => clearInterval(interval);
  }, [events]);

  return (
    <div className="container mt-4">
      {showNotification && <Alert variant="info" onClose={() => setShowNotification(null)} dismissible>{showNotification}</Alert>}
      
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 500, width: '100%' }}
        selectable={true}
        onSelectEvent={(event) => handleShow(true, event)}
        onSelectSlot={handleSelectSlot}
        views={['month', 'week', 'day', 'agenda']}
        eventPropGetter={(event) => ({
          style: { backgroundColor: event.category === "Trabajo" ? "#007bff" : event.category === "Personal" ? "#28a745" : "#6c757d" }
        })}
      />

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>{editMode ? "Editar evento" : "Agregar nuevo evento"}</Modal.Title>
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
              <Form.Label>Fecha y hora de inicio</Form.Label>
              <Form.Control
                type="datetime-local"
                value={moment(newEvent.start).format("YYYY-MM-DDTHH:mm")}
                onChange={(e) => setNewEvent({ ...newEvent, start: new Date(e.target.value) })}
              />
            </Form.Group>
            <Form.Group controlId="formBasicEnd">
              <Form.Label>Fecha y hora de finalización</Form.Label>
              <Form.Control
                type="datetime-local"
                value={moment(newEvent.end).format("YYYY-MM-DDTHH:mm")}
                onChange={(e) => setNewEvent({ ...newEvent, end: new Date(e.target.value) })}
              />
            </Form.Group>
            <Form.Group controlId="formBasicCategory">
              <Form.Label>Categoría</Form.Label>
              <Form.Control
                as="select"
                value={newEvent.category}
                onChange={(e) => setNewEvent({ ...newEvent, category: e.target.value })}
              >
                <option value="General">General</option>
                <option value="Trabajo">Trabajo</option>
                <option value="Personal">Personal</option>
              </Form.Control>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          {editMode && <Button variant="danger" onClick={() => handleDeleteEvent(newEvent)}>Eliminar</Button>}
          <Button variant="secondary" onClick={handleClose}>Cancelar</Button>
          <Button variant="primary" onClick={handleEventSubmit}>Guardar evento</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default MyCalendar;
