<script>
    import { goto } from "$app/navigation";


        let user_events = [
        ]
    
    
        let action = {
            name: "Falls Church Action",
            participants: 23,
            description: `We're starting a food forest, where we'll grow native plant species and edible local produce, and provide a place for the community to gather, garden, and grow together. <br><br> Requests: <br><br> 1. Meet in person to discuss and explore further, on Monday November 1st at 8:00pm.  <a href="" class="text-blue-500 underline">Add to calendar</a>`,
            requests: `Requests:
            
            1. Meet in person to discuss.  Meeting at 8:00pm on Monday, November 1st at Oak Lode.  <a href="">Add to Calendar</a>`,
            location: "Spokane, WA",
        }

        let name_edit = false;
        let place_edit = false;
        let description_edit = false;
    
        let participants = [
            {
                name: "Abby"
            },
            // {
            //     name: "Bob"
            // },
            // {
            //     name: "Claire"
            // },
            // {
            //     name: "David"
            // },
            // {
            //     name: "Elaine"
            // },
            // {
            //     name: "Fred"
            // },
            // {
            //     name: "Georgia"
            // },
            // {
            //     name: "Hallie"
            // },
            // {
            //     name: "Ionna"
            // },
            // {
            //     name: "Kelvin"
            // },
            // {
            //     name: "Loka"
            // },
            // {
            //     name: "Michael"
            // },
            // {
            //     name: "Nadine"
            // },
            // {
            //     name: "Oscar"
            // },
            // {
            //     name: "Petey"
            // },
            // {
            //     name: "Monroe"
            // },
            // {
            //     name: "Robert"
            // },
            // {
            //     name: "Orry"
            // },
            // {
            //     name: "Liza"
            // },
            // {
            //     name: "Mandy"
            // },
            // {
            //     name: "Anise"
            // },
            // {
            //     name: "Delilah"
            // },
            // {
            //     name: "Roc"
            // },
            // {
            //     name: "Stew"
            // },
    ]
    
        let participants_display = {
            height: "min-content"
        }
    
        let participants_index = 8;
    
        let joined = true;

        let published = true;
    
        function toggleParticipantsDisplay() {
        (participants_index == 8) ? (participants_index = participants.length) : (participants_index = 8);
        }
    
        function joinAction() {
           participants.push({name: "Jolene"});
           participants_index = participants.length;
           participants = participants;
           console.log(participants.length);
           joined = true;
           action_store.push({name: action.name});
           action_store = action_store;
        }
    
        let copy_alert = false;
    
       async function copyLink() {

// if(navigator.share) {
//       try {
//         const shareData = {
//           title: 'Web Share Demo',
//           text: 'Wanted to share this with you',
//           url: 'https://blahblah.com',
//         }
//         await navigator.share(shareData);
//         console.log('Share successfull');
//       } catch(err) {
//         console.log('Error: ', err);
//       }
//     } else {
//       console.warn('Native Web Sharing not supported');
//     }
            copy_alert = true;
    
            setTimeout(() => {
                copy_alert = false
            }, 1500)
        }
    
        let action_store = [];
    
        function goBack() {
            goto('/wall');
        }
        
        function toggleNameEdit() {
            (name_edit) ? (name_edit = false) : (name_edit = true);
        }

        function toggleDescriptionEdit() {
            (description_edit) ? (description_edit = false) : (description_edit = true);
        }

        function publishAction() {
            published = "publishing";
            setTimeout(() => {
                published = true;
                copy_alert = "publishing";
            }, 3000)
        }

        let geocoder;

        function geocodeNeighborhood() {

            action.neighborhood = geocoder + " CAN";
        }

        let state = "blank"
        action.neighborhood = "Kutina CAN";

        function publishActionNetwork() {
            state = "page"
        }

        function createActionGroup() {
            state = "form";
        }
    </script>

<div class="mt-10 md:text-center m-auto md:w-5/12 rounded-md border-2">
    
    <div class="md:px-8 md:py-4 py-2">

        {#if state == "form"}
        <form class="text-left">
            <label class="text-md" for="geocoder">What's your neighborhood?</label><br/>
            <input name="geocoder" bind:value={geocoder} type="text" class="border-2 w-8/12 mb-4 rounded-md"/><button on:click={geocodeNeighborhood} type="button" class="border-2 rounded-md px-1 bg-green-200">OK</button>
            <br>

            {#if action.neighborhood}
            <label class="text-md" for="name">CAN Name</label><br/>
            <input bind:value={action.neighborhood} name="name" type="text" class="w-8/12  mb-4" style="border-bottom: solid 1px black"/><br>

            <label class="text-md" for="email">Email Contact</label><br/>
            <input name="email" type="text" class="w-8/12 mb-4" style="border-bottom: solid 1px black" placeholder="hello@email.com"/><br>

            <label class="text-md" for="phone">Phone Contact</label><br/>
            <input name="phone" type="text" class="w-8/12" style="border-bottom: solid 1px black" placeholder="+XX XXX XXX XXX"/><br>

            <button type="button" on:click={publishActionNetwork} class="mt-4 mb-2 rounded-full shadow bg-blue-200 px-2 py-1 text-right block ml-auto">Create Action Network</button>
            {/if}
        </form>

        {:else if state == "page"}

        <div class="relative">
            {#if name_edit}
            <input style="border-bottom: solid 1px black" class="w-10/12 m-auto" bind:value={action.neighborhood}>
            <button on:click={toggleNameEdit}>
                <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-circle-check" width="24" height="24" viewBox="0 0 24 24" stroke-width="1.5" stroke="#000000" fill="none" stroke-linecap="round" stroke-linejoin="round">
                    <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                    <circle cx="12" cy="12" r="9" />
                    <path d="M9 12l2 2l4 -4" />
                  </svg>
                </button>
            {:else}
            <h1 class="text-lg">{action.neighborhood}</h1>
            <!-- <button on:click={toggleNameEdit} class="cursor-pointer absolute top-0 right-0"><svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-edit" width="22" height="22" viewBox="0 0 24 24" stroke-width="1.5" stroke="#000000" fill="none" stroke-linecap="round" stroke-linejoin="round">
                <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                <path d="M9 7h-3a2 2 0 0 0 -2 2v9a2 2 0 0 0 2 2h9a2 2 0 0 0 2 -2v-3" />
                <path d="M9 15h3l8.5 -8.5a1.5 1.5 0 0 0 -3 -3l-8.5 8.5v3" />
                <line x1="16" y1="5" x2="19" y2="8" />
              </svg></button> -->
            {/if}
        </div>


        <div class="mt-4 m-auto w-10/12 rounded-md border-2 text-left p-4 bg-yellow-50">
            <p class="text-lg">Post your first event here!</p>
            <p class="mt-2 text-md">One of the best things you can do is start a local event, to start building trust, relationships, and collective action with your fellow CAN doers.</p>
            <p class="mt-2 text-md">Once you know a time and a place — in person or online — post it here.</p>
        </div>

        {:else if state == "blank"}
        <button type="button" on:click={createActionGroup} class="mt-4 mb-2 rounded-full shadow bg-blue-200 px-2 py-1 text-right block ml-auto">New CAN</button>
        {/if}

        </div>

</div>