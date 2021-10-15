<script>
    let event;

    function expandEvent(e) {
            console.log(e.target.id);
            let more =  document.getElementById(`more-12`);
            more.classList.contains('hidden') ? more.classList.remove('hidden') : more.classList.add('hidden')
        }
</script>
<div class="mt-4 m-auto w-11/12 mb-4">
    <!-- <p class="font-semibold text-blue-700">Start here!</p> -->
    <div class="rounded-md border-2">
        <div class="text-left p-4 pb-0">
            <p class="text-lg font-bold">Discuss Local Housing Plans</p>
            <p class="mt-2 text-md">Want to understand what is happening with the Falls Church housing projects?  Want to make sure they are integrated, affordable, and make FC a better place to live — for us, and for our new neighbors to come?  Join us for a citizen's assembly on this topic.</p>
        </div>
        <div class="flex p-4 pt-0 text-left">
            <p class="mt-2 text-md text-blue-700 font-semibold">Today at 7:00PM <br>at Cherry Hill Park</p>
            <button type="button" class="mt-4 mb-2 rounded-full shadow bg-blue-200 px-2 py-1 text-right block ml-auto">Join</button>
        </div>
        <div id="more-12" class="hidden text-left p-4 pb-4">
            <div class="mb-4 ml-auto text-right" style=''>
                <ul class='inline-flex'>
                  <li class='py-2 px-6 bg-white rounded-t-lg text-gray-500 bg-gray-200 cursor-pointer'>Discussion</li>
                  <li class='py-2 px-6 bg-white rounded-t-lg cursor-default'>Location</li>
                </ul>
            </div>
            <img src="https://maps.google.com/maps/api/staticmap?markers=icon%3Ahttps%3A%2F%2Fsecure.meetupstatic.com%2Fs%2Fimg%2F5961591462445047%2Fmup-custom-google-map-pin.png%7C38.894615%2C-77.439980&zoom=17&size=480x300&sensor=false&key=AIzaSyA3fSxhHZNQNfMjJuMFvmULACXrBfFz9jQ&signature=UWDg01O1EMndIJNgK_EkV8q8IJE%3D">
        </div>
    </div>
    <div class="hidden mb-4 flex px-1">
        <button on:click={expandEvent} class="cursor-pointer block">
            <svg xmlns="http://www.w3.org/2000/svg" class="hidden icon icon-tabler icon-tabler-share" width="24" height="24" viewBox="0 0 24 24" stroke-width="1.5" stroke="#597e8d" fill="none" stroke-linecap="round" stroke-linejoin="round">
                <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                <circle cx="6" cy="12" r="3" />
                <circle cx="18" cy="6" r="3" />
                <circle cx="18" cy="18" r="3" />
                <line x1="8.7" y1="10.7" x2="15.3" y2="7.3" />
                <line x1="8.7" y1="13.3" x2="15.3" y2="16.7" />
              </svg>
            Share</button>
        <button id={12} on:click={expandEvent} class="text-blue-500 ml-auto text-right cursor-pointer underline block">Toggle Details</button>
    </div>
</div>