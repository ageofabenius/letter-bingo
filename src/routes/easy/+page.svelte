<script lang="ts">
	import GameComp from '$lib/components/Game.svelte';
	import WordleWordList from '$lib/content/wordle_all.txt?raw';
	import { Game } from '$lib/components/game.svelte';
	import { EASY } from '../difficulties';

	let game = new Game(
		WordleWordList.split('\n'),
		EASY.num_letters_drawn,
		EASY.number_letters_total,
		EASY.letter_sampling_distribution
	);
</script>

<GameComp {game} />
