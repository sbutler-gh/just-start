<script>
import { goto } from "$app/navigation";

import MenuHamburger from "$lib/components/MenuHamburger.svelte";
import "../app.css";

let display_menu = false;

</script>
<header class="bg-black p-4 text-white text-center mb-8">
<h1 on:click={function() {goto("/"); display_menu = false;}} class="text-2xl font-bold mb-4">JustStart.<span class="text-yellow-200">do</span></h1>
<p class="text">Events from community and climate groups near you.</p>
<MenuHamburger display_menu={display_menu} class="menu"></MenuHamburger>
</header>
<slot></slot>
<!-- <footer class="bg-black p-4 text-gray-300 text-left mt-8">
    <p class="text-sm"><em>By interacting with this website, inputting data, and inputting calendar information, you agree to all terms and conditions.</em></p>
</footer> -->
<style>
    nav {
        margin-left: auto;
    }
    nav > p {
        margin-right: 10px;
    }
    a {
        text-decoration: underline;
        cursor: pointer;
    }
</style>