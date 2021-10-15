<script>
import { goto } from "$app/navigation";


    export let event;

    export let overflow;

    export let border;

    export let height;

    export let cursor;

    export let hover;

    let user_location = "Fairfax";

    let menu = "Location";

    if (!event) {
        event = {
    "name": "Fairfax Action — First Meeting",
    "when": "2021-10-15T11:36",
    "where": "Cherry Hill Park",
    "details": "",
    "group_id": "uuid",
    "group_name": "Fairfax Citizens Action"
    }

    event.details = `The first meeting of the ${user_location} Action group.  Join us at ${event.where}!<br><br>
    Share with friends and neighbors in the community to get more people involved!  And make sure to click "join" above, to recieve updates on the event and help with headcount.<br><br>
    To get prepared for the event, check out some of these resources:
    <ol class="mt-2" style="list-style: disc; margin-left: 1rem;">
        <li><a class="underline text-blue-500">CANs</a></li>
        <li><a class="underline text-blue-500">Strong Towns</a></li>
        <li><a class="underline text-blue-500">Systems Convening</a></li>
    </ol><br>
    Contact email:<br><br>
    Contact phone:`;

    }

    let day = new Date(event.when).toDateString();

    day = day.substring(0,3) + ", " + day.substring(3,10);

    let timezone = Intl.DateTimeFormat().resolvedOptions().timeZone
    
    let time = new Date(event.when).toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true});

    let when = day + " at " + time;

    console.log(event);

    function expandEvent(e) {
            console.log(e.target.id);
            let more =  document.getElementById(`more-12`);
            more.classList.contains('hidden') ? more.classList.remove('hidden') : more.classList.add('hidden')
        }

    function updateMenu(e) {

        let active = document.getElementsByClassName('active')[0];

        if (active != e.target) {

        console.log(e.target.innerText);
        menu = e.target.innerText;
        e.target.classList.remove("text-gray-500", "bg-gray-200", "cursor-pointer");

        let active = document.getElementsByClassName('active')[0];

        active.classList.add("text-gray-500", "bg-gray-200", "cursor-pointer");
        active.classList.remove("active", "cursor-default");

        e.target.classList.add('active', "cursor-default");

        menu == "Location" ? document.getElementById("location_img").classList.remove('hidden') : document.getElementById("location_img").classList.add('hidden');

        }
    }

    function toggleOverflow() {
        // height == "h-48" ? (height = "h-full") : (height = "h-48");
    }
    function openEvent() {
        goto('/new_event');
    }
</script>
<div class="md:px-4 md:py-2 py-2 relative">
    <div class="rounded-md {border} mt-4 m-auto w-11/12 mb-1 {cursor} {hover}" on:click={openEvent}>
        <div class="text-left p-4 pb-0 {height} {overflow}">
            <p class="text-lg font-bold">{event.name}</p>
            <p class="text-sm">with <a href="/group" class="cursor-pointer text-blue-500">{event.group_name}</a></p>

          <!-- <p class="mt-2 text-md">Want to understand what is happening with the Falls Church housing projects?  Want to make sure they are integrated, affordable, and make FC a better place to live — for us, and for our new neighbors to come?  Join us for a citizen's assembly on this topic.</p> -->

          <div class="flex">
            <p class="mt-2 text-sm text-blue-700 font-semibold">{when} <br>at {event.where}</p>
            <button type="button" class="mt-4 mb-2 rounded-full shadow bg-blue-200 px-2 py-1 text-right block ml-auto">Join</button>
        </div>

        {#if event.details}
        <p class="mt-2 text-md">{@html event.details}</p>
        {:else}
        <p class="mt-2 text-md text-blue-500 underline">Add details</p>
        {/if}
        </div>
    </div>

    <div class="flex w-11/12">
    <button class="rounded p-1 block text-sm bg-gray-200 text-left mx-4">Share Event</button>
    <a class="text-blue-500 underline text-sm text-right ml-auto">Add to Calendar</a>
    </div>
    
    </div>

    <style>
        ol {
            list-style: disc !important;
        }
    </style>
