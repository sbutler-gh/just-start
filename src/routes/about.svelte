<script>import "../app.css";

import { variables } from '$lib/variables';
// import SignUpProgramForm from "$lib/components";


let copy_tooltip = false;


function copyPostLink() {
    console.log('clicked copy');
                if (!navigator.clipboard){
                // use old commandExec() way
                `https://www.rebrand.ly/just-start-intro`.select();
                window.location.setSelectionRange(0, 99999)
                document.execCommand("copy");
                copy_tooltip = true;
                setTimeout(function(){ copy_tooltip = false }, 1000)

            } else{
                navigator.clipboard.writeText(`https://www.rebrand.ly/just-start-intro`).then(
                    function(){
                        console.log("Copied URL");
                        copy_tooltip = true;
                        setTimeout(function(){ copy_tooltip = false }, 1000)
                    })
                    .catch(
                    function() {
                        console.log("Couldn't copy, try right-clicking to copy the URL isntead."); // error
                    });
            }
            return false;    
        }

  function clickLink() {
    return false;
  }

  function printPage() {
    window.print();
  }
  
</script>
<svelte:head>
  <title>Just Start</title>
  <meta name="description" content="Coming together, and organizing the futures we believe in.">
  
  <!-- Facebook Meta Tags -->
  <meta property="og:url" content="https://www.rebrand.ly/just-start-intro">
  <meta property="og:type" content="website">
  <meta property="og:title" content="What can I do about X?  Just start organizing.">
  <meta property="og:description" content="Coming together, and organizing the futures we believe in.">
  <meta property="og:image" content="https://thefriend.org/assets/ugc/images/growing-pains.jpg">
  
  <!-- Twitter Meta Tags -->
  <meta name="twitter:card" content="summary_large_image">
  <meta property="twitter:domain" content="rebrand.ly">
  <meta property="twitter:url" content="https://www.rebrand.ly/just-start-intro">
  <meta name="twitter:title" content="What can I do about X?  Just start organizing.">
  <meta name="twitter:description" content="Coming together, and organizing the futures we believe in.">
  <meta name="twitter:image" content="https://thefriend.org/assets/ugc/images/growing-pains.jpg">
  
