<script lang="ts">
  import Logo from "./Logo.svelte"
  import PhotoPanel from "./PhotoPanel.svelte"
  import AlbumPanel from "./AlbumPanel.svelte"

  // where to put these?
  const API_KEY = "AIzaSyDTmNCr5okFZBbKsCtBSkPL_KJ1-gnvv1c"
  const CLIENT_ID =
    "164034047266-d9694hn1nmpm047bl7cbusqovq6s2ncp.apps.googleusercontent.com"
  const SCOPES = "https://www.googleapis.com/auth/photoslibrary.readonly"
  const DISCOVERY_DOC =
    "https://www.googleapis.com/discovery/v1/apis/photoslibrary/v1/rest"

  let tokenClient = null as any
  $: gapiInited = false
  $: gisInited = false
  $: isAuthorized = false
  let albums: Array<gapi.client.photoslibrary.Album> = []
  let photoPanels: Array<{
    album: gapi.client.photoslibrary.Album
    mediaItems: Array<gapi.client.photoslibrary.MediaItem>
    nextPageToken: string
  }> = []

  async function handleAuthClick() {
    const p = new Promise<void>((good, bad) => {
      gapi.load("client", async () => {
        try {
          gapi.client
            .init({
              apiKey: API_KEY,
              discoveryDocs: [DISCOVERY_DOC],
            })
            .then((authResult) => {
              gapiInited = true
              good()
            })
        } catch (ex) {
          bad(ex)
        }
      })
    })

    tokenClient = google.accounts.oauth2.initTokenClient({
      client_id: CLIENT_ID,
      scope: SCOPES,
      callback: async (response: any) => {
        if (response.error) {
          throw response
        }
        isAuthorized = true
        const data = await listAlbums()
        albums = <any>data.albums
      },
    })

    await p

    tokenClient.requestAccessToken({ prompt: "" })
  }

  function handleSignoutClick() {
    const token = gapi.client.getToken()
    if (token !== null) {
      google.accounts.oauth2.revoke(token.access_token)
      gapi.client.setToken(null)
    }
    isAuthorized = false
  }

  async function listAlbums() {
    const response = await gapi.client.photoslibrary.albums.list({
      pageSize: 20,
      fields: "albums(id,title)",
    })
    return response.result
  }

  async function loadMediaItems(album: gapi.client.photoslibrary.Album) {
    const response = await gapi.client.photoslibrary.mediaItems.search({
      resource: {
        pageSize: 10,
        albumId: album.id,
      },
    })
    return response.result
  }

  function addToPhotoPanels(
    album: gapi.client.photoslibrary.Album,
    response: any
  ) {
    photoPanels = [...photoPanels, { album, ...response }]
  }
</script>

<svelte:head>
  <title>just.be.collage</title>
  <meta name="description" content="Google Photos Integration" />
</svelte:head>

<section
  class="app"
  class:is-connected={isAuthorized}
  class:can-connect={gisInited && gapiInited}
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
    {#each photoPanels as photoPanel}
      <PhotoPanel {photoPanel} />
    {/each}
    <AlbumPanel
      {albums}
      on:unloadMediaItems={async (event) => {
        // remove album
        const albumToRemove = event.detail.album
        photoPanels = photoPanels.filter((p) => p.album !== albumToRemove)
      }}
      on:loadMediaItems={async (event) => {
        const response = await loadMediaItems(event.detail.album)
        addToPhotoPanels(event.detail.album, response)
      }}
    />
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
