<script>
    import {events_store, user_store} from "$lib/stores";
    import supabase from "$lib/db.js";
import { onMount } from "svelte";
import { get } from 'svelte/store';
import FullCalendar, { CalendarApi } from 'svelte-fullcalendar';
import dayGridPlugin from '@fullcalendar/daygrid';
// import iCalendarPlugin from '$lib/icalendar';
import iCalendarPlugin from '@fullcalendar/icalendar';
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
import SignUpProgramForm from "$lib/components/SignUpProgramForm.svelte"
import AddCalendar from "$lib/components/AddCalendar.svelte";

let data_theme = "light";

let data = [];
let parsed_data = [];
let string_data;

let screen_width;
$: outerWidth = 0;

let geo_id;

let svi_cre_data;

let local_data;

let location_buffer;
let location_coordinates;
let event_area;
let point;
let coordinates;
let cal_coordinates;

let todays_event;
let calendar_next_month_counter = 0;

let no_events = false;

let loaded_address;

let add_calendar = false;

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

let today_date = new Date();

let event = {
        when: now,
}


    onMount(async () => {

        const common = (await import('@fullcalendar/common')).default

        ipToCoordinates()
        .then(() => {

            // updateLocalData();

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
        loaded_address = `${json.city}, ${json.region}, ${json.postal}`;

        console.log(json.loc);
        coordinates = json.loc.split(',');
        console.log(coordinates);
        coordinates = {"lat": coordinates[0], "lng": coordinates[1]};
        // Seattle coordinates for testing
        // coordinates = {"lat": 47.6083, "lng": -122.335167};
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

const response = await fetch('/fetch_event_sources');

if (response) {
    let data = await response.json();
    console.log(data);
    let eventSources = data.data;

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
                    if (eventSources[i].cal_format == "google") {
                        eventSourcesArray.push({
                    googleCalendarId: eventSources[i].url
                    })
                    }

                    if (eventSources[i].cal_format == "ical") {
                        console.log('ical cal');
                        eventSourcesArray.push({
                    url: "https://serene-journey-42564.herokuapp.com/" + eventSources[i].url,
                    format: 'ics'
                    })
                    }
                }
            }
            
            // eventSourcesArray.push({
            //     googleCalendarId: eventSources[i].url
            // })
        }
        console.log(eventSourcesArray);
        console.log(eventsArray);
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

    // If you want to set the calendary initialView option according to screen size
    // let initialViewValue;

    // // console.log(screen.width);

    // // Checks the window width.  If window is less than 600px (e.g. narrow / mobile), then initialize calendar with listmonth display.
    // if (window.innerWidth < 600) {
    //     initialViewValue = 'listMonth'
    // }
    // // Otherwise, initialize calendar with standard month display.
    // else {
    //     initialViewValue = 'dayGridMonth'
    // }

options = {
initialView: 'listMonth',
plugins: [
        (await import('@fullcalendar/daygrid')).default,
        (await import('@fullcalendar/list')).default,
        (await import('@fullcalendar/timegrid')).default,
        // (await import('$lib/icalendar')).default,
        (await import('@fullcalendar/icalendar')).default,
        (await import('@fullcalendar/google-calendar')).default,
    ],
weekends: true,
googleCalendarApiKey: variables.googleCalendar,
eventSources: JSON.parse(eventSourcesArray),
events: JSON.parse(eventsArray),
initialDate: Date.now(),
validRange: function() {
    return {
      start: Date.now(),
      end: (Date.now() + 31557600000)
    };
  },
// events: {
//     url: 'https://serene-journey-42564.herokuapp.com/https://dweb.events/feed.ics',
//     format: 'ics',
//     // If headers are needed, can be addressed using this fix: https://stackoverflow.com/questions/58700821/fullcalendar-4-x-adding-header-x-requested-with-xmlhttprequest
// //     extraParams: {
// //         headers: [
// //             {"Access-Control-Allow-Origin":"*"}
// //         ]
// // }
//   },
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

// reset todays_event, so it can be found with new data;
todays_event = "";

// reset no_events value
no_events = false;

// reset calendar_month_next_counter, so it will only advance to next calendar for next two months
calendar_next_month_counter = 0;

// // check if there are eventSources.  If not, we'll recommend trying Seattle to get a feel.
// console.log(eventSourcesArray);

// set calendar to today, in case we're going from different city
calendarAPI.today();
}

function getTodaysEvent() {
    setTimeout(() => {
    let calendarAPI = calendar.getAPI();
    console.log(calendarAPI);
    console.log(calendarAPI.getEventSources());

    if (calendarAPI.getEventSources().length > 0) {
        let clientEvents = calendarAPI.getEvents();
        console.log(clientEvents);

        clientEvents.sort(function (a,b) {
            if (a._instance.range.start < b._instance.range.start) {
                return -1;
            }
            if (a._instance.range.start > b._instance.range.start) {
                return 1;
            }
        })

        console.log(clientEvents);

            for (var i = 0; i < clientEvents.length; i++) {
                let event = clientEvents[i];
                console.log(event);

                if (event._context.dateProfileGenerator.nowDate < event._instance.range.start) {
                    console.log('today is before the event' + i);
                    todays_event = event;
                    let time = new Date(todays_event.start.toString());
                    todays_event.local_start = time;
                    // todays_event.start = todays_event.start.toString();
                    break;
                }
                else {
                    console.log('today is after the event');
                }
            }

            if (!todays_event) {
                calendar_next_month_counter = calendar_next_month_counter + 1;
                console.log(calendar_next_month_counter);
                if (calendar_next_month_counter < 2)
                {
                    console.log(calendar_next_month_counter);
                calendarAPI.next();
                getTodaysEvent();
                }
                else {
                    no_events = true;
                }
            }
            else {
                console.log(todays_event);
            }
    }
  }, 2000)
}

async function updateCalendarEvents() {
    fetchEventSources()
    .then(()=> {
        getTodaysEvent();
    })
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

        formData.append('coordinates', JSON.stringify(coordinates));
        formData.append('event_object', JSON.stringify(new_event));

        console.log([...formData]);

        let response = await fetch('/insert_event', {
            method: "post",
            body: formData
        })

        if (response) {
            let data = await response.json();

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
    const request = await fetch(`https://api.opencagedata.com/geocode/v1/json?key=${variables.openCage}&q=${encodeURI(address)}`);    
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
            formData.append('cal_coordinates', JSON.stringify(cal_coordinates));

            let response = await fetch ('insert_event_source', {
                method: "post",
                body: formData
            })

        if (response) {
            let data = await response.json();

            console.log(data);

            let api = calendar.getAPI();

            // When FullCalendar attempts to load this new URL immediately, the get request will fail (You will see it in console.log)
            // Upon refreshing the page, the calendar should be showing as expected.  Make sure you put a real city name or address in the location field when testing, because the application generates coordinates from that location string — so you will only see it for your location on page load, if it's a location/address/string that returns coordinates around you.

            api.addEventSource(formData.get('url'));

            create_menu= "Success_Calendar";
        }
        else {
            console.log('error adding calendar, try again');
            create_menu = "Error_Calendar";
        }

        })
    }

    // async function signUp(e) {
    //     var formData = new FormData(e.target);

    //     let { user, error } = await supabase.auth.signUp({
    //     email: formData.get('email_phone'),
    //     password: formData.get('password')
    //     })

    //     if (user) {
    //         console.log(user);

    //         $user_store.id = user.id;
    //         $user_store.email = user.email;

    //         let { data: profiles, error } = await supabase
    //         .from('profiles')
    //         .update({ full_name: formData.get('name') })
    //         .eq('user_id', user.id)

    //         if (profiles) {
    //             console.log(profiles);
    //             $user_store.full_name = formData.get('name');

    //             user = {
    //                 id: user.id,
    //                 email: user.email,
    //                 full_name: formData.get('name')
    //             }

    //             localStorage.setItem('user', JSON.stringify(user));

    //             console.log(JSON.parse(localStorage.getItem('user')));
    //         }
    //         else {
    //          console.log(error);   
    //         }
    //         }
    //     else {
    //         console.log(error);
    //     }
    // }

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

    add_calendar = false;

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
    let response = await fetch('/fetch_cre_svi_data', {
        method: "POST",
        body: geo_id.slice(0,-1)})

    if (response) {
        let data = await response.json();
        console.log(data);
        svi_cre_data = data.data[0];
    }
    else {
        console.log(error);
    }
}

