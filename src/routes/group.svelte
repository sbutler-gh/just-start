<script>
    import {events_store} from "$lib/stores";
    import EventDynamic from "$lib/components/EventDynamic.svelte";

    let group = "Fairfax Citizens Action";
</script>

<div style="width: 350px" class="md:text-center m-auto md:w-5/12">
    <p class="mt-4 text-center">{group}</p>
        <EventDynamic cursor="cursor-pointer" hover="hover:shadow" height="h-48" border="border-2" overflow="overflow-hidden" event={$events_store[0]}></EventDynamic>

        <p class="text-right ml-auto">Your first event is live!  Now start researching local organizations who'd like to join the conversation, and send invites their way.  Likewiwse, start having conversations with friends and neighbors, and invite them to get involved.</p>
        <p class="hidden text-right ml-auto">As you research, you can also pin relevant organizations and entities to the map, to save them for future reference and help others discover them as well!</p>
        <img id="location_img" class="hidden" src="https://maps.google.com/maps/api/staticmap?markers=icon%3Ahttps%3A%2F%2Fsecure.meetupstatic.com%2Fs%2Fimg%2F5961591462445047%2Fmup-custom-google-map-pin.png%7C38.894615%2C-77.439980&zoom=17&size=480x300&sensor=false&key=AIzaSyA3fSxhHZNQNfMjJuMFvmULACXrBfFz9jQ&signature=UWDg01O1EMndIJNgK_EkV8q8IJE%3D">
</div>