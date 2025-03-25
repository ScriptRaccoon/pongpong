<script lang="ts">
	let point_counter = $state(0)

	function cycle_counter() {
		if (point_counter < 3) {
			point_counter += 1
		} else {
			point_counter = 0
		}
	}

	$effect(() => {
		const interval = setInterval(cycle_counter, 250)
		return () => clearInterval(interval)
	})

	let dots = $derived('.'.repeat(point_counter))
</script>

<p>
	Loading {dots}
</p>
