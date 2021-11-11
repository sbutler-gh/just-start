<script>
    import {events_store, user_store} from "$lib/stores";
    import supabase from "$lib/db.js";
import { onMount } from "svelte";
import { get } from 'svelte/store';
import FullCalendar, { CalendarApi } from 'svelte-fullcalendar';
import dayGridPlugin from '@fullcalendar/daygrid';
// import iCalendarPlugin from '$lib/icalendar';
// import iCalendarPlugin from '@fullcalendar/icalendar';
import googleCalendarPlugin from '@fullcalendar/google-calendar';
import listPlugin from '@fullcalendar/list';
import timeGridPlugin from '@fullcalendar/timegrid';
// import ical from 'ical';
import { parse } from "postcss";
import turfBuffer from '@turf/buffer';
import turfPoint from 'turf-point';
import turfBooleanContains from '@turf/boolean-contains';
import Carousel from '@beyonk/svelte-carousel'
import { variables } from '$lib/variables';

let data_theme = "light";

let data = [];
let parsed_data = [];
let string_data;

let geo_id;

let svi_cre_data;

let local_data;

let location_buffer;
let location_coordinates;
let event_area;
let point;
let coordinates;
let cal_coordinates;

let add_to_calendar_url;

let calendar;
let calendarAPI;

let display_ej_table = false;

let eventSourcesArray = [];
let eventsArray = [];
let eventFeed;
let address;
let address_display;
let timezone;

let new_event;

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


let create_menu = "";

let discussion;

var offset = new Date().getTimezoneOffset();
console.log(offset);

let now = new Date();
now.setMinutes(now.getMinutes() - offset)
now = now.toISOString();
now = now.slice(0, -8);
console.log(now);

let event = {
        when: now,
}


    onMount(async () => {

        const common = (await import('@fullcalendar/common')).default

        ipToCoordinates()
        .then(() => {

            updateLocalData();

            updateCalendarEvents();
        });
        // need to think this through better
        
    });

async function ipToCoordinates() {

        const ip = await fetch("https://serene-journey-42564.herokuapp.com/https://api.ipify.org?format=json&callback=getIP");

        const ip_json = await ip.json();
        console.log(ip_json);

        const request = await fetch(`https://serene-journey-42564.herokuapp.com/ipinfo.io/${ip_json["ip"]}/geo?token=${variables.ipInfo}`, {
            method: 'GET',
            "Access-Control-Allow-Origin": "https://a492-108-62-49-158.ngrok.io/",
            "Content-Type": "application/json",
            "charset": "utf-8"
        });

        const json = await request.json()

        console.log(json);
        timezone = json.timezone;
        console.log(timezone);

        address = `${json.city}, ${json.region}, ${json.postal}`;
        address_display = `${json.city}, ${json.region}, ${json.postal}`;

        console.log(json.loc);
        coordinates = json.loc.split(',');
        console.log(coordinates);
        coordinates = {"lat": coordinates[0], "lng": coordinates[1]};
//         coordinates = {
//     "lat": 37.7790262,
//     "lng": -122.419906
// }

        point = turfPoint([parseFloat(coordinates["lng"]), parseFloat(coordinates["lat"])]);
        console.log(point);

        event_area = turfBuffer(point, 25, {units: 'miles'});
        console.log(event_area);
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
            console.log(eventSources);

            console.log(event_area);

            eventSourcesArray = [];
            eventsArray = [];

            for (var i=0; i<eventSources.length; i++) {

                let calendar_coordinates = turfPoint([eventSources[i].coordinates['lng'], eventSources[i].coordinates['lat']]);

                console.log(calendar_coordinates);

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
            console.log(eventSourcesArray);

            initializeCalendarOptions();

        }
        else {
            console.log(error);
        }
}

