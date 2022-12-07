<script lang="ts">
  export let image: gapi.client.photoslibrary.MediaItem
  let query = "=w256"
</script>

<!-- svelte-ignore a11y-label-has-associated-control -->
<label class="image-caption">{image.filename}</label>
<!-- svelte-ignore a11y-click-events-have-key-events -->
<img
  src={image.baseUrl + query}
  alt={image.filename}
  on:click={() => {
    query = "=w512"
  }}
/>

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
</style>
