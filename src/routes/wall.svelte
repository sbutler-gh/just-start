<script>
import { goto } from "$app/navigation";
import { new_action_store } from "$lib/stores.js";


    let location_name = "Spokane, Washington";


    let action_store = [
        {
            name: "Feeding our community with a local food forest",
        },
        {
            name: "Saving energy with air pumps and electrification",
        },
        {
            name: "Feeding our flying friends with native plants",
        },
        {
            name: "Buying food together, healthier and cheaper",
        },
        {
            name: "Collecting, cleaning, and heating our water with sun and sky",
        },
        // {
        //     name: "Cleaning air with pollution-free transit",
        // },
        // {
        //     name: "Building value with local credit",
        // },
        // {
        //     name: "Staying protected with community storm shelters",
        // },
        // {
        //     name: "Staying above water with floating flood shelters",
        // },
        // {
        //     name: "Protecting our future by stopping Line 3",
        // },
        // {
        //     name: "Protecting our air by transvesting from fossil fuels to clean energy",
        // },
        // {
        //     name: "Making what we want with local spaces",
        // },
    ];

    let inspirations = [
        {
            name: "Feeding our community with a local food forest",
        },
        {
            name: "Saving energy with air pumps and electrification",
        },
        {
            name: "Feeding our flying friends with native plants",
        },
        {
            name: "Buying food together, healthier and cheaper",
        },
        {
            name: "Collecting, cleaning, and heating our water with sun and sky",
        },
        {
            name: "Cleaning air with pollution-free transit",
        },
        {
            name: "Building value with local credit",
        },
        {
            name: "Staying protected with community storm shelters",
        },
        {
            name: "Staying above water with floating flood shelters",
        },
        {
            name: "Protecting our future by stopping Line 3",
        },
        {
            name: "Protecting our air by transvesting from fossil fuels to clean energy",
        },
        {
            name: "Making what we want with local spaces",
        },

    ];

    function openAction() {
        goto('/template_action');
    }

    function newAction(e) {

        let action_name = e.target.innerText;

        $new_action_store =
            {
                name: action_name
            }

        // $new_action_store.name = action_name;
        
        console.log(e.target);
        console.log($new_action_store);
        goto('/blank_action');
    }

    function blankAction() {
       goto('/blank_action');
    }
</script>
<div class="mt-10 md:text-center m-auto md:w-5/12 rounded-md border-2">
    
    <div class="md:px-8 md:py-4 py-2">
<p class="text-center mt-4">{location_name}</p>

<div class="my-4 actions">
<div class="flex">
<p class="mt-4 text-lg text-left">Actions</p><button on:click={blankAction} class="ml-4 mt-4 rounded-full shadow bg-blue-200 px-2 py-1 relative">Add Action</button>
</div>

{#if action_store.length == 0}
<p class="mt-2 text-left italic"> No actions here yet.</p>
{/if}
</div>

<div class="flex overflow-x-scroll overflow-y-hidden pb-2">
    {#each action_store as action}
    <div on:click={openAction} style="min-width: 200px" class="ml-2 h-32 cursor-pointer mt-10 text-left m-auto w-48 px-2 py-1 rounded-md border-2">
    <p>{action.name}</p>
    </div>
    {/each}
</div>

<p class="mt-4 text-lg text-left">Possibilities</p>
<div class="flex overflow-x-scroll overflow-y-hidden pb-2">
{#each inspirations as inspiration}
<div on:click={newAction} style="min-width: 200px" class="h-32 ml-4 cursor-pointer mt-10 md:text-center m-auto rounded-md border-2">
<p>{inspiration.name}</p>
</div>
{/each}
</div>
</div>
</div>