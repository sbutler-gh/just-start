<script>
    import supabase from "$lib/db"

    export let loaded_address;
    export let address;

    let form_submit;

    async function submitForm(e) {
        var formData = new FormData(e.target);

        formData.append('loaded_address', loaded_address);
        formData.append('address', address);

        const response = await fetch(`./submitform`, {
      method: 'post',
      body: formData
    })
        response.ok ? ( form_submit = "success" ) : (form_submit = "error" )

    }
</script>
<form on:submit|preventDefault={submitForm}>
    <!-- <label>What would help you in organizing a gathering in the community?  What would you like to do in such gatherings?</label> -->
    <label>What would support you in organizing a gathering in your community?</label>
    <textarea name="support_info"></textarea>
    <!-- <label style="margin-top: 2rem;">Would you like to get involved in the design of this program?</label>
    <textarea></textarea> -->
    <label style="margin-top: 2rem;">Can you share a few words about yourself?</label>
    <textarea name="introduction" style="height: 4rem;"></textarea>
    <label style="margin-top: 2rem;">What's the best way to contact you?</label>
    <textarea name="contact" style="height: 3rem;"></textarea>
        {#if !form_submit}
    <button>Submit</button>
    {:else if form_submit == "success"}
    <p style="text-align: center; display: block; margin-top: 2rem; color: green;">Success!  Your responses have been recorded.  We'll be in touch!</p>
    {:else if form_submit == "error"}
    <p style="text-align: center; display: block;  margin-top: 2rem; color: red;">Error submitting form.  Please refresh the page and try again.</p>
    {/if}
</form>
<style>
    form {
        background: #e6e6e6;
        text-align: left;
        width: 75%;
        margin: auto;
        padding: 20px 20px;
    }
    label, textarea, button {
        display: block;
        margin-bottom: 0.75rem;
    }
    label {
        /* margin-top: 2rem; */
    }
    textarea {
        height: 5rem;
        width: 80%;
        padding-left: 5px;
        padding-top: 5px;
    }
    button {
        margin-left: auto;
    background: #bd4bec;
    padding: 5px 20px;
    color: white;
    font-size: 18px;
    }
    * {
        border-radius: 3px;
    }
</style>