<script module>
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import Grid from '../lib/components/Grid.svelte';
	import { fn } from 'storybook/test';

	// More on how to set up stories at: https://storybook.js.org/docs/writing-stories
	const { Story } = defineMeta({
		title: 'Example/Grid',
		component: Grid,
		tags: ['autodocs']
	});
</script>

<!-- More on writing stories with args: https://storybook.js.org/docs/writing-stories/args -->
<Story name="Empty" args={{}} />
