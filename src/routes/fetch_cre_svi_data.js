import supalab from "$lib/db"

import { createClient } from '@supabase/supabase-js'

const supabase = createClient( import.meta.env.VITE_SUPABASE_URL,
    import.meta.env.VITE_SUPABASE_ANON_KEY, { fetch: (...args) => fetch(...args) })

export async function post(request) {


  let { data, error } = await supabase
  .from('svi_cre')
  .select('*')
  .eq('GEO_ID', request.body)

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