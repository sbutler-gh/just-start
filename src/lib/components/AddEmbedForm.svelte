<script>

import { listen_dev } from "svelte/internal";

</script>
<form class="mt-4 ml-auto text-left">
    <label for="media" style="text-align: left" class="text-left text-sm mb-3 block">Record a video or audio of yourself to a platform of your choice (Twitter, Facebook, Youtube), and once it's live, add the embed code here.</label>
    <textarea name="media" class="rounded border border-gray-300 block w-full mb-3" placeholder="<iframe .... ></iframe>"></textarea>
    <button class="ml-auto text-right rounded border block px-2 py-1">Submit</button>
</form>