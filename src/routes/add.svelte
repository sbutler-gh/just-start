<script>
    import { onMount } from "svelte";
    import { variables } from '$lib/variables';
import AddCalendar from "$lib/components/AddCalendar.svelte";

    // Defining a variable to accept the fetched call from database later.
    let eventSources;

    let preview_address = {};

    let address;

    let cal_coordinates;

    let submission;

    let organization;

    let org_url;

    let calendar_url;

    // On page load, run the loadEventSourcesTable function.
    onMount( async () => {
        loadEventSourcesTable();
    });

    async function loadEventSourcesTable() {
        
        // Fetch all of the contents of the eventSources table in the database
        const response = await fetch('/fetch_event_sources');

        let events = await response.json();

         // Set eventSources equal to the response

        eventSources = events.data;

        eventSources.sort(function(a, b) {
        var keyA = a.organization,
            keyB = b.organization;
        // Compare the 2 dates
        if (keyA < keyB) return -1;
        if (keyA > keyB) return 1;
        return 0;
        });

        console.log(eventSources);

    };

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

<AddCalendar></AddCalendar>

{#if eventSources}
<table>
    <thead>
        <th data-key="id">Existing Organizations</th>
        <th data-key="last_name">City</th>
        <th data-key="ip_address">Country</th>
        <!-- <th data-key="first_name">Organization<br>URL</th>
        <th data-key="last_name">City</th>
        <th data-key="email">State/<br>Province</th>
        <th data-key="ip_address">Calendar<br>URL</th> -->
    </thead>
    <tbody>
        {#each eventSources as row}
            <tr>
                <td>{row.organization}</td>
                <td>{#if row.city}
                    {row.city}
                    {/if}</td>
                <td>{#if row.country}
                    {row.country}
                    {/if}</td>
                <!-- <td>{row.org_url}</td>
                <td>{row.city}</td>
                <td>{row.state_province}</td>
                <td>{row.country}</td>
                <td>{row.url}</td> -->
            </tr>
        {/each}
    </tbody>
</table>
{/if}
