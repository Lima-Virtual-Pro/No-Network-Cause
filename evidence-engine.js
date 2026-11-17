(()=>{'use strict';
const $=id=>document.getElementById(id);
const DB='internet-livre-db',STORE='events',OPS='noc-operations-v22';
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
let report=null;
function openDB(){return new Promise((resolve,reject)=>{const r=indexedDB.open(DB);r.onsuccess=()=>resolve(r.result);r.onerror=()=>reject(r.error)})}
async function readEvents(){const db=await openDB();if(!db.objectStoreNames.contains(STORE)){db.close();return []}return new Promise((resolve,reject)=>{const r=db.transaction(STORE).objectStore(STORE).getAll();r.onsuccess=()=>{db.close();resolve(r.result||[])};r.onerror=()=>{db.close();reject(r.error)}})}
function readOps(){try{const x=JSON.parse(localStorage.getItem(OPS)||'{}');return Array.isArray(x.telemetry)?x.telemetry:[]}catch{return []}}
function percentile(a,p){if(!a.length)return null;const i=Math.max(0,Math.ceil(a.length*p)-1);return a.slice().sort((x,y)=>x-y)[i]}
function build(events,telemetry){
 const checks=events.filter(e=>['diagnostic','monitor_check'].includes(e.event_type)).sort((a,b)=>Date.parse(b.timestamp)-Date.parse(a.timestamp)).slice(0,50);
 const failures=checks.filter(e=>e.result==='unreachable'),success=checks.filter(e=>e.result==='reachable');
 const offline=checks.filter(e=>e.online===false),httpFail=checks.reduce((n,e)=>n+(Array.isArray(e.checks)?e.checks.filter(c=>!c.ok).length:0),0);
 const httpTotal=checks.reduce((n,e)=>n+(Array.isArray(e.checks)?e.checks.length:0),0);
 const lat=checks.filter(e=>e.result==='reachable'&&Number.isFinite(e.latency_ms)).map(e=>e.latency_ms);
 const avg=lat.length?Math.round(lat.reduce((a,b)=>a+b,0)/lat.length):null,med=percentile(lat,.5),p95=percentile(lat,.95);
 const recent=checks.slice(0,10),recentFail=recent.filter(e=>e.result==='unreachable').length;
 const t=telemetry.slice().sort((a,b)=>Date.parse(b.timestamp)-Date.parse(a.timestamp));
 const latest=t[0]||null,radio=t.filter(x=>x.rssi_dbm!=null||x.snr_db!=null),optical=t.filter(x=>x.optical_rx_dbm!=null||x.optical_tx_dbm!=null||x.onu_state);
 const candidates=[],steps=[],limits=[];
 if(!checks.length){candidates.push({name:'Dados insuficientes',level:'Indeterminada',why:'Ainda não há verificações de conectividade armazenadas.'});steps.push('Execute pelo menos 5 diagnósticos em horários diferentes e registre o destino utilizado.')}
 else {
  if(offline.length)candidates.push({name:'Dispositivo/navegador indicou estado offline',level:'Evidência direta do navegador',why:offline.length+' de '+checks.length+' verificações ocorreram com navigator.onLine=false.'});
  if(failures.length)candidates.push({name:'Falha de acesso aos serviços HTTP testados',level:recentFail>=3?'Sinal recorrente':'Sinal observado',why:failures.length+' de '+checks.length+' verificações não alcançaram todos os destinos; isso não isola a causa.'});
  if(success.length&&failures.length)candidates.push({name:'Instabilidade parcial ou intermitente',level:'Hipótese',why:'Há verificações com sucesso e falha no mesmo histórico.'});
  if(lat.length&&p95>250)candidates.push({name:'Tempo de resposta HTTP elevado em parte da amostra',level:'Observação',why:'P95 observado de '+Math.round(p95)+' ms; pode incluir rede, DNS, servidor e processamento do navegador.'});
  if(lat.length&&p95<=250)candidates.push({name:'Tempos HTTP observados sem elevação acentuada nesta amostra',level:'Observação',why:'P95 de '+Math.round(p95)+' ms; não comprova qualidade Wi-Fi, ping ou throughput.'});
  steps.push('Repita 5 a 10 verificações em pelo menos dois destinos independentes e anote horário, rede e dispositivo.');
  steps.push('Compare o mesmo dispositivo por Wi-Fi e por cabo, quando possível; depois compare outro dispositivo na mesma rede.');
  steps.push('Se todos os dispositivos falharem, teste DNS e conectividade IP com ferramenta apropriada fora do navegador.');
  steps.push('Se somente Wi-Fi apresentar problema, registre RSSI/SNR e canal com ferramenta compatível; compare próximo ao ponto de acesso.');
  steps.push('Se a falha ocorrer também por cabo, consulte logs do modem/ONT/roteador e alarmes do provedor, preservando data/hora.');
 }
 if(radio.length){const r=radio[0];if(r.rssi_dbm!=null&&r.rssi_dbm<=-75)candidates.push({name:'Nível RSSI informado baixo',level:'Medição importada/manual',why:'Último RSSI '+r.rssi_dbm+' dBm em '+(r.sector||'setor não identificado')+'. Interpretar conforme tecnologia e calibração.'});}
 if(optical.length){const o=optical[0];candidates.push({name:'Telemetria óptica disponível',level:'Dado fornecido pela fonte',why:'Último registro '+(o.onu_state||'sem estado ONU')+'; RX '+(o.optical_rx_dbm??'não informado')+' dBm; TX '+(o.optical_tx_dbm??'não informado')+' dBm. Comparar com limites oficiais do fabricante/operadora.'});}
 if(!radio.length)limits.push('Não há RSSI/SNR nesta amostra; o navegador não mede nível físico do sinal.');
 if(!optical.length)limits.push('Não há telemetria óptica recente; nenhuma leitura de ONU/ONT foi presumida.');
 limits.push('Fetch HTTP não é ping ICMP, teste calibrado de velocidade ou perda real de pacotes.');
 limits.push('O resultado aponta sintomas e próximos testes; não confirma antena, setor, operadora ou causa-raiz.');
 const total=checks.length,conf=total>=20?'Amostra moderada (20+ verificações)':total>=5?'Amostra inicial (5–19 verificações)':'Amostra insuficiente (menos de 5 verificações)';
 return {generated_at:new Date().toISOString(),version:'4.0.3',sample:{checks:total,success:success.length,failed:failures.length,browser_offline:offline.length,http_attempts:httpTotal,http_failed:httpFail,mean_http_ms:avg,median_http_ms:med,p95_http_ms:p95,confidence:conf},candidates,steps,limits,latest_telemetry:latest?{timestamp:latest.timestamp,sector:latest.sector,rssi_dbm:latest.rssi_dbm,snr_db:latest.snr_db,onu_state:latest.onu_state,optical_rx_dbm:latest.optical_rx_dbm,optical_tx_dbm:latest.optical_tx_dbm}:null};
}
function list(items){return '<ol>'+items.map(x=>'<li>'+esc(x)+'</li>').join('')+'</ol>'}
function render(r){const host=$('nocEvidenceEngine');if(!host)return;host.innerHTML='<h3>Interpretação baseada em evidências · 4.0.3</h3><p class="tiny muted">Análise local do histórico e da telemetria registrada. Não usa dados inventados nem declara causa-raiz sem confirmação.</p><div class="grid"><article class="card span-4"><div class="eyebrow">Amostra analisada</div><div class="metric">'+r.sample.checks+'</div><div class="tiny muted">'+esc(r.sample.confidence)+'</div></article><article class="card span-4"><div class="eyebrow">Verificações com falha</div><div class="metric">'+r.sample.failed+'</div><div class="tiny muted">De '+r.sample.checks+' verificações</div></article><article class="card span-4"><div class="eyebrow">P95 HTTP</div><div class="metric">'+(r.sample.p95_http_ms==null?'—':Math.round(r.sample.p95_http_ms)+' ms')+'</div><div class="tiny muted">Não equivale a ping</div></article></div><h4>Achados e hipóteses</h4>'+(r.candidates.length?r.candidates.map(x=>'<div class="logline"><b>'+esc(x.name)+'</b> · <span class="pill">'+esc(x.level)+'</span><p class="tiny muted">'+esc(x.why)+'</p></div>').join(''):'<p class="muted">Sem dados suficientes.</p>')+'<h4>Roteiro de investigação recomendado</h4>'+list(r.steps)+'<h4>Limites da interpretação</h4>'+list(r.limits)+'<p class="tiny muted">Gerado em '+esc(new Date(r.generated_at).toLocaleString('pt-BR'))+'.</p><div class="actions"><button id="nocEvidenceJson">Exportar análise JSON</button><button id="nocEvidenceCsv" class="secondary">Exportar resumo CSV</button><button id="nocEvidencePdf" class="secondary">Imprimir / salvar PDF</button></div>';
 $('nocEvidenceJson').onclick=()=>download('noc-analise-4.0.3.json',JSON.stringify(r,null,2),'application/json');
 $('nocEvidenceCsv').onclick=()=>{const s=[['campo','valor'],...Object.entries(r.sample),['hipoteses',r.candidates.map(x=>x.name+' — '+x.why).join(' | ')],['passos',r.steps.join(' | ')],['limites',r.limits.join(' | ')]].map(row=>row.map(v=>'"'+String(v??'').replace(/"/g,'""')+'"').join(';')).join('\r\n');download('noc-resumo-4.0.3.csv','\uFEFF'+s,'text/csv;charset=utf-8')};
 $('nocEvidencePdf').onclick=()=>{const w=window.open('','_blank');if(!w){alert('Permita a janela de impressão para salvar o PDF.');return}w.document.write('<!doctype html><html lang="pt-BR"><meta charset="utf-8"><title>No Network Cause — Análise 4.0.3</title><body style="font:14px/1.5 Arial;max-width:850px;margin:30px auto;padding:0 20px"><h1>No Network Cause 4.0.3</h1><h2>Interpretação baseada em evidências</h2><p>Amostra: '+r.sample.checks+' verificações; falhas: '+r.sample.failed+'; P95 HTTP: '+(r.sample.p95_http_ms??'—')+' ms.</p><h3>Achados</h3>'+r.candidates.map(x=>'<p><b>'+esc(x.name)+'</b> ('+esc(x.level)+')<br>'+esc(x.why)+'</p>').join('')+'<h3>Passos recomendados</h3>'+list(r.steps)+'<h3>Limites</h3>'+list(r.limits)+'<p>Gerado '+new Date(r.generated_at).toLocaleString('pt-BR')+'.</p><script>window.onload=()=>window.print()<\/script></body></html>');w.document.close()};
}
function download(name,content,type){const u=URL.createObjectURL(new Blob([content],{type})),a=document.createElement('a');a.href=u;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(u),1500)}
async function run(){const host=$('nocEvidenceEngine');if(!host)return;host.innerHTML='<p class="muted">Analisando histórico local…</p>';try{report=build(await readEvents(),readOps());render(report)}catch(e){host.innerHTML='<p class="notice">Não foi possível ler o histórico: '+esc(e.message)+'.</p>'}}
function init(){const insights=$('insights');if(!insights||$('nocEvidenceEngine'))return;const card=document.createElement('article');card.className='card span-12';card.id='nocEvidenceEngine';const anchor=$('insightsText')?.closest('article');if(anchor)anchor.insertAdjacentElement('afterend',card);else insights.append(card);const refresh=$('refreshInsights');refresh?.addEventListener('click',run);document.addEventListener('visibilitychange',()=>{if(!document.hidden)run()});run()}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();