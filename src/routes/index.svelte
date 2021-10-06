<script>
    import AddEmbedForm from "$lib/components/AddEmbedForm.svelte";

    let topic = {
        media: `<iframe width="560" height="315" src="https://www.youtube.com/embed/bhwUeDkcA84" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen=""></iframe>`,
        description: "Hemp batteries, as a sustainable replacement in supply chains for batteries (e.g. devices, light vehicles) and other uses?  Other innovations like hemp, that can reduce extraction?"
    }

    let perspectives = [
        {
            media: `<iframe width="560" height="315" src="https://www.youtube-nocookie.com/embed/LEbi4hsPgVo" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`,
            date: ``
        },
        {
            media: `<iframe width="560" height="315" src="https://www.youtube-nocookie.com/embed/ehk7ry0Yqpk" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`,
            date: ``
        },
        {
            media: `<iframe width="560" height="315" src="https://www.youtube-nocookie.com/embed/UDjgSSO98VI" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`,
            date: ``
        },
        {
            media: `<iframe width="560" height="315" src="https://www.youtube-nocookie.com/embed/aCCK132OIGA" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`,
            date: ``
        }
    ]

    let new_element;
    let new_frame;

    let elements = [
        {
            content: "Can hemp be grown everywhere?  If so, could that help localize the supply chains?",
            date: ``
        },
        {
            content: "There may be functional differences between hemp batteries and lithium batteries, which should be understood for different devices and end uses.",
            date: ``
        },
        {
            content: "How accessible is the kind of hemp required for these batteries?  Can it be grown in yards?",
            date: ``
        },
        {
            content: "Maybe we don't need to worry about exisiting devices, if we can build new devices/tools that can utilize hemp batteries.",
            date: ``
        },
        {
            content: "Are there any risks, if hemp becomes ubiquitous?  If it becomes commoditized?  If it becomes a monoculture?",
            date: ``
        },
        {
            content: "What other materials like hemp belong in this conversation, and for what uses?",
            date: ``
        },
    ]

    let frames = [
        {
            content: "An open-source hemp battery specification, that people can use to take any type of hemp, and transform it into batteries of various sizes and charging capacities.  So from this spec, you could understand how to create a hemp battery that could suit a smartphone (of given size / power), a tablet, a laptop, or an electric bike, a drone, a household appliance, or to store solar power, etc.",
            date: ``
        },
        {
            content: "A hemp battery distribution network, so local makerspacers and producers can start building them, and buyers can find those local producers in the network.  This could eventually build from the hemp batteries to more aspects of the verticals, such as open-source 3D printable devices, hardware, vehicles, and tools.",
            date: ``
        },
        {
            content: "Some type of media or content, so people can become aware of hemp batteries and it can become a consumer expectation.",
            date: ``
        },
        {
            content: "A hemp battery event / fair, where people can see and buy all the things made with hemp batteries, and see all that's possible.",
            date: ``
        },
    ];

    let add_new_frame = false;

    let perspectives_previewed = 2;

    let perspectives_displayed = perspectives_previewed;

    let add_embed_form = false;

    let add_element_form = false;

    function toggleAddEmbedForm() {
        console.log('logging');
        if (add_embed_form) {
            add_embed_form = false;
            document.getElementById('addEmbedButton').classList.add('ml-auto');
        }

        else {
            add_embed_form = true;
            document.getElementById('addEmbedButton').classList.remove('ml-auto');
        }
        // (add_embed_form) ? (function() { add_embed_form = false; let button = document.getElementById('addEmbedButton'); button.classList.remove('ml-auto') } ) : (function() { add_embed_form = true; let button = document.getElementById('addEmbedButton'); button.classList.add('ml-auto') });
    }

    function togglePerspectivesList() {
        (perspectives_displayed == perspectives_previewed) ? (perspectives_displayed = perspectives.length) : (perspectives_displayed = perspectives_previewed);
    }

    function addElement() {
        let object = {
            content: new_element,
            date: ``
        }

        elements.push(object);

        console.log(elements);

        new_element = "";

        elements = elements;
    }

    function toggleAddNewFrame() {
        (add_new_frame) ? (add_new_frame = false) : (add_new_frame = true);
    }

    function addFrame() {
        let object = {
            content: new_frame,
            date: ``
        }

        frames.push(object);

        console.log(frames);

        new_frame = "";

        frames = frames;

        add_new_frame = false;
    }

