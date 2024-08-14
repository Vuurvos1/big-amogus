<script>
	import { invalidateAll } from '$app/navigation';
	import { page } from '$app/stores';
	import { onDestroy, onMount } from 'svelte';
	export let data;

	const MINUTE = 60 * 1000;

	let time = new Date();

	let runs = data.lines;
	$: currentRun = runs.find(
		(run, i, runs) => runs[i + 1] && time < new Date(runs[i + 1].date) && new Date(run.date) < time
	);

	/**
	 *  format date to hh:mm
	 *  @param {Date} date - input date
	 */
	function getHHMM(date) {
		const hours = date.getHours();
		const mins = date.getMinutes();
		return `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}`;
	}

	/**
	 *  format date to hh:mm
	 *  @param {String} str - input date
	 */
	function formatDuration(str) {
		if (!str) return '';
		const hours = str.match(/(\d+)\s*H/);
		const minutes = str.match(/(\d+)\s*M/);
		const seconds = str.match(/(\d+)\s*S/);

		return `${hours ? hours[1].padStart(2, '0') : '00'}:${
			minutes ? minutes[1].padStart(2, '0') : '00'
		}:${seconds ? seconds[1].padStart(2, '0') : '00'}`;
	}

	/** @type {number} */
	let interval;
	/** @type {number} */
	let timer;
	/** @type {number} */
	let timeOut;

	/** @type {number | null} */
	let activeRun = null;

	onMount(() => {
		// this could be done over a websocket if one exists???
		interval = setInterval(async () => {
			// refetch runs data every 5 minutes
			try {
				invalidateAll();
			} catch (err) {
				console.error('error updating schedule data');
			}
		}, MINUTE * 5);

		timeOut = setTimeout(() => {
			time = new Date();

			// start timer
			timer = setInterval(() => {
				// upate time every minute
				time = new Date();
			}, MINUTE);
			// offset timer to next full minute
		}, MINUTE - (new Date().getTime() % MINUTE));
	});

	onDestroy(() => {
		clearInterval(interval);
		clearInterval(timer);
		clearTimeout(timeOut);
	});
</script>

<svelte:head>
	<title>Bigoengus - {$page.params.slug}</title>
</svelte:head>

<h1>{$page.params.slug}</h1>
{#if currentRun}
	<a href="#{currentRun.id}"> Jump to current run </a>
{/if}

<!-- header -->
<div class="runsHeader">
	<p>Time</p>
	<p>Runner(s)</p>
	<p>Game</p>
	<p>Category</p>
	<p>Estimate</p>
</div>

<div class="runs">
	{#each runs as run, i}
		<!-- this might not highlight the first run of a schedule -->
		{#if i == 0 || (i > 1 && new Date(runs[i - 1].date).getDay() != new Date(run.date).getDay())}
			<div class="timie">
				{new Date(run.date).toLocaleDateString('default', {
					weekday: 'long',
					month: 'long',
					day: '2-digit',
					year: 'numeric'
				})}
			</div>
		{/if}

		<button
			class="run"
			id={String(run.id)}
			class:active={run.id === currentRun?.id}
			on:click={() => {
				if (activeRun === run.id) {
					activeRun = null;
					return;
				}

				activeRun = run.id;
			}}
		>
			<div class="runSummary">
				<div>
					{#if activeRun === run.id}
						v
					{:else}
						&gt;
					{/if}
				</div>

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

			{#if activeRun === run.id}
				<div class="runDetails">
					<dl>
						{#if run.setupTime}
							<dt>Setup Time</dt>
							<dd>{formatDuration(run.setupTime)}</dd>
						{/if}

						{#if run.console}
							<dt>Console</dt>
							<dd>{run.console}</dd>
						{/if}

						{#if run.type}
							<dt>Type</dt>
							<dd>{run.type}</dd>
						{/if}
					</dl>
				</div>
			{/if}
		</button>
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
		padding: 0 0.5rem;
	}

	.runsHeader > * {
		width: 100%;
		margin: 1rem 0;
	}

	.timie {
		position: sticky;
		top: 0;
		padding: 1rem;
		background-color: lightseagreen;
		text-align: center;
	}

	.runs {
		position: relative;
		display: flex;
		flex-direction: column;
	}

	dl {
		width: max-content;
		display: grid;
		grid-template-columns: auto 1fr;
		gap: 0.25rem 1rem;
	}

	dl dt {
		font-weight: 600;
	}

	.run:nth-child(odd) {
		background-color: hotpink;
	}

	.run:nth-child(even) {
		background-color: lime;
	}

	.runSummary {
		display: grid;
		gap: 0.25rem;
		grid-template-columns: 1.5rem repeat(5, 1fr);
		padding: 1rem 0.5rem;
	}

	.runSummary > * {
		overflow-x: auto;
	}

	.run.active {
		background-color: yellow;
	}

	.run.active * {
		color: red;
	}

	.runDetails {
		border-top: 1px solid rgba(0, 0, 0, 0.2);
		padding: 0.75rem 3rem;
	}
</style>
