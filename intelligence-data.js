(()=>{'use strict';
const $=id=>document.getElementById(id),DB='internet-livre-db',STORE='events',OPS='noc-operations-v22';
let latest=null;
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const num=v=>v==null||v===''?null:Number.isFinite(Number(v))?Number(v):null;
const fmt=v=>v==null?'—':Number(v).toLocaleString('pt-BR',{maximumFractionDigits:2});
function openDB(){return new Promise((resolve,reject)=>{const r=indexedDB.open(DB);r.onsuccess=()=>resolve(r.result);r.onerror=()=>reject(r.error)})}
async function readEvents(){const d=await openDB();if(!d.objectStoreNames.contains(STORE)){d.close();return []}return new Promise((resolve,reject)=>{const r=d.transaction(STORE).objectStore(STORE).getAll();r.onsuccess=()=>{d.close();resolve(r.result||[])};r.onerror=()=>{d.close();reject(r.error)}})}
function readTelemetry(){try{const x=JSON.parse(localStorage.getItem(OPS)||'{}');return Array.isArray(x.telemetry)?x.telemetry:[]}catch{return []}}
function hourKey(ts){const d=new Date(ts);return Number.isNaN(+d)?null:String(d.getHours()).padStart(2,'0')+'h'}
function dayKey(ts){const d=new Date(ts);return Number.isNaN(+d)?null:['dom','seg','ter','qua','qui','sex','sáb'][d.getDay()]}
function median(a){if(!a.length)return null;const s=a.slice().sort((x,y)=>x-y),m=Math.floor(s.length/2);return s.length%2?s[m]:(s[m-1]+s[m])/2}
function group(rows,key){const out={};rows.forEach(r=>{const k=key(r);if(k!=null&&k!=='') (out[k]??=[]).push(r)});return out}
function analyze(events,telemetry){
 const ev=events.filter(e=>['diagnostic','monitor_check','outage_start','recovery'].includes(e.event_type));
 const failures=ev.filter(e=>(e.event_type==='outage_start'||(e.event_type!=='recovery'&&e.result==='unreachable')));
 const t=telemetry.slice().filter(x=>x&&x.timestamp&& !Number.isNaN(Date.parse(x.timestamp)));
 const values={latency:t.filter(x=>num(x.latency_ms)!=null).map(x=>num(x.latency_ms)),rssi:t.filter(x=>num(x.rssi_dbm)!=null).map(x=>num(x.rssi_dbm)),snr:t.filter(x=>num(x.snr_db)!=null).map(x=>num(x.snr_db)),loss:t.filter(x=>num(x.packet_loss_pct)!=null).map(x=>num(x.packet_loss_pct)),util:t.filter(x=>num(x.utilization_pct)!=null).map(x=>num(x.utilization_pct))};
 const anomalies=t.map(x=>{const flags=[];if(num(x.rssi_dbm)!=null&&num(x.rssi_dbm)<=-75)flags.push('RSSI baixo');if(num(x.snr_db)!=null&&num(x.snr_db)<15)flags.push('SNR baixo');if(num(x.packet_loss_pct)!=null&&num(x.packet_loss_pct)>=2)flags.push('Perda real de pacotes ≥ 2%');if(num(x.utilization_pct)!=null&&num(x.utilization_pct)>=85)flags.push('Utilização ≥ 85%');if(num(x.latency_ms)!=null&&values.latency.length>=5){const m=median(values.latency),mad=median(values.latency.map(v=>Math.abs(v-m)));if(num(x.latency_ms)>Math.max(100,m+3*(mad||0)))flags.push('Latência atípica em relação à amostra')}return {...x,flags}});
 const anomalyRows=anomalies.filter(x=>x.flags.length);
 const allTimes=[...failures.map(x=>x.timestamp),...anomalyRows.map(x=>x.timestamp)];
 const hours=group(allTimes.map(timestamp=>({timestamp})),x=>hourKey(x.timestamp));
 const hourRows=Object.entries(hours).map(([hour,a])=>({hour,count:a.length})).sort((a,b)=>b.count-a.count);
 const areas=group(failures.filter(x=>num(x.latitude)!=null&&num(x.longitude)!=null),x=>Number(x.latitude).toFixed(3)+', '+Number(x.longitude).toFixed(3));
 const areaRows=Object.entries(areas).map(([area,a])=>({area,count:a.length,first:a.map(x=>x.timestamp).sort()[0],last:a.map(x=>x.timestamp).sort().at(-1)})).sort((a,b)=>b.count-a.count);
 const sectors=group(anomalyRows,x=>x.sector||'Setor não informado');
 const sectorRows=Object.entries(sectors).map(([sector,a])=>({sector,count:a.length,flags:[...new Set(a.flatMap(x=>x.flags))]})).sort((a,b)=>b.count-a.count);
 const periods=[...ev.map(x=>x.timestamp),...t.map(x=>x.timestamp)].filter(Boolean).map(x=>new Date(x)).filter(x=>!Number.isNaN(+x));
 const min=periods.length?new Date(Math.min(...periods.map(x=>+x))):null,max=periods.length?new Date(Math.max(...periods.map(x=>+x))):null;
 const findings=[],actions=[],limits=[];
 if(ev.length<5&&t.length<5)findings.push({kind:'Dados insuficientes',level:'Amostra insuficiente',detail:'Há poucos registros para identificar recorrência confiável. Aumente a frequência e a duração da coleta.'});
 if(failures.length>=3)findings.push({kind:'Recorrência de falhas observada',level:'Evidência descritiva',detail:failures.length+' falhas/interrupções registradas no histórico consultado. A contagem não determina a origem da falha.'});
 if(hourRows.length&&hourRows[0].count>=3)findings.push({kind:'Concentração temporal',level:'Padrão a investigar',detail:'Maior concentração na faixa '+hourRows[0].hour+' ('+hourRows[0].count+' ocorrências/anomalias). É necessário comparar dias e volume de monitoramento.'});
 if(areaRows.length&&areaRows[0].count>=2)findings.push({kind:'Repetição geográfica',level:'Evidência espacial aproximada',detail:'Há '+areaRows[0].count+' falhas na célula aproximada '+areaRows[0].area+'. A célula é agrupamento cartográfico, não identificação de antena ou endereço.'});
 if(sectorRows.length)findings.push({kind:'Setores com indicadores atípicos',level:'Telemetria informada/importada',detail:sectorRows.slice(0,3).map(x=>x.sector+': '+x.count+' registros; '+x.flags.join(', ')).join(' | ')});
 if(values.latency.length>=5){const m=median(values.latency);if(m>150)findings.push({kind:'Latência elevada na telemetria',level:'Indicador observado',detail:'Mediana de '+Math.round(m)+' ms nos registros de telemetria. O significado depende do ponto de medição, destino e tecnologia.'})}
 if(!areaRows.length)limits.push('Não há coordenadas geográficas associadas às falhas analisadas. Ative a localização opcional ou importe latitude/longitude junto da telemetria.');
 if(!values.rssi.length&&!values.snr.length)limits.push('Não há medições RSSI/SNR disponíveis. O navegador não mede potência física de sinal; use telemetria de equipamento ou ferramenta compatível.');
 if(!values.loss.length)limits.push('Não há perda real de pacotes medida. Falhas HTTP do navegador não são equivalentes a perda de pacotes.');
 if(!values.latency.length)limits.push('Não há latência numérica na telemetria da Central do Provedor.');
 limits.push('Eventos HTTP do navegador indicam alcance dos destinos testados e não isolam DNS, Wi-Fi, acesso, backhaul ou servidor.');
 limits.push('As coordenadas são agrupadas com arredondamento aproximado de três casas decimais; precisão real depende da fonte e da permissão concedida.');
 limits.push('Anomalias são triagem estatística por limiares indicativos, não prova de defeito nem diagnóstico definitivo.');
 actions.push('Repetir medições nos horários e locais com maior recorrência, usando o mesmo método e destinos de referência.');
 if(areaRows.length)actions.push('Comparar pontos próximos e distantes na mesma janela temporal; confirmar precisão GPS e condições de coleta.');
 if(sectorRows.length)actions.push('Inspecionar telemetria dos setores destacados: RSSI/SNR, perda, utilização, alarmes e estado do equipamento.');
 actions.push('Separar testes por segmento: dispositivo/LAN, Wi-Fi ou rádio, gateway, enlace de acesso, DNS e destinos externos.');
 actions.push('Registrar intervenção, responsável e horário; repetir a mesma bateria de testes antes/depois para medir o resultado.');
 const n=ev.length+t.length,confidence=n>=30?'Amostra mais consistente (30+ registros)':n>=10?'Amostra inicial (10–29 registros)':'Baixa confiança (menos de 10 registros)';
 return {generated_at:new Date().toISOString(),version:'5.1',sample:{events:ev.length,telemetry:t.length,failures:failures.length,telemetry_anomalies:anomalyRows.length,geo_failures:failures.filter(x=>num(x.latitude)!=null&&num(x.longitude)!=null).length,confidence,from:min?.toISOString()||null,to:max?.toISOString()||null},metrics:Object.fromEntries(Object.entries(values).map(([k,a])=>[k,{count:a.length,median:a.length?median(a):null,max:a.length?Math.max(...a):null}])),hours:hourRows,areas:areaRows,sectors:sectorRows,findings,actions,limits};
}
function list(a){return '<ul>'+a.map(x=>'<li>'+esc(x)+'</li>').join('')+'</ul>'}
function render(r){
 $('ndiCount').textContent=r.sample.events+r.sample.telemetry;$('ndiPeriod').textContent=r.sample.from?new Date(r.sample.from).toLocaleDateString('pt-BR')+' a '+new Date(r.sample.to).toLocaleDateString('pt-BR'):'Período indisponível';
 $('ndiFailures').textContent=r.sample.failures+r.sample.telemetry_anomalies;$('ndiGeo').textContent=r.sample.geo_failures;$('ndiGeoDetail').textContent=r.sample.geo_failures+' falhas com coordenadas';
 $('ndiExecutive').innerHTML='<p><b>'+esc(r.sample.confidence)+'.</b> Foram analisados '+r.sample.events+' eventos e '+r.sample.telemetry+' registros de telemetria. Foram encontrados '+r.sample.failures+' eventos de falha/interrupção e '+r.sample.telemetry_anomalies+' medições com pelo menos um indicador atípico.</p><p>O relatório descreve padrões nos dados disponíveis; não confirma causa-raiz nem atribui responsabilidade a operadora ou equipamento.</p>';
 $('ndiHours').innerHTML=r.hours.length?'<table><thead><tr><th>Faixa</th><th>Ocorrências</th></tr></thead><tbody>'+r.hours.map(x=>'<tr><td>'+esc(x.hour)+'</td><td>'+x.count+'</td></tr>').join('')+'</tbody></table>':'Sem horários suficientes.';
 $('ndiAreas').innerHTML=r.areas.length?'<table><thead><tr><th>Célula GPS aproximada</th><th>Falhas</th></tr></thead><tbody>'+r.areas.slice(0,12).map(x=>'<tr><td>'+esc(x.area)+'</td><td>'+x.count+'</td></tr>').join('')+'</tbody></table>':'Sem coordenadas de falhas.';
 const names={latency:'Latência (ms)',rssi:'RSSI (dBm)',snr:'SNR (dB)',loss:'Perda real (%)',util:'Utilização (%)'};
 $('ndiMetrics').innerHTML='<table><thead><tr><th>Indicador</th><th>Amostras</th><th>Mediana</th><th>Máximo</th></tr></thead><tbody>'+Object.entries(r.metrics).map(([k,x])=>'<tr><td>'+names[k]+'</td><td>'+x.count+'</td><td>'+fmt(x.median)+'</td><td>'+fmt(x.max)+'</td></tr>').join('')+'</tbody></table>';
 $('ndiFindings').innerHTML=r.findings.map(x=>'<div class="logline"><b>'+esc(x.kind)+'</b> · <span class="pill">'+esc(x.level)+'</span><p class="tiny muted">'+esc(x.detail)+'</p></div>').join('')||'Nenhum achado além dos limites da amostra.';
 $('ndiActions').innerHTML=list(r.actions);$('ndiLimits').innerHTML=list(r.limits);$('ndiStatus').textContent='Análise concluída em '+new Date(r.generated_at).toLocaleString('pt-BR')+'. Os dados permanecem neste dispositivo.';
}
function download(name,body,type){const u=URL.createObjectURL(new Blob([body],{type})),a=document.createElement('a');a.href=u;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(u),1200)}
async function run(){ $('ndiStatus').textContent='Lendo registros locais e calculando padrões…';try{latest=analyze(await readEvents(),readTelemetry());render(latest)}catch(e){$('ndiStatus').textContent='Não foi possível analisar os registros: '+e.message}}
function init(){if(!$('ndiRun'))return;$('ndiRun').addEventListener('click',run);document.querySelectorAll('[data-page="inteligencia"]').forEach(b=>b.addEventListener('click',run));$('ndiExportJson').onclick=()=>{if(!latest)return run();download('no-network-cause-inteligencia-5.1.json',JSON.stringify(latest,null,2),'application/json')};$('ndiExportCsv').onclick=()=>{if(!latest)return run();const rows=[['grupo','indicador','valor'],...Object.entries(latest.sample).map(([k,v])=>['amostra',k,v]),...latest.findings.map((x,i)=>['achado-'+i,x.kind,x.detail]),...latest.actions.map((x,i)=>['acao-'+i,'recomendacao',x])];download('no-network-cause-inteligencia-5.1.csv','\uFEFF'+rows.map(r=>r.map(v=>'"'+String(v??'').replace(/"/g,'""')+'"').join(';')).join('\r\n'),'text/csv;charset=utf-8')};$('ndiPrint').onclick=()=>{if(!latest)return run().then(()=>setTimeout(()=>window.print(),100));window.print()};run()}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();