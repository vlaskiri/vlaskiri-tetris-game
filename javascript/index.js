// TODO: Зверстати поле для розрахунку балів гри // Done

const PLAY_FIELD_COLUMNS = 10;
const PLAY_FIELD_ROWS = 20;
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

function convertPositionToIndex(row, column) {
	return row * PLAY_FIELD_COLUMNS + column;
}

function randomIndexTetroName(minNum, maxNum) {
	minNum = Math.ceil(minNum);
	maxNum = Math.floor(maxNum);

	const result = Math.floor(Math.random() * (maxNum - minNum + 1)) + minNum;

	return result;
}

let playField;
let tetromino;

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
	const column = Math.floor((PLAY_FIELD_COLUMNS - matrix[0].length) / 2);
	const row = -2;

	tetromino = {
		name,
		matrix,
		row,
		column,
	};
}

function placeTetromino() {
	const matrixSize = tetromino.matrix.length;

	for (let row = 0; row < matrixSize; row++) {
		for (let column = 0; column < matrixSize; column++) {
			if (tetromino.matrix[row][column]) {
				playField[tetromino.row + row][tetromino.column + column] =
					tetromino.name;
			}
		}
	}

	let linesCleared = 0;
	for (let row = 0; row < PLAY_FIELD_ROWS; row++) {
		if (playField[row].every(cell => cell !== 0)) {
			playField.splice(row, 1);
			playField.unshift(new Array(PLAY_FIELD_COLUMNS).fill(0));
			linesCleared++;
		}
	}

	updateScore(linesCleared);
	generateTetromino();
}

// TODO: Прописати логіку і код розрахунку балів гри // Done
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

generatePlayField();
generateTetromino();

const CELLS = document.querySelectorAll('.main-grid div');

function drawPlayField() {
	for (let row = 0; row < PLAY_FIELD_ROWS; row++) {
		for (let column = 0; column < PLAY_FIELD_COLUMNS; column++) {
			if (playField[row][column] === 0) continue;

			const name = playField[row][column];

			const CELL_INDEX = convertPositionToIndex(row, column);

			CELLS[CELL_INDEX].classList.add(name);
		}
	}
}

// TODO: Поставити const row = -2 в generateTetromino(); прописати щоб код працював корректно (Також внесені зміни у функцію hasCollisions)
function drawTetromino() {
	const name = tetromino.name;
	const tetrominoMatrixSize = tetromino.matrix.length;

	for (let row = 0; row < tetrominoMatrixSize; row++) {
		for (let column = 0; column < tetrominoMatrixSize; column++) {
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
				CELLS[CELL_INDEX].classList.add(name);
			}
		}
	}
}

// Функція оновлення поля гри
function draw() {
	CELLS.forEach(cell => cell.removeAttribute('class'));
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

draw();

// Функція обертання фігури і перемальовування поля
function rotate() {
	rotateTetromino();
	draw();
}

// Функціонал роботи з стрілками (клавіатура, мишка, утримування кнопки миші)
document.addEventListener('keydown', onKeyDown);
let up = document.getElementById('up');
let down = document.getElementById('down');
let left = document.getElementById('left');
let right = document.getElementById('right');

// Змінна для зберігання інтервалу
let intervalId;

// Функції для обробки подій
function rotateTetrominoEvent() {
	rotate();
	draw();
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

// Управління фігурами на полі
function onKeyDown(e) {
	switch (e.key) {
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
	draw();
}

// ------------------------------------- //

// Рефреш сторінки, гра оновиться
let restart = document.getElementById('restart-game');

restart.addEventListener('click', () => {
	document.location.reload();
});

// ------------------------------------- //

function moveTetrominoDown() {
	tetromino.row += 1;
	if (isValid()) {
		tetromino.row -= 1;
		placeTetromino();
	}
}

// TODO: Реалізувати самостійний рух фігур донизу // Done
// Auto move down tetromino
setInterval(() => {
	moveTetrominoDown();
	draw();
}, 1000);

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
			// if(tetromino.matrix[row][column]) continue;
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
