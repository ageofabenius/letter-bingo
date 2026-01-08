<script lang="ts">
	let {
		pop_letter
	}: {
		pop_letter: () => string;
	} = $props();

	let letters = $state([
		[null, null, 'c', 'd', 'e'],
		['f', 'g', 'h', 'i', 'j'],
		['k', 'l', 'm', 'n', 'o'],
		['p', 'q', 'r', 's', 't'],
		['u', 'v', 'w', 'x', 'y']
	]);

	function cell_clicked(row_index: number, col_index: number) {
		// Validate that cell is empty
		if (letters[row_index][col_index] !== null) {
			return;
		}

		const next_letter = pop_letter()

		letters[row_index][col_index] = next_letter;
	}
</script>

<div
	class="
	grid aspect-square grid-cols-5 grid-rows-5
	gap-0.5
	bg-gray-200
	p-0.5
	"
>
	{#each letters as row, row_index}
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
				onclick={() => cell_clicked(row_index, col_index)}
			>
				{letter}
			</div>
		{/each}
	{/each}
</div>
