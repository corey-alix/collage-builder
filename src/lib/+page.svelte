<script lang="ts">
  import Logo from "./Logo.svelte"
  import PhotoPanel from "./PhotoPanel.svelte"
  import AlbumPanel from "./AlbumPanel.svelte"
  import {
    authenticateUser,
    createTokenClient,
    listAllAlbums,
    loadMediaItems,
    signout,
  } from "./googleApi"

  $: isAuthorized = false
  let isGoogleApiInitialized = false
  let albums: Array<gapi.client.photoslibrary.Album> = []

  ;(async function () {
    await authenticateUser()
    isGoogleApiInitialized = true
  })()

  async function handleAuthClick() {
    await createTokenClient()
    isAuthorized = true
    albums = await listAllAlbums()
  }

  function handleSignoutClick() {
    signout()
    isAuthorized = false
  }
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
    width: 75vw;
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
