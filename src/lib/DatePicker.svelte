<script lang="ts">
  // import dispatch
  import { createEventDispatcher } from "svelte"
  let dateInput: HTMLInputElement

  // create a dispatcher
  const dispatch = createEventDispatcher()

  // dispatch date change
  function handleDateChange(event: Event) {
    const value = dateInput.value
    const [year, month, day] = value.split("-").map((x) => parseInt(x, 10))

    dispatch("change", {
      year,
      month,
      day,
    })
  }
</script>

<input bind:this={dateInput} type="date" on:change={handleDateChange} />
