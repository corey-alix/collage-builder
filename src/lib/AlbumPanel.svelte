<script lang="ts">
  import PhotoPanel from "./PhotoPanel.svelte"
  export let albums: Array<gapi.client.photoslibrary.Album> = []
  let loaded = new Set<string>()
</script>

<div class="grid">
  {#each albums as album}
    <div class="span-all-columns" class:loaded={loaded.has(album.id)}>
      {#if loaded.has(album.id)}
        <PhotoPanel {album} />
      {/if}
    </div>
    <div tabIndex="0" class="albumPanel" class:loaded={loaded.has(album.id)}>
      <!-- svelte-ignore a11y-click-events-have-key-events -->
      <div class="thumbnail">
        <img
          src={album.coverPhotoBaseUrl}
          alt={album.title}
          on:click={() => {
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

  .span-all-columns:not(.loaded) {
    display: none;
  }
  .span-all-columns {
    grid-column-start: span var(--column-count);
  }

  .albumPanel {
    display: grid;
    grid-template-rows: 10rem 2rem;
    text-align: center;
    border: 3px solid var(--border-color);
    border-radius: 3px;
    background-color: var(--background-color);
    height: 100qcw;
  }

  .albumPanel:focus {
    outline: 3px solid var(--border-color);
  }

  .albumPanel.loaded {
    display: none;
  }

  .thumbnail {
    padding: 3px;
  }

  .thumbnail > img {
    height: 100%;
    width: 100%;
    object-fit: cover;
    cursor: pointer;
  }
</style>
