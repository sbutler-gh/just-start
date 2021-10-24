<script>
    import {events_store, user_store} from "$lib/stores";
    import EventDynamic from "$lib/components/EventDynamic.svelte";
    import supabase from "$lib/db.js";
import { onMount } from "svelte";
import { get } from 'svelte/store';
import FullCalendar, { CalendarApi } from 'svelte-fullcalendar';
import dayGridPlugin from '@fullcalendar/daygrid';
// import iCalendarPlugin from '@fullcalendar/icalendar';
import googleCalendarPlugin from '@fullcalendar/google-calendar';
import listPlugin from '@fullcalendar/list';
import timeGridPlugin from '@fullcalendar/timegrid';
import ical from 'ical';
import { parse } from "postcss";
import turfBuffer from '@turf/buffer';
import turfPoint from 'turf-point';
import turfBooleanContains from '@turf/boolean-contains';

let data_theme = "light";

let data = [];
let parsed_data = [];
let string_data;

let geo_id;

let location_buffer;
let location_coordinates;
let event_area;
let point;
let coordinates;

let calendar;
let calendarAPI;

let eventSourcesArray = [];
let eventsArray = [];
let eventFeed;
let address;
let address_display;
let timezone;

let new_event = {
    "start": "2021-10-24T09:24:00.000Z"
}
let date_display_options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };


let first_event = true;

let options;

let calendar_popup_show = false;

let calendar_popup = {
        title: '',
        details: '',
        x: '',
        y: '',
    }


    onMount(async () => {

        const common = (await import('@fullcalendar/common')).default

        fetchEventSources();
        ipToCoordinates();
        
    });

    // let string_data = JSON.stringify(parsed_data);

    console.log(string_data);

async function ipToCoordinates() {
        const request = await fetch("https://ipinfo.io/json?token=d41bed18e5fda2");
        const json = await request.json()

        console.log(json);
        timezone = json.timezone;
        console.log(timezone);

        address_display = `${json.city}, ${json.region}, ${json.postal}`;


        console.log(json.loc);
        coordinates = json.loc.split(',');
        console.log(coordinates);
        location_coordinates = {"lat": coordinates[0], "lng": coordinates[1]};
        console.log(location_coordinates);

        point = turfPoint([parseFloat(coordinates[1]), parseFloat(coordinates[0])]);
        console.log(point);

        event_area = turfBuffer(point, 25, {units: 'miles'});
        console.log(event_area);

        geocodeCoordinates(coordinates);
}

function loadUser() {
        // localStorage.getItem('user') ? ($user_store = JSON.parse(localStorage.getItem('user'))) : null;
        
        // console.log($user_store);
}

async function fetchEventSources() {


    let { data: eventSources, error } = await supabase
        .from('eventSources')
        .select('*')

        if (eventSources) {
            console.log(eventSources)

            eventSourcesArray = [];

            for (var i=0; i<eventSources.length; i++) {

                let calendar_coordinates = turfPoint([eventSources[i].coordinates['lng'], eventSources[i].coordinates['lat']]);

                if (turfBooleanContains(event_area, calendar_coordinates)) {
                    console.log('match');

                    if (eventSources[i].event_object) {
                        eventsArray.push(
                            eventSources[i].event_object
                        )
                    }
                    else {
                        eventSourcesArray.push({
                        googleCalendarId: eventSources[i].url
                        })
                    }
                }
                
                // eventSourcesArray.push({
                //     googleCalendarId: eventSources[i].url
                // })
            }
            eventSourcesArray = JSON.stringify(eventSourcesArray, null, 2);
            console.log(eventSourcesArray);
            eventsArray = JSON.stringify(eventsArray, null, 2);
            console.log(eventsArray);
            // console.log(eventSourcesArray);

        }
        else {
            console.log(error);
        }

        initializeCalendarOptions();
}

async function initializeCalendarOptions() {
    calendarAPI = calendar.getAPI();

options = {
initialView: 'listWeek',
plugins: [
        (await import('@fullcalendar/daygrid')).default,
        (await import('@fullcalendar/list')).default,
        (await import('@fullcalendar/timegrid')).default,
        // (await import('@fullcalendar/icalendar')).default,
        (await import('@fullcalendar/google-calendar')).default,
    ],
weekends: true,
googleCalendarApiKey: 'AIzaSyDYxnSEee64WAIFIyEft-sxjUhNYBMoPG4',
eventSources: JSON.parse(eventSourcesArray),
events: JSON.parse(eventsArray),
eventClick: function(info) {
info.jsEvent.preventDefault(); // don't let the browser navigate

console.log(info.event.extendedProps);
calendar_popup.title = info.event.title;
calendar_popup.details = info.event.extendedProps.description;
calendar_popup.location = info.event.extendedProps.location;
calendar_popup.x = info.jsEvent.pageX;
calendar_popup.y = info.jsEvent.pageY;

calendar_popup_show = true;
console.log(calendar_popup_show);
},
//   eventMouseLeave: function(info) {
//       calendar_popup_show = false;
//   }
};
}


