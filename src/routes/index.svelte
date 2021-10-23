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

let data_theme = "light";

let data = [];
let parsed_data = [];
let string_data;

let calendar;
let calendarAPI;

let eventSourcesArray = [];
let address;
let address_display;
let timezone;

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

        console.log(localStorage.getItem('user'));

        let { data: eventSources, error } = await supabase
        .from('eventSources')
        .select('*')

        if (eventSources) {
            console.log(eventSources)

            for (var i=0; i<eventSources.length; i++) {
                eventSourcesArray[i] = {
                    googleCalendarId: eventSources[i].url
                }
            }

            // console.log(eventSourcesArray);
            // console.log([...eventSourcesArray]);
            // console.log(eventSourcesArray[0])
            eventSourcesArray = JSON.stringify(eventSourcesArray, null, 2);
            // console.log(eventSourcesArray);
            // console.log(eventSourcesObject);
            // console.log(eventSourcesArray == eventSourcesObject);
            // console.log(typeof eventSourcesArray);
            // console.log(typeof eventSourcesObject);
            // eventSourcesObject = eventSourcesArray;
            // eventSourcesArray = eventSourcesObject;
        }
        else {
            console.log(error);
        }

        localStorage.getItem('user') ? ($user_store = JSON.parse(localStorage.getItem('user'))) : null;
        
        console.log($user_store);

        // const request = await fetch("https://ipinfo.io/json?token=d41bed18e5fda2");
        // const json = await request.json()

        // console.log(json);
        // timezone = json.timezone;
        // console.log(timezone);

        // address_display = `${json.city}, ${json.region}, ${json.postal}`;

        // geocodeCoordinates(json.loc);


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
    eventMouseEnter: function(info) {
    // info.jsEvent.preventDefault(); // don't let the browser navigate


    calendar_popup.title = info.event.title;
    calendar_popup.details = info.event.extendedProps.description;
    calendar_popup.x = info.jsEvent.pageX;
    calendar_popup.y = info.jsEvent.pageY;


    console.log(info.event.extendedProps);

    calendar_popup_show = true;
    console.log(calendar_popup_show);

    // console.log(calendar_popup);
    // console.log(calendarAPI.getEventSourceById('a'));
    
    // calendarAPI.getEventSourceById('b').remove();
    // console.log(JSON.stringify(calendarAPI.getEvents()));
  },
  eventMouseLeave: function(info) {
      calendar_popup_show = false;
  }
    };
        
    });

    // let string_data = JSON.stringify(parsed_data);

    console.log(string_data);


function toggleWeekends() {
    options.weekends = !options.weekends;
    options = { ...options };
    }
    
    let artifacts = [];

    let group = "Fairfax Citizens Action";

    let user;

    let location;

    let create_menu;

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

    function addEventToCalendar(e) {
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

        let new_event = {
            title: formData.get("name"), // a property!
            start: formData.get("when"), // a property!
            allDay: false
        }

        let api = calendar.getAPI();

        api.addEvent(new_event);
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

console.log(coordinates);
var coordinate_pair = coordinates.split(',');

const response = await fetch(`https://serene-journey-42564.herokuapp.com/https://geocoding.geo.census.gov/geocoder/geographies/coordinates?x=${coordinate_pair[1]}&y=${coordinate_pair[0]}&benchmark=Public_AR_Census2020&vintage=Census2020_Census2020&layers=10&format=json`, {
            method: 'GET',
            withCredentials: true,
            // headers: myHeaders
            })

            let result = await response.json();
            console.log(result);
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
                fetchCREData(result.result.addressMatches[0].geographies["Census Blocks"][0].GEOID.slice(0, -4))
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
</script>

<div style="width: 350px" class="md:text-center m-auto md:w-5/12">
<div class="absolute top-1 right-1">
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
</div>

<!-- <div>
    {calendar_popup.title}<br>
    {@html calendar_popup?.details}<br>
    {calendar_popup.x}<br>
    {calendar_popup.y}<br>
</div> -->

{#if calendar_popup_show}
<div class="shadow rounded border-2 bg-white" style="position: absolute; z-index: 100; width: 300px; top: {calendar_popup.y}px; left: {calendar_popup.x}px">
    {calendar_popup.title}<br>
    {@html calendar_popup?.details}<br>
</div>
{/if}

<div class="text-center">
    <h1 class="text-2xl mb-2">Want to make a difference?</h1>
    <h1 class="text-2xl mb-2">You're right on time.</h1>
</div>

<FullCalendar bind:this="{calendar}" {options} />

    <p class="mt-4 text-center">{group}</p>

        <EventDynamic cursor="cursor-pointer" hover="hover:shadow" height="h-48" border="border-2" overflow="overflow-hidden" event={$events_store[0]}></EventDynamic>

        <div class="w-11/12 m-auto">
            <select bind:value={create_menu} class="w-20 rounded-lg p-1 block text-sm bg-gray-200 ml-auto text-left">
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
                <input name="name" bind:value={event.name} type="text" class="border-2 w-full mb-4 rounded-md h-8 p-1"/>
                <br>
    
                <label class="text-sm" for="when">Date and Time</label><br/>
                <input type="datetime-local" class="border-2 rounded-md p-1" name="when" bind:value={event.when} min={now}>
                <!-- <input name="when" bind:value={event.when} type="text" class="border-2 w-full mb-4 rounded-md h-8 p-1"/> -->
                <br>
    
                <label class="text-sm" for="location">Location</label><br/>
                <input type="radio" bind:group={location} name="location" value="In-Person"><label class="ml-1 mr-2 text-sm" for="In-Person">In-Person</label>
                <input type="radio" bind:group={location} name="location" value="Online"><label class="ml-1 mr-2 text-sm" for="Online">Online</label>
                <!-- <input type="radio" bind:group={location} name="location" value="Hybrid"><label class="ml-1 text-sm" for="Hybrid">Hybrid</label> -->
    
                <p class="mt-1 text-sm">
                {#if location == "In-Person"}
                Enter the location of your meeting
                {:else if location == "Online"}
                Enter a link for your meeting
                {/if}
                </p>
                <input name="where" bind:value={event.where} type="text" class="border-2 w-full mb-4 rounded-md h-8 p-1"/>
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