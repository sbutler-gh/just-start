<script>
import { goto } from "$app/navigation";

import MenuHamburger from "$lib/components/MenuHamburger.svelte";
import "../app.css";

let display_menu = false;

</script>
<header class="bg-black p-4 text-white text-center mb-8">
<h1 on:click={function() {goto("/"); display_menu = false;}} class="cursor-pointer text-2xl font-bold mb-4">JustStart.<span class="text-yellow-200">do</span></h1>
<p class="text">Events from community and climate groups near you.</p>
<MenuHamburger display_menu={display_menu} class="menu"></MenuHamburger>
</header>
<slot></slot>
<footer class="p-4 text-gray-500 m-auto text-center bottom-0 mt-8">
    <!-- <p class="text-sm"><em>By interacting with this website, inputting data, and adding calendar information, you agree to the <a href="/docs/terms">Terms of Service</a> and <a href="/docs/privacy">Privacy Policy</a>.</em></p> -->
    <p class="text-sm">hello@juststart.do</p>
    <p class="text-sm"><em><a href="/docs/terms">Terms of Service</a> and <a href="/docs/privacy">Privacy Policy</a>. (c) 2021</em></p>
</footer>
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