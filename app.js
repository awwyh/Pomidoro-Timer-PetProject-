// Таймер
let timer
let minutes = 25
let seconds = 0
let isRunning = false

const timerDisplay = document.getElementById('timer')
const startBtn = document.getElementById('startBtn')
const stopBtn = document.getElementById('stopBtn')
const plusBtn = document.getElementById('plusBtn')
const minusBtn = document.getElementById('minusBtn')
const finishSound = document.getElementById('finishSound') // Элемент аудио
const timerStatus = document.getElementById('timerStatus') // Элемент для статуса таймера

// Увеличение времени
function plusTimer() {
  if (!isRunning) {
    minutes += 5
    updateTimer()
  }
}

// Уменьшение времени
function minusTimer() {
  if (!isRunning && minutes > 5) {
    minutes -= 5
    updateTimer()
  }
}

// Обновление отображения таймера
function updateTimer() {
  let hours = Math.floor(minutes / 60) // Вычисляем количество часов
  let remainingMinutes = minutes % 60 // Оставшиеся минуты

  const minutesStr =
    remainingMinutes < 10 ? '0' + remainingMinutes : remainingMinutes
  const secondsStr = seconds < 10 ? '0' + seconds : seconds

  // Обновляем отображение времени в формате часы:минуты:секунды
  if (hours > 0) {
    timerDisplay.textContent = `${hours}:${minutesStr}:${secondsStr}`
  } else {
    timerDisplay.textContent = `${minutesStr}:${secondsStr}`
  }
}

// Запуск таймера
function startTimer() {
  if (isRunning) return
  isRunning = true
  startBtn.disabled = true
  plusBtn.disabled = true
  minusBtn.disabled = true
  stopBtn.disabled = false
  timerStatus.textContent = 'Таймер Помодоро ⏱️' // Обновляем текст статуса

  timer = setInterval(() => {
    if (seconds === 0) {
      if (minutes === 0) {
        clearInterval(timer)
        isRunning = false
        startBtn.disabled = false
        stopBtn.disabled = true
        plusBtn.disabled = false
        minusBtn.disabled = false
        finishSound.play() // Проигрываем звук завершения сессии
        showPopup('Время вышло! Начинаем перерыв...') // Показываем всплывающее окно
        startBreakTimer() // Начинаем таймер для перерыва
        return
      }
      minutes--
      seconds = 59
    } else {
      seconds--
    }
    updateTimer()
  }, 1000)
}

// Остановка таймера
function stopTimer() {
  clearInterval(timer)
  isRunning = false
  minutes = 25
  seconds = 0
  updateTimer()
  startBtn.disabled = false
  plusBtn.disabled = false
  minusBtn.disabled = false
  stopBtn.disabled = true
}

// Функция для начала 5-минутного перерыва
function startBreakTimer() {
  startBtn.disabled = true // Делаем кнопку Start недоступной во время перерыва

  minutes = 5 // Устанавливаем перерыв на 5 минут
  seconds = 0
  updateTimer()

  // Обновляем статус на время перерыва
  timerStatus.textContent = 'Перерыв 🧘‍♂️'

  timer = setInterval(() => {
    if (seconds === 0) {
      if (minutes === 0) {
        clearInterval(timer)
        isRunning = false
        startBtn.disabled = true
        plusBtn.disabled = false
        minusBtn.disabled = false
        stopBtn.disabled = true
        alert('Перерыв завершен!')
        timerStatus.textContent = 'Таймер Помодоро ⏱️' // Восстанавливаем статус таймера после перерыва
        return
      }
      minutes--
      seconds = 59
    } else {
      seconds--
    }
    updateTimer()
  }, 1000)
}

// Функция для отображения всплывающего окна
function showPopup(message) {
  const popup = document.createElement('div')
  popup.textContent = message
  popup.style.position = 'fixed'
  popup.style.top = '50%'
  popup.style.left = '50%'
  popup.style.transform = 'translate(-50%, -50%)'
  popup.style.padding = '20px'
  popup.style.backgroundColor = 'rgba(0, 0, 0, 0.8)'
  popup.style.color = 'white'
  popup.style.borderRadius = '10px'
  popup.style.fontSize = '20px'
  popup.style.textAlign = 'center'
  document.body.appendChild(popup)

  // Закрываем окно через 3 секунды
  setTimeout(() => {
    popup.remove()
  }, 3000)
}