function toggleWeekends() {
    options.weekends = !options.weekends;
    options = { ...options };
    }
    
    let artifacts = [];

    let group = "Fairfax Citizens Action";

    let user;

    let location;

    let create_menu = "Success";

    let discussion;

    var offset = new Date().getTimezoneOffset();
    console.log(offset);

    let now = new Date();
    now.setMinutes(now.getMinutes() - offset)
    now = now.toISOString();
    // let now = new Date().toLocaleString('en-US', { timeZone: timezone })
    now = now.slice(0, -8);
    console.log(now);

    // now.setMinutes(now.getMinutes() + offset);
    // console.log(now);

    // var dt = new Date();
    // dt.setMinutes(dt.getMinutes() + dt.getTimezoneOffset())
    // console.log(dt)

    let event = {
        name: `${group} Meeting`,
        when: now,
        where: "",
        details: ``,
        group_id: "",
        group_name: ""
    }

    function publishDiscussion(e) {

//         var formData = new FormData(e.target);

//         const { data, error } = await supabase
//   .from('artifacts')
//   .insert([
//     { details: 'someValue', user_id: 'otherValue', group_id: },
//   ])

        let new_artifact = {
        type: create_menu,
        details: discussion
        }
        artifacts.unshift(new_artifact);
        console.log(new_artifact);
        discussion = "";
        create_menu = "Create";
        artifacts = artifacts;
    }

    function publishEvent(e) {
        console.log(e);
        var formData = new FormData(e.target);
        console.log([...formData]);

        let new_artifact = {
        name: formData.get("name"),
        when: formData.get("when"),
        where: formData.get("where"),
        details: ``,
        group_id: "",
        group_name: group,
        type: create_menu
        }

        console.log(new_artifact);

        artifacts.unshift(new_artifact);

        create_menu = "Create";
        artifacts = artifacts;

    }

    async function addEventToCalendar(e) {
        console.log(e);
        var formData = new FormData(e.target);
        console.log([...formData]);

        let start = new Date(formData.get("when"));
        console.log(start);

        start = start.toISOString();
        console.log(start);
        

        // let new_artifact = {
        // name: formData.get("name"),
        // when: formData.get("when"),
        // where: formData.get("where"),
        // details: ``,
        // group_id: "",
        // group_name: group,
        // type: create_menu
        // }

        // console.log(new_artifact);

        new_event = {
            title: formData.get("name"), // a property!
            start: formData.get("when"), // a property!
            allDay: false,
            extendedProps: {
                description: formData.get('description'),
                location: formData.get('where')
            }
        }


        function generateUUID() { // Public Domain/MIT
            var d = new Date().getTime();//Timestamp
            var d2 = (performance && performance.now && (performance.now()*1000)) || 0;//Time in microseconds since page-load or 0 if unsupported
            return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
                var r = Math.random() * 16;//random number between 0 and 16
                if(d > 0){//Use timestamp until depleted
                    r = (d + r)%16 | 0;
                    d = Math.floor(d/16);
                } else {//Use microseconds since page-load if supported
                    r = (d2 + r)%16 | 0;
                    d2 = Math.floor(d2/16);
                }
                return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
            });
        }

        const { data, error } = await supabase
        .from('eventSources')
        .insert([
            { id: generateUUID(), coordinates: location_coordinates, event_object: new_event, cal_format: 'event' },
        ])

        if (data) {
            console.log(data);

            let api = calendar.getAPI();

            api.addEvent(new_event);

            create_menu= "Success";
        }
        else {
            console.log('error adding event, try again');
            create_menu = "Error";
        }

        // setTimeout(() => {
        //     create_menu = "";
        // }, 5000)
    };

    async function signUp(e) {
        var formData = new FormData(e.target);

        let { user, error } = await supabase.auth.signUp({
        email: formData.get('email_phone'),
        password: formData.get('password')
        })

        if (user) {
            console.log(user);

            $user_store.id = user.id;
            $user_store.email = user.email;

            let { data: profiles, error } = await supabase
            .from('profiles')
            .update({ full_name: formData.get('name') })
            .eq('user_id', user.id)

            if (profiles) {
                console.log(profiles);
                $user_store.full_name = formData.get('name');

                user = {
                    id: user.id,
                    email: user.email,
                    full_name: formData.get('name')
                }

                localStorage.setItem('user', JSON.stringify(user));

                console.log(JSON.parse(localStorage.getItem('user')));
            }
            else {
             console.log(error);   
            }
            }
        else {
            console.log(error);
        }
    }

    async function geocodeCoordinates(coordinates) {


const response = await fetch(`https://serene-journey-42564.herokuapp.com/https://geocoding.geo.census.gov/geocoder/geographies/coordinates?x=${coordinates[1]}&y=${coordinates[0]}&benchmark=Public_AR_Census2020&vintage=Census2020_Census2020&layers=10&format=json`, {
            method: 'GET',
            withCredentials: true,
            // headers: myHeaders
            })

            let result = await response.json();
            console.log(result);

            geo_id = result.result.geographies["Census Blocks"][0].GEOID.slice(0, -3);
            fetchEJData(geo_id);
}

