<script>
    import { onMount } from "svelte";
    import { variables } from '$lib/variables';

    // Defining a variable to accept the fetched call from database later.

    let preview_address = {};

    let address;

    let cal_coordinates;

    let submission;

    let organization;

    let org_url;

    let calendar_url;

    async function getCalendarCoordinates(address) {
    const request = await fetch(`https://api.opencagedata.com/geocode/v1/json?key=${variables.openCage}&q=${encodeURI(address)}`);    
    const json = await request.json()
    console.log(json);
    console.log(json?.results[0]?.geometry);

    cal_coordinates = json?.results[0]?.geometry;

    let components = json?.results[0].components;

    if (components?.city) {
        preview_address.city = components.city
    }
    else if (components?.town) {
        preview_address.city = components.town
    }
    else if (components?.municipality) {
        preview_address.city = components.municipality
    }
    else if (components?.county) {
        preview_address.city = components.county
    }

    // preview_address.city = json?.results[0].components.county;
    preview_address.state_province = json?.results[0].components?.state_code;
    preview_address.country = json?.results[0].components?.country;
    preview_address.coordinates = json?.results[0]?.geometry;

    return(json?.results[0]?.geometry);
}

    async function previewOrganizationAddress() {
        console.log(address);
        const request = await fetch(`https://api.opencagedata.com/geocode/v1/json?key=${variables.openCage}&q=${encodeURI(address)}`);    
        const json = await request.json()
        console.log(json);

        let components = json?.results[0].components;

        if (components?.city) {
            preview_address.city = components.city
        }
        else if (components?.town) {
            preview_address.city = components.town
        }
        else if (components?.municipality) {
            preview_address.city = components.municipality
        }
        else if (components?.county) {
            preview_address.city = components.county
        }

        // preview_address.city = json?.results[0].components.county;
        preview_address.state_province = json?.results[0].components?.state_code;
        preview_address.country = json?.results[0].components?.country;
        preview_address.coordinates = json?.results[0]?.geometry;
    }

async function shareCalendarFeed(e) {

var formData = new FormData(e.target);
console.log([...formData]);

getCalendarCoordinates(formData.get('address'))
.then(async () => {

    console.log(cal_coordinates);
    formData.append('cal_coordinates', JSON.stringify(cal_coordinates));
    formData.append('city', preview_address.city);
    formData.append('state_province', preview_address.state_province);
    formData.append('country', preview_address.country);

    // formData.append('city', );

    let response = await fetch ('insert_event_source', {
        method: "post",
        body: formData
    })

if (response) {
    let data = await response.json();

    console.log(data);

    // let api = calendar.getAPI();

    // // When FullCalendar attempts to load this new URL immediately, the get request will fail (You will see it in console.log)
    // // Upon refreshing the page, the calendar should be showing as expected.  Make sure you put a real city name or address in the location field when testing, because the application generates coordinates from that location string — so you will only see it for your location on page load, if it's a location/address/string that returns coordinates around you.

    // api.addEventSource(formData.get('url'));

    preview_address = {};

    submission = data.data[0];
    console.log(submission);

    organization = "";
    org_url = "";
    address = "";
    calendar_url = "";
    
}
else {
    console.log('error adding calendar, try again');
    submission = "Error_Calendar";
}

})
}

</script>

<!-- Want to preview to make sure address looks okay. -->
<div class="text-left p-4">
<h3 class="text-bold text-xl mb-2">Add new calendar feed</h3>
<p class="">Enter the fields below and click <strong>Add Calendar</strong>.  If successful, the events from your calendar will be displayed with other local events, when people load nearby locations.</p>

<div class="rounded-md border-2 mt-4 p-2 w-12/12 md:w-7/12 mb-2">
    <form on:submit|preventDefault={shareCalendarFeed} class="text-left">
        <label class="text-sm" for="organization">Organization Name</label><br/>
        <input name="organization" bind:value={organization} type="text" class="border-2 w-full mb-4 rounded-md h-8 p-1"/>
        <br>

        <label class="text-sm" for="org_url">Organization Website URL</label><br/>
        <input name="org_url" bind:value={org_url} type="text" class="border-2 w-full mb-4 rounded-md h-8 p-1"/>
        <br>

        <label class="text-sm" for="url">Calendar URL</label><br/>
        <label class="text-xs" for="url">A URL for a Google Calendar or an ICS/Ical calendar.  If using Google, this could look like <em>[youraccount]@gmail.com</em> or <em>[calendarid]@group.calendar.google.com</em> — if sharing an ICS/Ical calendar, it should end in <em>.ics</em></label><br/>
        <input name="url" bind:value={calendar_url} type="text" class="border-2 w-full mb-4 rounded-md h-8 p-1"/>
        <br>

        <label class="text-sm" for="cal_format">Calendar Type</label><br/>
        <input name="cal_format" type="radio" value="google"> <label>Google</label>
        <input class="ml-4" name="cal_format" type="radio" value="ical"> <label>ICAL</label>

        <br>

        <label class="text-sm" for="address">Organization Address</label><br/>
        <label class="text-xs" for="address">Enter an address for your organization, so this calendar can be shown to people in nearby locations.</label><br/>
        <input name="address" bind:value={address} type="text" class="border-2 w-full mb-4 rounded-md h-8 p-1"/>
        <br>
        <button type="button" on:click={previewOrganizationAddress} class="underline cursor-pointer text-blue-700 text-left block">Verify Address</button>
        {#if preview_address?.coordinates}
            <ul>
                <li>City: {preview_address.city}</li>
                <li>State/Province: {preview_address.state_province}</li>
                <li>Country: {preview_address.country}</li>
                <li>Coordinates: {JSON.stringify(preview_address.coordinates)}</li>
            </ul>
        {/if}
        <button type="submit" class="mt-2 mb-2 rounded-full shadow bg-blue-200 px-2 py-1 text-right block ml-auto">Add Calendar</button>
        <p class="text-xs text-gray-500 text-right">You affirm this data is publically accessible or you have permission to share it, and you agree to the <a href="docs/terms" class="underline">terms of service</a>.</p>
        {#if submission}
        <div class="text-right">
        <svg on:click={function() { submission = ""}} xmlns="http://www.w3.org/2000/svg" class="cursor-pointer block ml-auto icon icon-tabler icon-tabler-x" width="28" height="28" viewBox="0 0 24 24" stroke-width="1.5" stroke="#000000" fill="none" stroke-linecap="round" stroke-linejoin="round">
            <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        <p class="text-green-700">Successfully submitted entry!  Here are the contents:</p>
        <p>Organization: {submission.organization}</p>
        <p>Organization URL: {submission.org_url}</p>
        <p>Organization Calendar URL: {submission.url}</p>
        <ul>
            <li>City: {submission.city}</li>
            <li>State/Province: {submission.state_province}</li>
            <li>Country: {submission.country}</li>
            <li>Coordinates: {JSON.stringify(submission.coordinates)}</li>
        </ul>
        </div>
        {:else if submission == "Error"}
        <p class="text-red-700 text-right">Error submitting these contents.  Please try again.</p>
        {/if}
    </form>
    </div>
</div>
