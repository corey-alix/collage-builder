<script lang="ts">
  import { backupImage } from "./googleApi"

  export let image: gapi.client.photoslibrary.MediaItem
  export let saved = true

  let query = 256
  let isBackup: "" | "ok" | "err" = ""

  $: if (saved) isBackup = "ok"
</script>

<!-- svelte-ignore a11y-no-noninteractive-tabindex -->
<div class="grid" tabindex="0">
  <!-- svelte-ignore a11y-label-has-associated-control -->
  <label class="image-caption">{image.filename} {isBackup || "unknown"}</label>
  <!-- svelte-ignore a11y-click-events-have-key-events -->
  <img
    src={`${image.baseUrl}=w${query}`}
    alt={image.filename}
    on:click={() => {}}
  />
  <!-- svelte-ignore a11y-click-events-have-key-events -->
  <green-circle
    class:hidden={isBackup == "err"}
    class:ok={isBackup == "ok"}
    on:click={async () => (saved = await backupImage(image))}>✓</green-circle
  >
  <red-circle class:hidden={isBackup !== "err"}>✗</red-circle>
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

  .image-caption {
    text-align: center;
    color: var(--text-color);
    font-size: 6pt;
    display: block;
    background-color: var(--background-color);
    overflow: hidden;
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
    display: none;
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
    width: 33cqw;
    background-color: var(--background-color);
    color: var(--text-color);
    border: 1px solid var(--border-color);
    border-radius: var(--border-radius);
  }

  .toolbar > input:hover {
    box-shadow: 0 0 1cqw 0.1cqw white;
  }

  red-circle {
    display: block;
    width: 2em;
    height: 2em;
    border-radius: 50%;
    background-color: red;
    font-size: 0.5em;
    text-align: center;
    margin: 0;
    padding: 0;
    line-height: 2em;
    position: absolute;
    right: 1em;
    top: 2em;
    opacity: 0.5;
  }

  green-circle {
    --size: 1.5em;
    display: block;
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
    border: 1px solid rgba(0, 200, 0, 0.5);
    color: rgba(255, 255, 255, 0.5);
    cursor: pointer;
  }

  green-circle.ok {
    opacity: 1;
    background-color: rgba(0, 255, 0, 0.5);
    color: white;
    cursor: default;
  }
</style>
