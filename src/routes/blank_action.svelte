<script>
    import { goto } from "$app/navigation";
    import { new_action_store } from "$lib/stores";

    let action;

    if ($new_action_store.name) {
        action = {
            name: $new_action_store.name,
            participants: 23,
            description: `Action description`,
            requests: ``,
            location: "Spokane, WA",
        }
    }

    else {
        action = {
            name: "Action title",
            participants: 23,
            description: `Action description`,
            requests: ``,
            location: "Spokane, WA",
        }
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

        let published = false;
    
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
    </script>
    
    <button class="absolute top-1 left-1" on:click|preventDefault={goBack}>Back</button>
    
    
    <div class="mt-10 md:text-center m-auto md:w-5/12 rounded-md border-2">
    
        <div class="md:px-8 md:py-4 py-2">
    
            <div class="relative">
                {#if name_edit}
                <input style="border-bottom: solid 1px black" class="w-10/12 m-auto" bind:value={action.name}>
                <button on:click={toggleNameEdit}>
                    <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-circle-check" width="24" height="24" viewBox="0 0 24 24" stroke-width="1.5" stroke="#000000" fill="none" stroke-linecap="round" stroke-linejoin="round">
                        <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                        <circle cx="12" cy="12" r="9" />
                        <path d="M9 12l2 2l4 -4" />
                      </svg>
                    </button>
                {:else}
                <h1 class="text-lg">{action.name}</h1>
                <button on:click={toggleNameEdit} class="cursor-pointer absolute top-0 right-0"><svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-edit" width="22" height="22" viewBox="0 0 24 24" stroke-width="1.5" stroke="#000000" fill="none" stroke-linecap="round" stroke-linejoin="round">
                    <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                    <path d="M9 7h-3a2 2 0 0 0 -2 2v9a2 2 0 0 0 2 2h9a2 2 0 0 0 2 -2v-3" />
                    <path d="M9 15h3l8.5 -8.5a1.5 1.5 0 0 0 -3 -3l-8.5 8.5v3" />
                    <line x1="16" y1="5" x2="19" y2="8" />
                  </svg></button>
                {/if}
            </div>
            
            <div class="relative">
            <p class="text-sm mb-2 inline">{action.location}</p>
            <svg xmlns="http://www.w3.org/2000/svg" class="inline icon icon-tabler icon-tabler-edit" width="22" height="22" viewBox="0 0 24 24" stroke-width="1.5" stroke="#000000" fill="none" stroke-linecap="round" stroke-linejoin="round">
                <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                <path d="M9 7h-3a2 2 0 0 0 -2 2v9a2 2 0 0 0 2 2h9a2 2 0 0 0 2 -2v-3" />
                <path d="M9 15h3l8.5 -8.5a1.5 1.5 0 0 0 -3 -3l-8.5 8.5v3" />
                <line x1="16" y1="5" x2="19" y2="8" />
              </svg>
            </div>
    
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
    
            {#if published}
            {#if joined}
            <button on:click={copyLink} class="mb-2 ml-2 m-auto rounded-full shadow bg-blue-200 px-2 py-1 inline-flex relative">Invite Others
                {#if copy_alert == true}
                <div class="ease-in-out transition absolute right-0 bg-gray-200 rounded p-1" style="margin-right: -100px; margin-top: -3px;">Link Copied</div>
                {:else if copy_alert == "publishing"}
                <div class="ease-in-out transition absolute right-0 bg-green-200 rounded p-1" style="margin-right: -150px; margin-top: -3px;">Now start sharing!</div>
                {/if}
            </button>
            {:else}
            <button on:click={joinAction} class="mb-2 ml-2 m-auto rounded-full shadow bg-blue-200 px-2 py-1">Join Action</button>
            {/if}
            {/if}
    
            <div class="relative">
                {#if description_edit}
                <textarea class="w-10/12" style="border-bottom: solid 1px black" rows="8" bind:value={action.description}></textarea>
                <svg on:click={toggleDescriptionEdit} xmlns="http://www.w3.org/2000/svg" class="absolute top-0 -right-3 icon icon-tabler icon-tabler-circle-check" width="24" height="24" viewBox="0 0 24 24" stroke-width="1.5" stroke="#000000" fill="none" stroke-linecap="round" stroke-linejoin="round">
                    <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                    <circle cx="12" cy="12" r="9" />
                    <path d="M9 12l2 2l4 -4" />
                  </svg>
                {:else}
                <p class="">{@html action.description}</p>
                <svg on:click={toggleDescriptionEdit} xmlns="http://www.w3.org/2000/svg" class=" absolute top-0 -right-3 icon icon-tabler icon-tabler-edit" width="22" height="22" viewBox="0 0 24 24" stroke-width="1.5" stroke="#000000" fill="none" stroke-linecap="round" stroke-linejoin="round">
                    <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                    <path d="M9 7h-3a2 2 0 0 0 -2 2v9a2 2 0 0 0 2 2h9a2 2 0 0 0 2 -2v-3" />
                    <path d="M9 15h3l8.5 -8.5a1.5 1.5 0 0 0 -3 -3l-8.5 8.5v3" />
                    <line x1="16" y1="5" x2="19" y2="8" />
                  </svg>
                  {/if}
            </div>

            <!-- <div class="relative">
                {#if description_edit}
                <textarea class="w-10/12" style="border-bottom: solid 1px black" rows="8" bind:value={action.requests}></textarea>
                <svg on:click={toggleDescriptionEdit} xmlns="http://www.w3.org/2000/svg" class="absolute top-0 -right-3 icon icon-tabler icon-tabler-circle-check" width="24" height="24" viewBox="0 0 24 24" stroke-width="1.5" stroke="#000000" fill="none" stroke-linecap="round" stroke-linejoin="round">
                    <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                    <circle cx="12" cy="12" r="9" />
                    <path d="M9 12l2 2l4 -4" />
                  </svg>
                {:else}
                <p class="mt-4">{@html action.requests}</p>
                <svg on:click={toggleDescriptionEdit} xmlns="http://www.w3.org/2000/svg" class=" absolute top-0 -right-3 icon icon-tabler icon-tabler-edit" width="22" height="22" viewBox="0 0 24 24" stroke-width="1.5" stroke="#000000" fill="none" stroke-linecap="round" stroke-linejoin="round">
                    <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                    <path d="M9 7h-3a2 2 0 0 0 -2 2v9a2 2 0 0 0 2 2h9a2 2 0 0 0 2 -2v-3" />
                    <path d="M9 15h3l8.5 -8.5a1.5 1.5 0 0 0 -3 -3l-8.5 8.5v3" />
                    <line x1="16" y1="5" x2="19" y2="8" />
                  </svg>
                  {/if}
            </div> -->

            {#if !published}
            <button on:click={publishAction} class="mt-4 mb-2 ml-2 m-auto rounded-full shadow bg-blue-200 px-2 py-1 inline-flex relative">Publish Action</button>
            {:else if published == "publishing"}
            <div class="ease-in-out transition bg-green-200 rounded p-1 mt-4" style="">
                <p>Success!  This action is live.</p>
            </div>
            {/if}
    
    
        </div>
    </div>