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
// let address = "1401 Constitution Avenue NW, Room 5128, Washington, DC 20230";

// eventSourcesArray[i] = {
//     googleCalendarId: ''
// }
let eventSourcesObject = `[
    {
        "googleCalendarId": "k82o4j8ae7igaqvlgimf2amvto@group.calendar.google.com"
    },
    {
        "googleCalendarId": "rcn0vfl7gakgs0n4jin7p9717c@group.calendar.google.com"
    },
    {
        "googleCalendarId": "rjgfkvruvo64nl0mgjb2ublr10@group.calendar.google.com"
    },
    {
        "googleCalendarId": "830bedaj6q9tjt2042a5r9t35c@group.calendar.google.com"
    },
    {
        "googleCalendarId": "npg8h9l5gq75uvi8hb4dinbhh0@group.calendar.google.com"
    },
    {
        "googleCalendarId": "npg8h9l5gq75uvi8hb4dinbhh0@group.calendar.google.com"
    },
    {
        "googleCalendarId": "oaj03ilc6q78v89qnjd58v8kn8@group.calendar.google.com"
    },
    {
        "googleCalendarId": "72dh5ehol3oufbkusqagta0qf8@group.calendar.google.com"
    },
    {
        "googleCalendarId": "c_n87mvbr7pmoaqnc3gghk7anso8@group.calendar.google.com"
    },
    {
        "googleCalendarId": "jq4j8rpp68153gjs3hm3qqrfhs@group.calendar.google.com"
    },
    {
        "googleCalendarId": "350colorado.org_j0p6542j4veqvob0ld2s2pds2c@group.calendar.google.com"
    },
    {
        "googleCalendarId": "0itj1252bfvl5t60r9390gsur4@group.calendar.google.com"
    },
    {
        "googleCalendarId": "mcmaster.ca_0hon444jcnv1q08u0e321mvjac@group.calendar.google.com"
    },
    {
        "googleCalendarId": "yimbyaction.org_mu1323rqrm8l3oe39cp0glqjmc@group.calendar.google.com"
    },
    {
        "googleCalendarId": "yimbyaction.org_j3urdk80b6iar4vb870n88cvak@group.calendar.google.com"
    },
    {
        "googleCalendarId": "yimbyaction.org_0oku96oeckra7incfv5s7if588@group.calendar.google.com"
    },
    {
        "googleCalendarId": "yimbyaction.org_ra67a1b1d6ii7volenc4ot53kk@group.calendar.google.com"
    },
    {
        "googleCalendarId": "yimbyaction.org_l2mfnatktu8lbv1hrd9tckbdj8@group.calendar.google.com"
    },
    {
        "googleCalendarId": "1ng34go1ufl6p77v4bade2dnes@group.calendar.google.com"
    },
    {
        "googleCalendarId": "c_a6roi7sdgdi99imiqutg56hpvg@group.calendar.google.com"
    },
    {
        "googleCalendarId": "santacruzyimby@gmail.com"
    },
    {
        "googleCalendarId": "climaterealitypghswpa@gmail.com"
    },
    {
        "googleCalendarId": "e3uve65n4nahe36hqo82vb8cko@group.calendar.google.com"
    },
    {
        "googleCalendarId": "tdqqlimebh88vv6709o0ebjnh4@group.calendar.google.com"
    },
    {
        "googleCalendarId": "b168mbr3ua6pq0m3q66et0u0hs@group.calendar.google.com"
    },
    {
        "googleCalendarId": "jlintondesign.com_pe6dh7g2jmetc30f4knv90m7q0@group.calendar.google.com"
    },
    {
        "googleCalendarId": "climaterealitydfw@gmail.com"
    },
    {
        "googleCalendarId": "la8u8mj42bkgktoo73nmm42h6g%40group.calendar.google.com"
    },
    {
        "googleCalendarId": "tacomawachapter@gmail.com"
    },
    {
        "googleCalendarId": "oai12c0uuqmdhpu5ak6d23mfms@group.calendar.google.com"
    },
    {
        "googleCalendarId": "cnd@northcountrytrail.org"
    },
    {
        "googleCalendarId": "c_eblo7tbsqntvubgs6kmfvhjvng@group.calendar.google.com"
    },
    {
        "googleCalendarId": "350brooklyn@gmail.com"
    },
    {
        "googleCalendarId": "350fairfax@gmail.com"
    },
    {
        "googleCalendarId": "6qfq0k7vcf2llhmjdn3pn8kf6k@group.calendar.google.com"
    },
    {
        "googleCalendarId": "b1h5vn6slpb501rkq6penjifjc@group.calendar.google.com"
    },
    {
        "googleCalendarId": "350mass.metrowest@gmail.com'"
    },
    {
        "googleCalendarId": "https://350ct.org/events/?ical=1"
    },
    {
        "googleCalendarId": "rcn0vfl7gakgs0n4jin7p9717c@group.calendar.google.com"
    },
    {
        "googleCalendarId": "climateactionphilly@gmail.com"
    },
    {
        "googleCalendarId": "https://www.solarunitedneighbors.org/events/?ical=1"
    },
    {
        "googleCalendarId": "plk5nmb5o48t6orvphluggdjo0@group.calendar.google.com"
    },
    {
        "googleCalendarId": "7q0i7hpspf649g5brjq0q644cc@group.calendar.google.com"
    },
    {
        "googleCalendarId": "brq7mot601lj0jksiloc0spm2s@group.calendar.google.com"
    },
    {
        "googleCalendarId": "350newhampshire@gmail.com"
    },
    {
        "googleCalendarId": "350pittsburgh@gmail.com"
    },
    {
        "googleCalendarId": "4cdo03qksvfkqv86b8cjbe2ttk@group.calendar.google.com"
    },
    {
        "googleCalendarId": " 350stl.org_bh9rh54kakvh5gd9hv4mam0qag@group.calendar.google.com "
    },
    {
        "googleCalendarId": "s29jhr80slk0bvl43gnvsu7ejo@group.calendar.google.com"
    },
    {
        "googleCalendarId": "350chicago.org_fed24a32kqna3f3b7r4ekjr0qo@group.calendar.google.com"
    },
    {
        "googleCalendarId": "1vfiqgmaobq6iu944bnl7g24ag@group.calendar.google.com"
    },
    {
        "googleCalendarId": "o4sd25lg15otfoird89di40kdg@group.calendar.google.com"
    },
    {
        "googleCalendarId": "https://350santafe.org/events/?ical=1"
    },
    {
        "googleCalendarId": "qctfj4gfl9i2f47bvc77ab05ns@group.calendar.google.com"
    },
    {
        "googleCalendarId": "g2l3t9npek40kg1hu568vj4vt8@group.calendar.google.com"
    },
    {
        "googleCalendarId": "cb5q95hc1vo8bbq5qtj39g0gfk@group.calendar.google.com"
    },
    {
        "googleCalendarId": "ndbrqeg6ktu11shh05h5t9aa5o@group.calendar.google.com"
    },
    {
        "googleCalendarId": "gtus9b30uu6fnfoqgu14li7jt4@group.calendar.google.com"
    },
    {
        "googleCalendarId": "350eugene.org_4ehkg0kti31bi1kiejc1tkcpe8@group.calendar.google.com"
    }
]`;