function calculateEventAreaBuffer(coordinates) {

    console.log(coordinates);

        location_coordinates = {"lat": coordinates['y'], "lng": coordinates['x']}
        console.log(location_coordinates);

        var point = turfPoint([coordinates['x'], coordinates['y']]);

        event_area = turfBuffer(point, 25, {units: 'miles'});
        console.log(event_area);

        fetchEventSources();

}

async function geocodeAddress() {
// let calendarAPI = calendar.getAPI();
// calendarAPI.addEventSource(calEvent);
// console.log('loaded');

let url_query = encodeURIComponent(address);
console.log(url_query);

const response = await fetch(`https://serene-journey-42564.herokuapp.com/https://geocoding.geo.census.gov/geocoder/geographies/onelineaddress?address=${url_query}&benchmark=Public_AR_Census2020&vintage=Census2020_Census2020&layers=10&format=json`, {
            method: 'GET',
            withCredentials: true,
            // headers: myHeaders
            })

            let result = await response.json();
            console.log(result);

            if (result.result.addressMatches[0]) {
                // fetchCREData(result.result.addressMatches[0].geographies["Census Blocks"][0].GEOID.slice(0, -4))
                geo_id = result.result.addressMatches[0].geographies["Census Blocks"][0].GEOID.slice(0, -3);
                console.log(geo_id);
                calculateEventAreaBuffer(result.result.addressMatches[0].coordinates)
                fetchEJData(geo_id);
                // 

            }

            else {
                console.log('error with address input');
            }
            // coordinatesToAirQuality(response_json.result.addressMatches[0].coordinates);

            // coordinatesToAirQuality(response_json.result.)



            // console.log(response_json.result);
            // $user_store.coordinates = response_json.result.addressMatches[0].coordinates;
            // $user_store.matchedAddress = response_json.result.addressMatches[0].matchedAddress;
            // $user_store.tigerLine = response_json.result.addressMatches[0].tigerLine;

            // $user_store = $user_store;

            // console.log($user_store);
}


async function coordinatesToAirQuality(coordinates) {

    let longitude = coordinates.x;
    let latitude = coordinates.y;

    const response = await fetch(`https://www.airnowapi.org/aq/forecast/latLong/?format=application/json&latitude=${latitude}&longitude=${longitude}&date=2021-10-22&distance=50&API_KEY=19AF03DF-1A45-4ECC-BDDF-3EB306A0834A`,
    {method: 'GET',
    withCredentials: true,
    })

    let response_json = await response.json();
     console.log(response_json);
}

async function fetchCREData(geo_id) {

    console.log(geo_id);
    let { data: cre, error } = await supabase
    .from('cre')
    .select('*')
    .eq('GEO_ID', geo_id)

    if (cre) {
        console.log(cre);
    }
    else {
        console.log(error);
    }
}

async function fetchEJData(geo_id) {

console.log(geo_id);

let { data: ej, error } = await supabase
.from('ejscreen_percentiles')
.select('*')
.eq('ID', geo_id);

if (ej) {
    console.log(ej);
}
else {
    console.log(error);
}
}

function closeCalendarPopup() {
    calendar_popup_show = false;
}

function toggleEventForm() {
    create_menu == "Event" ? create_menu = "" : create_menu = "Event";
}