async function initializeCalendarOptions() {
    calendarAPI = calendar.getAPI();

options = {
initialView: 'listWeek',
plugins: [
        (await import('@fullcalendar/daygrid')).default,
        (await import('@fullcalendar/list')).default,
        (await import('@fullcalendar/timegrid')).default,
        // (await import('$lib/icalendar')).default,
        // (await import('@fullcalendar/icalendar')).default,
        (await import('@fullcalendar/google-calendar')).default,
    ],
weekends: true,
googleCalendarApiKey: variables.googleCalendar,
eventSources: JSON.parse(eventSourcesArray),
events: JSON.parse(eventsArray),
eventClick: function(info) {
info.jsEvent.preventDefault(); // don't let the browser navigate

console.log(info);
add_to_calendar_url = info.event.url;

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

async function updateCalendarEvents() {
    fetchEventSources()
    // .then(()=> {
    //     initializeCalendarOptions();
    // })
}

async function updateLocalData() {
    coordinatesToGeoID(coordinates)
       .then(() => {
        fetchEJData(geo_id);
    })
}


function toggleWeekends() {
    options.weekends = !options.weekends;
    options = { ...options };
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

    async function addEventToCalendar(e) {
        console.log(e);
        var formData = new FormData(e.target);
        console.log([...formData]);

        let start = new Date(formData.get("when"));
        console.log(start);

        start = start.toISOString();
        console.log(start);
        

        new_event = {
            title: formData.get("name"), // a property!
            start: formData.get("when"), // a property!
            allDay: false,
            extendedProps: {
                description: formData.get('description'),
                location: formData.get('where')
            },
            url: `http://www.google.com/calendar/event?action=TEMPLATE&dates=${formData.get("when")}&text=${formData.get("name")}&location=${formData.get('where')}&details=${encodeURI(formData.get('description'))}`
        }

        const { data, error } = await supabase
        .from('eventSources')
        .insert([
            { id: generateUUID(), coordinates: coordinates, event_object: new_event, cal_format: 'event' },
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
    };

    async function addressToCoordinates(e) {

     var formData = new FormData(e.target);

    console.log(encodeURI(formData.get('address')));
    const request = await fetch(`https://api.opencagedata.com/geocode/v1/json?q=${encodeURI(formData.get('address'))}&key=${variables.openCage}`);
    const json = await request.json()
    console.log(json);
    console.log(json?.results[0]?.geometry);
    // return(json.results[0].geometry);

    if (json?.results[0]?.geometry) {

        e.target.coordinates = json.results[0].geometry;

        return

        // return(shareCalendarFeed(e));
    }

    else {
        console.log(json);
        create_menu = "Error_Calendar";
    }
    
    }

    async function geocodeAddress(address) {

const request = await fetch(`https://api.opencagedata.com/geocode/v1/json?q=${encodeURI(address)}&key=${variables.openCage}`);
const json = await request.json()
console.log(json);
console.log(json?.results[0]?.geometry);
// return(json.results[0].geometry);

if (json?.results[0]?.geometry) {

   coordinates = json.results[0].geometry;

    point = turfPoint([parseFloat(coordinates["lng"]), parseFloat(coordinates["lat"])]);
    console.log(point);

    event_area = turfBuffer(point, 25, {units: 'miles'});
    console.log(event_area);

   return(coordinates);
}

else {
    console.log(error);
   console.log(json);
}

}

async function getCalendarCoordinates(address) {
    const request = await fetch(`https://api.opencagedata.com/geocode/v1/json?q=${encodeURI(address)}&key=${variables.openCage}`);
    const json = await request.json()
    console.log(json);
    console.log(json?.results[0]?.geometry);

    cal_coordinates = json?.results[0]?.geometry;

    return(json?.results[0]?.geometry);
}
    

    async function shareCalendarFeed(e) {

        var formData = new FormData(e.target);
        console.log([...formData]);

        getCalendarCoordinates(formData.get('address'))
        .then(async () => {

            console.log(cal_coordinates);

            const { data, error } = await supabase
        .from('eventSources')
        .insert([
            { id: generateUUID(), coordinates: cal_coordinates, url: formData.get('url'), organization: formData.get('organization')  },
        ])

        if (data) {
            console.log(data);

            let api = calendar.getAPI();

            api.addEventSource(formData.get('url'));

            create_menu= "Success_Calendar";
        }
        else {
            console.log('error adding calendar, try again');
            create_menu = "Error_Calendar";
        }

        })
    }

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

    async function coordinatesToGeoID(coordinates) {

        console.log(coordinates);


const response = await fetch(`https://serene-journey-42564.herokuapp.com/https://geocoding.geo.census.gov/geocoder/geographies/coordinates?x=${coordinates["lng"]}&y=${coordinates["lat"]}&benchmark=Public_AR_Census2020&vintage=Census2020_Census2020&layers=10&format=json`, {
            method: 'GET',
            withCredentials: true,
            // headers: myHeaders
            })

            let result = await response.json();
            console.log(result);

            geo_id = result.result.geographies["Census Blocks"][0].GEOID.slice(0, -3);
            return(geo_id);
            // fetchEJData(geo_id);
}

async function calculateEventAreaBuffer(coordinates) {


        var point = turfPoint([coordinates['lat'], coordinates['lng']]);

        event_area = turfBuffer(point, 25, {units: 'miles'});
        console.log(event_area);
        return(event_area);

}

async function updateLocation() {

    geocodeAddress(address)
    .then(() => {

        updateCalendarEvents();

        // calculateEventAreaBuffer(coordinates)
        // .then(() => {
        //     fetchEventSources()
        //     // .then(()=> {
        //     //     initializeCalendarOptions();
        //     // })
        //     // updateCalendarEvents()
        // })

        updateLocalData();
    })
}


async function coordinatesToAirQuality(coordinates) {

    let longitude = coordinates.x;
    let latitude = coordinates.y;

    const response = await fetch(`https://www.airnowapi.org/aq/forecast/latLong/?format=application/json&latitude=${latitude}&longitude=${longitude}&date=2021-10-22&distance=50&API_KEY=${variables.airNow}`,
    {method: 'GET',
    withCredentials: true,
    })

    let response_json = await response.json();
     console.log(response_json);
}

async function fetchCREandSVIdata(geo_id) {

    console.log(geo_id);
    let { data: svi_cre, error } = await supabase
    .from('svi_cre')
    .select('*')
    .eq('GEO_ID', geo_id.slice(0,-1))

    if (svi_cre) {
        console.log(svi_cre);
        svi_cre_data = svi_cre[0];
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
    local_data = ej[0];

    fetchCREandSVIdata(geo_id);

    if (!ej[0]) {

        console.log('No data found for this location.  Try searching a more specific address.');
        local_data = "no_data";

    //     if (geo_id.slice(0,-2) == "01") {
    //         geo_id = geo_id.slice(0,-2) + "02";
    //         fetchEJData(geo_id);
    //     }
    //     else if (geo_id.slice(0,-2) != "01") {
    //         geo_id = geo_id.slice(0,-2) + "02";
    //         fetchEJData(geo_id);
    //     }
    // }
    }
}
else {
    console.log(error);
}
}

// async function fetchCREData(geo_id) {

// }

function closeCalendarPopup() {
    calendar_popup_show = false;
}

function toggleEventForm() {
    create_menu == "Event" ? create_menu = "" : create_menu = "Event";
}

function closeEventDialogBox() {
    console.log('clicked');
    create_menu = "";
}

let copy_tooltip = false;

function copyEventLink() {
    console.log('clicked copy');
    console.log(new_event);
                if (!navigator.clipboard){
                // use old commandExec() way
                `${new_event?.url}`.select();
                window.location.setSelectionRange(0, 99999)
                document.execCommand("copy");
                copy_tooltip = true;
                setTimeout(function(){ copy_tooltip = false }, 2000)

            } else{
                navigator.clipboard.writeText(`${new_event?.url}`).then(
                    function(){
                        console.log("Copied URL");
                        copy_tooltip = true;
                        setTimeout(function(){ copy_tooltip = false }, 2000)
                    })
                    .catch(
                    function() {
                        console.log("Couldn't copy, try right-clicking to copy the URL isntead."); // error
                    });
            }    
        }

        function toggleEJTable() {
            display_ej_table ? display_ej_table = false : display_ej_table = true;
        }

        function toggleCalendarForm() {
            create_menu == "Calendar" ? create_menu = "" : create_menu = "Calendar";
        }
</script>

<svelte:head>
<title>Just Start</title>
<meta name="description" content="How can you take action?  Just start organizing!  Find where you can plug-in, and start your own organizing events as well."/>

<meta property="og:title" content="Just Start" />
<meta property="og:type" content="website" />
<meta property="og:url" content="https://www.rebrand.ly/just-start" />
<meta property="og:description" content="How can you take action?  Just start organizing!  Discover local events where you can make a difference, and start your own organizing for change as well."/>
<meta property="og:image" content="https://thefriend.org/assets/ugc/images/growing-pains.jpg">

<meta name="twitter:card" content="summary_large_image">
<meta property="twitter:domain" content="rebrand.ly">
<meta property="twitter:url" content="https://rebrand.ly/just-start/">
<meta name="twitter:title" content="Just Start">
<meta name="twitter:description" content="How can you take action?  Just start organizing!  Discover local events where you can make a difference, and start your own organizing for change as well.">
<meta name="twitter:image" content="https://thefriend.org/assets/ugc/images/growing-pains.jpg">

</svelte:head>

<div style="" class="text-center m-auto md:w-8/12">
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
<div class="shadow rounded-md border-2 bg-white text-left p-4 w-auto" style="position: absolute; z-index: 100; top: {calendar_popup.y}px; left: {calendar_popup.x}px">
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
    <a href={add_to_calendar_url} target="_blank" class="mt-2 block underline text-blue-500">Add to Calendar</a>
</div>
{/if}

<div class="text-center bg-black text-white p-8 md:mt-0 relative">

    <div class="absolute top-3 md:top-2 left-4 md:left-10 flex">
        <a href="/just-start" class="cursor-pointer underline" style="color: #ffffff;">About</a>
      </div>

    <div class="absolute top-3 md:top-2 right-10 flex">

        <a href="mailto:juststart@sambutler.us" class="cursor-pointer" style="margin-top: -3px" target="_blank">
        <svg xmlns="http://www.w3.org/2000/svg" class="mr-4 md:mr-4 h-6 w-6 cursor-pointer hover:opacity-80" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        </a>
          
          <a href="https://github.com/sbutler-gh/just-start" target="_blank">
          <svg role="img" class="mr-4 md:mr-4 cursor-pointer hover:fill-current" style="width: 18px; text-color: #dca0ff !important;" fill="#b953f4" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><title>GitHub</title><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg>    <div class="hover:cursor-pointer">
          </a>

        <a href="https://discord.gg/dTSmGuBXt8" target="_blank"> <svg xmlns="http://www.w3.org/2000/svg" style="padding-top: 1px" class="absolute hover:cursor-pointer" width="22" viewBox="0 0 71 55" fill="none">
        <g clip-path="url(#clip0)">
        <path class="hover:fill-current hover:cursor-pointer" style="color: #7783ff" d="M60.1045 4.8978C55.5792 2.8214 50.7265 1.2916 45.6527 0.41542C45.5603 0.39851 45.468 0.440769 45.4204 0.525289C44.7963 1.6353 44.105 3.0834 43.6209 4.2216C38.1637 3.4046 32.7345 3.4046 27.3892 4.2216C26.905 3.0581 26.1886 1.6353 25.5617 0.525289C25.5141 0.443589 25.4218 0.40133 25.3294 0.41542C20.2584 1.2888 15.4057 2.8186 10.8776 4.8978C10.8384 4.9147 10.8048 4.9429 10.7825 4.9795C1.57795 18.7309 -0.943561 32.1443 0.293408 45.3914C0.299005 45.4562 0.335386 45.5182 0.385761 45.5576C6.45866 50.0174 12.3413 52.7249 18.1147 54.5195C18.2071 54.5477 18.305 54.5139 18.3638 54.4378C19.7295 52.5728 20.9469 50.6063 21.9907 48.5383C22.0523 48.4172 21.9935 48.2735 21.8676 48.2256C19.9366 47.4931 18.0979 46.6 16.3292 45.5858C16.1893 45.5041 16.1781 45.304 16.3068 45.2082C16.679 44.9293 17.0513 44.6391 17.4067 44.3461C17.471 44.2926 17.5606 44.2813 17.6362 44.3151C29.2558 49.6202 41.8354 49.6202 53.3179 44.3151C53.3935 44.2785 53.4831 44.2898 53.5502 44.3433C53.9057 44.6363 54.2779 44.9293 54.6529 45.2082C54.7816 45.304 54.7732 45.5041 54.6333 45.5858C52.8646 46.6197 51.0259 47.4931 49.0921 48.2228C48.9662 48.2707 48.9102 48.4172 48.9718 48.5383C50.038 50.6034 51.2554 52.5699 52.5959 54.435C52.6519 54.5139 52.7526 54.5477 52.845 54.5195C58.6464 52.7249 64.529 50.0174 70.6019 45.5576C70.6551 45.5182 70.6887 45.459 70.6943 45.3942C72.1747 30.0791 68.2147 16.7757 60.1968 4.9823C60.1772 4.9429 60.1437 4.9147 60.1045 4.8978ZM23.7259 37.3253C20.2276 37.3253 17.3451 34.1136 17.3451 30.1693C17.3451 26.225 20.1717 23.0133 23.7259 23.0133C27.308 23.0133 30.1626 26.2532 30.1066 30.1693C30.1066 34.1136 27.28 37.3253 23.7259 37.3253ZM47.3178 37.3253C43.8196 37.3253 40.9371 34.1136 40.9371 30.1693C40.9371 26.225 43.7636 23.0133 47.3178 23.0133C50.9 23.0133 53.7545 26.2532 53.6986 30.1693C53.6986 34.1136 50.9 37.3253 47.3178 37.3253Z" fill="#5865F2"/>
        </g>
        <defs>
        <clipPath id="clip0">
        <rect width="71" height="55" fill="white"/>
        </clipPath>
        </defs>
        </svg>
        </a>

        </div>
    <!-- <h1 class="text-2xl mb-2">Want to make a difference?</h1>
    <h1 class="text-2xl mb-2">You're right on time.</h1> -->
    <!-- <h1 class="text-xl mb-2">Possibilities are all around us.</h1>
    <h1 class="text-xl mb-2">You're right on time.</h1> -->
    <a href="/" style="text-decoration: none; color: white;">
        <h1 class="text-2xl mb-2 md:mt-0 mt-4"><a href="/" style="text-decoration: none; color: white;">Not sure how to take action?</a></h1>
        <h1 class="text-2xl mb-2"><a href="/" style="text-decoration: none; color: white;">Just start.</a></h1>
        </a>
</div>

<div class="text-black">
<p class="text-xl my-8">Find an event near your, or grab some friends and start your own.</p>

<!-- <p class="font-semibold mb-2">{address_display}</p> -->

<input class="rounded border-2 w-64 my-4" bind:value={address} placeholder="Enter full address (incl. street number)"> <button on:click={updateLocation} class="cursor-pointer rounded border-2 bg-gray-200 px-2 py-1">Update Location</button>


<!-- <p class="text-lg">Start an event, invite a few friends and neighbors, and bring possibilities to life.</p> -->
<!-- Or rich media message.  Could also include rich media message at the top. -->
<div class="md:flex my-8">
<div class="md:w-5/12 xs:h-64 md:h-auto xs:text-center md:m-auto my-5">
    <p class="text-xl mb-4">Events near you</p>

    <FullCalendar bind:this="{calendar}" {options} />
</div>

<div class="local-awareness m-auto text-center md:w-6/12">
    {#if coordinates}
    <iframe title="Local Air Quality" class="text-center m-auto" height="230" width="230" src='https://widget.airnow.gov/aq-dial-widget/?latitude={coordinates['lat']}&longitude={coordinates['lng']}&transparent=true' style="border: none; border-radius: 25px;"></iframe>
        {#if local_data && local_data != "no_data"}
            <!-- <p class="font-semibold mb-2 text-xl">{address_display}</p> -->
        {#if !display_ej_table}
        <button class="underline text-blue-500" on:click={toggleEJTable}>Show More Local Data</button>
        {:else}
       <div class="m-auto text-center md:mt-2" style="height: fit-content">
        <table id="table-example-1" class="m-auto text-center styled-table">
            <caption class="text-center">
                <!-- <p class="font-semibold mb-1">{address_display?.slice(0,-7)}</p> -->
                <p class="font-semibold mb-2">Environmental Justice Indicators</p>
                <p class="mb-2 italic">0 to 100, lower is better. <a href="https://ejscreen.epa.gov/mapper/" target="_blank" class="underline text-blue-800">Explore the map</a></p>
            </caption>
            <thead>
                <tr class="">
                <td class="">Traffic proximity</td>
                <td class="">PM2.5 level</td>
                <td class="">Ozone level</td>
                <td class="">Diesel particulates</td>
                <td class="">Cancer risks</td>
                <!-- <td>Respiratory hazards (air)</td>
                <td>Lead paint indicator</td>
                <td>Risk management projects</td>
                <td>National priority sites</td>
                <td>TSD Facilities</td>
                <td>Water dischargers</td>
                <td>Vulnerable populations</td> -->
                </tr>
            </thead>
            <tbody>
                  <tr>
                      <td class="{`bg-${local_data.P_PTRAF_D2}`}">{local_data.P_PTRAF_D2}</td>
                      <td class="">{local_data.P_PM25_D2}</td>
                      <td>{local_data.P_OZONE_D2}</td>
                      <td>{local_data.P_DSLPM_D2}</td>
                      <td>{local_data.P_CANCR_D2}</td>
                  </tr>
              </tbody>
        </table>

        <table id="table-example-1" class="m-auto text-center styled-table mt-4">
            <caption class="text-center">
                <!-- <p class="font-semibold mb-1">{address_display?.slice(0,-7)}</p> -->
                <p class="font-semibold mb-2">Social Vulnerability Indicators</p>
                <p class="mb-2 italic">0 to 1, closer to 1 means higher vulnerability. <a href="https://svi.cdc.gov/map.html" target="_blank" class="underline text-blue-800">Explore the map</a></p>
            </caption>
            <thead>
                <tr class="">
                    <!-- {
                        "GEO_ID": 51107611005,
                        "AREA_SQMI": 6.193283030672,
                        "RPL_THEME1": 0.1115,
                        "RPL_THEME2": 0.1095,
                        "RPL_THEME3": 0.6096,
                        "RPL_THEME4": 0.1314,
                        "RPL_THEMES": 0.1118,
                        "F_THEME1": "0",
                        "F_THEME2": "0",
                        "F_THEME3": "0",
                        "F_THEME4": "0",
                        "F_TOTAL": "0",
                        "GINI_IND_Inequality_E": 0.3543,
                        "GINI_IND_Inequality_M": 0.0233,
                        "GINI_IND_Inequality_F": "-1",
                        "Blw_Pov_Lvl_PE": 2.2,
                        "Blw_Pov_Lvl_PF": "-1",
                        "Female_no_partner_w_child_PE": 3.2,
                        "Female_no_partner_w_child_PF": "0",
                        "Male_no_partner_w_child_PE": 1.9,
                        "Male_no_partner_w_child_PF": "0",
                        "crowd_occ_PE": "0",
                        "crowd_occ_PF": "0",
                        "HS_Grad_PE": 97.7,
                        "HS_Grad_PF": "1",
                        "ENG_LVW_PM": 1.3,
                        "ENG_LVW_PF": -1,
                        "WRK_FT_YR_PE": 62.2,
                        "WRK_FT_YR_PF": "1",
                        "No_Health_Ins_PE": 1.3,
                        "No_Health_Ins_PF": "-1",
                        "Broadband_PE": 97.6,
                        "Broadband_PF": "1",
                        "No_Veh_PE": 1.4,
                        "No_Veh_PF": -1,
                        "HO_Vac_PE": "2.7",
                        "HO_Vac_PF": "0",
                        "Rent_Vac_PE": "15.9",
                        "Rent_Vac_PF": "0"
                    } -->
                <td class="">Socio
                    economics</td>
                <td class="">Household Composition</td>
                <td class="">Minority / Language</td>
                <td class="">Housing and Transportation</td>
                <td class="">Overall</td>
                <!-- <td>Respiratory hazards (air)</td>
                <td>Lead paint indicator</td>
                <td>Risk management projects</td>
                <td>National priority sites</td>
                <td>TSD Facilities</td>
                <td>Water dischargers</td>
                <td>Vulnerable populations</td> -->
                </tr>
            </thead>
            <tbody>
                  <tr>
                        <td class="">{svi_cre_data.RPL_THEME1}</td>
                        <td class="">{svi_cre_data.RPL_THEME2}</td>
                        <td class="">{svi_cre_data.RPL_THEME3}</td>
                        <td class="">{svi_cre_data.RPL_THEME4}</td>
                        <td class="">{svi_cre_data.RPL_THEMES}</td>
                  </tr>
              </tbody>
        </table>

        <table id="table-example-1" class="m-auto text-center styled-table mt-4">
            <caption class="text-center">
                <!-- <p class="font-semibold mb-1">{address_display?.slice(0,-7)}</p> -->
                <p class="font-semibold mb-2">Community Resilience Indicators</p>
                <p class="mb-2 italic">Percentage of population in different categories</p>
                <!-- <p class="mb-2 italic">0 to 100, lower is better. <a href="https://ejscreen.epa.gov/mapper/" target="_blank" class="underline text-blue-800">Explore the map</a></p> -->
            </caption>
            <thead>
                <tr class="">
                    <!-- {
                        "GINI_IND_Inequality_E": 0.3543,
                        "GINI_IND_Inequality_M": 0.0233,
                        "GINI_IND_Inequality_F": "-1",
                        "Blw_Pov_Lvl_PE": 2.2,
                        "Blw_Pov_Lvl_PF": "-1",
                        "Female_no_partner_w_child_PE": 3.2,
                        "Female_no_partner_w_child_PF": "0",
                        "Male_no_partner_w_child_PE": 1.9,
                        "Male_no_partner_w_child_PF": "0",
                        "crowd_occ_PE": "0",
                        "crowd_occ_PF": "0",
                        "HS_Grad_PE": 97.7,
                        "HS_Grad_PF": "1",
                        "ENG_LVW_PM": 1.3,
                        "ENG_LVW_PF": -1,
                        "WRK_FT_YR_PE": 62.2,
                        "WRK_FT_YR_PF": "1",
                        "No_Health_Ins_PE": 1.3,
                        "No_Health_Ins_PF": "-1",
                        "Broadband_PE": 97.6,
                        "Broadband_PF": "1",
                        "No_Veh_PE": 1.4,
                        "No_Veh_PF": -1,
                        "HO_Vac_PE": "2.7",
                        "HO_Vac_PF": "0",
                        "Rent_Vac_PE": "15.9",
                        "Rent_Vac_PF": "0"
                    } -->
                <!-- <td class="">Income Inequality Index (0-1)</td> -->
                <td class="">Poverty</td>
                <td class="">Single Mothers</td>
                <td class="">Single Fathers</td>
                <td class="">HS Graduation</td>
                <td class="">No Health Insurance</td>
                <!-- <td>Respiratory hazards (air)</td>
                <td>Lead paint indicator</td>
                <td>Risk management projects</td>
                <td>National priority sites</td>
                <td>TSD Facilities</td>
                <td>Water dischargers</td>
                <td>Vulnerable populations</td> -->
                </tr>
            </thead>
            <tbody>
                  <tr>
                      <!-- <td >{svi_cre_data.GINI_IND_Inequality_E}</td> -->
                      <td class="">{svi_cre_data.Blw_Pov_Lvl_PE} %</td>
                      <td class="">{svi_cre_data.Female_no_partner_w_child_PE} %</td>
                      <td class="">{svi_cre_data.Male_no_partner_w_child_PE} %</td>
                      <td class="">{svi_cre_data.HS_Grad_PE} %</td>
                      <td>{svi_cre_data.No_Health_Ins_PE}% </td>
                  </tr>
              </tbody>
        </table>
        <button class="underline text-blue-500 mt-1" on:click={toggleEJTable}>Hide</button>
        </div>
        {/if}
        {:else if local_data == "no_data"}
        <p class="bg-red-200 px-2 py-1 mt-3">No data found for geo_id {geo_id}.  Try searching a different address.</p>
        {/if}
    {/if}
</div>
</div>
    
    {#if create_menu == "Success"}
    <div class="bg-green-200 text-green w-5/12 m-auto p-4 pt-6 relative">
        <button class="absolute top-1 right-1 cursor-pointer" on:click={closeEventDialogBox}><svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-square-x" width="20" height="20" viewBox="0 0 24 24" stroke-width="1.5" stroke="#597e8d" fill="none" stroke-linecap="round" stroke-linejoin="round">
                <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
            </svg></button>
        <p>Success!  You can see your event on the calendar, and start inviting others to join you on <strong>{new Date(new_event?.start).toLocaleString('en-US', date_display_options).slice(0,-6).concat('th').concat(` at ${new Date(new_event?.start).toLocaleTimeString()}`)}.</strong>  <button on:click={copyEventLink} class="text-blue-800 underline"><span class="">Share event with friends</span> <span>✉️</span></button>
        {#if copy_tooltip}
        <svg xmlns="http://www.w3.org/2000/svg" class="absolute inline-flex icon icon-tabler icon-tabler-circle-check" width="24" height="24" viewBox="0 0 24 24" stroke-width="1.5" stroke="#009988" fill="none" stroke-linecap="round" stroke-linejoin="round">
            <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
            <circle cx="12" cy="12" r="9" />
            <path d="M9 12l2 2l4 -4" />
          </svg>
        {/if}</p> 
    </div>
    {:else if create_menu == "Success_Calendar"}
    <div class="bg-green-200 text-green w-5/12 m-auto p-4 pt-6 relative">
        <button class="absolute top-1 right-1 cursor-pointer" on:click={closeEventDialogBox}><svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-square-x" width="20" height="20" viewBox="0 0 24 24" stroke-width="1.5" stroke="#597e8d" fill="none" stroke-linecap="round" stroke-linejoin="round">
                <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
            </svg></button>
        <p class="">Success!  If you refresh the page and load an area near your calendar, you should be able to view your events in the feed.  (Note, this is only for Google Calendar URLs at the moment.  Support for ICAL URLs coming soon.)</p>
    </div>
    {:else if create_menu == "Error"}
    <div class="bg-red-200 text-green w-5/12 m-auto p-4 pt-6 relative">
        <button class="absolute top-1 right-1 cursor-pointer" on:click={closeEventDialogBox}><svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-square-x" width="20" height="20" viewBox="0 0 24 24" stroke-width="1.5" stroke="#597e8d" fill="none" stroke-linecap="round" stroke-linejoin="round">
                <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
            </svg></button>
        <p>Error uploading event to database.  <button on:click={toggleEventForm} class="text-blue-800 underline"><span class="">Try again.</button></p> 
    </div>
    {:else if create_menu == "Error_Calendar"}
    <div class="bg-red-200 text-green w-5/12 m-auto p-4 pt-6 relative">
        <button class="absolute top-1 right-1 cursor-pointer" on:click={closeEventDialogBox}><svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-square-x" width="20" height="20" viewBox="0 0 24 24" stroke-width="1.5" stroke="#597e8d" fill="none" stroke-linecap="round" stroke-linejoin="round">
                <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
            </svg></button>
        <p>Error uploading event to database.  <button on:click={toggleCalendarForm} class="text-blue-800 underline"><span class="">Try again.</button></p> 
    </div>
    {/if}
    <div class="flex m-auto text-center mt-2">
<button on:click={toggleEventForm} class="ml-auto text-center rounded bg-gray-200 px-2 py-1">Start your own event</button>
<button on:click={toggleCalendarForm} class="ml-2 m-auto rounded bg-gray-200 px-2 py-1">Share your calendar feed</button>
    </div>



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
                <label class="text-sm" for="description">Why is this important to you and your community?  Let people know why they should show up.</label><br/>
                <textarea name="description" type="text" class="rounded border border-gray-300 block w-full mb-3 h-20"></textarea>
                <br>
                <button type="submit" class="mt-2 mb-2 rounded-full shadow bg-blue-200 px-2 py-1 text-right block ml-auto">Publish Meeting</button>
            </form>
            </div>
            {:else if create_menu == "Calendar"}
            <div class="rounded-md border-2 mt-4 p-2">
                <form on:submit|preventDefault={shareCalendarFeed} class="text-left">
                    <label class="text-sm" for="organization">Organization Name</label><br/>
                    <input name="organization" type="text" class="border-2 w-full mb-4 rounded-md h-8 p-1"/>
                    <br>

                    <label class="text-sm" for="url">Calendar URL</label><br/>
                    <label class="text-xs" for="url">If using Google Calendar, this could be <em>[youraccount]@gmail.com</em> or <em>[calendarid]@group.calendar.google.com</em></label><br/>
                    <input name="url" type="text" class="border-2 w-full mb-4 rounded-md h-8 p-1"/>
                    <br>

                    <label class="text-sm" for="address">Organization Address</label><br/>
                    <label class="text-xs" for="address">Enter an address for your organization, so this calendar can be shown to people in nearby locations.</label><br/>
                    <input name="address" type="text" class="border-2 w-full mb-4 rounded-md h-8 p-1"/>
                    <br>
    
                    <button type="submit" class="mt-2 mb-2 rounded-full shadow bg-blue-200 px-2 py-1 text-right block ml-auto">Share Calendar</button>
                </form>
                </div>
            {/if}
        </div>
        <div class="carousel-section mb-2">
        <p class="text-xl mt-8 mb-4">What do you want to organize?</p>
        <Carousel perPage={{ 800: 3, 500: 2 }} dots={false}>
            <div class="md:mr-2 slide-content">
                <div class="rounded bg-gray-200 h-64 px-4 py-2">
                    <h3 class="text-xl font-semibold my-2">Identify local issues, desires, and priorities.</h3>
                    <p class="mb-2">Convene with friends and neighbors in your community, listen and share to understand what each other are seeing and wanting, and start organizing for action.</p>
                    <a href="https://www.youtube.com/watch?v=uEzKUW95t28" target="_blank" class="underline text-blue-500">Learn more</a>
                </div>
            </div>
            <div class="md:mr-2 slide-content">
                <div class="rounded bg-gray-200 h-64 px-4 py-2">
                   <h3 class="text-xl font-semibold my-2">Climate Role-Play Event</h3>
                    <p class="mb-2">Want a live role-playing game, where you and your peers can take climate action towards the Paris Agreement?</p>
                    <!-- <p>Here's how.</p> -->
                    <a href="https://www.youtube.com/watch?v=V4U3obbn0fA" target="_blank" class="underline text-blue-500">Learn more</a>
                </div>
            </div>
            <div class="md:mr-2 slide-content">
                <div class="rounded bg-gray-200 h-64 px-4 py-2">
                    <h3 class="text-xl font-semibold my-2">C.A.N.</h3>
                    <p class="mb-2">Citizens Action Network.  Community Action Network.  Cities and Neighborhoods.  Climate Action Network.</p>
                    <p class="mb-2">Whatever CAN means to you, you and your community can make it happen.</p>
                    <a href="https://www.youtube.com/watch?v=HMHMr_o4y4s" target="_blank" class="underline text-blue-500">Learn more</a>
                </div>
            </div>
            <!-- <div class="ml-2 slide-content">
                <div class="rounded bg-gray-200 h-48 px-4 py-2">
                    <h3 class="text-xl font-semibold">Strong Town</h3>
                    <p>Strong Towns are about living well in the places we live, today and for future generations.  </p>
                    <p>Whatever CAN means to you, you and your community can make it happen.</p>
                </div>
            </div> -->
            <div class="md:mr-2 slide-content">
                <div class="rounded bg-gray-200 h-64 px-4 py-2">
                    <h3 class="text-xl font-semibold my-2">Future Design Walk</h3>
                    <p class="mb-2">Put yourselves in the minds of the people living 60 years in the future.</p>
                    <p class="mb-2">Walk around your community, discuss policies and solutions, and imagine from the perspective on behalf of the people to come.</p>
                    <a href="https://www.thealternative.org.uk/dailyalternative/2020/10/25/future-design-japan-time-rebels" target="_blank" class="underline text-blue-500">Learn more</a>
                </div>
            </div>
            <div class="md:mr-2 slide-content">
                <div class="rounded bg-gray-200 h-64 px-4 py-2">
                    <h3 class="text-xl font-semibold my-2">Come Together</h3>
                    <p class="mb-2">Message some friends and neighbors, tell them where and when, and start connecting, learning about each other, and building community together.</p>
                    <!-- <p class="mb-2">Walk around your community, discuss policies and solutions, and imagine from the perspective and on behalf of the people to come.</p> -->
                    <a href="https://www.youtube.com/watch?v=WdHBWL4LK88" target="_blank" class="underline text-blue-500">Learn more</a>
                </div>
            </div>
        </Carousel>
        </div>
        
        </div>
</div>
<style>

.styled-table {
    border-collapse: collapse;
    /* margin: 25px 0; */
    font-size: 0.9em;
    font-family: sans-serif;
    min-width: 300px;
    box-shadow: 0 0 20px rgba(0, 0, 0, 0.15);
}

.styled-table thead tr {
    background-color: #009879;
    color: #ffffff;
    text-align: left;
}

.styled-table th,
.styled-table td {
    padding: 9px 12px;
}

.styled-table tbody tr {
    border-bottom: 1px solid #dddddd;
}

.styled-table tbody tr:nth-of-type(even) {
    background-color: #f3f3f3;
}

.styled-table tbody tr:last-of-type {
    border-bottom: 2px solid #009879;
}
</style>