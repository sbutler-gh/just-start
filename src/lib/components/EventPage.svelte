<script>
    export let event;

    export let overflow;

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
</script>
        <div class="text-left p-4 pb-0 h-48 {overflow}">
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

        <div id="more-12" class="hidden text-left p-4 pb-4">
            <div class="mb-4 ml-auto text-right" style=''>
                <ul class='inline-flex'>
                  <li on:click={updateMenu} class='py-2 px-3 bg-gray-100 rounded text-gray-500 bg-gray-200 cursor-pointer mr-1'>Discussion</li>
                  <li on:click={updateMenu} class='active py-2 px-3 bg-gray-100 rounded cursor-default'>Location</li>
                </ul>
            </div>
            {#if menu == "Discussion"}
            <p>Discussion</p>
            {/if}
            <img id="location_img" class="" src="https://maps.google.com/maps/api/staticmap?markers=icon%3Ahttps%3A%2F%2Fsecure.meetupstatic.com%2Fs%2Fimg%2F5961591462445047%2Fmup-custom-google-map-pin.png%7C38.894615%2C-77.439980&zoom=17&size=480x300&sensor=false&key=AIzaSyA3fSxhHZNQNfMjJuMFvmULACXrBfFz9jQ&signature=UWDg01O1EMndIJNgK_EkV8q8IJE%3D">
        </div>
    <div class="hidden mb-4 flex px-1">
        <button on:click={expandEvent} class="cursor-pointer block">
            <svg xmlns="http://www.w3.org/2000/svg" class="hidden icon icon-tabler icon-tabler-share" width="24" height="24" viewBox="0 0 24 24" stroke-width="1.5" stroke="#597e8d" fill="none" stroke-linecap="round" stroke-linejoin="round">
                <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                <circle cx="6" cy="12" r="3" />
                <circle cx="18" cy="6" r="3" />
                <circle cx="18" cy="18" r="3" />
                <line x1="8.7" y1="10.7" x2="15.3" y2="7.3" />
                <line x1="8.7" y1="13.3" x2="15.3" y2="16.7" />
              </svg>
            Share</button>
        <button id={12} on:click={expandEvent} class="text-blue-500 ml-auto text-right cursor-pointer underline block">Toggle Details</button>
    </div>

    <style>
        ol {
            list-style: disc !important;
        }
    </style>