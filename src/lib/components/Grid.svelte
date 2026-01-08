<script lang="ts">
	import { Game } from './game.svelte';

	let game = new Game();
</script>

<div class="flex aspect-square size-16 items-center justify-center border">
	{game.current_letter}
</div>

<div
	class="
	grid aspect-square grid-cols-5 grid-rows-5
	gap-0.5
	bg-gray-200
	p-0.5
	"
>
	{#each game.grid as row, row_index}
		{#each row as letter, col_index}
			<div
				class="
				flex
				size-full
				items-center justify-center
				bg-white
				p-1
				text-2xl
				{letter ? 'hover:bg-gray-100' : 'cursor-pointer hover:bg-green-100'}
				"
				onclick={() => game.cell_clicked(row_index, col_index)}
			>
				{letter}
			</div>
		{/each}
	{/each}
</div>
