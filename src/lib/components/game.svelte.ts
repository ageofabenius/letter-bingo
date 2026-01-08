import { LetterRandomizer as LetterBag } from "./letter_bag.svelte";

export class Game {

    grid: (string | null)[][] = $state([
        [null, null, null, null, null],
        [null, null, null, null, null],
        [null, null, null, null, null],
        [null, null, null, null, null],
        [null, null, null, null, null]
    ]);

    current_letter: string = $state('');

    letter_bag: LetterBag

    constructor() {
        this.letter_bag = new LetterBag()
        this.next_letter()
    }

    next_letter() {
        console.log('advance_letter')
        this.current_letter = this.letter_bag.get_next_letter()
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
        this.next_letter()
    }
}
