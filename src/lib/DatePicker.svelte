<script lang="ts">
  // import dispatch
  import { createEventDispatcher } from "svelte"
  let dateInput: HTMLInputElement

  // create a dispatcher
  const dispatch = createEventDispatcher()

  // dispatch date change
  function handleDateChange(event: Event) {
    const value = dateInput.valueAsDate
    dispatch("change", {
      year: value.getFullYear(),
      month: value.getMonth(),
      day: value.getDate(),
    })
  }
</script>

<input bind:this={dateInput} type="date" on:change={handleDateChange} />
