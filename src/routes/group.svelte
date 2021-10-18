<script>
    import {events_store} from "$lib/stores";
    import EventDynamic from "$lib/components/EventDynamic.svelte";

    let artifacts = [];

    let group = "Fairfax Citizens Action";

    let user;

    let location;

    let create_menu;

    let discussion;

    let now = new Date().toISOString();
    now = now.slice(0, -8);

    var offset = new Date().getTimezoneOffset();
    console.log(offset);

    let event = {
        name: `${group} Meeting`,
        when: now,
        where: "",
        details: ``,
        group_id: "",
        group_name: ""
    }

    function publishDiscussion() {
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
</script>

<div style="width: 350px" class="md:text-center m-auto md:w-5/12">
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
            <form on:submit|preventDefault={publishEvent} class="text-left">
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