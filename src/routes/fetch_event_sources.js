import supalab from "$lib/db"

import { createClient } from '@supabase/supabase-js'

const supabase = createClient( import.meta.env.VITE_SUPABASE_URL,
    import.meta.env.VITE_SUPABASE_ANON_KEY, { fetch: (...args) => fetch(...args) })

export async function get() {

  console.log('request');

    let { data, error } = await supabase
    .from('eventSources')
    .select('*')

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