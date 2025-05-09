import React, { useState, useEffect} from 'react';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import { Button, Modal, Form } from 'react-bootstrap';
import { getUserRoleFromToken, getUserIdFromToken } from '../helpers/authHelper';
import format from 'date-fns/format';
import parse from 'date-fns/parse';
import startOfWeek from 'date-fns/startOfWeek';
import getDay from 'date-fns/getDay';
import lt from 'date-fns/locale/lt';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const locales = { lt };

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 1 }),
  getDay,
  locales,
});

const formats = {
  timeGutterFormat: (date, culture, localizer) =>
    localizer.format(date, 'HH:mm', culture),
  eventTimeRangeFormat: () => '',
  agendaTimeFormat: (date, culture, localizer) =>
    localizer.format(date, 'HH:mm', culture),
};

const CalendarPage = () => {
  const [events, setEvents] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newLesson, setNewLesson] = useState({
    title: '',
    start: '',
    end: '',
    moduleId: '',
    studentId: '',
  });
  const [availableModules, setAvailableModules] = useState([]);
  const [availableStudents, setAvailableStudents] = useState([]);


  const userId = getUserIdFromToken();
  const role = getUserRoleFromToken();

  useEffect(() => {
    fetchLessons();
    if (role === 'tutor') {
    fetch(`https://localhost:7014/api/tutors/${userId}/modules`)
        .then(res => res.json())
        .then(data => setAvailableModules(data))
        .catch(err => console.error('Module fetch error:', err));
    }

  }, []);

  const fetchLessons = async () => {
    try {
      const response = await fetch(
        `https://localhost:7014/api/LessonSchedule/user?userId=${userId}&role=${role}`
      );
      if (response.ok) {
        const lessons = await response.json();
        const formatted = lessons.map((lesson) => ({
          title: lesson.description,
          start: new Date(lesson.startTime),
          end: new Date(lesson.endTime),
          allDay: false,
        }));
        setEvents(formatted);
      }
    } catch (error) {
      console.error('Failed to fetch lessons:', error);
    }
  };

  const handleAddLesson = async () => {
    const payload = {
      tutorId: role === 'tutor' ? userId : null,
      studentId: role === 'student' ? userId : newLesson.studentId,
      moduleId: parseInt(newLesson.moduleId),
      startTime: new Date(newLesson.start).toISOString(),
      endTime: new Date(newLesson.end).toISOString(),
      description: newLesson.title,
    };

    try {
      const response = await fetch(`https://localhost:7014/api/LessonSchedule`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        await fetchLessons();
        setShowAddModal(false);
        setNewLesson({ title: '', start: '', end: '', moduleId: '', studentId: '' });
      } else {
        const error = await response.text();
        alert('Error adding lesson: ' + error);
      }
    } catch (err) {
      console.error('Error adding lesson:', err);
    }
  };

 const customEvent = ({ event }) => (
  <div style={{ padding: '4px 6px' }}>
    <div style={{ fontWeight: '600', fontSize: '0.95rem', color: '#fff' }}>
      {event.title}
    </div>
    <div style={{ fontSize: '0.8rem', color: '#e0e0e0' }}>
      {format(event.start, 'HH:mm')} – {format(event.end, 'HH:mm')}
    </div>
  </div>
);



  return (
    <div className="container py-4">
      <h2 className="mb-4">Lesson Calendar</h2>

      {role === 'tutor' && (
        <Button variant="primary" onClick={() => setShowAddModal(true)}>
          Add Lesson
        </Button>
      )}
        <div style={{ height: '80vh', overflowY: 'scroll' }}>
            <Calendar
                localizer={localizer}
                events={events}
                tooltipAccessor={(event) =>
                    `${event.title} (${event.start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}–${event.end.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })})`
                }
                defaultView="week" // explicitly set view to week or day
                views={['week', 'day', 'month']}
                formats={formats}
                startAccessor="start"
                endAccessor="end"
                style={{ height: 600, marginTop: '20px' }}
                scrollToTime={new Date(new Date().setHours(new Date().getHours() - 1))}
                showNowIndicator={true}
                components={{ event: customEvent }}
                eventPropGetter={(event) => ({
                    style: {
                    backgroundColor: '#0d6efd',
                    color: 'white',
                    borderRadius: '4px',
                    border: 'none'
                    }
                })}
            />

        </div>
      <Modal show={showAddModal} onHide={() => setShowAddModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Schedule a Lesson</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="lessonTitle" className="mb-3">
                <Form.Label>Lesson Title</Form.Label>
                <Form.Control
                type="text"
                value={newLesson.title}
                onChange={(e) => setNewLesson({ ...newLesson, title: e.target.value })}
                />
            </Form.Group>
            <Form.Group controlId="moduleSelector" className="mb-3">
                <Form.Label>Select Module</Form.Label>
                <Form.Select
                value={newLesson.moduleId}
                onChange={async (e) => {
                    const moduleId = e.target.value;
                    setNewLesson((prev) => ({ ...prev, moduleId, studentId: '' }));
                    if (moduleId) {
                    const res = await fetch(`https://localhost:7014/api/tutors/${userId}/modules/${moduleId}/students`);
                    if (res.ok) {
                        const students = await res.json();
                        setAvailableStudents(students);
                    } else {
                        setAvailableStudents([]);
                    }
                    }
                }}
                >
                <option value="">-- Choose a module --</option>
                {availableModules.map((mod) => (
                    <option key={mod.id} value={mod.id}>{mod.name}</option>
                ))}
                </Form.Select>
            </Form.Group>

            <Form.Group controlId="studentSelector" className="mb-3">
                <Form.Label>Select Student</Form.Label>
                <Form.Select
                value={newLesson.studentId}
                onChange={(e) => setNewLesson({ ...newLesson, studentId: e.target.value })}
                disabled={!newLesson.moduleId}
                >
                <option value="">-- Choose a student --</option>
                {availableStudents.map((stu) => (
                    <option key={stu.id} value={stu.id}>{stu.name} ({stu.email})</option>
                ))}
                </Form.Select>
            </Form.Group>

            <Form.Group controlId="lessonStart" className="mb-3">
                <Form.Label>Start Time</Form.Label>
                <DatePicker
                    selected={newLesson.start ? new Date(newLesson.start) : null}
                    onChange={(date) => setNewLesson({ ...newLesson, start: date })}
                    showTimeSelect
                    timeFormat="HH:mm"
                    timeIntervals={30}
                    dateFormat="yyyy-MM-dd HH:mm"
                    timeCaption="Time"
                    className="form-control"
                    locale="lt"
                />
            </Form.Group>
            <Form.Group controlId="lessonEnd" className="mb-3">
                <Form.Label>End Time</Form.Label>
                <DatePicker
                    selected={newLesson.end ? new Date(newLesson.end) : null}
                    onChange={(date) => setNewLesson({ ...newLesson, end: date })}
                    showTimeSelect
                    timeFormat="HH:mm"
                    timeIntervals={30}
                    dateFormat="yyyy-MM-dd HH:mm"
                    timeCaption="Time"
                    className="form-control"
                    locale="lt"
                />
            </Form.Group>
            </Form>

        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowAddModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleAddLesson}>
            Save Lesson
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default CalendarPage;
