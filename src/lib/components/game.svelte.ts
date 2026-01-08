export class Game {

    grid: (string | null)[][] = $state([
        [null, null, null, null, null],
        [null, null, null, null, null],
        [null, null, null, null, null],
        [null, null, null, null, null],
        [null, null, null, null, null]
    ]);

    current_letter: string = $state('');

    constructor() {
        this.advance_letter()
    }

    advance_letter() {
        this.current_letter = test_letters.shift()!;
    }


    cell_clicked(row_index: number, col_index: number) {
        // Validate that cell is empty
        if (this.grid[row_index][col_index] !== null) {
            return;
        }

        // Place letter
        this.grid[row_index][col_index] = this.current_letter;
        this.current_letter = ''

        // Check win condition

        // Move to next letter
        this.advance_letter()
    }
}


let test_letters = [
    'a',
    'b',
    'c',
    'd',
    'e',
    'a',
    'b',
    'c',
    'd',
    'e',
    'a',
    'b',
    'c',
    'd',
    'e',
    'a',
    'b',
    'c',
    'd',
    'e',
    'a',
    'b',
    'c',
    'd',
    'e',
    'a',
    'b',
    'c',
    'd',
    'e'
];