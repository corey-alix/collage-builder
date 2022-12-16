import { signin } from "./googleApi";

const GOOGLE_PHOTO_PAGE_SIZE = 25;

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

export async function loadMediaItem(mediaItemId: string) {
    const response = await gapi.client.photoslibrary.mediaItems.get({
        mediaItemId,
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
    await signin();
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

