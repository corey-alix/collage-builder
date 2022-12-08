const PHOTO_API = "http://localhost:5000/Photo"
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

export async function listAllAlbums() {
    let { albums, nextPageToken } = await listAlbums();
    while (nextPageToken) {
        const moreAlbums = await listAlbums(nextPageToken);
        albums.splice(albums.length, 0, ...moreAlbums.albums);
        nextPageToken = moreAlbums.nextPageToken;
    }
    return albums;
}

export async function listAlbums(pageToken?: string) {
    const response = await gapi.client.photoslibrary.albums.list({
        pageToken
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

export async function loadPhotos(albumId: string, pageToken?: string) {
    return await gapi.client.photoslibrary.mediaItems.search({
        resource: {
            albumId,
            pageSize: 10,
            pageToken,
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

type PhotoInfo = {
    id: string
    href: string
}

async function whatFilesHaveBeenBackedUp() {
    const response = await fetch(`${PHOTO_API}/list`)
    return (await response.json()) as Array<PhotoInfo>
}

async function backupImage(image: gapi.client.photoslibrary.MediaItem, quality = 1024) {
    const response = await fetch(
        `${PHOTO_API}/save?url=${image.baseUrl}=w${quality}&filename=${image.filename}`
    )
    return response.ok;
}


let backups: Array<PhotoInfo> = [];
export { backups, backupImage }

retryUntilSuccessful(async () => backups = await whatFilesHaveBeenBackedUp());

function retryUntilSuccessful<T>(cb: () => Promise<T>, interval = 1000 * 30, maxRetries = 10) {
    const p = new Promise<T>((good, bad) => {
        const h = setInterval(async () => {
            try {
                const result = await cb();
                clearInterval(h);
                good(result);
            } catch (ex) {
                console.log(ex);
                maxRetries--;
                if (maxRetries <= 0) {
                    bad("Max retries exceeded");
                    clearInterval(h);
                    return;
                }
            }
        }, interval);
    });
    return p;
}
