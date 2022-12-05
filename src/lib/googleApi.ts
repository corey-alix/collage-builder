const API_KEY = "AIzaSyDTmNCr5okFZBbKsCtBSkPL_KJ1-gnvv1c"
const CLIENT_ID =
    "164034047266-d9694hn1nmpm047bl7cbusqovq6s2ncp.apps.googleusercontent.com"
const SCOPES = "https://www.googleapis.com/auth/photoslibrary.readonly"
const DISCOVERY_DOC =
    "https://www.googleapis.com/discovery/v1/apis/photoslibrary/v1/rest"


export class GoogleApi {
    authenticateUser() {
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

    createTokenClient() {
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
}