<script>
  import { variables } from "$lib/variables";
  export let display_menu;
</script>
<div class="top-2 right-4 md:right-80 md:top-4 menu">
<svg on:click={ function() { display_menu? (display_menu = false) : (display_menu = true)}} xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-menu-2" width="20" height="20" viewBox="0 0 24 24" stroke-width="1.5" stroke="#ffffff" fill="none" stroke-linecap="round" stroke-linejoin="round">
    <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
    <line x1="4" y1="6" x2="20" y2="6" />
    <line x1="4" y1="12" x2="20" y2="12" />
    <line x1="4" y1="18" x2="20" y2="18" />
  </svg>
  {#if display_menu}
  <nav on:click={ function() { display_menu? (display_menu = false) : (display_menu = true)}} class="bg-white text-black p-2">
    <p><a href="/about">About</a></p>
    <!-- <p><a href="https://github.com/sbutler-gh/just-start">Contribute</a></p> -->
    <p><a href="https://github.com/sbutler-gh/just-start">Contribute</a></p>
    <p><a href="https://discord.gg/dTSmGuBXt8" target="_blank">Volunteer</a></p>

    <!-- <p><a href="https://discord.gg/dTSmGuBXt8" target="_blank">Volunteer</a></p> -->
    <p><a href="mailto:{variables.contactEmail}">Email</a></p>
  </nav>
    {/if}
  </div>
  <!-- <p class="text-white">{display_menu}</p> -->
  <style>
        .menu {
        position: absolute;
        /* right: 5%;
        top: 2%; */
        text-align: right;
        width: 100px;
    }

    .menu > svg {
      margin-left: auto;
      display: block;
      text-align: right;
    }

    nav {
      border: solid 1px black;
    }

    nav > p {
      cursor: pointer;
      margin-bottom: 10px;
    }

    nav > p {
      /* text-decoration: underline; */
      /* color: royalblue; */
    }
  </style>