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
		[0, 1, 0, 0],
		[0, 1, 0, 0],
		[0, 1, 0, 0],
		[0, 1, 0, 0],
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

const tetroNameIndex = randomIndexTetroName(0, 8);

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
	const name = TETROMINO_NAMES[tetroNameIndex];
	const matrix = TETROMINOES[name];

	tetromino = {
		name,
		matrix,
		row: 1,
		column: 4,
	};
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

function drawTetromino() {
	const name = tetromino.name;
	const tetrominoMatrixSize = tetromino.matrix.length;

	for (let row = 0; row < tetrominoMatrixSize; row++) {
		for (let column = 0; column < tetrominoMatrixSize; column++) {
			if (!tetromino.matrix[row][column]) continue;

			const CELL_INDEX = convertPositionToIndex(
				tetromino.row + row,
				tetromino.column + column
			);

			CELLS[CELL_INDEX].classList.add(name);
		}
	}
}

function draw() {
	CELLS.forEach(cell => cell.removeAttribute('class'));
	drawTetromino();
	drawPlayField();
}

draw();

function moveTetrominoDown() {
	tetromino.row += 1;
}

function moveTetrominoLeft() {
	tetromino.column -= 1;
}

function moveTetrominoRight() {
	tetromino.column += 1;
}

document.addEventListener('keydown', onKeyDown);

function onKeyDown(e) {
	console.log('down', e);
	switch (e.key) {
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
