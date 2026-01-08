export class WordList {
    word_list: Set<string>

    constructor(word_list: string[]) {
        this.word_list = new Set(word_list)
    }

    is_valid(s: string): boolean {
        return this.word_list.has(s.toLowerCase())
    }
}