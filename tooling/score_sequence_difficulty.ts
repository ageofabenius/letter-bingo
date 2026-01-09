import fs from 'fs';

function fast_count_bigint_ones(n: bigint) {
    let count = 0n;
    while (n > 0n) {
        n &= n - 1n;  // clear the lowest set bit
        count++;
    }
    return Number(count);
}

class GameBoard {
    board: (string | null)[][] = [
        [null, null, null, null, null],
        [null, null, null, null, null],
        [null, null, null, null, null],
        [null, null, null, null, null],
        [null, null, null, null, null]
    ]

    possible_row_matches: number[] = [1, 1, 1, 1, 1] // Default to 1 as a non-zero placeholder for now
    possible_col_matches: number[] = [1, 1, 1, 1, 1] // Default to 1 as a non-zero placeholder for now

    get(row: number, col: number): (string | null) {
        return this.board[row][col]
    }

    set(row: number, col: number, letter: string | null) {
        this.board[row][col] = letter
    }


    get_row(index: number): (string | null)[] {
        return this.board[index]
    }

    get_col(index: number): (string | null)[] {
        return [
            this.board[0][index],
            this.board[1][index],
            this.board[2][index],
            this.board[3][index],
            this.board[4][index],
        ]
    }

    row_is_filled(index: number): boolean {
        return this.board[index][0] !== null
            && this.board[index][1] !== null
            && this.board[index][2] !== null
            && this.board[index][3] !== null
            && this.board[index][4] !== null
    }

    col_is_filled(index: number): boolean {
        return this.board[0][index] !== null
            && this.board[1][index] !== null
            && this.board[2][index] !== null
            && this.board[3][index] !== null
            && this.board[4][index] !== null
    }
}

// [index][letter]
type WordMasks = Record<number, Record<string, bigint>>

function dictionary_and_word_masks(dictionary_filepath: string): [Set<string>, WordMasks, bigint] {
    console.log(`Loading dictionary: ${dictionary_filepath}`)

    let all_words = fs.readFileSync(dictionary_filepath, 'utf8').trimEnd().split('\n')

    let all_words_set = new Set(all_words)

    const letters = [
        "a",
        "b",
        "c",
        "d",
        "e",
        "f",
        "g",
        "h",
        "i",
        "j",
        "k",
        "l",
        "m",
        "n",
        "o",
        "p",
        "q",
        "r",
        "s",
        "t",
        "u",
        "v",
        "w",
        "x",
        "y",
        "z",
    ]

    let word_masks: WordMasks = {}
    for (let i = 0; i < 5; i++) {
        word_masks[i] = {}
        for (let letter of letters) {
            word_masks[i][letter] = 0n
        }
    }

    for (let [word_index, word] of all_words.entries()) {
        for (let pos = 0; pos < 5; pos++) {
            let letter = word[pos]
            word_masks[pos][letter] |= 1n << BigInt(word_index);
        }
    }

    const all_words_mask = (1n << BigInt(all_words.length)) - 1n;

    return [all_words_set, word_masks, all_words_mask]
}

class MatchChecker {
    word_masks: WordMasks
    all_words_mask: bigint

    memoized_num_matches: Map<number, number> = new Map()

    stats: Stats

    constructor(word_masks: WordMasks, all_words_mask: bigint, stats: Stats) {
        this.word_masks = word_masks
        this.all_words_mask = all_words_mask
        this.stats = stats
    }

    memoized_number_of_matches(letters: (string | null)[]): number {
        const key = this.memoization_key(letters)
        const memoized = this.memoized_num_matches.get(key)
        if (memoized !== undefined) {
            // console.log(`returning memoized: ${letters}, key: ${key.toString(2)}`)
            this.stats.memoized_matches_returned++
            return memoized
        }

        this.stats.unmemoized_matches_returned++
        const num_matches = number_of_matches(letters, this.word_masks, this.all_words_mask)
        this.memoized_num_matches.set(key, num_matches)
        // console.log(`memoizing ${letters}, key: ${key.toString(2)}`)
        return num_matches
    }

    memoization_key(letters: (string | null)[]): number {
        /// 27 possible values (26 letters + null) can fit in 5 bytes, so we
        /// take the value of each letter and shift it over by index * 5 bits
        let key = 0;
        for (let i = 0; i < 5; i++) {
            let value = letters[i] === null ? 0 : letters[i]!.charCodeAt(0) - 96 // so a = 1, null = 0

            key |= value << (i * 5);
        }

        return key
    }
}

function number_of_matches(letters: (string | null)[], word_masks: WordMasks, all_words_mask: bigint): number {
    let candidates = all_words_mask
    for (const [index, letter] of letters.entries()) {
        if (letter === null) {
            continue
        }
        candidates &= word_masks[index][letter]
    }

    return fast_count_bigint_ones(candidates)
}

function load_sequence(sequence_filepath: string): string {
    return fs.readFileSync(sequence_filepath, 'utf8').toLowerCase()
}

function clone_board(board: (string | null)[][]): (string | null)[][] {
    return board.map(row => row.slice())
}

function main(sequence_filepath: string, dictionary_filepath: string) {
    console.log(`Scoring sequence difficulty for: ${sequence_filepath}`)

    let [dictionary, word_masks, all_words_mask] = dictionary_and_word_masks(dictionary_filepath)

    let sequence = load_sequence(sequence_filepath)
    console.log(`Sequence: ${sequence}`)

    console.log(`Simulating game....`)

    let game_board: GameBoard = new GameBoard()
    let stats = new Stats()
    let match_checker = new MatchChecker(word_masks, all_words_mask, stats)
    recursive_foo(game_board, sequence, 0, 6, dictionary, match_checker, stats)
    stats.complete()
    stats.print_results()
}



