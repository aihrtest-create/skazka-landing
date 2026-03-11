// Data Dictionary
const questsData = {
  heist: { name: "Идеальное ограбление", basePricePerGuest: 6000, isShort: false, minGuests: 10, ageRange: "7–13 лет", rides: 10, desc: "Взломать сейф, обойти лазерную защиту и раскрыть тайну — хит сезона!", img: "img/perf.png" },
  cyber: { name: "Кибер Праздник", basePricePerGuest: 6000, isShort: false, minGuests: 10, ageRange: "7–13 лет", rides: 10, desc: "Minecraft, Roblox, Brawl Stars — игра выходит в реальность.", img: "img/detective.png" },
  dino: { name: "Планета Дино", basePricePerGuest: 4000, isShort: true, minGuests: 5, ageRange: "4–8 лет", rides: 7, desc: "Путешествие к динозаврам и поиск древних артефактов.", img: "img/detective.png" },
  mission: { name: "Миссия выполнима", basePricePerGuest: 6000, isShort: false, minGuests: 10, ageRange: "7–13 лет", rides: 10, desc: "Деактивировать «бомбу», пройти полосу препятствий и спасти мир — шпионский квест!", img: "img/detective.png" },
  blog: { name: "Блог Пати", basePricePerGuest: 5000, isShort: false, minGuests: 8, ageRange: "8–13 лет", rides: 10, desc: "Тренды, пранки и звёздная жизнь — вечеринка для будущих блогеров!", img: "img/detective.png" },
  magic: { name: "Школа Волшебства", basePricePerGuest: 5000, isShort: false, minGuests: 8, ageRange: "6–12 лет", rides: 10, desc: "Поиск крестражей в стиле Хогвартса — магия, зелья и волшебные палочки!", img: "img/detective.png" }
};

const decorOptions = [
  { id: 'decor_bas', name: 'Весёлый старт', price: 4000, desc: '20 гелиевых шаров', img: 'img/hero.png' },
  { id: 'decor_skaz', name: 'Сказочный калейдоскоп', price: 7500, desc: '22 шара, 2 фольг.', img: 'img/party.png' },
  { id: 'decor_zvez', name: 'Звёздный праздник', price: 11500, desc: '40 шаров, 4 фольг.', img: 'img/hero.png' },
  { id: 'decor_max', name: 'Максимум', price: 12500, desc: 'Полный набор', img: 'img/party.png' }
];

const locOptions = [
  { id: 'loc_blin', name: 'Блинная', capacity: 'до 92 чел', feePerGuest: 500, img: 'img/party.png', dep: 0 },
  { id: 'loc_baz', name: 'Базилик', capacity: 'до 80 чел', feePerGuest: 500, img: 'img/hero.png', dep: 0 },
  { id: 'loc_mad', name: 'Мадагаскар', capacity: 'до 45 чел', feePerGuest: 500, img: 'img/party.png', dep: 20000 },
  { id: 'loc_mad_v', name: 'Веранда', capacity: 'до 40 чел', feePerGuest: 500, img: 'img/hero.png', dep: 0 },
  { id: 'loc_elf', name: 'Домик Эльфов', capacity: 'до 30 чел', feePerGuest: 500, img: 'img/party.png', dep: 0 }
];

const extraOptions = [
  { id: 'ex_photo_1', name: 'Фотограф (1 час)', price: 10000, desc: 'Проф. съёмка' },
  { id: 'ex_show_bub', name: 'Мыльные пузыри', price: 15000, desc: 'Шоу гигантских пузырей' },
  { id: 'ex_show_cry', name: 'Крио-шоу', price: 20000, desc: 'Мороженое из азота' },
  { id: 'ex_cake_2', name: 'Вкусный торт (2 кг)', price: 10000, desc: 'Медовик/сникерс' }
];

function formatScore(n) { return String(Math.floor(n)).replace(/\B(?=(\d{3})+(?!\d))/g, " ") + " ₽"; }

// State
let currentState = { qid: null, step: 0, kids: 10, adults: 2, decorPrice: decorOptions[0].price, locFee: locOptions[0].feePerGuest, extras: 0 };

