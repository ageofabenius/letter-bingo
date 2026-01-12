<script lang="ts">
	import { EASY, MEDIUM, HARD } from './difficulties';
</script>

<div class="bg-white">
	<div class="flex flex-col gap-4 p-4">
		<div class="prose">
			<h2>How to play:</h2>
			<p>
				Letters are pulled randomly from a bag. Place them on the board to create a 5-letter word.
				The remaining letters that can be drawn are shown below the board (the board can fit 25
				letters total).
			</p>
		</div>
		<div class="flex items-center gap-4">
			<a
				class="block w-48 cursor-pointer rounded-l bg-gray-300 px-4 py-2 text-center font-bold text-gray-800 hover:bg-gray-400"
				href="/easy"
			>
				Easy
			</a>
			<span>
				<span class="opacity-60">Letters drawn at once:</span>
				{EASY.num_letters_drawn}
				<span class="opacity-60">, total letters in bag:</span>
				{EASY.number_letters_total}
			</span>
		</div>
		<div class="flex items-center gap-4">
			<a
				class="block w-48 cursor-pointer rounded-l bg-gray-300 px-4 py-2 text-center font-bold text-gray-800 hover:bg-gray-400"
				href="/medium"
			>
				Medium
			</a>
			<span>
				<span class="opacity-60">Letters drawn at once:</span>
				{MEDIUM.num_letters_drawn}
				<span class="opacity-60">, total letters in bag:</span>
				{MEDIUM.number_letters_total}
			</span>
		</div>
		<div class="flex items-center gap-4">
			<a
				class="block w-48 cursor-pointer rounded-l bg-gray-300 px-4 py-2 text-center font-bold text-gray-800 hover:bg-gray-400"
				href="/hard"
			>
				Hard
			</a>
			<span>
				<span class="opacity-60">Letters drawn at once:</span>
				{HARD.num_letters_drawn}
				<span class="opacity-60">, total letters in bag:</span>
				{HARD.number_letters_total}
			</span>
		</div>
	</div>
</div>
