// Grade Scales configuration
const GRADE_SCALES = {
  '10': [
    { grade: 'O', point: 10.0, label: 'Outstanding (90-100%)', scale4Point: 4.0 },
    { grade: 'A+', point: 9.0, label: 'Excellent (80-89%)', scale4Point: 3.7 },
    { grade: 'A', point: 8.0, label: 'Very Good (70-79%)', scale4Point: 3.3 },
    { grade: 'B+', point: 7.0, label: 'Good (60-69%)', scale4Point: 3.0 },
    { grade: 'B', point: 6.0, label: 'Above Average (55-59%)', scale4Point: 2.7 },
    { grade: 'C', point: 5.0, label: 'Average (50-54%)', scale4Point: 2.0 },
    { grade: 'P', point: 4.0, label: 'Pass (40-49%)', scale4Point: 1.0 },
    { grade: 'F', point: 0.0, label: 'Fail (< 40%)', scale4Point: 0.0 }
  ],
  '4': [
    { grade: 'A', point: 4.0, label: 'Excellent (93-100%)', scale10Point: 10.0 },
    { grade: 'A-', point: 3.7, label: 'Superior (90-92%)', scale10Point: 9.25 },
    { grade: 'B+', point: 3.3, label: 'Very Good (87-89%)', scale10Point: 8.25 },
    { grade: 'B', point: 3.0, label: 'Good (83-86%)', scale10Point: 7.5 },
    { grade: 'B-', point: 2.7, label: 'Above Average (80-82%)', scale10Point: 6.75 },
    { grade: 'C+', point: 2.3, label: 'Average (77-79%)', scale10Point: 5.75 },
    { grade: 'C', point: 2.0, label: 'Below Average (73-76%)', scale10Point: 5.0 },
    { grade: 'C-', point: 1.7, label: 'Pass (70-72%)', scale10Point: 4.25 },
    { grade: 'D', point: 1.0, label: 'Marginal Pass (60-69%)', scale10Point: 3.0 },
    { grade: 'F', point: 0.0, label: 'Fail (< 60%)', scale10Point: 0.0 }
  ]
};

let currentScale = '10'; // Default scale
let courseIdCounter = 0;

// Initialize app on DOM load
document.addEventListener('DOMContentLoaded', () => {
  renderReferenceTable();
  // Initial 4 course rows
  const initialCourses = [
    { name: 'Mathematics & Linear Algebra', credits: 4, gradeIndex: 0 },
    { name: 'Computer Programming & Data Structures', credits: 4, gradeIndex: 1 },
    { name: 'Digital Logic & Circuit Design', credits: 3, gradeIndex: 0 },
    { name: 'Professional Communication', credits: 2, gradeIndex: 2 }
  ];

  initialCourses.forEach(c => addCourseRow(c.name, c.credits, c.gradeIndex));
  calculateCGPA();
});

// Switch between 10.0 and 4.0 Grade Scales
function switchScale(scale) {
  if (currentScale === scale) return;
  currentScale = scale;

  document.getElementById('scale10Btn').classList.toggle('active', scale === '10');
  document.getElementById('scale4Btn').classList.toggle('active', scale === '4');

  document.getElementById('scoreMax').textContent = `out of ${scale === '10' ? '10.0' : '4.0'}`;
  
  // Re-populate grade dropdowns
  const currentRows = document.querySelectorAll('.course-row');
  currentRows.forEach(row => {
    const select = row.querySelector('.grade-select');
    const selectedVal = select.value;
    populateGradeSelect(select);
  });

  renderReferenceTable();
  calculateCGPA();
}

// Populate grade dropdown for a select element
function populateGradeSelect(selectElement) {
  const grades = GRADE_SCALES[currentScale];
  selectElement.innerHTML = grades.map((g, idx) => 
    `<option value="${g.point}">${g.grade} (${g.point.toFixed(1)}) - ${g.label.split(' ')[0]}</option>`
  ).join('');
}

