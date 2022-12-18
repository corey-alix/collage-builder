<script lang="ts">
  import { loadPhotosByAlbum } from "./googlePhotoApi"
  import Photo from "./Photo.svelte"
  import { getBackupInfo } from "./photoApi"
  import type { PhotoInfo } from "./photoApi"
  import { onMount } from "svelte"

  export let album: gapi.client.photoslibrary.Album
  let nextPageToken = ""
  let mediaItems: Array<gapi.client.photoslibrary.MediaItem> = []

  async function loadMediaItems() {
    const response = await loadPhotosByAlbum(album.id, nextPageToken)
    nextPageToken = response.result.nextPageToken || ""
    mediaItems = [...mediaItems, ...response.result.mediaItems!]
    return response.result
  }

  let backupInfo: Record<string, PhotoInfo> = {}

  $: sortedImages = [...mediaItems].filter((a) => !!a.mediaMetadata.photo)
  $: {
    album && loadMediaItems()
  }

  onMount(async () => {
    const photoList = await getBackupInfo()
    backupInfo = photoList.reduce((acc, photo) => {
      acc[photo.id] = photo
      return acc
    }, {} as Record<string, PhotoInfo>)

    console.log(backupInfo)
  })
</script>

<div class="grid">
  <q class="span-all-columns">{album.title}</q>
  {#each sortedImages as image}
    <!-- svelte-ignore a11y-no-noninteractive-tabindex -->
    <div
      class="grid-item"
      class:two-rows={image.mediaMetadata.height > image.mediaMetadata.width}
    >
      <div>
        <Photo {image} saved={!!backupInfo[image.id]?.cached} />
      </div>
    </div>
  {/each}
  {#if nextPageToken}
    <button class="more" on:click={() => loadMediaItems()}
      >Load more from <q>{album.title}</q></button
    >
  {/if}
</div>

<style>
  * {
    box-sizing: border-box;
    --border-radius: 3px;
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
    row-gap: 1em;
    column-gap: 1em;
    width: 100%;
  }

  .grid-item {
    border-radius: var(--border-radius);
    outline: 1px solid var(--border-color);
    background-color: var(--background-color);
    padding: 3px;
    container-type: inline-size;
  }

  .grid-item > div {
    border-radius: var(--border-radius);
    width: 100%;
    max-height: 90vh;
    object-fit: contain;
  }

  .grid-item:hover,
  .grid-item:focus-within {
    outline: 3px solid var(--border-color);
  }

  .more {
    border-radius: var(--border-radius);
    height: max(5em, 100%);
    width: max(10em, 50%);
    align-self: center;
    padding: 1em;
    border: 1px solid var(--border-color);
    grid-column-start: 1;
  }

  .more:hover {
    box-shadow: 0 0 1cqw 0.1cqw white;
  }

  .two-rows {
    grid-row-start: span 2;
  }

  .span-all-columns {
    grid-column-start: span var(--column-count);
  }
</style>
