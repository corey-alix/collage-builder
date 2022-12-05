<script lang="ts">
  import { createEventDispatcher } from "svelte"
  export let albums: Array<gapi.client.photoslibrary.Album> = []
  const dispatch = createEventDispatcher()

  async function loadAlbum(id: string) {
    const response = await gapi.client.photoslibrary.albums.get({
      albumId: id,
    })
    return response.result
  }
</script>

<div class="grid">
  {#each albums as album, index}
    <div class="albumPanel">
      <!-- svelte-ignore a11y-click-events-have-key-events -->
      {#if album.coverPhotoBaseUrl}
        <div class="thumbnail">
          <img
            src={album.coverPhotoBaseUrl}
            alt={album.title}
            on:click={() => {
              album.coverPhotoBaseUrl = ""
              dispatch("unloadMediaItems", { album })
            }}
          />
        </div>
      {/if}
      {#if !album.coverPhotoBaseUrl}
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <div
          class="thumbnail unloaded"
          on:click={async () => {
            if (!album.coverPhotoBaseUrl) {
              const response = loadAlbum(album.id)
              album.coverPhotoBaseUrl = (await response).coverPhotoBaseUrl || ""
              dispatch("loadMediaItems", { album })
            }
          }}
        >
          <div>{index}</div>
        </div>
      {/if}
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
    font-size: 0.7cqw;
    height: 100qcw;
  }

  .thumbnail {
    padding: 3px;
  }

  .thumbnail.unloaded {
    font-size: 1cqw;
    position: relative;
    container-type: inline-size;
  }

  .thumbnail.unloaded div {
    position: absolute;
    bottom: calc(50% - 15cqw);
    left: calc(50% - 15cqw);
    border: 1px solid white;
    width: 30cqw;
    height: 30cqw;
    padding-top: 10cqw;
    border-radius: 50%;
  }

  .thumbnail.unloaded div:hover {
    box-shadow: 0 0 2px 2px white;
    cursor: pointer;
  }

  .thumbnail > img {
    height: 100%;
    width: 100%;
    object-fit: cover;
    cursor: pointer;
  }
</style>
