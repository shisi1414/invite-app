// functions/api/choice.js
export async function onRequest(context) {
  const { request, env } = context
  if (request.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 })
  }

  let body = {}
  try {
    body = await request.json()
  } catch (e) {
    body = {}
  }

  // 1）先打日志：Cloudflare 实时日志能看到
  console.log('【选择上报】', JSON.stringify({
    time: new Date().toISOString(),
    ua: request.headers.get('user-agent'),
    cfIp: request.headers.get('cf-connecting-ip'),
    body
  }))

  // 2）如果绑了 KV，就持久化（见第三步）；没绑也不报错
  try {
    if (env && env.CHOICES) {
      const key = Date.now() + '_' + Math.random().toString(36).slice(2)
      await env.CHOICES.put(key, JSON.stringify({
        time: new Date().toISOString(),
        ua: request.headers.get('user-agent'),
        ...body
      }))
    }
  } catch (e) {
    console.log('KV写入失败', e.message)
  }

  return new Response(JSON.stringify({ ok: true }), {
    headers: { 'content-type': 'application/json' }
  })
}