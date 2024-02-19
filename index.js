const PLAY_FIELD_COLUMNS = 10;
const PLAY_FIELD_ROWS = 20;
const TETROMINO_NAMES = ['O', 'J'];

const TETROMINOES = {
	'O': [
		[1, 1],
		[1, 1],
	],
	'J': [
		[1, 0, 0],
		[1, 1, 1],
		[0, 0, 0],
	],
};

function convertPositionToIndex(row, column) {
	return row * PLAY_FIELD_COLUMNS + column;
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

	// console.log(playField);
}

function generateTetromino() {
	const name = TETROMINO_NAMES[1];
	const matrix = TETROMINOES[name];

	tetromino = {
		name,
		matrix,
		row: 2,
		column: 5,
	};
}

generatePlayField();
generateTetromino();

const CELLS = document.querySelectorAll('.main-grid div');
// console.log(CELLS);

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
			// console.log(CELL_INDEX);

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


// TODO: добавить новые фигуры (на своё усмотрение)
// TODO: стилизация каждой фигуре, которую создали 
// TODO: Добавить функцию рандома, которая будет возвращать рандомный индекс TETROMINO_NAMES[1] (38 строка кода)
// TODO: Центрировать фигуру независимо от ширины
// TODO: 
// TODO: 
// TODO: 

