<script>
    import {events_store} from "$lib/stores";
    import EventDynamic from "$lib/components/EventDynamic.svelte";
</script>

<div style="width: 350px" class="md:text-center m-auto md:w-5/12">
    
    <div class="md:px-4 md:py-2 py-2">
        {JSON.stringify($events_store[0])}
        <EventDynamic event={$events_store[0]}></EventDynamic>
     </div>
</div>