</script>

<div class="mt-10 md:text-center m-auto md:w-6/12 rounded-md border-2 px-2">
    <div class="md:px-8 md:py-4 py-2">

        {@html topic.media}
        <p class="mt-4">{topic.description}</p>

        <div class="mt-4 text-right block ml-auto w-8/12">
            {#each perspectives.slice(0, perspectives_displayed)  as perspective, i}
            <div class="bg-white rounded border-2 border-gray-300 ml-auto mb-2">
                <p>{perspective.media}</p>
            </div>
            <!-- {@html perspective.media} -->
            {/each}

            <button on:click={togglePerspectivesList} class="underline">
                {#if perspectives.length > perspectives_displayed}
                View all perspectives
                {:else}
                Show less
                {/if}
            </button>

            <button id="addEmbedButton" on:click={toggleAddEmbedForm} class="block mt-4 ml-auto rounded border border-gray-300 px-2 py-1">
                {#if !add_embed_form}
                + Share Perspective
                {:else}
                Close
                {/if}
            </button>
            {#if add_embed_form}
            <AddEmbedForm></AddEmbedForm>
            {/if}
        </div>

        <div class="text-left mt-8 w-8/12">
            <!-- <p>What are important elements of this topic that we should make sure to consider (or not consider?)</p> -->
            <p>While exploring this topic, what are importnat elements we should make sure to consider — or not consider?</p>
            <ul class="list-disc">
            {#if elements}
            {#each elements as element}
            <li class="mt-4">{element.content}</li>
            {/each}
            {:else}
            {/if}

            <li class="mt-4 w-10/12"><textarea name="element" bind:value={new_element} style="border-bottom: solid gray 1px;" class="border-gray-300 block w-full mb-3 h-8"></textarea>
                {#if new_element}
                <button on:click={addElement} class="block mt-4 rounded border border-gray-300 px-2 py-1 ml-auto">Submit</button>
                {/if}
            </li>
            
            </ul>
        </div>

        <div class="text-left mt-8">
        <p class="text-lg">Frames</p>
        <p>Representations of the problem or possibility, so that they can be explored and we can compare + imagine alternatives (e.g. what if we changed X?  How would that be different?)</p>
        <p class="italic text-sm">Hansel and Gretel example (?)</p>

        <div class="mt-8">
            {#if frames}
            <div class="slider overflow-hidden">
            <div class="frames flex overflow-x-auto">
            {#each frames as frame}
            <div style="min-width: 85%;" class="mr-4 frame h-52 block mt-4 rounded border border-gray-300 px-2 py-1">
                <p>{frame.content}</p>
            </div>
            {/each}
            </div>
            </div>
            {/if}

            <button on:click={toggleAddNewFrame} class="block mt-4 rounded border border-gray-300 px-2 py-1">
                {#if !add_new_frame}
                Add Frame
                {:else}
                Close
                {/if}
            </button>
            {#if add_new_frame}
            <form class="w-12/12 mt-4">
            <textarea bind:value={new_frame} class="rounded border border-gray-300 block w-full mb-3 h-20" placeholder="Describe a concrete frame, representation, or possibility, which we may want to act on."></textarea>
            <button type="button" on:click={addFrame} class="block mt-4 rounded border border-gray-300 px-2 py-1 ml-auto">Submit</button>
            </form>
            {/if}

        </div>
        </div>

        
        </div>
</div>