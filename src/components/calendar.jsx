import React, { useState, useEffect } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import "react-big-calendar/lib/css/react-big-calendar.css";
import moment from 'moment';
import 'moment/locale/es'; // Importar el idioma español
import { Modal, Button, Form, Alert } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import localforage from 'localforage';

moment.locale('es'); // Establecer el idioma español para Moment.js
const localizer = momentLocalizer(moment);

function MyCalendar({ todoArray }) {
  const [events, setEvents] = useState([]);
  const [show, setShow] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [newEvent, setNewEvent] = useState({ title: "", start: new Date(), end: new Date(), category: "General" });
  const [showNotification, setShowNotification] = useState(null);
  const [error, setError] = useState(null);

  const normalizeDate = (date) => moment(date).startOf('day').toDate();

  useEffect(() => {
    localforage.config({
      name: 'calendarApp',
      storeName: 'events',
    });
  }, []);

  useEffect(() => {
    const loadEvents = async () => {
      const storedEvents = await localforage.getItem('calendarEvents') || [];
      const todoEvents = todoArray.map(todo => ({
        title: todo.titulo,
        start: normalizeDate(todo.fecha),
        end: normalizeDate(todo.fecha),
        allDay: true,
        category: "To-Do"
      }));
      setEvents([...storedEvents, ...todoEvents]);
    };
    loadEvents();
  }, [todoArray]);

  useEffect(() => {
    localforage.setItem('calendarEvents', events).catch((err) => {
      console.error("Error saving to localForage", err);
    });
  }, [events]);

  const handleShow = (edit = false, event = {}) => {
    setEditMode(edit);
    setNewEvent(edit ? event : { title: "", start: new Date(), end: new Date(), category: "General" });
    setShow(true);
  };

  const handleClose = () => {
    setShow(false);
    setEditMode(false);
    setError(null);
    setNewEvent({ title: "", start: new Date(), end: new Date(), category: "General" });
  };

  const handleEventSubmit = () => {
    const now = new Date();
    if (newEvent.start < now || newEvent.end < now) {
      setError("No puedes agregar eventos en fechas u horas pasadas.");
      return;
    }

    const normalizedEvent = {
      ...newEvent,
      start: normalizeDate(newEvent.start),
      end: normalizeDate(newEvent.end),
      allDay: true,
    };

    const updatedEvents = editMode
      ? events.map(event => (event === newEvent ? normalizedEvent : event))
      : [...events, normalizedEvent];

    setEvents(updatedEvents);
    handleClose();
  };

  const handleSelectSlot = ({ start, end }) => {
    const now = new Date();
    if (start < now) {
      setError("No puedes seleccionar días pasados.");
      return;
    }

    setNewEvent({
      title: "",
      start: normalizeDate(start),
      end: normalizeDate(end),
      category: "General",
    });
    setError(null);
    handleShow();
  };

  const handleDeleteEvent = (event) => {
    const updatedEvents = events.filter(e => e !== event);
    setEvents(updatedEvents);
  };

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
      {showNotification && (
        <Alert variant="info" onClose={() => setShowNotification(null)} dismissible>
          {showNotification}
        </Alert>
      )}

<Calendar
  localizer={localizer}
  events={events}
  startAccessor="start"
  endAccessor="end"
  style={{ height: 500, width: '100%' }}
  selectable
  onSelectEvent={(event) => handleShow(true, event)}
  onSelectSlot={handleSelectSlot}
  views={['month', 'week', 'day', 'agenda']} // Nombres válidos para las vistas
  messages={{
    date: 'Fecha',
    time: 'Hora',
    event: 'Evento',
    allDay: 'Todo el día',
    week: 'Semana',
    work_week: 'Semana laboral',
    day: 'Día',
    month: 'Mes',
    previous: 'Anterior',
    next: 'Siguiente',
    yesterday: 'Ayer',
    tomorrow: 'Mañana',
    today: 'Hoy',
    agenda: 'Agenda',
    noEventsInRange: 'No hay eventos en este rango.',
    showMore: total => `+ Ver más (${total})`,
  }}
  eventPropGetter={(event) => ({
    style: {
      backgroundColor: event.category === "Trabajo" ? "#007bff" : event.category === "Personal" ? "#28a745" : "#6c757d"
    }
  })}
/>


      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>{editMode ? "Editar evento" : "Agregar nuevo evento"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {error && <Alert variant="danger">{error}</Alert>}
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
                min={moment().format("YYYY-MM-DDTHH:mm")}
                value={moment(newEvent.start).format("YYYY-MM-DDTHH:mm")}
                onChange={(e) => setNewEvent({ ...newEvent, start: new Date(e.target.value) })}
              />
            </Form.Group>
            <Form.Group controlId="formBasicEnd">
              <Form.Label>Fecha y hora de finalización</Form.Label>
              <Form.Control
                type="datetime-local"
                min={moment().format("YYYY-MM-DDTHH:mm")}
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
