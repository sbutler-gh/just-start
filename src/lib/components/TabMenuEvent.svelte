<div id="more-12" class="hidden text-left p-4 pb-4">
    <div class="mb-4 ml-auto text-right" style=''>
        <ul class='inline-flex'>
          <li on:click={updateMenu} class='py-2 px-3 bg-gray-100 rounded text-gray-500 bg-gray-200 cursor-pointer mr-1'>Discussion</li>
          <li on:click={updateMenu} class='active py-2 px-3 bg-gray-100 rounded cursor-default'>Location</li>
        </ul>
    </div>
    {#if menu == "Discussion"}
    <p>Discussion</p>
    {/if}
    <img id="location_img" class="" src="https://maps.google.com/maps/api/staticmap?markers=icon%3Ahttps%3A%2F%2Fsecure.meetupstatic.com%2Fs%2Fimg%2F5961591462445047%2Fmup-custom-google-map-pin.png%7C38.894615%2C-77.439980&zoom=17&size=480x300&sensor=false&key=AIzaSyA3fSxhHZNQNfMjJuMFvmULACXrBfFz9jQ&signature=UWDg01O1EMndIJNgK_EkV8q8IJE%3D">
</div>