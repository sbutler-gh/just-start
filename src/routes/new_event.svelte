<script>
    import {events_store} from "$lib/stores";
    import EventDynamic from "$lib/components/EventDynamic.svelte";

    let main_event = $events_store[0];
    console.log(main_event);
</script>

<div style="width: 350px" class="md:text-center m-auto md:w-5/12">
    
    <div class="md:px-4 md:py-2 py-2">
       <EventDynamic event={main_event}></EventDynamic>
     </div>
</div>