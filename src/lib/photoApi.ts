// save to localStorage
function save(id: string, data: any) {
    localStorage.setItem(id, JSON.stringify(data));
}

// load from localStorage
function load(id: string): string | null {
    const data = localStorage.getItem(id);
    if (data) {
        return JSON.parse(data);
    }
    return null;
}

// prompt user for a value that was not found in local storage
function promptForValue(id: string, title: string): string {
    let value = load(id);
    if (value === null) {
        value = prompt(title);
        save(id, value);
    }
    return value;
}

function promptForPhotoApi(title = "What is the Photo Server URL?") {
    return promptForValue("PhotoServerUrl", title);
}

export type PhotoInfo = {
    id: string;
    filename: string;
    created: string;
    width: number;
    height: number;
    cached: boolean;
};

async function whatFilesHaveBeenBackedUp() {
    const PHOTO_API = promptForPhotoApi("I cannot determine what has been backup up. What is the Photo Server URL?");
    if (!PHOTO_API) throw "No photo api";
    const response = await fetch(`${PHOTO_API}/photo/list`);
    return (await response.json()) as Array<PhotoInfo>;
}

async function backupImage(image: gapi.client.photoslibrary.MediaItem) {
    const PHOTO_API = promptForPhotoApi("I cannot backup photos without a Photo Server URL. What is the Photo Server URL?");
    if (!PHOTO_API) throw "No photo api";
    const data = {
        id: image.id,
        url: image.baseUrl,
        filename: image.filename,
        created: image.mediaMetadata.creationTime,
        width: image.mediaMetadata.width,
        height: image.mediaMetadata.height,
        description: image.description,
    }
    const url = `${PHOTO_API}/photo/save`;
    const queryString = Object.keys(data).filter(k => typeof data[k] != "undefined").map(key => key + '=' + data[key]).join('&');
    const response = await fetch(`${url}?${queryString}`);
    if (!response.ok) {
        console.log("Error backing up image", response);
        throw "Error backing up image";
    }
    return response.ok;
}

async function removeImage(image: gapi.client.photoslibrary.MediaItem) {
    const PHOTO_API = promptForPhotoApi("I cannot backup photos without a Photo Server URL. What is the Photo Server URL?");
    if (!PHOTO_API) throw "No photo api";
    const url = `${PHOTO_API}/photo/delete`;
    const response = await fetch(`${url}?id=${image.id}`);
    if (!response.ok) {
        console.log("Error removing image", response);
        throw "Error removing image";
    }
    return response.ok;
}

function retryUntilSuccessful<T>(cb: () => Promise<T>, interval = 1000 * 30, maxRetries = 10) {
    const p = new Promise<T>((good, bad) => {
        const doit = async () => {
            try {
                const result = await cb();
                good(result);
            } catch (ex) {
                console.log(ex);
                maxRetries--;
                if (maxRetries <= 0) {
                    bad("Max retries exceeded");
                    return;
                }
                await new Promise((resolve) => setTimeout(resolve, interval));
                doit();
            }
        };
        doit();
    });
    return p;
}

let backups: Array<PhotoInfo> | null = null;
async function getBackupInfo() {
    if (backups) return backups;
    console.log("Getting backup info");
    backups = await retryUntilSuccessful(whatFilesHaveBeenBackedUp, 1000);
    console.log("Got backup info")
    return backups;
}

export { getBackupInfo, backupImage, removeImage };