async function fetchEJData(geo_id) {

console.log(geo_id);

let response = await fetch('/fetch_ej_data', {
        method: "POST",
        body: geo_id})

if (response) {
    let data = await response.json();
    console.log(data);
    local_data = data.data[0];

    fetchCREandSVIdata(geo_id);

    if (!data.data[0]) {

        console.log('No data found for this location.  Try searching a more specific address.');
        local_data = "no_data";
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

<div style="" class="text-center m-auto md:w-8/12 mb-12">
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
    <div class="event-popup-details">
    {@html calendar_popup?.details}
    </div>
    {/if}
    <a href={add_to_calendar_url} target="_blank" class="mt-2 block underline text-blue-500">Add to Calendar</a>
</div>
{/if}

<div class="text-black">
<!-- <p class="text-xl my-8">Find an event near your, or grab some friends and start your own.</p> -->

<!-- <p class="font-semibold mb-2">{address_display}</p> -->

<p>Events in ...</p>
<div class="block m-auto my-2 "><input style="padding: 5px;" class="rounded border-2 w-9/12 md:w-64 mr-2" bind:value={address} placeholder="Search a location"> <button on:click={updateLocation} style="padding: 5px;" class="cursor-pointer rounded border-2 bg-gray-200 px-1">Update</button></div>
    
{#if no_events}
<p class="block my-4">Not much happening near you?  <span on:click={function(){ add_calendar = true}} class="link">Add a calendar</span> for a local organization, or try a city with more data like <span class="link" on:click={function() {address = "Seattle, Washington"; updateLocation()}}>Seattle</span>, <span class="link" on:click={function() {address = "New York City, New York"; updateLocation()}}>New York</span>, or <span class="link" on:click={function() {address = "Los Angeles, California"; updateLocation()}}>Los Angeles</span>.</p>
{/if}

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
<!-- <button on:click={toggleEventForm} class="m-auto text-center rounded bg-gray-200 px-2 py-1">+ Add new event</button> -->
<!-- <button on:click={toggleCalendarForm} class="ml-2 m-auto rounded bg-gray-200 px-2 py-1">Share your calendar feed</button> -->
    </div>
    <div class="my-2">
    {#if add_calendar}
<button class="rounded bg-gray-200 px-2 py-1" on:click={function() { add_calendar ? (add_calendar = false) : (add_calendar = true)}}>Cancel</button>
<AddCalendar></AddCalendar>
{:else}
<button class="m-auto rounded bg-gray-200 px-2 py-1" on:click={function() { add_calendar ? (add_calendar = false) : (add_calendar = true)}}>+ Add new calendar</button>
{/if}
</div>

{#if todays_event}
<br>
<div class="m-auto mx-4 md:mx-auto">
<h4>Next event:</h4>
<!-- <h4 class="text-xl font-bold mb-2">{todays_event.local_start.toLocaleString({hour: 'numeric', minute: 'numeric',
    hour12: true}).slice(0,24)} -->
     <!-- ({timezone} Timezone) -->
    <!-- </h4> -->

<div class="rounded p-4 text-left bg-yellow-200">
    <p class="text-lg font-bold">{todays_event.title}</p>
    <!-- <p class="text-sm"><strong>Start:</strong> {todays_event.start.toString().slice(0,33)}</p> -->
        {#if !todays_event.extendedProps?.location}
        <!-- <svg xmlns="http://www.w3.org/2000/svg" class="inline-flex" height="20px" width="20px" viewBox="0 0 20 20" fill="gray">
            <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
          </svg><p class="inline-flex text-sm font-semibold mb-4">See Details for Location</p> -->
        {:else}
        <svg xmlns="http://www.w3.org/2000/svg" class="inline-flex" height="20px" width="20px" viewBox="0 0 20 20" fill="gray">
            <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
          </svg>    <p class="inline font-semibold mb-4">{todays_event.extendedProps?.location}</p>
          <br>
        <!-- <p class="font-semibold">{todays_event.extendedProps?.location}</p> -->
        {/if}
        <svg xmlns="http://www.w3.org/2000/svg" class="inline-flex icon icon-tabler icon-tabler-clock" width="20" height="20" viewBox="0 0 24 24" stroke-width="1.5" stroke="#000000" fill="none" stroke-linecap="round" stroke-linejoin="round">
            <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
            <circle cx="12" cy="12" r="9" />
            <polyline points="12 7 12 12 15 15" />
          </svg>    <p class="font-semibold mb-2 inline">{todays_event.local_start.toLocaleString().slice(0,24)}</p>
        <!-- <p class="font-semibold mb-2">{todays_event.local_start.toLocaleString().slice(0,24)}</p> -->
          <br>
    {#if todays_event.extendedProps.description}
        <details class="todays-event-details ml-1 mt-2"><summary>Event Details</summary>
        {@html todays_event.extendedProps.description}
        </details>
    {/if}
    <a href={todays_event.url} target="_blank" class="mt-2 block underline text-blue-500">Open in Calendar</a>
</div>
</div>
{/if}

<!-- <p class="text-lg">Start an event, invite a few friends and neighbors, and bring possibilities to life.</p> -->
<!-- Or rich media message.  Could also include rich media message at the top. -->
<div class="md:flex my-8">
<div class="w-full xs:h-64 md:h-auto xs:text-center md:m-auto my-5">
    <FullCalendar bind:this="{calendar}" {options} />
</div>
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

        </div>
</div>
<style>
    .event-details a {
        color: rgb(229 231 235) !important;
    }

    .link {
        color: royalblue;
        text-decoration: underline;
        cursor: pointer;
    }

/* .styled-table {
    border-collapse: collapse;
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
} */
</style>