</svelte:head>
<div style="" class="text-center m-auto md:w-8/12">
<!-- <div class="text-center bg-black text-white p-8 md:mt-0 relative">

  <div class="absolute top-3 md:top-2 left-4 md:left-10 flex">
    <a href="/" class="cursor-pointer" style="color: #ffffff;">Home</a>
  </div>

    <div class="absolute top-3 md:top-2 right-10 flex">

        <a href="mailto:juststart@sambutler.us" class="cursor-pointer" style="margin-top: -3px; color: white !important;" target="_blank">
        <svg xmlns="http://www.w3.org/2000/svg" class="mr-4 md:mr-4 h-6 w-6 cursor-pointer hover:opacity-80" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        </a>
          
          <a href="https://github.com/sbutler-gh/just-start" target="_blank">
          <svg role="img" class="mr-4 md:mr-4 cursor-pointer hover:fill-current" style="width: 18px; text-color: #dca0ff !important;" fill="#b953f4" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><title>GitHub</title><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg>    <div class="hover:cursor-pointer">
          </a>

        <a href="https://discord.gg/dTSmGuBXt8" target="_blank"> <svg xmlns="http://www.w3.org/2000/svg" style="padding-top: 1px" class="absolute hover:cursor-pointer" width="22" viewBox="0 0 71 55" fill="none">
        <g clip-path="url(#clip0)">
        <path class="hover:fill-current hover:cursor-pointer" style="color: #7783ff" d="M60.1045 4.8978C55.5792 2.8214 50.7265 1.2916 45.6527 0.41542C45.5603 0.39851 45.468 0.440769 45.4204 0.525289C44.7963 1.6353 44.105 3.0834 43.6209 4.2216C38.1637 3.4046 32.7345 3.4046 27.3892 4.2216C26.905 3.0581 26.1886 1.6353 25.5617 0.525289C25.5141 0.443589 25.4218 0.40133 25.3294 0.41542C20.2584 1.2888 15.4057 2.8186 10.8776 4.8978C10.8384 4.9147 10.8048 4.9429 10.7825 4.9795C1.57795 18.7309 -0.943561 32.1443 0.293408 45.3914C0.299005 45.4562 0.335386 45.5182 0.385761 45.5576C6.45866 50.0174 12.3413 52.7249 18.1147 54.5195C18.2071 54.5477 18.305 54.5139 18.3638 54.4378C19.7295 52.5728 20.9469 50.6063 21.9907 48.5383C22.0523 48.4172 21.9935 48.2735 21.8676 48.2256C19.9366 47.4931 18.0979 46.6 16.3292 45.5858C16.1893 45.5041 16.1781 45.304 16.3068 45.2082C16.679 44.9293 17.0513 44.6391 17.4067 44.3461C17.471 44.2926 17.5606 44.2813 17.6362 44.3151C29.2558 49.6202 41.8354 49.6202 53.3179 44.3151C53.3935 44.2785 53.4831 44.2898 53.5502 44.3433C53.9057 44.6363 54.2779 44.9293 54.6529 45.2082C54.7816 45.304 54.7732 45.5041 54.6333 45.5858C52.8646 46.6197 51.0259 47.4931 49.0921 48.2228C48.9662 48.2707 48.9102 48.4172 48.9718 48.5383C50.038 50.6034 51.2554 52.5699 52.5959 54.435C52.6519 54.5139 52.7526 54.5477 52.845 54.5195C58.6464 52.7249 64.529 50.0174 70.6019 45.5576C70.6551 45.5182 70.6887 45.459 70.6943 45.3942C72.1747 30.0791 68.2147 16.7757 60.1968 4.9823C60.1772 4.9429 60.1437 4.9147 60.1045 4.8978ZM23.7259 37.3253C20.2276 37.3253 17.3451 34.1136 17.3451 30.1693C17.3451 26.225 20.1717 23.0133 23.7259 23.0133C27.308 23.0133 30.1626 26.2532 30.1066 30.1693C30.1066 34.1136 27.28 37.3253 23.7259 37.3253ZM47.3178 37.3253C43.8196 37.3253 40.9371 34.1136 40.9371 30.1693C40.9371 26.225 43.7636 23.0133 47.3178 23.0133C50.9 23.0133 53.7545 26.2532 53.6986 30.1693C53.6986 34.1136 50.9 37.3253 47.3178 37.3253Z" fill="#5865F2"/>
        </g>
        <defs>
        <clipPath id="clip0">
        <rect width="71" height="55" fill="white"/>
        </clipPath>
        </defs>
        </svg>
        </a>

        </div>
    <a href="/" style="text-decoration: none; color: white;">
    <h1 class="text-2xl mb-2 md:mt-0 mt-4"><a href="/" style="text-decoration: none; color: white;">Not sure how to take action?</a></h1>
    <h1 class="text-2xl mb-2"><a href="/" style="text-decoration: none; color: white;">Just start.</a></h1>
    </a>
</div> -->

<div class="m-auto md:px-0 px-6 md:w-8/12 text-black text-left">
<!-- <h2 class="text-2xl text-center mt-8 font-semibold">Just Start.</h2> -->

<!-- <div style="padding:56.25% 0 0 0;position:relative;"><iframe src="https://player.vimeo.com/video/639909728?h=bce9097e6c&amp;badge=0&amp;autopause=0&amp;player_id=0&amp;app_id=58479" frameborder="0" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen style="position:absolute;top:0;left:0;width:100%;height:100%;" title="finaal v6.mov"></iframe></div><script src="https://player.vimeo.com/api/player.js"></script> -->

