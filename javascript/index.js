// Дизайн гри зробити під фільм Трон

// Окрема кнопка рестарт (Виконано)
// Клавіатура на екрані браузеру (Виконано)
// Завершити кнопку рестарт після кінця гри (Виконано)
// Допрацювати код для адекватного виведення блоку кінця гри (Виконано)

// Зробити час гри, показувати наступний елемент, зробити кращий дизайн і візуал по усій грі
// Реалізація найкращого результату у грі
// Збільшення швидкості

// Музика
document.addEventListener('DOMContentLoaded', function () {
	let audioPlayer = document.getElementById('audioPlayer');
	let toggleSoundButton = document.getElementById('toggleSoundButton');
	let soundImage = document.getElementById('soundImage');
	let soundSelect = document.getElementById('soundSelect');

	// Play/Pause Sound Button
	toggleSoundButton.addEventListener('click', function () {
		if (audioPlayer.paused) {
			audioPlayer.play();
			soundImage.src = './assets/unmuteIcon.png';
		} else {
			audioPlayer.pause();
			soundImage.src = './assets/muteIcon1.png';
		}
	});

	// Зміна треку
	soundSelect.addEventListener('change', function () {
		let selectedSound = soundSelect.value;
		audioPlayer.src = selectedSound;
		audioPlayer.play();
	});
});

// --------------------------------------------------------------------------- //
// Пауза
let pauseGame = document.getElementById('pause-game');

pauseGame.addEventListener('click', () => {
	if (pauseGame.classList.contains('play-game')) {
		pauseGame.classList.remove('play-game');
		pauseGame.classList.add('pause-game');
		audioPlayer.play();
		togglePauseGame();
	} else {
		pauseGame.classList.remove('pause-game');
		pauseGame.classList.add('play-game');
		audioPlayer.pause();
		togglePauseGame();
	}
});

// --------------------------------------------------------------------------- //
// Таймер

// --------------------------------------------------------------------------- //

const PLAY_FIELD_COLUMNS = 10;
const PLAY_FIELD_ROWS = 20;
const restartGame = document.getElementById('restart-game');
const gameOverRestart = document.getElementById('game-over-restart');
const overlay = document.querySelector('.overlay');
let isGameOver = false;
let timeID = null;
let isPaused = false;
let playField;
let tetromino;
let intervalId; // Змінна для зберігання інтервалу

const TETROMINO_NAMES = ['O', 'J', 'L', 'I', 'S', 'Z', 'T', 'U', 'X'];
const TETROMINOES = {
	O: [
		[1, 1],
		[1, 1],
	],
	J: [
		[1, 0, 0],
		[1, 1, 1],
		[0, 0, 0],
	],
	L: [
		[0, 0, 1],
		[1, 1, 1],
		[0, 0, 0],
	],
	I: [
		[0, 0, 0, 0],
		[1, 1, 1, 1],
		[0, 0, 0, 0],
		[0, 0, 0, 0],
	],
	S: [
		[0, 1, 1],
		[1, 1, 0],
		[0, 0, 0],
	],
	Z: [
		[1, 1, 0],
		[0, 1, 1],
		[0, 0, 0],
	],
	T: [
		[1, 1, 1],
		[0, 1, 0],
		[0, 0, 0],
	],
	U: [
		[1, 0, 1],
		[1, 1, 1],
		[0, 0, 0],
	],
	X: [
		[0, 1, 0],
		[1, 1, 1],
		[0, 1, 0],
	],
};
let cells;
init();

// Функціонал роботи з стрілками (клавіатура, мишка, утримування кнопки миші)
let up = document.getElementById('up');
let down = document.getElementById('down');
let left = document.getElementById('left');
let right = document.getElementById('right');

function init() {
	audioPlayer.play();
	score.querySelector('p').innerHTML = '000000'; // Оновлюємо значення в HTML
	isGameOver = false;
	generatePlayField();
	generateTetromino();
	cells = document.querySelectorAll('.main-grid div');
	moveDown();
}

// Оновлення поля, почати спочатку
restartGame.addEventListener('click', () => {
	document.querySelector('.main-grid').innerHTML = '';
	overlay.style.display = 'none';
	init();
});

// Оновлення поля після програшу, почати спочатку
gameOverRestart.addEventListener('click', function () {
	document.querySelector('.main-grid').innerHTML = '';
	overlay.style.display = 'none';
	init();
});

function convertPositionToIndex(row, column) {
	return row * PLAY_FIELD_COLUMNS + column;
}

function randomIndexTetroName(minNum, maxNum) {
	minNum = Math.ceil(minNum);
	maxNum = Math.floor(maxNum);

	const result = Math.floor(Math.random() * (maxNum - minNum + 1)) + minNum;

	return result;
}

