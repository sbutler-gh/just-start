// import supabase from "$lib/db"
import { variables } from '$lib/variables';

import { createClient } from '@supabase/supabase-js'

const supabase = createClient( import.meta.env.VITE_SUPABASE_URL,
    import.meta.env.VITE_SUPABASE_ANON_KEY, { fetch: (...args) => fetch(...args) })

export async function post(request) {

    const { data, error } = await supabase
    .from('eventSources')
    .insert([
        { coordinates: JSON.parse(request.body.get('cal_coordinates')), url: request.body.get('url'), organization: request.body.get('organization'), city: request.body.get('city'), state_province: request.body.get('state_province'), country: request.body.get('country'), org_url: request.body.get('org_url'), cal_format: request.body.get('cal_format')  },
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