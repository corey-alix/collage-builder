const GOOGLE_PHOTO_PAGE_SIZE = 25;
const API_KEY = "AIzaSyDTmNCr5okFZBbKsCtBSkPL_KJ1-gnvv1c"
const CLIENT_ID =
    "164034047266-d9694hn1nmpm047bl7cbusqovq6s2ncp.apps.googleusercontent.com"
const SCOPES = "https://www.googleapis.com/auth/photoslibrary.readonly"
const DISCOVERY_DOC =
    "https://www.googleapis.com/discovery/v1/apis/photoslibrary/v1/rest"


export function sleep(duration: number) {
    return new Promise<void>((good, bad) => {
        setTimeout(() => good(), duration)
    })
}

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


export async function loadAllPhotosByAlbum(albumId: string, pageToken?: string) {
    const response = await loadPhotosByAlbum(albumId, pageToken);
    if (response.status !== 200) {
        throw new Error("Error loading photos")
    }
    let { mediaItems, nextPageToken } = response.result;
    while (nextPageToken) {
        const morePhotos = await loadPhotosByAlbum(albumId, nextPageToken);
        if (morePhotos.status !== 200) {
            throw new Error("Error loading photos")
        }
        mediaItems.splice(mediaItems.length, 0, ...morePhotos.result.mediaItems);
        nextPageToken = morePhotos.result.nextPageToken;
    }
    return mediaItems;
}

export async function loadAllPhotosByDate(dates: Array<{ year: number, month: number, day: number }>, pageToken?: string) {
    const response = await loadPhotosByDate(dates, pageToken);
    if (response.status !== 200) {
        throw new Error("Error loading photos")
    }
    let { mediaItems, nextPageToken } = response.result;
    while (nextPageToken) {
        const morePhotos = await loadPhotosByDate(dates, nextPageToken);
        if (morePhotos.status !== 200) {
            throw new Error("Error loading photos")
        }
        if (morePhotos.result.mediaItems) {
            mediaItems.splice(mediaItems.length, 0, ...morePhotos.result.mediaItems);
        }
        nextPageToken = morePhotos.result.nextPageToken;
    }
    return mediaItems;
}

export async function loadPhotosByAlbum(albumId: string, pageToken?: string) {
    return await gapi.client.photoslibrary.mediaItems.search({
        resource: {
            albumId,
            pageSize: GOOGLE_PHOTO_PAGE_SIZE,
            pageToken,
        },
    })
}

/**
"{
  "error": {
    "code": 400,
    "message": "Searching for items in chronological order only works with DateFilter.",
    "status": "INVALID_ARGUMENT"
  }
}
" * 
 */
export async function loadPhotosByDate(dates: Array<{ year: number, month: number, day: number }>, pageToken?: string) {
    if (!gapi.client) {
        await authenticateUser()
        await createTokenClient()
        await sleep(300);
        return loadPhotosByDate(dates, pageToken);
    }
    return await gapi.client.photoslibrary.mediaItems.search({
        resource: {
            //albumId,
            pageSize: GOOGLE_PHOTO_PAGE_SIZE,
            pageToken,
            filters: {
                mediaTypeFilter: {
                    mediaTypes: ["PHOTO"],
                },
                dateFilter: {
                    dates
                }
            },
            //@ts-ignore: orderBy is not in the type definition
            // I cannot get the other direction (asc) to work, excluting also returns in desc.
            //orderBy: "MediaMetadata.creation_time desc",
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


