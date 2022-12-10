<script lang="ts">
  // import dispatch
  import { onMount, createEventDispatcher } from "svelte"

  let dateInput: HTMLInputElement
  export let dateValue: string

  // create a dispatcher
  const dispatch = createEventDispatcher()

  // dispatch date change
  function handleDateChange(event: Event) {
    const value = dateInput.value
    dateValue = dateInput.value
    const [year, month, day] = value.split("-").map((x) => parseInt(x, 10))

    dispatch("change", {
      year,
      month,
      day,
    })
  }

  onMount(() => {
    dateInput.value = dateValue
  })
</script>

<input
  bind:this={dateInput}
  bind:value={dateValue}
  type="date"
  on:change={handleDateChange}
/>
