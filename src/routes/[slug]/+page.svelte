<script>
	import { page } from '$app/stores';
	import { onDestroy, onMount } from 'svelte';
	export let data;

	let time = new Date();

	let runs = data.lines;
	let currentRun = getCurrentRun();

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

	function getCurrentRun() {
		for (let i = 0; i < runs.length; i++) {
			const run = runs[i];
			if (runs[i + 1] && time < new Date(runs[i + 1].date) && new Date(run.date) < time) {
				return runs[i];
			}
		}

		return [];
	}

	let interval;
	let timer;
	let timeOut;
	onMount(() => {
		// this could be done over a websocket if one exists???
		interval = setInterval(async () => {
			// refetch runs data every 5 minutes
			try {
				const res = await fetch(`https://oengus.io/api/marathons/${$page.params.slug}/schedule`);
				data = await res.json();
			} catch (err) {
				console.error('error updating schedule data');
			}
		}, 1000 * 60 * 5);

		timeOut = setTimeout(() => {
			time = new Date();
			currentRun = getCurrentRun();

			// start timer
			timer = setInterval(() => {
				// upate time every minute
				time = new Date();
				currentRun = getCurrentRun();
			}, 1000 * 60);
			// this is precise to the second, could maybe should also compensate ms
		}, (60 - time.getSeconds()) * 1000);
	});

	onDestroy(() => {
		clearInterval(interval);
		clearInterval(timer);
		clearTimeout(timeOut);
	});
</script>

<h1>{$page.params.slug}</h1>
{#if time >= new Date(runs[0].date) && time <= new Date(runs[runs.length - 1].date)}
	<a href="#{currentRun.id}"> Jump to current run </a>
{/if}

<!-- header -->
<div class="runsHeader">
	<p>Time</p>
	<p>Runner(s)</p>
	<p>Game</p>
	<p>Category</p>
	<!-- <p>Type</p> -->
	<p>Estimate</p>
</div>

<div class="runs">
	{#each runs as run, i}
		{#if i == 0 || (i > 1 && new Date(runs[i - 1].date).getDay() != new Date(run.date).getDay())}
			<div class="timie">
				{new Date(run.date).toLocaleDateString('default', {
					day: '2-digit',
					month: 'long',
					year: 'numeric'
				})}
			</div>
		{/if}
		<!-- this might not highlight the first run of a schedule -->
		<div class="run" id={run.id} class:active={run.id === currentRun.id}>
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
			{#if run.setupBlockText}
				<p>{run.setupBlockText}</p>
			{:else if run.setupBlock}
				<p>Setup Block</p>
			{:else}
				<p>{run.gameName}</p>
			{/if}

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
	:global(html) {
		scroll-padding-top: 4rem;
	}

	a {
		text-align: center;
	}

	.runsHeader {
		display: flex;
		flex-direction: row;
	}

	.runsHeader > * {
		width: 100%;
	}

	.timie {
		padding: 1rem;
		background-color: lightseagreen;
		text-align: center;
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

	.run.active {
		background-color: yellow;
	}

	.run.active * {
		color: red;
	}
</style>
