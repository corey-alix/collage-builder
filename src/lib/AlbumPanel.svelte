<script lang="ts">
  import { createEventDispatcher } from "svelte"
  import { loadAlbum } from "./googleApi"
  export let albums: Array<gapi.client.photoslibrary.Album> = []
  const dispatch = createEventDispatcher()
  let loaded = new Set<string>()
</script>

<div class="grid">
  {#each albums as album, index}
    <div class="albumPanel" class:loaded={loaded.has(album.id)}>
      <!-- svelte-ignore a11y-click-events-have-key-events -->
      <div class="thumbnail">
        <img
          src={album.coverPhotoBaseUrl}
          alt={album.title}
          on:click={() => {
            dispatch("loadMediaItems", { album })
            loaded.add(album.id)
            loaded = loaded
          }}
        />
      </div>
      <div>{album.title}</div>
    </div>
  {/each}
</div>

<style>
  * {
    box-sizing: border-box;
  }

  @media (prefers-color-scheme: dark) {
    * {
      --background-color: #222;
      --border-color: #eee;
      --text-color: #ccc;
    }
  }

  @media (min-width: 256px) {
    .grid {
      --column-count: 1;
    }
  }

  @media (min-width: 512px) {
    .grid {
      --column-count: 3;
    }
  }

  @media (min-width: 1024px) {
    .grid {
      --column-count: 5;
    }
  }

  .grid {
    display: grid;
    grid-template-columns: repeat(var(--column-count), 1fr);
    padding: 1em;
    row-gap: 1em;
    column-gap: 1em;
    width: 100%;
  }

  .albumPanel {
    display: grid;
    grid-template-rows: 10rem 2rem;
    text-align: center;
    border: 6px solid var(--border-color);
    border-radius: 3px;
    background-color: var(--background-color);
    height: 100qcw;
  }

  .albumPanel.loaded {
    display: none;
  }

  .thumbnail {
    padding: 3px;
  }

  .thumbnail.unloaded {
    position: relative;
    container-type: inline-size;
  }

  .thumbnail.unloaded div {
    position: absolute;
    bottom: calc(50% - 15cqw);
    left: calc(50% - 15cqw);
    outline: 1px solid var(--border-color);
    width: 30cqw;
    height: 30cqw;
    padding-top: 10cqw;
    border-radius: 50%;
    font-size: 10cqw;
    cursor: pointer;
  }

  .thumbnail.unloaded:hover div {
    outline: 2px solid white;
    box-shadow: 0.5cqw -0.2cqh 4cqw 2cqw white;
    padding-top: 7.5cqw;
    font-size: 15cqw;
  }

  .thumbnail > img {
    height: 100%;
    width: 100%;
    object-fit: cover;
    cursor: pointer;
  }
</style>
