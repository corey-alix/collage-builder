<script lang="ts">
  import { onMount } from "svelte"
  import Logo from "./Logo.svelte"
  import AlbumPanel from "./AlbumPanel.svelte"
  import Photo from "./Photo.svelte"

  import { signin, signout } from "./googleApi"

  import {
    listAllAlbums,
    loadAllPhotosByDate,
    loadMediaItem,
  } from "./googlePhotoApi"
  import DatePicker from "./DatePicker.svelte"
  import { backupImage, getBackupInfo, type PhotoInfo } from "./photoApi"

  let isSignedIn = false
  let albums: Array<gapi.client.photoslibrary.Album> = []

  let activePhotos: Array<gapi.client.photoslibrary.MediaItem>

  let photosByDate: Record<
    string,
    Array<gapi.client.photoslibrary.MediaItem>
  > = {}

  async function handleAuthClick() {
    await signin()
    isSignedIn = true
    albums = await listAllAlbums()
    uploadMissingPhotos()
  }

  function handleSignoutClick() {
    signout()
    isSignedIn = false
  }

  let selectedDate: string = ""

  async function loadByDate() {
    const [year, month, day] = selectedDate.split("-").map((s) => parseInt(s))

    const photos = await loadAllPhotosByDate([{ year, month, day }])
    activePhotos = photosByDate[`${year}.${month}.${day}`] = (
      photos || []
    ).reverse()
    photosByDate = photosByDate
  }

  let backupInfo: Array<PhotoInfo> | null = null

  function isSaved(image: gapi.client.photoslibrary.MediaItem): boolean {
    if (!backupInfo) return false
    const result = backupInfo.some((b) => b.filename == image.filename)
    console.log("isSaved", image.filename, result)
    return result
  }

  async function uploadMissingPhotos() {
    const missingPhotos = backupInfo.filter((p) => !p.cached)
    console.log("reloading missing photos in background", missingPhotos)
    if (missingPhotos.length == 0) return

    await signin()
    missingPhotos.forEach(async (p) => {
      const image = await loadMediaItem(p.id)
      backupImage(image)
    })
  }

  $: {
    selectedDate && localStorage.setItem("selected_date", selectedDate)
  }

  onMount(async () => {
    selectedDate = localStorage.getItem("selected_date") || ""
    backupInfo = await getBackupInfo()
    loadByDate()
  })

  function pad(n: number, width = 2, z = 0) {
    return (String(z).repeat(width) + String(n)).slice(String(n).length)
  }

  function gotoDay(dayOffset: number) {
    const [year, month, day] = selectedDate.split("-").map((s) => parseInt(s))
    const date = new Date(year, month - 1, day)
    date.setDate(date.getDate() + dayOffset)
    console.log(selectedDate, date, [year, month, day])
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(
      date.getDate()
    )}`
  }

  function gotoNextDate() {
    selectedDate = gotoDay(1)
    loadByDate()
  }

  function gotoPriorDate() {
    selectedDate = gotoDay(-1)
    loadByDate()
  }
</script>

<svelte:head>
  <title>just.be.collage</title>
  <meta name="description" content="Google Photos Integration" />
</svelte:head>

<section class="app">
  <div><Logo /></div>
  <section>
    <div class="sub-title">
      Collage Builder for <google>Google Photos</google>
    </div>
    <section class="toolbar">
      <input
        type="button"
        disabled={!isSignedIn}
        class="google_photos_button"
        value="Sign out from Google Photos"
        on:click={handleSignoutClick}
      />
      <input
        type="button"
        disabled={isSignedIn}
        class="google_photos_button"
        value="Connect to Google Photos"
        on:click={handleAuthClick}
      />
    </section>
  </section>
  {#if isSignedIn || true}
    <section class="workspace">
      <p>Load photos for a specific date</p>
      <div class="toolbar">
        <button on:click={gotoPriorDate}>Prior Date</button>
        <DatePicker on:change={loadByDate} bind:dateValue={selectedDate} />
        <button on:click={gotoNextDate}>Next Date</button>
      </div>
      {#if activePhotos}
        <div class="simple-grid">
          {#each activePhotos as image}
            <div class="relative">
              <Photo {image} saved={isSaved(image)} />
            </div>
          {/each}
        </div>
      {/if}
    </section>
  {/if}
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

  .sub-title {
    font-size: 3vw;
  }

  google {
    font-size: 2vw;
    font-display: swap;
  }

  input:disabled {
    display: none;
  }
</style>