// Add a new Course Row to the form
function addCourseRow(name = '', credits = 3, gradeIdx = 0) {
  courseIdCounter++;
  const courseList = document.getElementById('courseList');
  const row = document.createElement('div');
  row.className = 'course-row';
  row.id = `course-row-${courseIdCounter}`;

  row.innerHTML = `
    <input type="text" class="input-control course-name" placeholder="Course Name" value="${name}" oninput="calculateCGPA()">
    <input type="number" class="input-control course-credits" placeholder="Credits" value="${credits}" min="1" max="10" step="0.5" oninput="calculateCGPA()">
    <select class="input-control grade-select" onchange="calculateCGPA()"></select>
    <button type="button" class="btn-icon-danger" onclick="removeCourseRow('course-row-${courseIdCounter}')" title="Delete Course">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <polyline points="3 6 5 6 21 6"></polyline>
        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
      </svg>
    </button>
  `;

  courseList.appendChild(row);
  
  const select = row.querySelector('.grade-select');
  populateGradeSelect(select);
  if (GRADE_SCALES[currentScale][gradeIdx]) {
    select.value = GRADE_SCALES[currentScale][gradeIdx].point;
  }

  updateCourseCountBadge();
  calculateCGPA();
}

// Remove a course row
function removeCourseRow(rowId) {
  const row = document.getElementById(rowId);
  if (row) {
    row.remove();
    updateCourseCountBadge();
    calculateCGPA();
  }
}

// Reset form
function resetForm() {
  document.getElementById('courseList').innerHTML = '';
  courseIdCounter = 0;
  addCourseRow('Course 1', 3, 0);
  addCourseRow('Course 2', 3, 0);
  calculateCGPA();
}

// Update count badge
function updateCourseCountBadge() {
  const count = document.querySelectorAll('.course-row').length;
  document.getElementById('courseCountBadge').textContent = `${count} ${count === 1 ? 'Course' : 'Courses'}`;
}

// Main CGPA Calculation function
function calculateCGPA() {
  const rows = document.querySelectorAll('.course-row');
  let totalCredits = 0;
  let totalPoints = 0;

  rows.forEach(row => {
    const creditsInput = row.querySelector('.course-credits');
    const gradeSelect = row.querySelector('.grade-select');

    const credits = parseFloat(creditsInput.value) || 0;
    const gradePoint = parseFloat(gradeSelect.value) || 0;

    totalCredits += credits;
    totalPoints += (credits * gradePoint);
  });

  const maxScale = currentScale === '10' ? 10.0 : 4.0;
  let cgpa = totalCredits > 0 ? (totalPoints / totalCredits) : 0;
  cgpa = Math.min(cgpa, maxScale);

  // Update DOM values
  document.getElementById('scoreVal').textContent = cgpa.toFixed(2);
  document.getElementById('totalCreditsVal').textContent = totalCredits;
  document.getElementById('totalPointsVal').textContent = totalPoints.toFixed(1);

  // Percentage formula
  let percentage = 0;
  if (currentScale === '10') {
    percentage = cgpa > 0 ? ((cgpa - 0.75) * 10) : 0; // Standard CBSE/AICTE Indian CGPA to percentage formula
  } else {
    percentage = (cgpa / 4.0) * 100;
  }
  percentage = Math.max(0, Math.min(100, percentage));
  document.getElementById('percentageVal').textContent = `${percentage.toFixed(1)}%`;

  // Update SVG Progress Ring
  const circle = document.getElementById('scoreCircle');
  const circumference = 2 * Math.PI * 80; // r=80 -> ~502.65
  const progressRatio = cgpa / maxScale;
  const offset = circumference - (progressRatio * circumference);
  circle.style.strokeDasharray = `${circumference}`;
  circle.style.strokeDashoffset = `${offset}`;

  // Update Status Badge
  updateStatusBadge(cgpa, maxScale);

  // Recalculate target planner if active
  calculateTargetRequired();
}

