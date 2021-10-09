<script>
import { goto } from "$app/navigation";


    let action_store = [
        {
            name: "Feeding our community with a local food forest",
        }
    ];

    function openAction() {
        goto('/');
    }
</script>
<div class="flex">
    {#each action_store as action}
    <div on:click={openAction} class="cursor-pointer mt-10 md:text-center m-auto md:w-2/12 rounded-md border-2">
    <p>{action.name}</p>
    </div>
    {/each}
</div>