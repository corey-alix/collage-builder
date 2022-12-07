<script lang="ts">
  import Logo from "./Logo.svelte"
  import AlbumPanel from "./AlbumPanel.svelte"
  import Template from "./polygonTemplate.svelte"

  import {
    authenticateUser,
    createTokenClient,
    listAllAlbums,
    signout,
  } from "./googleApi"
  import PolygonTemplate from "./polygonTemplate.svelte"

  $: isAuthorized = false
  let isGoogleApiInitialized = false
  let albums: Array<gapi.client.photoslibrary.Album> = []

  let angle = 0

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

  function decay(start: number, end = 0) {
    const h = setInterval(() => {
      start -= 0.1
      if (start <= end) {
        clearInterval(h)
      }
    }, 1000)
    return start
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
  <h2>Select a Template</h2>
  <p>TODO: this will show some initial grid layout</p>
  <h2>Alternative Borders</h2>
  <p>Select the active image from one of these clippaths</p>
  <div>
    <div class="grid">
      <div class="template"><PolygonTemplate count={3} /></div>
      <div class="template"><PolygonTemplate count={3} angle={30} /></div>
      <div class="template"><PolygonTemplate count={3} angle={60} /></div>
      <div class="template"><PolygonTemplate count={3} angle={90} /></div>
      <div class="template"><PolygonTemplate count={4} /></div>
      <div class="template"><PolygonTemplate count={4} angle={45} /></div>
      <div class="template"><PolygonTemplate count={5} angle={-18} /></div>
      <div class="template"><PolygonTemplate count={5} angle={18} /></div>
      <div class="template">
        <PolygonTemplate
          count={6}
          {angle}
          fillColor="#d11"
          strokeColor="#ccc"
        />
      </div>
      <div class="template"><PolygonTemplate count={6} angle={30} /></div>
      <div class="template">
        <PolygonTemplate count={7} angle={180 / 7 / 2} />
      </div>
      <div class="template"><PolygonTemplate count={8} angle={22.5} /></div>
    </div>
    <input type="range" min="-90" max="90" bind:value={angle} />
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
  </div>
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

  .grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 0.5em;
  }

  .template {
    width: 64px;
  }
</style>
