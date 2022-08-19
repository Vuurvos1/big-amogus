<script>
	import { page } from '$app/stores';
	import { onDestroy, onMount } from 'svelte';
	export let data;

	let runs = data.lines;

	// format date to hh:mm
	function getHHMM(date) {
		const hours = date.getHours();
		const mins = date.getMinutes();
		return `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}`;
	}

	function formatDuration(str) {
		if (!str) return '';
		const hours = str.match(/(\d+)\s*H/);
		const minutes = str.match(/(\d+)\s*M/);
		const seconds = str.match(/(\d+)\s*S/);

		return `${hours ? hours[1].padStart(2, '0') : '00'}:${
			minutes ? minutes[1].padStart(2, '0') : '00'
		}:${seconds ? seconds[1].padStart(2, '0') : '00'}`;
	}

	let interval;
	onMount(() => {
		// this could be done over a websocket if one exists???
		interval = setInterval(async () => {
			// refetch runs data every 5 minutes
			const res = await fetch(`https://oengus.io/api/marathons/${page.params.slug}/schedule`);
			data = await res.json();
		}, 1000 * 60 * 5);
	});

	onDestroy(() => {
		clearInterval(interval);
	});
</script>

<h1>{$page.params.slug}</h1>

<!-- <pre>
  {JSON.stringify(data, null, 2)}
</pre> -->

<div class="runsHeader">
	<!-- header -->
	<p>Time</p>
	<p>Runner(s)</p>
	<p>Game</p>
	<p>Category</p>
	<!-- <p>Type</p> -->
	<p>Estimate</p>
</div>

<div class="runs">
	<div>{new Date(runs[0].date)}</div>

	{#each runs as run, i}
		{#if i > 1 && new Date(runs[i - 1].date).getDay() != new Date(run.date).getDay()}
			<div>{new Date(run.date)}</div>
			<!-- if current run day is bigger than last run day -->
		{/if}

		<div class="run">
			<time>{getHHMM(new Date(run.date))}</time>
			{#if run.runners.length > 0}
				<div>
					{#each run.runners as runner}
						<p>
							{runner.username}
						</p>
					{/each}
				</div>
			{/if}
			<!-- game -->
			<p>{run.gameName ? run.gameName : run.setupBlockText}</p>

			<!-- cat -->
			{#if run.categoryName}
				<p>{run.categoryName}</p>
			{/if}

			<!-- est -->
			<p>{formatDuration(run.estimate)}</p>
		</div>
		<!-- content here -->
	{/each}
</div>

<style>
	.runsHeader {
		display: flex;
		flex-direction: row;
	}

	.runsHeader > * {
		width: 100%;
	}

	.runs {
		display: flex;
		flex-direction: column;
	}

	.run:nth-child(odd) {
		background-color: hotpink;
	}

	.run:nth-child(even) {
		background-color: lime;
	}

	.run {
		display: flex;
		flex-direction: row;
		align-items: center;
	}

	.run > * {
		width: 25%;
		overflow-x: auto;
	}
</style>
