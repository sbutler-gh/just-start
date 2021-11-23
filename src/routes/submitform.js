import supabase from "$lib/db"

export async function post(request) {

const {data, error} = await supabase
.from('support_responses')
.insert({support_info: request.body.get('support_info'), introduction: request.body.get('introduction'), contact: request.body.get('contact'), loaded_location: request.body.get('loaded_address'), searched_location: request.body.get('address')})

if (error) {
return {
    status: error.status,
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