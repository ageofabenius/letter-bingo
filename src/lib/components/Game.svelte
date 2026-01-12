<script lang="ts">
	import { Game } from './game.svelte';
	import WordleWordList from '$lib/content/wordle_all.txt?raw';
	import Letter from './Letter.svelte';

	let game = new Game(WordleWordList.split('\n'));
</script>

<div class="grid bg-white">
	<div class="flex flex-col gap-4 p-4">
		<div class="flex gap-4">
			<div class="opacity-30">
				<Letter letter={game.next_letter} bordered={true} />
			</div>
			<div>
				<Letter letter={game.current_letter} bordered={true} />
			</div>
		</div>

		<div
			class="
			grid aspect-square
			grid-cols-5 grid-rows-5
			gap-0.5
		bg-gray-200
			p-0.5
			size-fit
			"
		>
			{#each game.grid as row, row_index}
				{#each row as letter, col_index}
					<!-- svelte-ignore a11y_click_events_have_key_events -->
					<!-- svelte-ignore a11y_no_static_element_interactions -->
					<div
						class="
						size-full
						{letter ? 'hover:bg-gray-100' : 'cursor-pointer hover:bg-green-100'}
						{game.game_lost
							? 'bg-red-500/35'
							: game.winning_row === row_index || game.winning_col === col_index
								? 'bg-green-500/50'
								: 'bg-white'}
						"
						onclick={() => game.cell_clicked(row_index, col_index)}
					>
						<Letter {letter} />
					</div>
				{/each}
			{/each}
		</div>
	</div>

	<div class="flex flex-col gap-4 p-4">
		{#key game.letter_bag.bag}
			{#each Object.entries(game.letter_bag.bag) as [letter, count]}
				<div class="flex flex-wrap gap-2">
					{#each { length: count }}
						<div>
							<Letter {letter} bordered={true} />
						</div>
					{/each}
				</div>
			{/each}
		{/key}
	</div>
</div>
