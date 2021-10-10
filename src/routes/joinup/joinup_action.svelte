<script>

    import supabase from '$lib/db.js'
    import { get } from 'svelte/store';
    import { participants_store } from '$lib/stores.js';
import { goto } from '$app/navigation';

    let user_id;
    let action_id = `3d9f92c8-2203-11ec-9621-0242ac130002`
    let email;
    let password;
    let copy_alert;
    let copy_alert_offer;

    let participants_index = 8;

    let user_store = null;

    let participants_collapsed = true;

    let participants_collapsed_height = "26px";

    let participants_display = {
        overflow: "hidden",
        height: "min-content",
        collapsed: "true"
    }

    let actions_store;

    let mySubscription;

    // getActions();
    getUsersFromParticipants();
    fetchUser();
    getActions();

    
    async function fetchUser() {
        user_store = supabase.auth.user();
        console.log(user_store);

        if (user_store?.id) {
            getUser();
        }
    }

    async function getActions() {

        let { data: actions, error } = await supabase
        .from('actions')
        .select('*')
        .filter('id', 'eq', action_id)

        if (actions) {
            console.log(actions);

            actions_store = actions[0];
        }
        else {
            console.log(error);
        }

        console.log('page loaded');
    }

    async function getUser() {
        console.log(user_store);

        let { data: users_prod, error } = await supabase
        .from('users_prod')
        .select('*')
        .filter('id', 'eq', user_store.id)

        user_store = users_prod[0];
        console.log(user_store);
    }

    async function createParticipant() {

        const { data, error } = await supabase
        .from('participants')
        .insert([
            {
            user_id: user_store.id, 
            action_id: action_id
            },
        ])

        if (data) {
            console.log(data);
        }
        else {
            console.log('error');
            console.log(error)
        }

        console.log('created participant');
        // getUsersFromParticipants();
        let new_participant = {
            user_id: user_store.id,
            users_prod: {
                name: user_store.name
            }
        }
        $participants_store.push(new_participant);

        $participants_store = $participants_store;
    }

    async function getUsersFromParticipants() {

        let { data: participants_data, error } = await supabase
        .from('participants')
        .select(`
            user_id,
            users_prod (
            name
            )
        `)
        .filter('action_id', 'eq', action_id)

        if (participants_data) {
            console.log(participants_data);
            // let participants = participants_data;
            $participants_store = participants_data;
        }
        else {
            console.log('error');
            console.log(error);
        }

    }

    async function signInUser() {

        // var formData = new FormData(e.target);

        // console.log(formData);

        let { user, error } = await supabase.auth.signIn({
        email: email,
        password: password
        })

        if (error) {
            console.log(error)
        }
        else {
            user_store = user;
         console.log(user);
         console.log(user_store);
         getUser();
        }

    }

    async function LogOut() {
        let { error } = await supabase.auth.signOut();
        user_store = null;
    }

    function toggleParticipantsDisplay() {

        (participants_index == 8) ? (participants_index = $participants_store.length) : (participants_index = 8);
        // console.log(participants_display.height);
        // (participants_display.height == participants_collapsed_height) ? (participants_display.height = "min-content") : (participants_display.height = participants_collapsed_height);
    }

    function copyLink() {
        copy_alert = true;

        setTimeout(() => {
            copy_alert = false
        }, 1500)
    }

    function copyLinkOffer() {
        copy_alert_offer = true;

        setTimeout(() => {
            copy_alert_offer = false
        }, 1500)
    }

    // async function subscribeParticipants() {
    //     mySubscription = supabase
    //     .from('participants')
    //     .on('*', payload => {
    //         console.log('Change received!', payload)
    //     })
    //     .subscribe()

    //     console.log(mySubscription);
    // }

    // async function removeSubscribeParticipants() {
    //     supabase.removeSubscription(mySubscription);
    // }

    function goBack() {
        goto("/");
    }


    

</script>
{#if !user_store}
<form class="hidden absolute top-1 right-1">
<input placeholder="email" name="email" class="rounded border-gray-400 border block" bind:value={email}>
<input placeholder="password" class="rounded border-gray-400 border block" name="password" bind:value={password}>
<button type="button" on:click={signInUser} class="mt-2 rounded shadow bg-grey-200 px-4 py-1">Sign In</button>
</form>
{:else}

<form class="absolute top-1 right-1" on:submit={LogOut}>
    <p>{user_store.id}</p>
    <button class="mt-2 rounded shadow bg-gray-200 px-4 py-1">Log Out</button>
    </form>
 {/if}
 
 <button class="absolute top-1 left-1" on:click|preventDefault={goBack}>Back</button>

<div class="md:mt-10 text-center m-auto md:w-5/12 rounded-md border-2">

<!-- <div class="text-left alert flex flex-row items-center bg-green-200 p-2 rounded border-b-2 border-green-300">
    <div class="alert-icon flex items-center bg-green-100 border-2 border-green-500 justify-center h-7 w-7 flex-shrink-0 rounded-full">
        <span class="text-green-500">
            <svg fill="currentColor"
                 viewBox="0 0 20 20"
                 class="h-4 w-4">
                <path fill-rule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clip-rule="evenodd"></path>
            </svg>
        </span>
    </div>
    <div class="alert-content ml-2">
        <div class="alert-title font-semibold text-md text-green-800">
            Sharing is Saving
        </div>
        <div class="alert-description text-sm text-green-600">
            This more people who join this project, the more everyone saves.
        </div>
    </div>
</div> -->



<div class="px-8 py-4">
<div class="inline-flex mb-5 pt-8">
<h1 class="text-xl font-bold">{actions_store?.name} FC</h1>
</div>

{#if $participants_store}

<div class="relative w-4/6 m-auto">
<div class="relative m-auto" style="height: {participants_display.height}; overflow: hidden;">
{#each $participants_store.slice(0, participants_index) as participant, i}
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

<div class="mb-2">
<p on:click={toggleParticipantsDisplay} class="inline-flex text-blue-500 text-black cursor-pointer">{$participants_store.length} participants</p>
{#if $participants_store.some(o => o.user_id == user_store?.id)}
<button on:click={copyLink} class="ml-2 m-auto rounded-full shadow bg-blue-200 px-2 py-1 inline-flex relative">Invite Others
    {#if copy_alert}
    <div class="ease-in-out transition absolute right-0 bg-gray-200 rounded p-1" style="margin-right: -100px; margin-top: -3px;">Link Copied</div>
    {/if}
</button>
{:else}
<button on:click={createParticipant} class="ml-2 m-auto rounded-full shadow bg-blue-200 px-2 py-1">Join Action</button>
{/if}
</div>

<p class="italic hidden"> people who join this project, the more everyone saves.</p>

</div>
{/if}

<div class="mt-8 text-left">
{#if actions_store?.description}
{actions_store?.description}
{/if}
</div>
</div>

<div id="offer_section" class="text-left bg-gray-300 px-8 py-4">
    <h3 class="text-md text-gray-800 font-semibold">No offer yet</h3>
    <h3 class="text-sm text-gray-800"><a class="relative text-blue-800 underline cursor-pointer" on:click={copyLinkOffer}>Invite more friends and neighbors{#if copy_alert_offer}<div class="absolute right-0 bg-white text-black rounded p-1" style="margin-right: -90px; margin-top: -25px;">Link Copied</div>{/if}</a>, to save more and get an offer sooner.</h3>

</div>

</div>