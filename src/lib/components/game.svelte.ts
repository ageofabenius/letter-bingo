import { WordList } from "./dictionary.svelte";
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
    dictionary: WordList

    winning_row: number | null = $state(null)
    winning_col: number | null = $state(null)

    constructor(word_list: string[]) {
        this.dictionary = new WordList(word_list)

        this.letter_bag = new LetterBag()
        this.next_letter()
    }

    next_letter() {
        console.log('advance_letter')
        this.current_letter = this.letter_bag.get_next_letter()
    }

    cell_clicked(row_index: number, col_index: number) {
        // Validate game is not over
        if (this.winning_row || this.winning_col) {
            return;
        }

        // Validate that cell is empty
        if (this.grid[row_index][col_index] !== null) {
            return;
        }

        // Place letter
        this.grid[row_index][col_index] = this.current_letter;
        this.current_letter = ''

        // Check win condition
        const row_word = this.row_word(row_index)
        console.log('row_word', row_word)
        const col_word = this.col_word(col_index)
        console.log('col_word', col_word)

        if (row_word && this.dictionary.is_valid(row_word)) {
            console.log('ROW WINS!')
            this.winning_row = row_index
        }

        if (col_word && this.dictionary.is_valid(col_word)) {
            console.log('COL WINS!')
            this.winning_col = col_index
        }

        if (this.winning_row && this.winning_col) {
            console.log('DOUBLE WIN!')
        }

        // Move to next letter
        this.next_letter()
    }

    /**
     * Returns either the word spanning the row index, or null if the row is not
     * yet filled
     */
    row_word(row_index: number): string | null {
        const row_letters = this.grid[row_index]
        if (row_letters.some(l => l === null)) {
            return null
        } else {
            return row_letters.join('')
        }
    }

    /**
     * Returns either the word spanning the col index, or null if the col is not
     * yet filled
     */
    col_word(col_index: number): string | null {
        const col_letters = this.grid.map((row) => row[col_index])
        if (col_letters.some(l => l === null)) {
            return null
        } else {
            return col_letters.join('')
        }
    }
}
