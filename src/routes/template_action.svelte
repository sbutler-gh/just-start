<script>
    import { goto } from "$app/navigation";
    
    
        let action = {
            name: "Feeding our community with a local food forest",
            participants: 23,
            description: "We're starting a food forest, where we'll grow native plant species and edible local produce, and provide a place for the community to gather, garden, and grow together.",
            location: "Washington DC"
        }
    
        let participants = [
            {
                name: "Abby"
            },
            {
                name: "Bob"
            },
            {
                name: "Claire"
            },
            {
                name: "David"
            },
            {
                name: "Elaine"
            },
            {
                name: "Fred"
            },
            {
                name: "Georgia"
            },
            {
                name: "Hallie"
            },
            {
                name: "Ionna"
            },
            {
                name: "Kelvin"
            },
            {
                name: "Loka"
            },
            {
                name: "Michael"
            },
            {
                name: "Nadine"
            },
            {
                name: "Oscar"
            },
            {
                name: "Petey"
            },
            {
                name: "Monroe"
            },
            {
                name: "Robert"
            },
            {
                name: "Orry"
            },
            {
                name: "Liza"
            },
            {
                name: "Mandy"
            },
            {
                name: "Anise"
            },
            {
                name: "Delilah"
            },
            {
                name: "Roc"
            },
            {
                name: "Stew"
            },
    ]
    
        let participants_display = {
            height: "min-content"
        }
    
        let participants_index = 8;
    
        let joined = false;
    
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
    
        function copyLink() {
            copy_alert = true;
    
            setTimeout(() => {
                copy_alert = false
            }, 1500)
        }
    
        let action_store = [];
    
        function goBack() {
            goto('/wall');
        }
    </script>
    
    <button class="absolute top-1 left-1" on:click|preventDefault={goBack}>Back</button>
    
    
    <div class="mt-10 md:text-center m-auto md:w-5/12 rounded-md border-2">
    
        <div class="md:px-8 md:py-4 py-2">
    
            <h1 class="text-lg">{action.name}</h1>
            <p class="text-sm mb-2">{action.location}<a href="/new_action" class="ml-2 cursor-pointer underline text-blue-500">Bring it to Spokane, WA</a></p>
    
            <div class="relative w-4/6 m-auto">
                <div on:click={toggleParticipantsDisplay} class="cursor-pointer relative m-auto" style="height: {participants_display.height}; overflow: hidden;">
                {#each participants.slice(0, participants_index) as participant, i}
                <p class="text-left inline-flex"><svg xmlns="http://www.w3.org/2000/svg" class="inline-block icon icon-tabler icon-tabler-mood-kid" width="28" height="28" viewBox="0 0 24 24" stroke-width="1.5" stroke="#000000" fill="none" stroke-linecap="round" stroke-linejoin="round">
                    <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                    <circle cx="12" cy="12" r="9" />
                    <line x1="9" y1="10" x2="9.01" y2="10" />
                    <line x1="15" y1="10" x2="15.01" y2="10" />
                    <path d="M9.5 15a3.5 3.5 0 0 0 5 0" />
                    <path d="M12 3a2 2 0 0 0 0 4" />
                  </svg></p>
                {/each}
                </div>
    
                <!-- <p on:click={toggleParticipantsDisplay} class="inline-flex text-blue-500 text-black cursor-pointer">{participants.length} people</p> -->
            </div>
    
            {#if joined}
            <button on:click={copyLink} class="mb-2 ml-2 m-auto rounded-full shadow bg-blue-200 px-2 py-1 inline-flex relative">Invite Others
                {#if copy_alert}
                <div class="ease-in-out transition absolute right-0 bg-gray-200 rounded p-1" style="margin-right: -100px; margin-top: -3px;">Link Copied</div>
                {/if}
            </button>
            {:else}
            <button on:click={joinAction} class="mb-2 ml-2 m-auto rounded-full shadow bg-blue-200 px-2 py-1">Join Action</button>
            {/if}
    
            <p class="">{action.description}</p>
    
    
        </div>
    </div>
    
    <div class="flex">
    {#each action_store as action}
    <div class="mt-10 md:text-center m-auto md:w-2/12 rounded-md border-2">
    <p>{action.name}</p>
    </div>
    {/each}
    </div>