// Status Badge indicator logic
function updateStatusBadge(score, maxScale) {
  const badge = document.getElementById('statusBadge');
  const ratio = score / maxScale;

  if (score === 0) {
    badge.textContent = 'Ready to Calculate';
    badge.style.background = 'rgba(148, 163, 184, 0.15)';
    badge.style.color = 'var(--text-muted)';
    badge.style.borderColor = 'rgba(148, 163, 184, 0.3)';
  } else if (ratio >= 0.85) {
    badge.textContent = 'First Class with Distinction (Honors)';
    badge.style.background = 'rgba(16, 185, 129, 0.15)';
    badge.style.color = 'var(--success)';
    badge.style.borderColor = 'rgba(16, 185, 129, 0.3)';
  } else if (ratio >= 0.7) {
    badge.textContent = 'First Class';
    badge.style.background = 'rgba(99, 102, 241, 0.15)';
    badge.style.color = 'var(--primary)';
    badge.style.borderColor = 'rgba(99, 102, 241, 0.3)';
  } else if (ratio >= 0.5) {
    badge.textContent = 'Second Class';
    badge.style.background = 'rgba(245, 158, 11, 0.15)';
    badge.style.color = 'var(--warning)';
    badge.style.borderColor = 'rgba(245, 158, 11, 0.3)';
  } else {
    badge.textContent = 'Needs Improvement';
    badge.style.background = 'rgba(239, 68, 68, 0.15)';
    badge.style.color = 'var(--danger)';
    badge.style.borderColor = 'rgba(239, 68, 68, 0.3)';
  }
}

// Target CGPA Planner calculation
function calculateTargetRequired() {
  const currentCGPA = parseFloat(document.getElementById('scoreVal').textContent) || 0;
  const currentCredits = parseFloat(document.getElementById('totalCreditsVal').textContent) || 0;
  
  const targetCGPA = parseFloat(document.getElementById('targetCgpaInput').value);
  const remainingCredits = parseFloat(document.getElementById('remainingCreditsInput').value);
  
  const resultDiv = document.getElementById('plannerResult');

  if (isNaN(targetCGPA) || isNaN(remainingCredits) || remainingCredits <= 0) {
    resultDiv.innerHTML = 'Enter target CGPA & remaining credits to calculate required GPA.';
    return;
  }

  const maxScale = currentScale === '10' ? 10.0 : 4.0;
  if (targetCGPA > maxScale) {
    resultDiv.innerHTML = `<span style="color: var(--danger)">Target CGPA cannot exceed ${maxScale.toFixed(1)}!</span>`;
    return;
  }

  const totalPointsEarned = currentCGPA * currentCredits;
  const totalFutureCredits = currentCredits + remainingCredits;
  const totalPointsNeeded = targetCGPA * totalFutureCredits;
  const requiredPointsFuture = totalPointsNeeded - totalPointsEarned;

  const requiredGPA = requiredPointsFuture / remainingCredits;

  if (requiredGPA > maxScale) {
    resultDiv.innerHTML = `<span style="color: var(--danger)">Impossible: Requires an average GPA of <strong>${requiredGPA.toFixed(2)}</strong> (exceeds max scale)!</span>`;
  } else if (requiredGPA <= 0) {
    resultDiv.innerHTML = `<span style="color: var(--success)">You have already achieved or exceeded your target CGPA!</span>`;
  } else {
    resultDiv.innerHTML = `You need an average GPA of <strong>${requiredGPA.toFixed(2)}</strong> across the remaining <strong>${remainingCredits}</strong> credits to hit <strong>${targetCGPA.toFixed(2)}</strong> CGPA.`;
  }
}

// Render Grade Reference Table
function renderReferenceTable() {
  const tbody = document.getElementById('scaleTableBody');
  const items = GRADE_SCALES[currentScale];

  tbody.innerHTML = items.map(item => `
    <tr>
      <td><strong style="color: var(--text-main); font-size: 15px;">${item.grade}</strong></td>
      <td>${currentScale === '10' ? item.point.toFixed(1) : (item.scale10Point ? item.scale10Point.toFixed(1) : '-')}</td>
      <td>${currentScale === '4' ? item.point.toFixed(1) : (item.scale4Point ? item.scale4Point.toFixed(1) : '-')}</td>
      <td>${item.label.split('(')[1] ? item.label.split('(')[1].replace(')', '') : '-'}</td>
      <td>${item.label.split('(')[0]}</td>
    </tr>
  `).join('');
}