function closeEventDialogBox() {
    create_menu == "";
}
</script>

<div style="" class="md:text-center m-auto md:w-10/12">
<!-- <div class="absolute top-1 right-1">
{#if $user_store?.id}
<p class="font-semibold">{$user_store.full_name}</p>
<a class="text-blue-500">+ New Group</a>
{:else if !$user_store?.id}
<form on:submit|preventDefault={signUp} class="">
<label>Name</label><br>
<input name="name" class="rounded-md border-2"><br>
<label>Email</label><br>
<input name="email_phone" class="rounded-md border-2"><br>
<label>Password</label><br>
<input name="password" class="rounded-md border-2"><br>
<button>Submit</button>
</form>
{/if}
</div> -->

<!-- <div>
    {calendar_popup.title}<br>
    {@html calendar_popup?.details}<br>
    {calendar_popup.x}<br>
    {calendar_popup.y}<br>
</div> -->

{#if calendar_popup_show}
<div class="shadow rounded-md border-2 bg-white text-left p-4 w-5/12" style="position: absolute; z-index: 100; top: {calendar_popup.y}px; left: {calendar_popup.x}px">
    <button class="absolute top-1 right-1 cursor-pointer" on:click={closeCalendarPopup}><svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-square-x" width="24" height="24" viewBox="0 0 24 24" stroke-width="1.5" stroke="#597e8d" fill="none" stroke-linecap="round" stroke-linejoin="round">
        <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
        <rect x="4" y="4" width="16" height="16" rx="2" />
        <path d="M10 10l4 4m0 -4l-4 4" />
      </svg></button>
    <p class="mb-4">{calendar_popup.title}</p>
    {#if calendar_popup?.location}
    <div class="flex">
    <svg xmlns="http://www.w3.org/2000/svg" class="inline-flex" height="20px" width="20px" viewBox="0 0 20 20" fill="gray">
        <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
      </svg><p class="inline-flex text-sm font-semibold mb-4">{calendar_popup.location}</p>
    </div>
    {/if}
    {#if calendar_popup?.details}
    {@html calendar_popup?.details}
    {/if}
</div>
{/if}

<div class="text-center">
    <h1 class="text-2xl mb-2">Want to make a difference?</h1>
    <h1 class="text-2xl mb-2">You're right on time.</h1>
</div>

<p class="font-semibold mb-2">{address_display}</p>

<input class="rounded border-2 w-64 mb-2" bind:value={address}> <button on:click={geocodeAddress} class="rounded border-2 bg-gray-200 px-2 py-1">Update Location</button>

<div class="w-5/12 m-auto mb-5">
<FullCalendar bind:this="{calendar}" {options} />
</div>

{#if create_menu == "Success"}
<div class="bg-green-200 text-green w-5/12 m-auto p-4 pt-6 relative">
    <button class="absolute top-1 right-1 cursor-pointer" on:click={closeEventDialogBox}><svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-square-x" width="20" height="20" viewBox="0 0 24 24" stroke-width="1.5" stroke="#597e8d" fill="none" stroke-linecap="round" stroke-linejoin="round">
            <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
        </svg></button>
    <p>Success!  You can see your event on the calendar, and start inviting others to join you on <strong>{new Date(new_event?.start).toLocaleString('en-US', date_display_options).slice(0,-6).concat('th').concat(` at ${new Date(new_event?.start).toLocaleTimeString()}`)}.</strong>  <a href="" class="text-blue-800 underline"><span class="">Share event with friends</span> <span>✉️</span></a></p> 
</div>
{:else if create_menu == "Error"}
<div class="bg-green-200 text-green w-5/12 m-auto p-4 pt-6 relative">
    <button class="absolute top-1 right-1 cursor-pointer" on:click={closeEventDialogBox}><svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-square-x" width="20" height="20" viewBox="0 0 24 24" stroke-width="1.5" stroke="#597e8d" fill="none" stroke-linecap="round" stroke-linejoin="round">
            <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
        </svg></button>
    <p>Error uploading event to database.  <button on:click={toggleEventForm} class="text-blue-800 underline"><span class="">Try again.</button></p> 
</div>
{/if}

{#if first_event}
<p>gotta get some events</p>
{/if}

<p class="text-lg">Start an event, invite a few friends and neighbors, and bring possibilities to life.</p>
<!-- Or rich media message.  Could also include rich media message at the top. -->
<button on:click={toggleEventForm} class="rounded bg-gray-200 px-2 py-1">Add Event to Calendar</button>

        <div class="w-11/12 m-auto">
            <select bind:value={create_menu} class="hidden w-20 rounded-lg p-1 block text-sm bg-gray-200 ml-auto text-left">
                <option>Create</option>
                <option>Discussion</option>
                <option>Event</option>
                <!-- <option>Conversation</option>
                <option>Issue</option>
                <option>Action</option>
                <option>Event</option>
                <option>Offer</option>
                <option>Request</option> -->
            </select>

            {#if create_menu == "Discussion"}
            <!-- {#if !user?.name}
            <p class="pl-4 mt-2  text-left">Who's writing this?  <a class="text-blue-500 underline">Sign in</a></p>
            {/if} -->
            <textarea bind:value={discussion} class="m-auto rounded-md border-2 mt-4 w-10/12 text-left block"></textarea>
            <button type="button" on:click={publishDiscussion} class="mt-2 rounded-lg p-1 block text-sm bg-gray-200 ml-auto text-left">Publish</button>
            {:else if create_menu == "Event"}
            <div class="rounded-md border-2 mt-4 p-2">
            <form on:submit|preventDefault={addEventToCalendar} class="text-left">
                <label class="text-sm" for="name">Event Name</label><br/>
                <input name="name" type="text" class="border-2 w-full mb-4 rounded-md h-8 p-1"/>
                <br>
    
                <label class="text-sm" for="when">Date and Time</label><br/>
                <input type="datetime-local" class="border-2 rounded-md p-1" name="when" bind:value={event.when} min={now}>
                <!-- <input name="when" bind:value={event.when} type="text" class="border-2 w-full mb-4 rounded-md h-8 p-1"/> -->
                <br>
    
                <!-- <label class="text-sm" for="location">Location</label><br/>
                <input type="radio" bind:group={location} name="location" value="In-Person"><label class="ml-1 mr-2 text-sm" for="In-Person">In-Person</label>
                <input type="radio" bind:group={location} name="location" value="Online"><label class="ml-1 mr-2 text-sm" for="Online">Online</label>
                <p class="mt-1 text-sm">
                {#if location == "In-Person"}
                Enter the location of your meeting
                {:else if location == "Online"}
                Enter a link for your meeting
                {/if}
                </p> -->
                <p class="mt-1 text-sm">Enter a location for your meeting (in-person or virtual)</p>
                <input name="where" bind:value={event.where} type="text" class="border-2 w-full mb-4 rounded-md h-8 p-1"/>
                <br>
                <label class="text-sm" for="description">Why is this important?  Let people know.</label><br/>
                <textarea name="description" type="text" class="rounded border border-gray-300 block w-full mb-3 h-20"></textarea>
                <br>
                <button type="submit" class="mt-2 mb-2 rounded-full shadow bg-blue-200 px-2 py-1 text-right block ml-auto">Publish Meeting</button>
            </form>
            </div>
            {/if}
        </div>

        <div class="w-11/12 m-auto">
            {#each artifacts as artifact}
            {#if artifact.type == "Event"}
            <EventDynamic cursor="cursor-pointer" hover="hover:shadow" height="h-48" border="border-2" overflow="overflow-hidden" event={artifact}></EventDynamic>
            {:else if artifact.type == "Discussion"}
            <div class="border-2 rounded-md mt-4 m-auto w-10/12 mb-2 p-2 text-left">
                <p class="whitespace-pre">{@html artifact.details}</p>
            </div>
            {/if}
            {/each}
        </div>

        <div class="hidden">
        <p class="text-right ml-auto">Your first event is live!  Now start researching local organizations who'd like to join the conversation, and send invites their way.  Likewiwse, start having conversations with friends and neighbors, and invite them to get involved.</p>
        <p class="hidden text-right ml-auto">As you research, you can also pin relevant organizations and entities to the map, to save them for future reference and help others discover them as well!</p>
        <img id="location_img" class="hidden" src="https://maps.google.com/maps/api/staticmap?markers=icon%3Ahttps%3A%2F%2Fsecure.meetupstatic.com%2Fs%2Fimg%2F5961591462445047%2Fmup-custom-google-map-pin.png%7C38.894615%2C-77.439980&zoom=17&size=480x300&sensor=false&key=AIzaSyA3fSxhHZNQNfMjJuMFvmULACXrBfFz9jQ&signature=UWDg01O1EMndIJNgK_EkV8q8IJE%3D">
        </div>
</div>