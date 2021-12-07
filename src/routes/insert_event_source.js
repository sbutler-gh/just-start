// import supabase from "$lib/db"
import { variables } from '$lib/variables';

import { createClient } from '@supabase/supabase-js'

const supabase = createClient( import.meta.env.VITE_SUPABASE_URL,
    import.meta.env.VITE_SUPABASE_ANON_KEY, { fetch: (...args) => fetch(...args) })

export async function post(request) {

    const { data, error } = await supabase
    .from('eventSources')
    .insert([
        { coordinates: JSON.parse(request.body.get('cal_coordinates')), url: request.body.get('url'), organization: request.body.get('organization')  },
    ])

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