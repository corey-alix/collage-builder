import { PHOTO_API } from "./googleApi";

type PhotoInfo = {
    id: string;
    href: string;
};

async function whatFilesHaveBeenBackedUp() {
    const response = await fetch(`${PHOTO_API}/list`);
    return (await response.json()) as Array<PhotoInfo>;
}

async function backupImage(image: gapi.client.photoslibrary.MediaItem, quality = 1024) {
    const response = await fetch(
        `${PHOTO_API}/save?url=${image.baseUrl}=w${quality}&filename=${image.filename}`
    );
    return response.ok;
}
let backups: Array<PhotoInfo> = [];
export { backups, backupImage };
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
