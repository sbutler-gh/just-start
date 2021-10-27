# Just Start

To run this project locally, clone the repository and run `npm install.`  Then:

1. Determine a source for your calendar eventSources and events.  Currently, the repository pulls these from a Supabase postgres table.  You can instead pull these URLs from a local source (e.g. local JSON data, hardcoded), or you can configure another source (e.g. your own Supabase table.)  If you opt to create a table in postgres and pull from that, you can see the default eventSources table configuration in `eventSourcesExample.csv`.

2. Create a .env file and enter your keys for the services connected.

```
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
VITE_GOOGLE_CALENDAR_API_KEY=
VITE_OPEN_CAGE_API_KEY=
VITE_AIR_NOW_KEY=
VITE_IP_INFO_KEY=
```

In terms of functionality, on page load, the application pulls the IP via an api request to api.ipify.org.  It then requests the coordinates of that IP from ipinfo (requires ipinfo token).

It then pulls the calendar eventSources from the Supabase table (requires Supabase credentials), pulls local air quality data from airnowapi.org (requires token), and pulls local community data from other Supabase tables (requires Supabase credentials).

After pulling the calendar eventSources, the FullCalendar component is initialized with those calendar sources.  Since this only works with @fullcalendar/googleCalendar for now, a Google Calendar API Key is also required.

When you use the input bar at the top of the application to update location, it sends the request to Open Cage (requires token).

When you "add a new event" or "share a calendar feed", those forms are currently configured to submit to the Supabase eventSources tables, which also requires Supabase credentials.

3. Once you have set-up those keys and the place where you'll pull / push eventSources, you can run `npm run dev` and the application should work locally.

4. For deployment, this repository currently uses the netlify adapter for deployment on netlify.  If you want to deploy using a different provider (e.g. Cloudflare), look up the appropriate adapter for SvelteKit.  It's easy to find this.

5. When deploying to Netlify (and other services), you may need to populate your environmental variables in the build settings for that service.  For Netlify and some others, you also may need to specify the environmental variable `NODE_VERSION = 14` in the build settings.