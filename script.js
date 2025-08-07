document.addEventListener('DOMContentLoaded', () => {
  updateStudentSelect();
});

// Registrar estudiante
const studentForm = document.getElementById('studentForm');
studentForm.addEventListener('submit', e => {
  e.preventDefault();
  const name = document.getElementById('name').value.trim();
  const id = document.getElementById('id').value.trim();
  const level = document.getElementById('level').value.trim();
  let students = JSON.parse(localStorage.getItem('students')) || [];
  if (students.some(s => s.id === id)) {
    alert('Cédula ya registrada'); return;
  }
  students.push({ name, id, level });
  localStorage.setItem('students', JSON.stringify(students));
  alert('Estudiante registrado');
  updateStudentSelect();
  studentForm.reset();
});

// Actualizar lista de estudiantes
function updateStudentSelect() {
  const select = document.getElementById('studentSelect');
  select.innerHTML = '<option value="">-- Selecciona un estudiante --</option>';
  const students = JSON.parse(localStorage.getItem('students')) || [];
  students.forEach(s => {
    const opt = document.createElement('option');
    opt.value = s.id;
    opt.textContent = `${s.name} (${s.level})`;
    select.appendChild(opt);
  });
}

// Registrar comportamiento
const recordForm = document.getElementById('recordForm');
recordForm.addEventListener('submit', e => {
  e.preventDefault();
  const id = document.getElementById('studentSelect').value;
  const type = document.getElementById('recordType').value;
  const reason = document.getElementById('reason').value.trim();
  const date = document.getElementById('date').value;

  let records = JSON.parse(localStorage.getItem('records')) || [];
  records.push({ id, type, reason, date });
  localStorage.setItem('records', JSON.stringify(records));
  alert('Registro guardado');
  recordForm.reset();
});

// Búsqueda de registros
const searchBtn = document.getElementById('searchBtn');
searchBtn.addEventListener('click', () => {
  const query = document.getElementById('searchId').value.trim().toLowerCase();
  const students = JSON.parse(localStorage.getItem('students')) || [];
  const records = JSON.parse(localStorage.getItem('records')) || [];
  const student = students.find(s => s.id === query || s.name.toLowerCase().includes(query));
  const container = document.getElementById('results');
  container.innerHTML = '';
  if (!student) {
    container.innerHTML = '<p>Estudiante no encontrado</p>';
    return;
  }
  const { name, id, level } = student;
  let html = `<h3>${name} (Nivel: ${level})</h3>`;
  const filt = records.filter(r => r.id === student.id);
  if (filt.length === 0) {
    html += '<p>No hay registros para este estudiante.</p>';
  } else {
    const counts = { amonestacion: 0, citacion: 0, suspension: 0 };
    filt.forEach(r => counts[r.type]++);
    html += '<ul>' +
            `<li>Amonestaciones: ${counts.amonestacion}</li>` +
            `<li>Citaciones: ${counts.citacion}</li>` +
            `<li>Suspensiones: ${counts.suspension}</li>` +
          '</ul>';
    html += '<table><thead><tr><th>Fecha</th><th>Tipo</th><th>Razón</th></tr></thead><tbody>';
    filt.forEach(r => html += `<tr><td>${r.date}</td><td>${r.type}</td><td>${r.reason}</td></tr>`);
    html += '</tbody></table>';
  }
  container.innerHTML = html;
});