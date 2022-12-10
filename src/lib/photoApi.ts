// save to localStorage
function save(id: string, data: any) {
    localStorage.setItem(id, JSON.stringify(data));
}

// load from localStorage
function load(id: string) {
    const data = localStorage.getItem(id);
    if (data) {
        return JSON.parse(data);
    }
    return null;
}

// prompt user for a value that was not found in local storage
function promptForValue(id: string, title: string) {
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
    href: string;
};

async function whatFilesHaveBeenBackedUp() {
    const PHOTO_API = promptForPhotoApi("I cannot determine what has been backup up. What is the Photo Server URL?");
    if (!PHOTO_API) throw "No photo api";
    const response = await fetch(`${PHOTO_API}/list`);
    return (await response.json()) as Array<PhotoInfo>;
}

async function backupImage(image: gapi.client.photoslibrary.MediaItem, quality = 1024) {
    const PHOTO_API = promptForPhotoApi("I cannot backup photos withour a Photo Server URL. What is the Photo Server URL?");
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
    const url = `${PHOTO_API}/save`;
    const queryString = Object.keys(data).filter(k => typeof data[k] != "undefined").map(key => key + '=' + data[key]).join('&');
    const response = await fetch(`${url}?${queryString}`);
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

export { getBackupInfo, backupImage };
