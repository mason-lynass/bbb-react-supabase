const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')

const handler = async (_request: Request): Promise<Response> => {
  try {
    const { event } = await _request.json();

    const { bathroom_id, user_id, id } = event.new

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: 'hello@betterbathroombureau.org',
        to: 'masonlynass@gmail.com',
        subject: 'New Review Created',
        html: `<strong>A new review for "${bathroom_id}" - has been created in the database!</strong><p>ID: ${id}</p>
        <p>created by ${user_id}</p>`,
      }),
    })
  
  
    return new Response(JSON.stringify(res), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    })
  } catch(error) {
    return new Response(JSON.stringify({ error: error.message}), {status: 500})
  }
  
}

Deno.serve(handler)