function generatePlayField() {
	for (let i = 0; i < PLAY_FIELD_ROWS * PLAY_FIELD_COLUMNS; i++) {
		const div = document.createElement('div');
		document.querySelector('.main-grid').append(div);
	}

	playField = new Array(PLAY_FIELD_ROWS)
		.fill()
		.map(el => new Array(PLAY_FIELD_COLUMNS).fill(0));
}

function generateTetromino() {
	const tetroNameLength = TETROMINO_NAMES.length - 1;

	const name = TETROMINO_NAMES[randomIndexTetroName(0, tetroNameLength)];
	const matrix = TETROMINOES[name];
	const row = -2;
	const column = Math.floor((PLAY_FIELD_COLUMNS - matrix[0].length) / 2);

	tetromino = {
		name,
		matrix,
		row,
		column,
	};
}

function isOutsideOfTopboard(row) {
	return tetromino.row + row < 0;
}

function placeTetromino() {
	const matrixSize = tetromino.matrix.length;

	for (let row = 0; row < matrixSize; row++) {
		for (let column = 0; column < matrixSize; column++) {
			if (isOutsideOfTopboard(row)) {
				isGameOver = true;
				audioPlayer.pause();
				return;
			}

			if (tetromino.matrix[row][column]) {
				playField[tetromino.row + row][tetromino.column + column] =
					tetromino.name;
			}
		}
	}

	generateTetromino();
}

// Функція оновлення значення очків
function updateScore(linesCleared) {
	// Total Score
	let score = document.getElementById('score');

	const pointsPerLine = 10;
	const totalPoints = linesCleared * pointsPerLine;

	// Отримуємо значення з HTML
	let currentScore = parseFloat(score.querySelector('p').textContent);

	// Додаємо до цього значення нові очки
	currentScore += totalPoints;

	// Оновляємо значення
	let formattedScore = currentScore.toFixed().padStart(6, '0');

	// Оновлюємо значення в HTML
	score.querySelector('p').textContent = formattedScore;
}

// Функція очистки ліній
function clearLines() {
	let linesCleared = 0;
	for (let row = 0; row < PLAY_FIELD_ROWS; row++) {
		if (playField[row].every(cell => cell !== 0)) {
			playField.splice(row, 1);
			playField.unshift(new Array(PLAY_FIELD_COLUMNS).fill(0));
			linesCleared++;
		}
	}

	updateScore(linesCleared);
}

// generatePlayField();
// generateTetromino();

function drawPlayField() {
	for (let row = 0; row < PLAY_FIELD_ROWS; row++) {
		for (let column = 0; column < PLAY_FIELD_COLUMNS; column++) {
			if (playField[row][column] === 0) continue;

			const name = playField[row][column];

			const CELL_INDEX = convertPositionToIndex(row, column);

			cells[CELL_INDEX].classList.add(name);
		}
	}
}

function drawTetromino() {
	const name = tetromino.name;
	const tetrominoMatrixSize = tetromino.matrix.length;

	for (let row = 0; row < tetrominoMatrixSize; row++) {
		for (let column = 0; column < tetrominoMatrixSize; column++) {
			if (isOutsideOfTopboard(row)) continue;
			if (!tetromino.matrix[row][column]) continue;
			const rowIndex = tetromino.row + row;
			const columnIndex = tetromino.column + column;

			if (
				rowIndex >= 0 &&
				rowIndex < PLAY_FIELD_ROWS &&
				columnIndex >= 0 &&
				columnIndex < PLAY_FIELD_COLUMNS
			) {
				const CELL_INDEX = convertPositionToIndex(rowIndex, columnIndex);
				cells[CELL_INDEX].classList.add(name);
			}
		}
	}
}

// Функція оновлення поля гри
function draw() {
	cells.forEach(cell => cell.removeAttribute('class'));
	drawTetromino();
	drawPlayField();
}

function rotateMatrix(matrixTetromino) {
	const N = matrixTetromino.length;
	const rotateMatrix = [];

	for (let i = 0; i < N; i++) {
		rotateMatrix[i] = [];
		for (let j = 0; j < N; j++) {
			rotateMatrix[i][j] = matrixTetromino[N - j - 1][i];
		}
	}

	return rotateMatrix;
}

function rotateTetromino() {
	const oldMatrix = tetromino.matrix;
	const rotatedMatrix = rotateMatrix(tetromino.matrix);
	tetromino.matrix = rotatedMatrix;
	if (isValid()) {
		tetromino.matrix = oldMatrix;
	}
}

// draw();

// Функція обертання фігури і перемальовування поля
function rotate() {
	rotateTetromino();
	draw();
}

// ------------------------------------------------------------------------------- //

// Функції для обробки подій
function rotateTetrominoEvent() {
	rotate();
}