<!-- <p>Just Start is a tool to help you organize with your community.  Find activities near you, straight from the calendars of local organizations.  Discover resources and best practices to come together and make change.  Publish your own activities and events to the broader community.  Find important insights and data, to learn more about local issues and what matters to you.</p> -->
<p>After 3 years of grappling with <em>what we can do about climate change</em>, I’ve come around to a simple perspective:</p>
<p>The way we respond to climate change, and any challenges we’re facing, is <strong>organizing in our communities</strong>.</p>
<p>This is nothing new.  Communities around the world have organized to overcome challenges for millennia.  Bonobos make love to build relations.  Whales cross oceans to birth in warm waters.  Human communities organize to survive, share knowledge, live in relation with each other and the non-human world, advance equality, dismantle injustice, and make decisions about our futures together.</p>
<p><em>Make</em> our futures together.</p>
<p>This isn't anything new, but it also seems to be a lost practice in many of our communities.  And yet, when confronted with challenges head on, organizing is what we do.  When the pandemic started, communities around the world organized mutual aid and food banks.  When fires, and floods, and storms hit, communities organize to survive.  When polluters and extractors encroach on lands they don’t belong, communities organize resistance, form coalitions, and defend their sovereignty and rights to self-determination.</p>
<p>As we face distributed and often invisible challenges like rising temperatures, wealth inequality, deforestation, the extinction of non-human relatives, and plastic all around us — how will we respond?</p>
<!-- <p>The problems of consumption, waste, greenhouse gas emissions, plastic pollution, are rooted in our communities — simultaneously, in all of our communities.  Consider plastic.  Because we consume plastic in our communities and don’t have a way to recycle it locally, it gets shipped to facilities in Southeast Asia.  Because communities around the world can’t recycle locally, the destination points in Asia are overburdened, so plastic spills into rivers, flows out into oceans, and comes back into our bodies through the food and water we drink.</p> -->
<!-- <p>How can we create the transformations we wish for?</p> -->
<p>Earlier this year, I built a tool for just that — to help people <a href="https://placeflow.net/welcome">coordinate sustainable transitions in their communities.</a>  It sounds great, even as I type it.  It was missing an important piece of wisdom, however, about how we make things happen in reality:</p>
<p class="font-semibold">Connection before agenda.</p>
<p>Organizing is a process.  It requires trust, relationship building, listening, and sharing perspectives.  At first glance, it can seem easier and more straightforward to skip the human stuff, and just apply solutions that we “know” (so we think) can solve problems:</p>
<p><em>Every community has a plastic problem.  Here’s an open-source machine to recycle plastic in backyards, that every community can use!</em></p>
<img src="https://i.imgur.com/gbTh4as.jpg">
<p class="text-sm"><em>Honestly, every community probably could use it ... <a href="https://hackaday.io/project/139958-the-metabolizer">Source: The Metabolizer, Sam Smith</a></em></p>
<p>Though applying solutions seems the most direct route to creating change, there are a few reasons why this approach may be flawed — and why the practice of <em>connection before agenda</em>, could be more straightforward than we think ...</p>
<hr>
<p><strong>First</strong>, each of us have limited perspectives.  By listening, connecting, and sharing perspectives with others, we can see more of the world and more possibilities.  In the words of Donella Meadows, the ability to change paradigms (ways we see the world) is <a href="https://donellameadows.org/archives/leverage-points-places-to-intervene-in-a-system/">the most impactful change we can make</a>.</p>
<p class="">If we can evaluate and explore more perspectives, we’ll have more possibilities to choose from, which gives us the opportunity to find better courses of action.</p>
<p>As David Graeber puts it, when we’re working together to solve problems, <em>"our differences are a resource"</em> — because diversity of thinking means more ways to get things done.</p>
<div class="embed-youtube mb-4">
<iframe class="" src="https://www.youtube.com/embed/5eR_95slEFw?start=177" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
</div>
<!-- <iframe src="https://youtu.be/5eR_95slEFw?t=177"></iframe> -->
<hr>
<p><strong>Second,</strong> there is a difference between <em>technological capacity</em> and <em>adaptive capacity</em>.  Knowing the right thing to do is not the same as knowing how to adapt.  Consider that for any habit you’ve struggled to pick up — you know it’s good for you, why don’t you just do it?</p>
<p>We know clean electricity, plant-based diets, buying local, driving less are all good for us.  Why don’t we just do them?</p>
<p>According to Karen O’Brien, when we struggle to make important changes in our lives and communities, we may be missing <strong>adaptive capacity</strong>.  That could reside in an attachment to worldviews, distraction (e.g. digital addiction), despair and hopelessness, or lack of awareness / understanding of the challenges we’re facing.</p>
<div class="embed-youtube mb-4">
<iframe class="mb-4" src="https://www.youtube.com/embed/Znu1IfxvBKc?start=558" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
</div>
<p>How can we build the capacity to adapt in our communities — looking up from our phones, finding hope and inspiration, and exploring new possibilities?</p>
<p><strong><em>Organizing</em> in our communities.</strong></p>
<p>As O’Brien highlights, this may not only unlock systems-level change in our communities.  The organizing processes in themselves — connection, listening, sharing, solving problems together — may also widen perspectives, prompt self-inquiry and reflection, and lead to <em>individual transformation</em> as well (more fulfilling lives, less consumption, more engagement).</p>
<p>What’s more important: starting a plant-based food campaign or reducing meat consumption in my house?  According to O'Brien, we want <strong>both/and</strong>.</p>
<p>And community organizing is a <strong>[both/and]</strong>, <strong>[I/we]</strong> practice.</p>
<hr>
<p><strong>Third</strong>, say every politician in the world agreed to decarbonize by 2025.  What do you imagine would happen next?</p>
<p>We’d see homes being retrofitted and insulated.  Renewable energy installations going up.  Schools, teachers, and students taking leadership of local climate projects.  Neighbors organizing local food production and local economies.</p>
<p>But who would be leading those processes?  Would it be government planners and contractors coming into your neighborhood, to do a job and check boxes?</p>
<p>Or would it be led by <strong>us</strong> — the people that make up our communities, designing the future of the places we live together?</p>
<p>Which would you prefer?  And which approach do you think would turn out better, in the long-term?</p>
<p>We have more challenges than climate change.  We’re currently in a paradigm where the people who make decisions are far removed from the consequences of them — a world lacking skin in the game.  And from neighborhoods getting torn down for “economic development”, to corporations pushing addictive technologies and poisoning our land and oceans, we know this has to change too.</p>
<p>What about a a world where people who are <em>closest</em> to a problem are empowered to solve it?  Where people who <em>live</em> in a place determine the future their places hold?  Supported by all of the knowhow, experience, perspective, and capacities that our modern world has to offer?</p>
<p>If that’s a world we want, it doesn’t come for free.  We can’t have local leadership, while sitting behind a social media feed or binge-watching Netflix over the weekend.  If we want to determine our futures, we need to be engaged in the process of creating them.  <strong>We need to organize</strong>.</p>
<p>Once we start, we’ll probably have a lot of fun doing it too. </p>
<hr>
<p>Beyond climate change, if there’s any difference we want to make in the world — in our homes, our neighborhoods, our cities, our regions, our digital networks — it probably starts with organizing.  What's a better way to get things done, than people in a community coming together, making decisions, and taking action themselves?  Doesn’t it sound right, just reading it?</p>
<p>That's the future that we're working to realize.  Want to make a difference, but don't know where to start?  Find a local event happening this week — <strong> and just go.</strong>  Nothing happening around you?  Make a plan with a few friends, <strong>put it on the calendar</strong>, invite others to join you — <strong>and just start.</strong>   Looking for another capability, or have a different problem?  More is on the way — let us know anything that would <strong>support your work</strong>, and feel free to <strong><a href="https://calendly.com/sambutler8/meeting">schedule a conversation as well</a></strong>.</p>
<p>And we know there are other important matters as well.  In communities which are facing some of the greatest challenges – environmental pollution, economic inequality, systemic violence, injustice, genocide, and oppression — people may have the least time and capacity to engage in local organizing.  We’re working to understand everyone's challenges and overcome them — whether it's a lack of childcare support, food and poverty, housing or transportation inequity, or political violence and threats.  It’s important for everyone to be part of the process, sharing their perspectives and capacity, and helping lead change together.</p>
<p>Many people may not even have the time or digital access to read something like this.  So you can <button class="underline text-blue-700 relative" on:click={printPage}>print this page</button> and share it locally too.  It’s a small step — but an important one, in understanding <em>who isn’t in the room, why aren’t they here, and how can we make sure everyone can be involved, if there are obstacles in the way?</em></p>
<p>That’s not lip service. Everybody has a story, a perspective, a set of skills and capacities, to help us get where we’re trying to go.  The more people who show up, the more hands we have together, the more likely we are to get where we want to go.</p>
<p>To that end, one of the possibilities I'm most excited about is funding for local organizing. <em>Would you like funding to organize in your community?  How much would you like?</em>  I'm not sure if there's any better bang for our bucks, in terms of building local wealth and creating positive outcomes, than supporting local organizing and enabling our communities to create outcomes ourselves.  So if you're a municipality, philanthropy, creative funder, or any old person who's who wants to see outcomes — let's talk about empowering communities to make it happen. (And if you have any ideas for other ways to support local organizing, let us know!)</p>

  <p>... So what now?  How will we address climate change, wealth inequality, COVID, violence and injustice, and all the other issues that matter to us?  The futures we want to create, the gifts we want to give, the lives we want to experience?  The future of the places we call home?</p>
