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
	<!-- <p>Type</p> -->
	<p>Estimate</p>
</div>

<div class="runs">
	{#each runs as run, i}
		<details class="run" id={String(run.id)} class:active={run.id === currentRun?.id}>
			<summary>
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
				<!-- this might not highlight the first run of a schedule -->
				<div>
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
			</summary>

			<div>
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
		</details>
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

	.run > *:first-child {
		/* margin-left: 0.75rem; */
	}

	.run > *:last-child {
		/* margin-right: 0.75rem;    */
	}

	dl {
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

	.run > summary > * {
		display: flex;
		flex-direction: row;
		align-items: center;
		gap: 0.25rem;
		padding: 1rem 0.75rem;
	}

	.run > summary > * > * {
		width: 25%;
		overflow-x: auto;
	}

	.run.active {
		background-color: yellow;
	}

	.run.active * {
		color: red;
	}

	details summary::-webkit-details-marker {
		display: none;
	}

	details summary {
		cursor: pointer;
	}

	details summary > * {
		display: inline;
	}

	details > summary {
		list-style: none;
	}
	details > summary::-webkit-details-marker {
		display: none;
	}

	details > div {
		border-top: 1px solid rgba(0, 0, 0, 0.2);
		padding: 0.5rem 2rem;
	}
</style>
