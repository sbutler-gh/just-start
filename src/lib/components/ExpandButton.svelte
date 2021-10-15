<p on:click={toggleOverflow} class="hidden cursor-pointer absolute top-1/2 -right-1 text-right">
    <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-chevrons-up" width="24" height="24" viewBox="0 0 24 24" stroke-width="1.5" stroke="#597e8d" fill="none" stroke-linecap="round" stroke-linejoin="round">
      <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
  {#if height == "h-48"}
      <polyline points="7 7 12 12 17 7" />
      <polyline points="7 13 12 18 17 13" />
  {:else if height == "h-full"}
      <polyline points="7 11 12 6 17 11" />
      <polyline points="7 17 12 12 17 17" />
  {/if}
  </svg>
  </p>