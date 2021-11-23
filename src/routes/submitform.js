// import supabase from "$lib/db"
import { variables } from '$lib/variables';

import { createClient } from '@supabase/supabase-js'

const supabase = createClient( import.meta.env.VITE_SUPABASE_URL,
    import.meta.env.VITE_SUPABASE_ANON_KEY, { fetch: fetch })

export async function post(request) {

const {data, error} = await supabase
.from('support_responses')
.insert({support_info: request.body.get('support_info'), introduction: request.body.get('introduction'), contact: request.body.get('contact'), loaded_location: request.body.get('loaded_address'), searched_location: request.body.get('address')})

if (error) {
return {
    status: 500,
    body: error
  }
}
else {

return {
    status: 200,
    body: {
      data
    }
  }
}

}