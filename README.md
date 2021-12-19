# miniflux-to-reader

Grabs the saved articles from your [Miniflux](https://github.com/miniflux/v2) account and saves them into [Reader](https://readwise.io/read) (from [Readwise](https://readwise.io/)). Once saved, the script will remove from saved in Miniflux too to clean up and reduce processing on future runs.

## Motivation
I use [Unread](https://www.goldenhillsoftware.com/unread/) on iOS to process the RSS feeds I follow and wanted an easy way to save to Reader that cut out Instapaper while still being easy to save.

## Deployment
To deploy this:
- Create a [Cloud Function](https://cloud.google.com/functions) in GCP
- Copy the settings in `cloudbuild.yaml` (line 6 is specific to my deployment)
- Generate a [Readwise token](https://readwise.io/access_token)
- Generate a [Miniflux token](https://miniflux.app/docs/api.html#authentication)
- Add tokens to setup steps (yes, this isn't ideal but for a quick POC I wasn't going to take the time to setup a connection to [Secret Manager](https://cloud.google.com/secret-manager) which isn't natively supported in Cloud Functions)
- Deploy!
- Create a [Cloud Scheduler](https://cloud.google.com/scheduler/) cron to run as often as you need
- Use the HTTPS url for the Cloud Function as the action
