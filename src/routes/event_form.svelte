<script>
import { goto } from "$app/navigation";

    import {events_store} from "$lib/stores";

    let user_location = "Fairfax";

    let location = "In-Person";

    // let now = DateTime.Now.ToString("yyyy-MM-ddTHH:mm");

    console.log(Intl.DateTimeFormat().resolvedOptions().timeZone);

    let now = new Date().toISOString();
    now = now.slice(0, -8);

    var offset = new Date().getTimezoneOffset();
    console.log(offset);

    let event = {
        name: `${user_location} Action — First Meeting`,
        when: now,
        where: "",
        details: ``,
        group_id: "",
        group_name: ""
    }
    let choose_group = false;

    function publishEvent() {

        if (!choose_group) {
            event.group_id = "uuid";
            event.group_name = `${user_location} Citizens Action`
        }

        console.log('need to handle group as well, automatically created with new event in this flow');
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
        console.log(event);
        $events_store.push(event);

        // goto event, show group as part of it
        goto('/new_event');
    }
</script>

<div style="width: 350px" class="md:text-center m-auto md:w-5/12">
    
    <p class="ml-1 mt-1 p-1 text-left block">Back</p>
    
    <div class="md:px-4 md:py-2 py-2">

        <form class="text-left">
            <label class="text-sm" for="geocoder">Event Name</label><br/>
            <input name="name" bind:value={event.name} type="text" class="border-2 w-full mb-4 rounded-md h-8 p-1"/>
            <br>

            <label class="text-sm" for="when">Date and Time</label><br/>
            <input type="datetime-local" name="when" bind:value={event.when} min={now}>
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

            {#if choose_group}
            <label class="text-sm" for="group">Group</label><br/>
            <select name="group" bind:value={event.group} class="border-2 w-full mb-4 rounded-md h-8 p-1">
                <option>Fairfax Sunrise</option>
                <option>The Usual Suspects</option>
                <option>GM School Group</option>
            </select>
            <br>
            {/if}
        </form>

        <button type="button" on:click={publishEvent} class="mt-2 mb-2 rounded-full shadow bg-blue-200 px-2 py-1 text-right block ml-auto">Publish Meeting</button>

     </div>
</div>