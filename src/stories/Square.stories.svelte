<script module>
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import Square from '../lib/components/Square.svelte';
	import { fn } from 'storybook/test';

	// More on how to set up stories at: https://storybook.js.org/docs/writing-stories
	const { Story } = defineMeta({
		title: 'Example/Square',
		component: Square,
		tags: ['autodocs']
	});
</script>

<!-- More on writing stories with args: https://storybook.js.org/docs/writing-stories/args -->
<Story name="Empty" args={{}} />

<Story name="A" args={{ letter: 'A' }} />

<Story name="B" args={{ letter: 'B' }} />
