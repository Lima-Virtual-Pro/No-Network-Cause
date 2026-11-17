/**
 * No Network Cause — Cloudflare Telemetry Bridge 1.0
 * Bindings: KV namespace TELEMETRY_KV; Secret INGEST_TOKEN.
 * Optional variable: ALLOWED_ORIGIN (default GitHub Pages origin).
 * POST /ingest: authenticated JSON ingestion.
 * GET /metrics: read-only latest metrics; CORS restricted to app origin.
 */
const DEFAULT_ORIGIN = "https://lima-virtual-pro.github.io";
function cors(origin, allowed) {
  return {"Access-Control-Allow-Origin": origin === allowed ? origin : allowed,
    "Access-Control-Allow-Methods":"GET,POST,OPTIONS",
    "Access-Control-Allow-Headers":"Content-Type, Authorization",
    "Access-Control-Max-Age":"86400","Vary":"Origin"};
}
function reply(data,status,headers) {
  return new Response(JSON.stringify(data),{status,headers:{"Content-Type":"application/json; charset=utf-8","Cache-Control":"no-store",...headers}});
}
function normalize(payload) {
  const m=payload&&payload.metrics&&typeof payload.metrics==="object"?payload.metrics:payload;
  if(!m||typeof m!=="object"||Array.isArray(m)) throw Error("JSON deve ser um objeto.");
  const out={sector:String(m.sector||"Setor não identificado").slice(0,100),timestamp:m.timestamp||new Date().toISOString(),source:"cloudflare-agent"};
  if(!Number.isFinite(Date.parse(out.timestamp))) throw Error("timestamp inválido.");
  const rules={rssi_dbm:[-120,0],snr_db:[-10,80],latency_ms:[0,600000],packet_loss_pct:[0,100],throughput_mbps:[0,1e9],utilization_pct:[0,100],users:[0,1e7]};
  for(const [k,[min,max]] of Object.entries(rules)) if(m[k]!==undefined&&m[k]!==null) {
    if(typeof m[k]!=="number"||!Number.isFinite(m[k])||m[k]<min||m[k]>max) throw Error("Valor inválido: "+k);
    out[k]=m[k];
  }
  return out;
}
export default {async fetch(request,env) {
  const url=new URL(request.url),allowed=env.ALLOWED_ORIGIN||DEFAULT_ORIGIN,origin=request.headers.get("Origin")||"",headers=cors(origin,allowed);
  if(request.method==="OPTIONS") return origin&&origin!==allowed?new Response(null,{status:403}):new Response(null,{status:204,headers});
  if(url.pathname==="/health"&&request.method==="GET") return reply({ok:true,service:"No Network Cause Telemetry Bridge",version:"1.0",storage:!!env.TELEMETRY_KV},200,headers);
  if(url.pathname==="/metrics"&&request.method==="GET") {
    if(origin&&origin!==allowed) return reply({error:"Origin não autorizado."},403,headers);
    if(!env.TELEMETRY_KV) return reply({error:"KV binding TELEMETRY_KV ausente."},503,headers);
    const listed=await env.TELEMETRY_KV.list({prefix:"latest:",limit:100}),records=[];
    for(const key of listed.keys){const value=await env.TELEMETRY_KV.get(key.name,"json");if(value)records.push(value);}
    records.sort((a,b)=>Date.parse(b.timestamp)-Date.parse(a.timestamp));
    return reply({metrics:records[0]||{},records,count:records.length,source:"cloudflare-telemetry-bridge"},200,headers);
  }
  if(url.pathname==="/ingest"&&request.method==="POST") {
    if(!env.INGEST_TOKEN||!env.TELEMETRY_KV) return reply({error:"Configuração do Worker incompleta."},503,headers);
    if(request.headers.get("Authorization")!=="Bearer "+env.INGEST_TOKEN) return reply({error:"Não autorizado."},401,headers);
    let payload;try{payload=await request.json();}catch{return reply({error:"JSON inválido."},400,headers);}
    let metric;try{metric=normalize(payload);}catch(e){return reply({error:e.message},422,headers);}
    await env.TELEMETRY_KV.put("latest:"+encodeURIComponent(metric.sector),JSON.stringify(metric),{expirationTtl:604800});
    return reply({ok:true,saved:true,sector:metric.sector,timestamp:metric.timestamp},201,headers);
  }
  return reply({error:"Rota não encontrada."},404,headers);
}};
