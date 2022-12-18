<script lang="ts">
  import { backupImage, removeImage } from "./photoApi"

  export let image: gapi.client.photoslibrary.MediaItem
  export let saved: boolean = false

  let query = 256
  let isSaving = false
  let error = ""

  async function deleteImage() {
    isSaving = true
    try {
      error = ""
      await removeImage(image)
      saved = false
    } catch (ex) {
      console.error(ex)
      error = ex
    }
    isSaving = false
  }

  async function backup() {
    isSaving = true
    try {
      error = ""
      saved = await backupImage(image)
    } catch (ex) {
      console.error(ex)
      error = ex
    }
    isSaving = false
  }
</script>

<!-- svelte-ignore a11y-no-noninteractive-tabindex -->
<div class="grid" tabindex="0">
  <!-- svelte-ignore a11y-click-events-have-key-events -->
  <img
    id={image.id}
    src={`${image.baseUrl}=w${query}`}
    alt={image.filename}
    on:click={() => {}}
  />
  <div>{error}</div>
  <!-- svelte-ignore a11y-click-events-have-key-events -->
  <green-circle
    class="circle"
    class:hidden={error}
    class:ok={saved}
    class:is-saving={isSaving}
    on:click={() => {
      if (saved) {
        deleteImage()
      } else {
        backup()
      }
    }}>✓</green-circle
  >
  <!-- svelte-ignore a11y-click-events-have-key-events -->
  <red-circle
    class="circle"
    class:hidden={!error}
    on:click={() => {
      backup()
    }}>✗</red-circle
  >
  <div class="toolbar">
    <input
      type="button"
      value={`quality: ${query}`}
      class:hidden={query > 1024}
      on:click={() => (query *= 2)}
    />
  </div>
</div>

<style>
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: var(--border-radius);
  }

  .hidden {
    display: none;
  }

  .grid {
    display: grid;
    grid-template-rows: auto auto;
  }

  /* show toolbar when grid or a grid child has focus */
  .grid:not(:focus-within) > .toolbar {
    display: grid;
  }

  .toolbar {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    padding: 0.25em;
    gap: 0.5em;
  }

  .toolbar > input {
    font-size: 6pt;
    text-align: center;
    background-color: var(--background-color);
    color: var(--text-color);
    border: 1px solid var(--border-color);
    border-radius: var(--border-radius);
  }

  .toolbar > input:hover {
    box-shadow: 0 0 1cqw 0.1cqw white;
  }

  .circle {
    --size: 1.5em;
    width: var(--size);
    height: var(--size);
    border-radius: 50%;
    font-size: 0.5em;
    text-align: center;
    margin: 0;
    padding: 0;
    line-height: var(--size);
    position: absolute;
    right: 1em;
    top: 2em;
    cursor: pointer;
  }

  red-circle {
    background-color: red;
  }

  green-circle {
    outline: 1px solid rgba(0, 200, 0, 0.5);
    color: rgba(255, 255, 255, 0.5);
    background-color: rgba(255, 255, 255, 0.2);
  }

  green-circle:not(.ok):hover {
    outline: 1px solid white;
    color: white;
  }

  green-circle.ok {
    opacity: 1;
    background-color: rgba(0, 255, 0, 0.5);
    color: white;
    cursor: default;
  }

  green-circle.is-saving {
    animation-name: spin;
    animation-duration: 1s;
    animation-iteration-count: infinite;
    animation-timing-function: linear;
  }

  @keyframes spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
</style>