let calendar_popup_show = false;

let calendar_popup = {
        title: '',
        details: '',
        x: '',
        y: '',
    }

    onMount(async () => {

        const common = (await import('@fullcalendar/common')).default
        options.plugins = [
			(await import('@fullcalendar/daygrid')).default,
            // (await import('@fullcalendar/icalendar')).default,
            (await import('@fullcalendar/google-calendar')).default,
		];

        // const request = await fetch("https://ipinfo.io/json?token=d41bed18e5fda2");
        // const json = await request.json()

        // console.log(json);

        // address_display = `${json.city}, ${json.region}, ${json.postal}`;

        // geocodeCoordinates(json.loc);

        // let { data: eventSources, error } = await supabase
        // .from('eventSources')
        // .select('*')

        // if (eventSources) {
        //     console.log(eventSources)

        //     for (var i=0; i<eventSources.length; i++) {
        //         eventSourcesArray[i] = {
        //             googleCalendarId: eventSources[i].url
        //         }
        //     }

        //     // console.log(eventSourcesArray);
        //     // console.log([...eventSourcesArray]);
        //     // console.log(eventSourcesArray[0])
        //     eventSourcesArray = JSON.stringify(eventSourcesArray, null, 2);
        //     // console.log(eventSourcesArray);
        //     // console.log(eventSourcesObject);
        //     // console.log(eventSourcesArray == eventSourcesObject);
        //     // console.log(typeof eventSourcesArray);
        //     // console.log(typeof eventSourcesObject);
        //     eventSourcesObject = eventSourcesArray;
        //     // eventSourcesArray = eventSourcesObject;
        // }
        // else {
        //     console.log(error);
        // }

        

        // // console.log(localStorage.getItem('user'));

        // // localStorage.getItem('user') ? ($user_store = JSON.parse(localStorage.getItem('user'))) : null;
        
        // // console.log($user_store);

        // // data = ical.parseICS(`https://timelyapp.time.ly/api/calendars/5978221/export?format=ics`);

        // // console.log(data);
        // // const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];


        // // for (let k in data) {
        // //     if (data.hasOwnProperty(k)) {
        // //         var ev = data[k];
        // //         if (data[k].type == 'VEVENT') {
        // //             console.log(`${ev.summary} is in ${ev.location} on the ${ev.start.getDate()} of ${months[ev.start.getMonth()]} at ${ev.start.toLocaleTimeString('en-GB')}`);
        // //             parsed_data.push({
        // //                 start: ev.start.toISOString(),
        // //                 // end: ev.end.toISOString(),
        // //                 id: ev.uid,
        // //                 title: ev.summary
        // //             })
        // //         }
        // //     }
        // // }
     
    })

    let options = {
    initialView: 'dayGridMonth',
    plugins: [dayGridPlugin, googleCalendarPlugin],
    weekends: true,
    googleCalendarApiKey: 'AIzaSyDYxnSEee64WAIFIyEft-sxjUhNYBMoPG4',
    eventSources: JSON.parse(eventSourcesObject),
    eventClick: function(info) {
    info.jsEvent.preventDefault(); // don't let the browser navigate


    calendar_popup.title = info.event.title;
    calendar_popup.details = info.event.extendedProps.description;
    calendar_popup.x = info.jsEvent.pageX;
    calendar_popup.y = info.jsEvent.pageY;


    console.log(info.event.extendedProps);

    calendar_popup_show = true;

    // console.log(calendar_popup);

    calendarAPI = calendar.getAPI();
    // console.log(calendarAPI.getEventSourceById('a'));
    
    // calendarAPI.getEventSourceById('b').remove();
    // console.log(JSON.stringify(calendarAPI.getEvents()));
  }
    };

