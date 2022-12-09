<script lang="ts">
  import { onMount } from "svelte"
  import Logo from "./Logo.svelte"
  import AlbumPanel from "./AlbumPanel.svelte"
  import Photo from "./Photo.svelte"
  import {
    authenticateUser,
    createTokenClient,
    listAllAlbums,
    loadAllPhotosByDate,
    signout,
  } from "./googleApi"
  import DatePicker from "./DatePicker.svelte"
  import { getBackupInfo, type PhotoInfo } from "./photoApi"

  $: isAuthorized = false
  let isGoogleApiInitialized = false
  let albums: Array<gapi.client.photoslibrary.Album> = []
  let photosByDate: Record<
    string,
    Array<gapi.client.photoslibrary.MediaItem>
  > = {}

  async function handleAuthClick() {
    await authenticateUser()
    isGoogleApiInitialized = true
    await createTokenClient()
    isAuthorized = true
    albums = await listAllAlbums()
  }

  function handleSignoutClick() {
    signout()
    isAuthorized = false
  }

  async function loadByDate(
    e: CustomEvent<{ year: number; month: number; day: number }>
  ) {
    const { year, month, day } = e.detail
    if (!year || !month || !day) {
      console.log("ignoring date", e.detail)
      return
    }
    const photos = await loadAllPhotosByDate([{ year, month, day }])
    photosByDate[`${year}.${month}.${day}`] = photos || []
    photosByDate = photosByDate
  }

  let backupInfo: Array<PhotoInfo> | null = null

  function isSaved(image: gapi.client.photoslibrary.MediaItem): boolean {
    if (!backupInfo) return false
    return backupInfo.some((b) => b.id == image.filename)
  }

  onMount(async () => {
    backupInfo = await getBackupInfo()
  })
</script>

<svelte:head>
  <title>just.be.collage</title>
  <meta name="description" content="Google Photos Integration" />
</svelte:head>

<section
  class="app"
  class:is-connected={isAuthorized}
  class:can-connect={isGoogleApiInitialized}
>
  <div class="if-not-connected"><Logo /></div>
  <section class="if-connected">
    <div class="sub-title">
      Collage Builder for <google>Google Photos</google>
    </div>
    <section class="toolbar">
      <input
        type="button"
        class="google_photos_button if-connected"
        value="Sign out from Google Photos"
        on:click={handleSignoutClick}
      />
    </section>
  </section>
  <section class="toolbar">
    <input
      type="button"
      class="google_photos_button if-not-connected"
      value="Connect to Google Photos"
      on:click={handleAuthClick}
    />
  </section>
  <section class="workspace if-connected">
    {#each Object.entries(photosByDate) as [date, images]}
      <p>{date}</p>
      <div class="simple-grid">
        {#each images as image}
          <div class="relative">
            <Photo {image} saved={isSaved(image)} />
          </div>
        {/each}
      </div>
    {/each}
    <DatePicker on:change={loadByDate} />
    <AlbumPanel {albums} />
  </section>
</section>

<style>
  @media (prefers-color-scheme: dark) {
    .workspace {
      background-color: #333;
    }
    .google_photos_button {
      background-color: var(--color-google-gray);
      color: #ccc;
    }
  }

  @media (prefers-color-scheme: light) {
    .workspace {
      background-color: #ccc;
    }
    .google_photos_button {
      background-color: var(--color-google-white);
      color: var(--color-google-gray);
    }
  }

  .workspace {
    width: 95vw;
    border: 1px solid white;
    border-radius: 1em;
    margin-top: 1em;
  }

  section {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    flex: 0.6;
  }

  .relative {
    position: relative;
  }

  .simple-grid {
    display: grid;
    grid-template-columns: repeat(6, 1fr);
    gap: 1em;
  }

  .toolbar {
    display: grid;
    grid-auto-flow: column;
    column-gap: 1em;
    flex-basis: 0;
  }

  .google_photos_button {
    --color-google-white: #ffffff;
    --color-google-gray: #3c4043;
    background-image: url(/google_photos_icon.png);
    background-repeat: no-repeat;
    background-position: 8px 8px;
    background-size: 24px 24px;
    padding-left: calc(8px + 24px + 16px);
    padding-right: 16px;
    height: 40px;
    border-radius: 4px;
  }

  .app:not(.is-connected) .if-connected,
  .app.is-connected .if-not-connected {
    display: none;
  }

  .sub-title {
    font-size: 3vw;
  }

  google {
    font-size: 2vw;
    font-display: swap;
  }
</style>
