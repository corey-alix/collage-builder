<script lang="ts">
  export let photoPanel: {
    album: gapi.client.photoslibrary.Album
  } & {
    mediaItems: Array<gapi.client.photoslibrary.MediaItem>
    nextPageToken: string
  }

  $: sortedImages = !photoPanel
    ? []
    : [...photoPanel.mediaItems].filter((a) => !!a.mediaMetadata.photo)

  async function loadMediaItems() {
    const response = await gapi.client.photoslibrary.mediaItems.search({
      resource: {
        albumId: photoPanel.album.id,
        pageSize: 10,
        pageToken: photoPanel.nextPageToken,
      },
    })
    photoPanel!.nextPageToken = response.result.nextPageToken || ""
    photoPanel!.mediaItems = <any>[
      ...photoPanel!.mediaItems,
      ...response.result.mediaItems!,
    ]
    return response.result
  }
</script>

<div class="grid">
  {#each sortedImages as image}
    <div
      class="grid-item"
      class:two-rows={image.mediaMetadata.height > image.mediaMetadata.width}
    >
      <!-- svelte-ignore a11y-label-has-associated-control -->
      <label class="image-caption">{image.filename}</label>
      <img src={image.baseUrl + "=w256"} alt={image.filename} />
    </div>
  {/each}
</div>
{#if photoPanel?.nextPageToken}
  <button class="more" on:click={() => loadMediaItems()}
    >Load more from <q>{photoPanel.album.title}</q></button
  >
{/if}

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
    padding: 1em;
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

  .grid-item > img {
    border-radius: var(--border-radius);
    width: 100%;
    max-height: 90vh;
    object-fit: contain;
  }

  .image-caption {
    text-align: center;
    color: var(--text-color);
    font-size: 6pt;
    display: block;
    background-color: var(--background-color);
    overflow: hidden;
  }

  .more {
    border-radius: var(--border-radius);
    height: max(5em, 100%);
    width: max(10em, 50%);
    align-self: center;
    padding: 1em;
    border: 1px solid var(--border-color);
  }

  .more:hover {
    box-shadow: 0 0 1cqw 0.1cqw white;
  }

  .two-rows {
    grid-row-start: span 2;
  }
</style>