//     for (var i=0; i<eventSourcesArray.length; i++) {
//     calendarAPI.addEventSource(eventSourcesArray[i]['googleCalendarId']);
// }

    

function toggleWeekends() {
    options.weekends = !options.weekends;
    options = { ...options };
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
<svelte:head>
    <!-- <script type='text/javascript' src='fullcalendar-1.6.2/fullcalendar/gcal.js'></script> -->
</svelte:head>
<html data-theme={data_theme}>
<select bind:value={data_theme} class="select absolute top-1 right-1">
 <option>light</option>
<option>dark</option>
<option>cupcake</option>
<option>bumblebee</option>
<option>emerald</option>
 <option>corporate</option>
<option> synthwave</option>
<option>retro</option>
<option>cyberpunk</option>
<option>valentine</option>
<option>halloween</option>
<option>garden</option>
<option>forest</option>
<option>lofi</option>
<option>pastel</option>
<option> fantasy</option>
<option>wireframe</option>
<option>black</option>
<option>luxury</option>
<option>dracula</option>
</select>

<body>
<div class="text-center">
<h1 class="text-2xl mb-2">Want to make a difference?</h1>
<h1 class="text-2xl mb-2">You're right on time.</h1>

<p class="font-semibold mb-2">{address_display}</p>

<input class="rounded border-2 w-64 mb-2" bind:value={address}> <button class="btn btn-primary rounded-full btn-accent btn-primary btn-sm h-0">Search</button>


    <h1 class="text-2xl">Start your own event.  Here's some inspiration</h1>

    <button on:click={toggleEventForm} class="btn btn-primary rounded-full btn-primary btn-sm h-0">Add Event to Calendar</button>
    </div>

<!-- <button on:click="{toggleWeekends}">toggle weekends</button> -->
<!-- <FullCalendar bind:this="{calendar}" {options} /> -->

<!-- {#if calendar_popup_show}
<div class="shadow rounded border-2 bg-white" style="position: absolute; z-index: 100; width: 300px; top: {calendar_popup.y}px; left: {calendar_popup.x}px">
    {calendar_popup.title}<br>
    {@html calendar_popup?.details}<br>
</div>
{/if} -->
</body>
</html>

<!-- Option to show this and load it -->

<!-- <iframe width="100%" height="100%" src="https://www.airnow.gov/"></iframe> -->

<!-- <iframe width="100%" height="100%" src="https://www.slc.gsa.gov/slc/"></iframe> -->

<!-- <iframe width="100%" height="100%" src="https://www.eia.gov/state/maps.php?src=home-f3"></iframe> -->

<!-- https://hazards.fema.gov/nri/map -->
<style>
       .fc-month-view span.fc-title{
         white-space: normal;
   }
</style>


    <!-- //     googleCalendarId: 'scv8jmntmv4549is1lkmhpt1as@group.calendar.google.com'
    // },
    // {
    //     https://350bayarea.org/events/?ical=1
            // <link rel="alternate" type="text/calendar" title="350PDX: Climate Justice » iCal Feed" href="https://350pdx.org/calendar/?ical=1">
            // <a class="tribe-events-ical tribe-events-button" title="Use this to share calendar data with Google Calendar, Apple iCal and other compatible apps" href="https://350santafe.org/events/month/?tribe-bar-date=2021-10-22&amp;ical=1&amp;tribe_display=month">+ Export Events</a>
            // <a class="ai1ec-tooltip-trigger ai1ec-tooltip-auto" target="_blank" data-placement="right" title="Subscribe to this calendar in Apple Calendar/iCal" href="webcal://sandiego350.org/?plugin=all-in-one-event-calendar&amp;controller=ai1ec_exporter_controller&amp;action=export_events&amp;no_html=true">
        //    <link rel="alternate" type="text/calendar" title="Boulder.Earth Climate Action Portal » iCal Feed" href="https://boulder.earth?ical=1">
                // https://calendar.google.com/calendar/ical/events%40350sacramento.org/public/basic.ics
    // webcal://www.ccacoalition.org/en/events/calendar/ical/%2A/calendar.ics
    // https://ggwash.org/calendar/ical
    // https://centerforearthethics.org/events/feed/
                // }

    // {
    //     googleCalendarId: 'oai12c0uuqmdhpu5ak6d23mfms@group.calendar.google.com',
    //     dataType : 'jsonp',
    //     url: 'https://albionmich.net/calendar/'
    // },
    // {
    //     googleCalendarId: 'ht3jlfaac5lfd6263ulfh4tql8@group.calendar.google.com',
    //     dataType : 'jsonp',
    //     url: 'https://albionmich.net/calendar/'
    // },
    // {
    //     googleCalendarId: 'c_hk8i3tnmn4vt2sh6huclfcd7p0@group.calendar.google.com',
    //     url: 'https://faithinnewyork.org/event/finy-civic-engagement-organizing-3/'
    // },
    // {
    //     'https://www.waynemetro.org/wm-events/?ical=1',
    //     'www.doi.gov/events/calendar/section/59/export.ics'
    // } -->