// Привязка событий к кнопкам таймера
startBtn.addEventListener('click', startTimer)
stopBtn.addEventListener('click', stopTimer)
plusBtn.addEventListener('click', plusTimer)
minusBtn.addEventListener('click', minusTimer)

updateTimer()

// ToDo List
const inputEl = document.getElementById('title')
const createBtn = document.getElementById('create')
const listEl = document.getElementById('list')

const notes = []

// Рендер задач
function render() {
  listEl.innerHTML = ''
  if (notes.length === 0) {
    listEl.innerHTML =
      '<p>' +
      (currentLang === 'ru' ? 'Список задач пуст.' : 'Task list is empty.') +
      '</p>'
  }

  for (let i = 0; i < notes.length; i++) {
    listEl.insertAdjacentHTML('beforeend', getNoteTemplate(notes[i], i))
  }
}

// Шаблон задачи
function getNoteTemplate(note, index) {
  return `<li class="list-item">
    <span class="${note.completed ? 'text-decoration-line-through' : ''}">
      ${note.title}
    </span>
    <span>
      <button class="btnc btn-success" data-index="${index}" data-type="toggle">&check;</button>
      <button class="btnc btn-danger" data-index="${index}" data-type="remove">&times;</button>
    </span>
  </li>`
}

// Добавление задачи
createBtn.onclick = function () {
  if (inputEl.value.trim().length === 0) {
    return
  }
  const newNote = {
    title: inputEl.value,
    completed: false,
  }
  notes.push(newNote)
  render()
  inputEl.value = ''
}

// Управление задачами (удаление/отметка)
listEl.onclick = function (event) {
  if (event.target.dataset.index) {
    const index = Number(event.target.dataset.index)
    const type = event.target.dataset.type

    if (type === 'toggle') {
      notes[index].completed = !notes[index].completed
    } else if (type === 'remove') {
      notes.splice(index, 1)
    }
    render()
  }
}

// Переключение темы
const themeToggleButton = document.getElementById('theme-toggle')
const body = document.body

themeToggleButton.onclick = function () {
  body.classList.toggle('dark-theme')
  themeToggleButton.textContent = body.classList.contains('dark-theme')
    ? '☀️'
    : '🌙'
}

// Переключение языка
const langToggleButton = document.getElementById('lang-toggle')

const translations = {
  ru: {
    title: 'Помодоро Таймер',
    titleTimer: 'Таймер Помодоро ⏱️',
    addTime: 'Добавить 5 минут',
    subtractTime: 'Убрать 5 минут',
    start: 'Старт',
    reset: 'Сброс',
    tasksTitle: 'Список задач',
    addTask: 'Добавить',
    enterGoal: 'Введите задачу',
    listing: 'Список задач пуст.',
  },
  en: {
    title: 'Pomodoro Timer',
    titleTimer: 'Pomodoro Timer ⏱️',
    addTime: 'Add 5 minutes',
    subtractTime: 'Remove 5 minutes',
    start: 'Start',
    reset: 'Reset',
    tasksTitle: 'Task List',
    addTask: 'Add',
    enterGoal: 'Enter a task',
    listing: 'Task list is empty.',
  },
}

let currentLang = 'ru' // Инициализация переменной

function translate() {
  const lang = translations[currentLang]
  document.getElementById('titlee').textContent = lang.title
  document.getElementById('timerStatus').textContent = lang.titleTimer
  document.getElementById('plusBtn').textContent = lang.addTime
  document.getElementById('minusBtn').textContent = lang.subtractTime
  document.getElementById('startBtn').textContent = lang.start
  document.getElementById('stopBtn').textContent = lang.reset
  document.getElementById('tasks-title').textContent = lang.tasksTitle
  document.getElementById('create').textContent = lang.addTask
  inputEl.setAttribute('placeholder', lang.enterGoal)
  render()
}

langToggleButton.onclick = function () {
  currentLang = currentLang === 'ru' ? 'en' : 'ru'
  langToggleButton.textContent = currentLang === 'ru' ? 'RU' : 'EN'
  translate()
}

// Перевод при загрузке
translate()