// Render Modal HTML
if (!document.getElementById('marquiz-modal')) {
  document.body.insertAdjacentHTML('beforeend', `
    <div id="marquiz-modal" class="marquiz-overlay">
      <div class="marquiz-content">
        <button class="marquiz-close">&times;</button>
        <div id="marquiz-body"></div>
      </div>
    </div>
  `);
}

const modal = document.getElementById('marquiz-modal');
const modalBody = document.getElementById('marquiz-body');

document.querySelector('.marquiz-close').addEventListener('click', () => {
  modal.classList.remove('active');
  document.body.style.overflow = '';
});

// Open Modal
document.querySelectorAll('.program-card[data-quest]').forEach(card => {
  card.addEventListener('click', function (e) {
    const qid = this.dataset.quest;
    openModal(qid);
  });
});

function openModal(qid) {
  const qData = questsData[qid];
  currentState = {
    qid: qid, step: 0, kids: qData.minGuests, adults: 2,
    decorPrice: decorOptions[0].price, locFee: locOptions[0].feePerGuest, extras: 0
  };
  renderStep();
  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function getBaseCost() { return currentState.kids * questsData[currentState.qid].basePricePerGuest; }
function getLocCost() { return (currentState.kids + currentState.adults) * currentState.locFee; }
function getTotal() { return getBaseCost() + getLocCost() + currentState.decorPrice + currentState.extras; }

function renderStep() {
  const qData = questsData[currentState.qid];
  let html = '';

  if (currentState.step === 0) {
    // Step 0: Quest Info
    html = `
      <div class="mq-step mq-step-0">
        <div class="mq-hero-img">
          <img src="${qData.img}" alt="${qData.name}">
        </div>
        <div class="mq-body">
          <h2 class="mq-title">${qData.name}</h2>
          <div class="mq-facts">
            <div class="mq-fact">
              <span class="mq-fact-icon">🕐</span>
              <span class="mq-fact-label">${qData.isShort ? '1 час' : '2 часа'}</span>
            </div>
            <div class="mq-fact">
              <span class="mq-fact-icon">🎂</span>
              <span class="mq-fact-label">${qData.ageRange}</span>
            </div>
            <div class="mq-fact">
              <span class="mq-fact-icon">👥</span>
              <span class="mq-fact-label">от ${qData.minGuests} детей</span>
            </div>
          </div>
          <p class="mq-about">${qData.desc}</p>
          <div class="mq-rides">
            <span class="mq-rides-icon">🎢</span>
            <div class="mq-rides-text">
              <strong>${qData.rides} аттракционов включено</strong>
              <span>Подберём под возраст вашего ребёнка</span>
            </div>
          </div>
          <button class="btn btn-pink btn-lg btn-block mq-next">Собрать праздник →</button>
        </div>
      </div>
    `;
  } else {
    // Steps 1-4
    const stepsHtml = `
      <div class="mq-progress">
        <div class="mq-progress-bar" style="width: ${currentState.step * 25}%"></div>
      </div>
    `;

    let contentHtml = '';

    if (currentState.step === 1) {
      contentHtml = `
        <h3 class="mq-subtitle">Шаг 1 из 4: Выберите оформление</h3>
        <div class="mq-grid">
          ${decorOptions.map((opt, i) => `
            <div class="mq-card ${currentState.decorPrice === opt.price ? 'selected' : ''}" data-type="decor" data-val="${opt.price}">
              <img src="${opt.img}">
              <div class="mq-card-body">
                <h4>${opt.name}</h4>
                <p>${opt.desc}</p>
                <strong>${formatScore(opt.price)}</strong>
              </div>
            </div>
          `).join('')}
        </div>
      `;
    } else if (currentState.step === 2) {
      contentHtml = `
        <h3 class="mq-subtitle">Шаг 2 из 4: Банкетная локация</h3>
        <div class="mq-grid">
          ${locOptions.map((opt, i) => `
            <div class="mq-card ${currentState.locFee === opt.feePerGuest ? 'selected' : ''}" data-type="loc" data-val="${opt.feePerGuest}">
              <img src="${opt.img}">
              <div class="mq-card-body">
                <h4>${opt.name}</h4>
                <p>${opt.capacity}</p>
                <strong>Сбор: ${opt.feePerGuest} ₽/гость</strong>
              </div>
            </div>
          `).join('')}
        </div>
      `;
    } else if (currentState.step === 3) {
      contentHtml = `
        <h3 class="mq-subtitle">Шаг 3 из 4: Количество гостей</h3>
        <div class="mq-counters">
          <div class="mq-counter">
            <label>Дети (от ${qData.minGuests})</label>
            <div class="counter-control" data-type="kids" data-min="${qData.minGuests}">
              <button class="minus">-</button>
              <span>${currentState.kids}</span>
              <button class="plus">+</button>
            </div>
          </div>
          <div class="mq-counter">
            <label>Взрослые</label>
            <div class="counter-control" data-type="adults" data-min="0">
              <button class="minus">-</button>
              <span>${currentState.adults}</span>
              <button class="plus">+</button>
            </div>
          </div>
        </div>
      `;
    } else if (currentState.step === 4) {
      contentHtml = `
        <h3 class="mq-subtitle">Шаг 4 из 4: Дополнения</h3>
        <div class="mq-list">
          ${extraOptions.map(opt => `
            <label class="mq-list-item">
              <input type="checkbox" value="${opt.price}" class="extra-cb">
              <span class="mq-check"></span>
              <div class="mq-item-text">
                <h4>${opt.name}</h4>
                <p>${opt.desc}</p>
              </div>
              <strong class="mq-item-price">+${formatScore(opt.price)}</strong>
            </label>
          `).join('')}
        </div>
        <div class="mq-total-box">
          <p>Предварительная стоимость:</p>
          <div class="mq-total-price" id="mq-total">${formatScore(getTotal())}</div>
        </div>
      `;
    }

    html = `
      ${stepsHtml}
      <div class="mq-step-content">
        ${contentHtml}
      </div>
      <div class="mq-footer">
        <button class="btn btn-outline mq-prev">← Назад</button>
        ${currentState.step < 4 ? `<button class="btn btn-blue mq-next">Далее →</button>` : `<button class="btn btn-pink mq-submit">Оставить заявку</button>`}
      </div>
    `;
  }

  modalBody.innerHTML = html;
  attachStepEvents();
}

function attachStepEvents() {
  const nextBtn = modalBody.querySelector('.mq-next');
  if (nextBtn) nextBtn.addEventListener('click', () => { currentState.step++; renderStep(); });

  const prevBtn = modalBody.querySelector('.mq-prev');
  if (prevBtn) prevBtn.addEventListener('click', () => { currentState.step--; renderStep(); });

  const submitBtn = modalBody.querySelector('.mq-submit');
  if (submitBtn) submitBtn.addEventListener('click', () => {
    alert('Заявка на сумму ' + formatScore(getTotal()) + ' успешно отправлена!');
    modal.classList.remove('active');
    document.body.style.overflow = '';
  });

  // Cards
  modalBody.querySelectorAll('.mq-card').forEach(card => {
    card.addEventListener('click', function () {
      modalBody.querySelectorAll('.mq-card').forEach(c => c.classList.remove('selected'));
      this.classList.add('selected');
      if (this.dataset.type === 'decor') currentState.decorPrice = parseInt(this.dataset.val);
      if (this.dataset.type === 'loc') currentState.locFee = parseInt(this.dataset.val);
    });
  });

  // Counters
  modalBody.querySelectorAll('.counter-control button').forEach(btn => {
    btn.addEventListener('click', function () {
      const wrap = this.parentElement;
      const type = wrap.dataset.type;
      const min = parseInt(wrap.dataset.min);
      let val = currentState[type];

      if (this.classList.contains('minus') && val > min) val--;
      if (this.classList.contains('plus')) val++;

      currentState[type] = val;
      wrap.querySelector('span').textContent = val;
    });
  });

  // Extras
  modalBody.querySelectorAll('.extra-cb').forEach(cb => {
    cb.addEventListener('change', () => {
      let sum = 0;
      modalBody.querySelectorAll('.extra-cb:checked').forEach(c => sum += parseInt(c.value));
      currentState.extras = sum;
      const totalEl = document.getElementById('mq-total');
      if (totalEl) totalEl.textContent = formatScore(getTotal());
    });
  });
}