class Stats {
    total_possible_states: number
    visited_states: number = 0
    pruned_branches: number = 0
    pruned_states: number = 0
    winning_states: number = 0
    winning_boards: (string | null)[][][] = []

    start_time: number
    end_time: number | null = null

    memoized_matches_returned: number = 0
    unmemoized_matches_returned: number = 0

    constructor() {
        this.total_possible_states = factorial(25)
        this.start_time = Date.now();
    }

    complete() {
        this.end_time = Date.now();
    }

    print_results() {
        if (!this.end_time) {
            this.complete()
        }
        let elapsed = this.end_time! - this.start_time
        console.log(`Elapsed: ${elapsed}ms`)
        this.winning_boards = [] // FOR EASIER DEBUG
        console.log(this)
        const percentage_states_pruned = this.pruned_states / this.total_possible_states
        console.log(`percentage_states_pruned: ${percentage_states_pruned.toFixed(10)}%`)
        // for (let board of this.winning_boards) {
        //     console.log(board)
        // }
    }

    print_progress() {
        let portion_complete = ((this.visited_states + this.pruned_states) / this.total_possible_states)
        let elapsed_ms = Date.now() - this.start_time
        let total_ms = elapsed_ms / portion_complete
        let total_min = total_ms / (1000 * 60)
        console.log(
            `visited: ${this.visited_states}, \
pruned: ${this.pruned_states}, \
progress: ${portion_complete.toFixed(10)}% \
elapsed: ${elapsed_ms}ms
total: ${total_min} min
        `)
    }
}

function factorial(n: number) {
    // Factorial of 0 and 1 is 1
    if (n === 0 || n === 1) {
        return 1;
    }

    let result = 1;
    // Loop from 2 up to and including n
    for (let i = 2; i <= n; i++) {
        result *= i; // Equivalent to result = result * i;
    }

    return result;
}

function game_is_still_winnable(game_board: GameBoard): boolean {
    for (let i = 0; i < 5; i++) {
        if (game_board.possible_row_matches[i] > 0) {
            return true
        }
        if (game_board.possible_col_matches[i] > 0) {
            return true
        }
    }
    return false
}

function game_is_still_winnable_in_other_rows_cols(game_board: GameBoard, row: number, col: number): boolean {
    for (let i = 0; i < 5; i++) {
        if (i != row && game_board.possible_row_matches[i] > 0) {
            return true
        }
        if (i != col && game_board.possible_col_matches[i] > 0) {
            return true
        }
    }
    return false
}

function recursive_foo(game_board: GameBoard, full_sequence: string, sequence_index: number, search_depth: number, dictionary: Set<string>, match_checker: MatchChecker, stats: Stats) {
    if (sequence_index >= search_depth) {
        return
    }
    const current_letter = full_sequence[sequence_index]
    // console.log(`recursive_foo for sequence ${full_sequence}, current_letter: ${current_letter}`)

    for (let row = 0; row < 5; row += 1) {
        for (let col = 0; col < 5; col += 1) {
            if (game_board.get(row, col) !== null) {
                // Cell is already taken
                continue
            }

            // Set the cell to the current letter
            game_board.set(row, col, current_letter)
            stats.visited_states++

            // console.log(game_board)

            const row_letters = game_board.get_row(row)
            const col_letters = game_board.get_col(col)

            // Check if it's solved
            let row_wins = false
            let col_wins = false
            if (game_board.row_is_filled(row)) {
                // Row is filled
                // Check if it's in the dictionary
                if (dictionary.has(row_letters.join(""))) {
                    row_wins = true
                }
            }
            if (game_board.col_is_filled(col)) {
                // Col is filled
                // Check if it's in the dictionary
                if (dictionary.has(col_letters.join(""))) {
                    col_wins = true
                }
            }
            if (row_wins || col_wins) {
                stats.winning_states++
                stats.pruned_branches++
                const num_empty_cells = 25 - sequence_index - 1
                stats.pruned_states += factorial(num_empty_cells)
                stats.winning_boards.push(clone_board(game_board.board))
            } else {
                // Set new row and col num matches
                const previous_possible_row_matches = game_board.possible_row_matches[row]
                const previous_possible_col_matches = game_board.possible_col_matches[col]

                const num_row_matches = match_checker.memoized_number_of_matches(row_letters)
                const num_col_matches = match_checker.memoized_number_of_matches(col_letters)

                game_board.possible_row_matches[row] = num_row_matches
                game_board.possible_col_matches[col] = num_col_matches

                const is_winnable = game_is_still_winnable(game_board)

                if (is_winnable) {
                    // The game is still winnable
                    recursive_foo(game_board, full_sequence, sequence_index + 1, search_depth, dictionary, match_checker, stats)
                } else {
                    stats.pruned_branches++
                    const num_empty_cells = 25 - sequence_index - 1
                    stats.pruned_states += factorial(num_empty_cells)
                }

                // Set the possible matches back, backtracking
                game_board.possible_row_matches[row] = previous_possible_row_matches
                game_board.possible_col_matches[col] = previous_possible_col_matches
            }

            // Unset the cell back to null, backtracking
            game_board.set(row, col, null)


            // Finally, print results if at the first or second layer
            if (sequence_index <= 0) {
                console.log(`${current_letter} => (${row}, ${col})`)
                stats.print_progress()
            }
        }

    }
}

let sequence_filepath = process.argv[2];

const dictionary_filepath = "src/lib/content/wordle_all.txt"

main(sequence_filepath, dictionary_filepath)