function moveTetrominoDownContinuous() {
	moveTetrominoDown();
	draw();
}

function moveTetrominoLeftContinuous() {
	moveTetrominoLeft();
	draw();
}

function moveTetrominoRightContinuous() {
	moveTetrominoRight();
	draw();
}

// Обробка подій на клік
up.addEventListener('click', () => {
	rotateTetrominoEvent();
});

down.addEventListener('click', () => {
	moveTetrominoDownContinuous();
});

left.addEventListener('click', () => {
	moveTetrominoLeftContinuous();
});

right.addEventListener('click', () => {
	moveTetrominoRightContinuous();
});

// Обробка натискання на кнопку
up.addEventListener('mousedown', () => {
	intervalId = setInterval(rotateTetrominoEvent, 100);
});

down.addEventListener('mousedown', () => {
	intervalId = setInterval(moveTetrominoDownContinuous, 100);
});

left.addEventListener('mousedown', () => {
	intervalId = setInterval(moveTetrominoLeftContinuous, 100);
});

right.addEventListener('mousedown', () => {
	intervalId = setInterval(moveTetrominoRightContinuous, 100);
});

// Обробка відтискання кнопки
up.addEventListener('mouseup', () => {
	clearInterval(intervalId);
});

down.addEventListener('mouseup', () => {
	clearInterval(intervalId);
});

left.addEventListener('mouseup', () => {
	clearInterval(intervalId);
});

right.addEventListener('mouseup', () => {
	clearInterval(intervalId);
});

// Пауза гри
function togglePauseGame() {
	if (isPaused === false) {
		stopMoveDown();
	} else {
		startMoveDown();
	}
	isPaused = !isPaused;
}

// Опускання донизу одразу однією кнопкою (пробілом)
function dropTetrominoDown() {
	while (!isValid()) {
		tetromino.row++;
	}
	tetromino.row--;
}

// Гра закінчена
function gameOver() {
	stopMoveDown();
	overlay.style.display = 'flex';
}

// Управління фігурами на полі
document.addEventListener('keydown', onKeyDown);
function onKeyDown(e) {
	if (e.key == 'Escape') {
		togglePauseGame();
	}

	if (!isPaused) {
		switch (e.key) {
			case ' ':
				dropTetrominoDown();
				break;
			case 'ArrowUp':
				rotate();
				break;
			case 'ArrowDown':
				moveTetrominoDown();
				break;
			case 'ArrowLeft':
				moveTetrominoLeft();
				break;
			case 'ArrowRight':
				moveTetrominoRight();
				break;
		}
	}

	draw();
}

// ------------------------------------------------------------------------------- //

function moveTetrominoDown() {
	tetromino.row += 1;
	if (isValid()) {
		tetromino.row -= 1;
		placeTetromino();
		clearLines();
	}
}

// Auto move down tetromino
function moveDown() {
	moveTetrominoDown();
	draw();
	stopMoveDown();
	startMoveDown();

	if (isGameOver) {
		gameOver();
	}
}

// moveDown();

function startMoveDown() {
	if (!timeID) {
		timeID = setTimeout(() => {
			requestAnimationFrame(moveDown);
		}, 700);
	}
}

function stopMoveDown() {
	cancelAnimationFrame(timeID);
	clearTimeout(timeID);

	timeID = null;
}

// ------------------------------------- //

function moveTetrominoLeft() {
	tetromino.column -= 1;
	if (isValid()) {
		tetromino.column += 1;
	}
}

function moveTetrominoRight() {
	tetromino.column += 1;
	if (isValid()) {
		tetromino.column -= 1;
	}
}

function isValid() {
	const matrixSize = tetromino.matrix.length;

	for (let row = 0; row < matrixSize; row++) {
		for (let column = 0; column < matrixSize; column++) {
			if (isOutsideOfGameboard(row, column)) {
				return true;
			}
			if (hasCollisions(row, column)) {
				return true;
			}
		}
	}
}

function isOutsideOfGameboard(row, column) {
	return (
		tetromino.matrix[row][column] &&
		(tetromino.column + column < 0 ||
			tetromino.column + column >= PLAY_FIELD_COLUMNS ||
			tetromino.row + row >= playField.length)
	);
}

function hasCollisions(row, column) {
	const rowIndex = tetromino.row + row;
	const columnIndex = tetromino.column + column;

	// Перевірка: якщо фігура за межами поля, тоді немає зіткнення
	if (
		rowIndex < 0 ||
		rowIndex >= PLAY_FIELD_ROWS ||
		columnIndex < 0 ||
		columnIndex >= PLAY_FIELD_COLUMNS
	) {
		return false;
	}
	return tetromino.matrix[row][column] && playField[rowIndex][columnIndex];
}
