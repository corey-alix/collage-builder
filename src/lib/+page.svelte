<script lang="ts">
  import Logo from "./Logo.svelte";
  import AlbumPanel from "./AlbumPanel.svelte";
  import {
    authenticateUser,
    createTokenClient,
    listAllAlbums,
    signout,
  } from "./googleApi";

  import { createSvgPolygon } from "./pageGenerator";
  $: isAuthorized = false;
  let isGoogleApiInitialized = false;
  let albums: Array<gapi.client.photoslibrary.Album> = [];
  let svgPoly = createSvgPolygon(6, {angle: 30, radius: 50});

  async function handleAuthClick() {
    await authenticateUser();
    isGoogleApiInitialized = true;
    await createTokenClient();
    isAuthorized = true;
    albums = await listAllAlbums();
  }

  function handleSignoutClick() {
    signout();
    isAuthorized = false;
  }
</script>

<svelte:head>
  <title>just.be.collage</title>
  <meta name="description" content="Google Photos Integration" />
</svelte:head>

<section>
  <svg width="0" height="0">
    <defs>
      <clipPath id="clip">
        <path d="{svgPoly}" />
      </clipPath>
    </defs>
  </svg>
  <svg width="100" height="100">
    <path id="path" d="{svgPoly}" fill="white" stroke="black" stroke-width="2" />
    <path id="path2" d="{createSvgPolygon(6, {angle: 0, radius: 50})}" fill="rgb(20,20,20,0.5)" stroke="black" stroke-width="2" />
  </svg>
</section>
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
</style>
