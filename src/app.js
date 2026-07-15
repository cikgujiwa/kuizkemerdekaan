const bookMissions = [
  { code: 'BUKU-RAKYAT', title: 'Buku 1', prompt: 'Kenali watak utama', points: 100 },
  { code: 'BUKU-SAINS', title: 'Buku 2', prompt: 'Cari fakta sains', points: 100 },
  { code: 'BUKU-SEJARAH', title: 'Buku 3', prompt: 'Susun garis masa', points: 100 },
  { code: 'BUKU-CERITA', title: 'Buku 4', prompt: 'Lakarkan nilai murni', points: 100 },
  { code: 'BUKU-INOVASI', title: 'Buku 5', prompt: 'Cipta idea baharu', points: 100 }
];

const state = {
  completed: new Set(),
  score: 0,
  sensorBonus: 0,
  reflectionAwarded: false,
  lastMotion: 0
};

const booksElement = document.querySelector('#books');
const scoreElement = document.querySelector('#score');
const badgeElement = document.querySelector('#badge');
const streakElement = document.querySelector('#streak');
const certificateCard = document.querySelector('#certificateCard');
const sensorNeedle = document.querySelector('#sensorNeedle');
const sensorStatus = document.querySelector('#sensorStatus');
const certificateDialog = document.querySelector('#certificateDialog');

function renderBooks() {
  booksElement.innerHTML = bookMissions.map((book, index) => {
    const done = state.completed.has(book.code);
    return `
      <button class="book-tile ${done ? 'complete' : ''}" data-code="${book.code}">
        <span class="book-number">${index + 1}</span>
        <strong>${book.title}</strong>
        <small>${book.prompt}</small>
        <em>${done ? 'Selesai' : `${book.points} mata`}</em>
      </button>
    `;
  }).join('');
}

function updateDashboard() {
  const completedCount = state.completed.size;
  const totalScore = state.score + state.sensorBonus;
  scoreElement.textContent = totalScore;
  badgeElement.textContent = completedCount >= 5 ? 'Pemburu Sijil' : completedCount >= 3 ? 'Ulat Buku Pro' : 'Pembaca Baru';
  streakElement.textContent = `${completedCount} misi`;
  certificateCard.innerHTML = `<span>${completedCount >= 5 ? 'Sijil Dibuka' : 'Sijil Terkunci'}</span><strong>${completedCount} / 5 Buku</strong>`;

  if (completedCount >= 5 && !certificateDialog.open) {
    certificateDialog.showModal();
  }
}

function completeBook(code) {
  const mission = bookMissions.find((book) => book.code === code.toUpperCase());
  if (!mission) {
    sensorStatus.textContent = 'Kod buku tidak dijumpai. Cuba kod demo yang betul.';
    return;
  }

  if (!state.completed.has(mission.code)) {
    state.completed.add(mission.code);
    state.score += mission.points;
    sensorStatus.textContent = `${mission.title} disahkan! +${mission.points} mata.`;
    renderBooks();
    updateDashboard();
  } else {
    sensorStatus.textContent = `${mission.title} telah disahkan sebelum ini.`;
  }
}

function awardSensorBonus(force = 18) {
  const bonus = Math.min(50, Math.round(force * 2));
  state.sensorBonus += bonus;
  sensorNeedle.style.width = `${Math.min(100, force * 4)}%`;
  sensorStatus.textContent = `Sensor mengesan gerakan aktif! +${bonus} mata bonus.`;
  updateDashboard();
}

async function enableMotionSensor() {
  if (typeof DeviceMotionEvent !== 'undefined' && typeof DeviceMotionEvent.requestPermission === 'function') {
    const permission = await DeviceMotionEvent.requestPermission();
    if (permission !== 'granted') {
      sensorStatus.textContent = 'Kebenaran sensor tidak diberikan. Gunakan simulasi goncangan.';
      return;
    }
  }

  window.addEventListener('devicemotion', (event) => {
    const acceleration = event.accelerationIncludingGravity || { x: 0, y: 0, z: 0 };
    const force = Math.abs(acceleration.x || 0) + Math.abs(acceleration.y || 0) + Math.abs(acceleration.z || 0);
    const now = Date.now();

    if (force > 24 && now - state.lastMotion > 1200) {
      state.lastMotion = now;
      awardSensorBonus(force);
    }
  });

  sensorStatus.textContent = 'Sensor gerakan aktif. Goncang peranti untuk bonus.';
}

booksElement.addEventListener('click', (event) => {
  const tile = event.target.closest('.book-tile');
  if (tile) completeBook(tile.dataset.code);
});

document.querySelector('#verifyCode').addEventListener('click', () => {
  completeBook(document.querySelector('#bookCode').value.trim());
});

document.querySelector('#enableSensor').addEventListener('click', enableMotionSensor);
document.querySelector('#simulateShake').addEventListener('click', () => awardSensorBonus(20));

document.querySelector('#submitReflection').addEventListener('click', () => {
  const reflection = document.querySelector('#reflection').value.trim();
  if (reflection.length < 20) {
    sensorStatus.textContent = 'Rumusan perlu sekurang-kurangnya 20 aksara.';
    return;
  }

  if (!state.reflectionAwarded) {
    state.reflectionAwarded = true;
    state.score += 20;
    sensorStatus.textContent = 'Rumusan diterima! +20 mata refleksi.';
    updateDashboard();
  }
});

document.querySelector('#closeDialog').addEventListener('click', () => certificateDialog.close());

renderBooks();
updateDashboard();
