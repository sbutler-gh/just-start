<script>
import { goto } from "$app/navigation";

    import Event from "$lib/components/Event.svelte";
    let location = "Fairfax, Virginia ...";

    let events = [0,1,2,3,4,5,6,7,8,9,10];

    events = [];

    // sortEventsBySoonestAndClosest();

    function sortEventsBySoonestAndClosest() {

        for (var i = 0; i < events.length; i++) {
            console.log(`if ${i} is closer, set index of events to ${i}`);

            let calculation = Math.random();

            console.log(calculation);

            if (calculation > 0.5) {

                let new_index = events[i];
                events.splice(i, 1);
                events.unshift(new_index);
            }
        }

        console.log(events);
    }

    function createNewEvent() {
        console.log('new event');
        goto('/event_form');
    }

</script>

<div style="width: 350px" class="md:text-center m-auto md:w-5/12">
    
    <input bind:value={location} class="ml-1 mt-1 p-1 text-left border-2 rounded-md block w-4/12">
    
    <div class="md:px-4 md:py-2 py-2">

        {#if events.length == 0}

        <h2 on:click={createNewEvent} class="mt-8 px-2 text-center text-2xl font-semibold cursor-pointer">Start the first event in your area!</h2>
        {:else}

        <Event></Event>

            {#if events.length > 1}
                <p class="text-center">{events?.slice(1, events.length).length} more events near you this week</p>
                {#each events.splice(1, events.length) as event}
                <Event></Event>
                {/each}
            {:else}
                <button type="button" on:click={createNewEvent} class="text-center">No other events near you this week!  Start a new one!</button>
            {/if}
        {/if}

        </div>
</div>