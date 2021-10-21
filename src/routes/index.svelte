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

let data = [];
let parsed_data = [];
let string_data;

let calendar;

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

        // console.log(localStorage.getItem('user'));

        // localStorage.getItem('user') ? ($user_store = JSON.parse(localStorage.getItem('user'))) : null;
        
        // console.log($user_store);

        // data = ical.parseICS(`https://timelyapp.time.ly/api/calendars/5978221/export?format=ics`);

        // console.log(data);
        // const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];


        // for (let k in data) {
        //     if (data.hasOwnProperty(k)) {
        //         var ev = data[k];
        //         if (data[k].type == 'VEVENT') {
        //             console.log(`${ev.summary} is in ${ev.location} on the ${ev.start.getDate()} of ${months[ev.start.getMonth()]} at ${ev.start.toLocaleTimeString('en-GB')}`);
        //             parsed_data.push({
        //                 start: ev.start.toISOString(),
        //                 // end: ev.end.toISOString(),
        //                 id: ev.uid,
        //                 title: ev.summary
        //             })
        //         }
        //     }
        // }
     
    })

    let options = {
    initialView: 'dayGridMonth',
    plugins: [dayGridPlugin, googleCalendarPlugin],
    weekends: true,
    googleCalendarApiKey: 'AIzaSyAYFvUdVW8ZDNHfdDJSc3ikM2EFXQhypiw',
    eventSources: [
        {
        googleCalendarId: 'c_n87mvbr7pmoaqnc3gghk7anso8@group.calendar.google.com',
        id: 'a'
        },
        {
            googleCalendarId: '72dh5ehol3oufbkusqagta0qf8@group.calendar.google.com',
            id: 'b'
        }
    ],
    eventClick: function(info) {
    info.jsEvent.preventDefault(); // don't let the browser navigate


    calendar_popup.title = info.event.title;
    calendar_popup.details = info.event.extendedProps.description;
    calendar_popup.x = info.jsEvent.pageX;
    calendar_popup.y = info.jsEvent.pageX;

    let calendarAPI = calendar.getAPI();
    // console.log(calendarAPI.getEventSourceById('a'));
    
    // calendarAPI.getEventSourceById('b').remove();
    console.log(JSON.stringify(calendarAPI.getEvents()));
  }
    };

function toggleWeekends() {
    options.weekends = !options.weekends;
    options = { ...options };
}
</script>

<div>
    {calendar_popup.title}<br>
    {@html calendar_popup?.details}<br>
    <!-- {calendar_popup.x}<br>
    {calendar_popup.y}<br> -->
</div>

<!-- <button on:click="{toggleWeekends}">toggle weekends</button> -->
<FullCalendar bind:this="{calendar}" {options} />