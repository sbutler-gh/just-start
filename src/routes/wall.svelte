<script>
import { goto } from "$app/navigation";
import { new_action_store } from "$lib/stores.js";


    let location_name = "Spokane, Washington";


    let action_store = [
        {
            name: "Feeding our community with a local food forest",
            image: "https://www.wabe.org/wp-content/uploads/2019/06/Co_16_JPG_vh0llaNS-1024x769.jpg",
        },
        {
            name: "Saving energy with heat pumps and electrification",
            image: "https://www.novelcare.ca/wp-content/uploads/2019/12/Ductless-Heat-Pumps-scaled.jpg",
        },
        {
            name: "Feeding our flying friends with native plants",
            image: "https://www.chesapeakebay.net/images/blog/feb_23_21_1800-01.jpg"
        },
        {
            name: "Buying food together, healthier and cheaper",
            image: "https://opimedia.azureedge.net/-/media/images/men/editorial/articles/magazine-articles/2014/04-01/buy-bulk-food-to-save-money/fresh-produce-jpg.jpg",
        },
        {
            name: "Collecting, cleaning, and heating our water with sun and sky",
            image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQMrO_AHtqg10fGqGqdRNtcsgTFU7pJzuD0UgyXSL5f65gQRVM4Kf6fAtDd1lUg-i8e8Hk&usqp=CAU"
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
        goto('/draft_action');
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
<p class="text-center mt-4 hidden">{location_name}</p>
<!-- <p class="text-center text-lg mt-4">What do you wish for?</p> -->
<!-- <p class="text-center text-lg mt-4">Make life better.  Make the future better.</p>
<p class="text-center text-lg mt-4">Make better.</p> -->

<p class="text-left text-lg mt-4">Actions we know</p>

<div class="my-4 actions">
<div class="flex">
<!-- <p class="mt-4 text-lg text-left">Actions</p> -->
<!-- <button on:click={blankAction} class="ml-auto mt-2 rounded-full shadow bg-blue-200 px-2 py-1 relative">Add Action</button> -->
</div>

{#if action_store.length == 0}
<p class="mt-2 text-left italic"> No actions here yet.</p>
{/if}
</div>

<div class="hidden flex grid grid-cols-2 gap-4 text-left">
    {#each action_store as action}
    <div>
    <img src={action.image} class="h-32 w-48">
    <p class="text-sm">{action.name}</p>
    </div>
    {/each}
</div>

<div class="flex overflow-x-scroll overflow-y-hidden pb-6 grid grid-cols-3 gap-x-16 gap-y-4">
    {#each action_store as action}
    <div on:click={openAction} class="ml-0 h-32 cursor-pointer text-left m-auto w-48 px-2 py-1 rounded-md border-2">
    <p>{action.name}</p>
    <!-- <img src={action.image} class="h-32"> -->
    </div>
    {/each}
</div>

<p class="mt-6 text-lg text-left">Nearby Actions</p>
<div class="flex overflow-x-scroll overflow-y-hidden pb-6 grid grid-cols-3 gap-x-16 gap-y-4">
{#each inspirations as inspiration}
<div on:click={newAction} class="h-32 ml-0 cursor-pointer mt-4 text-left w-48 px-2 py-1 m-auto rounded-md border-2">
<p>{inspiration.name}</p>
</div>
{/each}
</div>
</div>
</div>