<p><a class="font-bold" href="/">Just start — today.</a></p>
<hr>
<ol>
<li><p>1. If you want to just start, <a href="/">hit the main page</a> and find a local event, or call a few friends and add your own event to the calendar.</p>
</li>
<li><p>2. If you want more people to see this perspective, <button class="underline text-blue-700 relative" on:click={copyPostLink}><span href="https://www.rebrand.ly/just-start-intro" on:click={clickLink}>share this post</span>
{#if copy_tooltip}
  <p class="absolute top-6 rounded text-black bg-gray-100 px-2 py-1">Link copied!</p>
{/if}
</button> with people in your community, and start a discussion around these ideas.</p>
</li>
<li><p>3. Want to support the vision and help make this happen?  Share your thoughts in our <a href="https://discord.gg/dTSmGuBXt8">Discord</a> or our <a href="https://github.com/sbutler-gh/just-start">Github repo</a>, via <a href="mailto:{variables.contactEmail}">email</a>, or on <a href="https://twitter.com/juststartdo">Twitter</a> to help others discover and engage in the discussion as well.</p>
  <!-- <p class="italic">In terms of value creation, impact, or any other metric, there may not be anything better than local organizing. So if you’re involved in a municipality, charity, or philanthropy, let’s talk about how communities can <a href="">empower your outcomes</a> — and for anybody who has ideas on how we can support more people getting engaged in local organizing, we’d love to <a href="">hear from you too.</a></p> -->

</li>
</ol>

</div>

</div>

<style>
  h2, p {
    margin-bottom: 1rem;
  }
  hr {
    margin-bottom: 1rem;
  }

  a {
    color: rgb(29 78 216);
    text-decoration: underline;
  }

  /* @media only screen and (max-width: 600px) { */


  .embed-youtube {
    position: relative;
    padding-bottom: 56.25%; /* - 16:9 aspect ratio (most common) */
    /* padding-bottom: 62.5%; - 16:10 aspect ratio */
    /* padding-bottom: 75%; - 4:3 aspect ratio */
    padding-top: 30px;
    height: 0;
    overflow: hidden;
    width: 100%;
}

.embed-youtube iframe,
.embed-youtube object,
.embed-youtube embed {
    border: 0;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
}
  /* } */

  @media only screen and (min-width: 601px) {
    
    /* .embed-youtube {
      width: 100% !important;
      height: auto !important;
    } */
    
  }
</style>