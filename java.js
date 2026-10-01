document.addEventListener('DOMContentLoaded', () => {
  const dateInput = document.getElementById('appointmentDate');
  const timeSelect = document.getElementById('appointmentTime');
  const bookingForm = document.getElementById('bookingForm');
  const turnosList = document.getElementById('turnosList');
  const cqlTableBody = document.getElementById('cqlTableBody');

  // Configurar la fecha mínima permitida (Hoy)
  const today = new Date().toISOString().split('T')[0];
  dateInput.min = today;

  // Horarios disponibles de ejemplo
  const availableHours = ['09:00 AM', '10:00 AM', '11:00 AM', '02:00 PM', '03:30 PM', '05:00 PM'];

  // Cargar horas al cambiar fecha
  dateInput.addEventListener('change', () => {
    timeSelect.innerHTML = '<option value="">Selecciona un horario</option>';
    if (dateInput.value) {
      availableHours.forEach(hour => {
        const option = document.createElement('option');
        option.value = hour;
        option.textContent = hour;
        timeSelect.appendChild(option);
      });
    }
  });

  // Cargar turnos existentes desde LocalStorage
  let appointments = JSON.parse(localStorage.getItem('optica_appointments')) || [];

  function saveAppointments() {
    localStorage.setItem('optica_appointments', JSON.stringify(appointments));
  }

  function renderAppointments() {
    turnosList.innerHTML = '';
    cqlTableBody.innerHTML = '';

    if (appointments.length === 0) {
      turnosList.innerHTML = '<p class="empty-state">No tienes ningún turno registrado por el momento.</p>';
      cqlTableBody.innerHTML = '<tr><td colspan="7" style="text-align:center; color:#64748b;">Tabla de Cassandra vacía (0 registros)</td></tr>';
      return;
    }

    appointments.forEach((app, index) => {
      // 1. Renderizar Tarjeta Visual
      const card = document.createElement('div');
      card.className = 'turno-card';
      card.innerHTML = `
        <div class="turno-header">
          <strong><i class="fa-solid fa-calendar-day"></i> ${app.date} - ${app.time}</strong>
          <span class="turno-badge">${app.status}</span>
        </div>
        <p><strong>Paciente:</strong> ${app.name}</p>
        <p><strong>DNI:</strong> ${app.dni}</p>
        <p><strong>Servicio:</strong> ${app.service}</p>
        <p><strong>Contacto:</strong> ${app.phone}</p>
        ${app.notes ? `<p><small><em>Nota: ${app.notes}</em></small></p>` : ''}
        <div style="margin-top: 15px; text-align: right;">
          <button class="btn btn-danger" onclick="cancelAppointment(${index})">
            <i class="fa-solid fa-trash"></i> Cancelar Turno
          </button>
        </div>
      `;
      turnosList.appendChild(card);

      // 2. Renderizar Fila en la Tabla CQL
      const row = document.createElement('tr');
      row.innerHTML = `
        <td style="color:#a5f3fc">${app.id}</td>
        <td>${app.name}</td>
        <td>${app.dni}</td>
        <td>${app.service}</td>
        <td>${app.date}</td>
        <td>${app.time}</td>
        <td style="color:#4ade80">${app.status}</td>
      `;
      cqlTableBody.appendChild(row);
    });
  }

  // Generador de UUID para simular CQL
  function generateUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }

  // Manejador del Formulario
  bookingForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const newAppointment = {
      id: generateUUID(),
      name: document.getElementById('fullName').value,
      dni: document.getElementById('dni').value,
      email: document.getElementById('email').value,
      phone: document.getElementById('phone').value,
      service: document.getElementById('serviceType').value,
      date: document.getElementById('appointmentDate').value,
      time: document.getElementById('appointmentTime').value,
      notes: document.getElementById('notes').value,
      status: 'CONFIRMADO'
    };

    appointments.push(newAppointment);
    saveAppointments();
    renderAppointments();

    bookingForm.reset();
    timeSelect.innerHTML = '<option value="">Primero selecciona una fecha</option>';
    showToast('¡Turno reservado con éxito!');
  });

  // Cancelar Turno
  window.cancelAppointment = function(index) {
    if (confirm('¿Estás seguro de que deseas cancelar este turno?')) {
      appointments.splice(index, 1);
      saveAppointments();
      renderAppointments();
      showToast('El turno ha sido cancelado');
    }
  };

  // Toast Notificaciones
  function showToast(message) {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.style.display = 'block';
    setTimeout(() => {
      toast.style.display = 'none';
    }, 3000);
  }

  // Inicializar al cargar
  renderAppointments();
});