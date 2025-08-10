<script>
	let { data } = $props();
	const { next, live } = data;
</script>

<svelte:head>
	<title>Home</title>
	<meta name="description" content="A different way to view Oengus schedules" />
</svelte:head>

<section>
	<h1>Oengus Schedules</h1>

	<h2>Live marathons</h2>
	<ul>
		{#each live as marathon}
			<li>
				<a href={`/${marathon.id}`}>{marathon.name}</a>
			</li>
		{/each}
	</ul>

	<h2>Upcomming marathons</h2>
	<ul>
		{#each next as marathon}
			<li>
				<a href={`/${marathon.id}`}>{marathon.name}</a>
			</li>
		{/each}
	</ul>
</section>

<style>
	section {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		flex: 1;
	}

	ul {
		margin: 1em 0;
	}

	h1 {
		width: 100%;
	}
</style>
