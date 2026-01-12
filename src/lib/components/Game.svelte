<script lang="ts">
	import { Game } from './game.svelte';
	import Letter from './Letter.svelte';

	let {
		game
	}: {
		game: Game;
	} = $props();
</script>

<div>
	<div class="flex flex-col p-4 sm:flex-row">
		<div class="flex flex-row justify-start gap-4 sm:flex-col">
			{#each game.drawn_letters as letter, index}
				<div
					class="
					{index == 0
						? ''
						: index == 1
							? 'opacity-40'
							: index == 2
								? 'opacity-30'
								: index == 3
									? 'opacity-20'
									: ''}
					"
				>
					<Letter {letter} standalone={true} />
				</div>
			{/each}
		</div>

		<div
			class="ext-md flex aspect-square size-12
			rotate-90
			items-center
			justify-center
			sm:size-20
			sm:rotate-0
			sm:text-2xl
			lg:size-24
			lg:text-3xl
			"
		>
			→
		</div>

		<div
			class="
			grid aspect-square
			size-fit grid-cols-5
			grid-rows-5
		gap-0.5
			bg-gray-200
			p-0.5
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

	<div class="flex flex-wrap gap-x-4 gap-y-2 p-4 sm:gap-x-8 sm:gap-y-3 md:gap-x-12 md:gap-y-4">
		{#key game.letter_bag.bag}
			{#each Object.entries(game.letter_bag.bag) as [letter, count], index}
				{#if count > 0}
					<div class="flex flex-wrap gap-1 sm:gap-2 md:gap-3">
						{#each { length: count }}
							<div>
								<Letter {letter} standalone={true} />
							</div>
						{/each}
					</div>
				{/if}
			{/each}
		{/key}
	</div>
</div>
