const API_KEY = "AIzaSyDTmNCr5okFZBbKsCtBSkPL_KJ1-gnvv1c"
const CLIENT_ID =
    "164034047266-d9694hn1nmpm047bl7cbusqovq6s2ncp.apps.googleusercontent.com"
const SCOPES = "https://www.googleapis.com/auth/photoslibrary.readonly"
const DISCOVERY_DOC =
    "https://www.googleapis.com/discovery/v1/apis/photoslibrary/v1/rest"


export function authenticateUser() {
    const p = new Promise<void>((good, bad) => {
        gapi.load("client", async () => {
            try {
                gapi.client
                    .init({
                        apiKey: API_KEY,
                        discoveryDocs: [DISCOVERY_DOC],
                    })
                    .then((authResult) => {
                        good()
                    })
            } catch (ex) {
                bad(ex)
            }
        })
    })
    return p;
}

export function createTokenClient() {
    const p = new Promise<any>((good, bad) => {
        const tokenClient = google.accounts.oauth2.initTokenClient({
            client_id: CLIENT_ID,
            scope: SCOPES,
            callback: async (response: any) => {
                if (response.error) {
                    bad(response)
                } else {
                    good(tokenClient);
                }
            },
        })
        tokenClient.requestAccessToken({ prompt: "" })
    });

    return p;
}

export async function listAlbums() {
    const response = await gapi.client.photoslibrary.albums.list({
        pageSize: 20,
        fields: "albums(id,title)",
    })
    return response.result
}

export async function loadAlbum(albumId: string) {
    const response = await gapi.client.photoslibrary.albums.get({
        albumId,
    })
    return response.result
}

export async function loadMediaItems(album: gapi.client.photoslibrary.Album) {
    const response = await gapi.client.photoslibrary.mediaItems.search({
        resource: {
            pageSize: 10,
            albumId: album.id,
        },
    })
    return response.result
}

export async function loadMoreMediaItems(photoPanel: any) {
    return await gapi.client.photoslibrary.mediaItems.search({
        resource: {
            albumId: photoPanel.album.id,
            pageSize: 10,
            pageToken: photoPanel.nextPageToken,
        },
    })
}

export async function signout() {
    const token = gapi.client.getToken()
    if (token !== null) {
        google.accounts.oauth2.revoke(token.access_token)
        gapi.client.setToken(null)
    }

}