export async function onRequest(context) {
  const { request, env } = context
  if (request.method !== 'GET') {
    return new Response('Method not allowed', { status: 405 })
  }

  if (!env || !env.CHOICES) {
    return new Response(JSON.stringify({ error: 'KV not bound' }), {
      headers: { 'content-type': 'application/json' }
    })
  }

  const list = await env.CHOICES.list({ limit: 100 })
  const items = []
  for (const key of list.keys) {
    const val = await env.CHOICES.get(key.name)
    items.push({ key: key.name, data: JSON.parse(val) })
  }

  // 按时间倒序
  items.sort((a, b) => b.key.localeCompare(a.key))

  return new Response(JSON.stringify(items, null, 2), {
    headers: { 'content-type': 'application/json' }
  })
}
