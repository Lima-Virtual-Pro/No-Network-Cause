(()=>{'use strict';
const $=id=>document.getElementById(id);
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function read(){
 const c=navigator.connection||navigator.mozConnection||navigator.webkitConnection;
 const rows=[
 ['Estado do dispositivo',navigator.onLine?'Online segundo o navegador':'Offline segundo o navegador'],
 ['Tipo de rede',c?.type||'Não disponibilizado pelo navegador'],
 ['Perfil de conexão',c?.effectiveType||'Não disponibilizado'],
 ['Download estimado',Number.isFinite(c?.downlink)?c.downlink+' Mbps':'Não disponibilizado'],
 ['RTT estimado',Number.isFinite(c?.rtt)?c.rtt+' ms':'Não disponibilizado'],
 ['Economia de dados',typeof c?.saveData==='boolean'?(c.saveData?'Ativada':'Desativada'):'Não disponibilizado'],
 ['Plataforma',navigator.userAgentData?.platform||navigator.platform||'Não identificada'],
 ['Atualização',new Date().toLocaleTimeString('pt-BR')]
 ];
 const note=c?'Informações fornecidas pelo navegador. Downlink e RTT são estimativas da API, não medições de velocidade nem ping.':'Este navegador não oferece a API de informações de rede. O estado online/offline continua disponível.';
 const body=$('nocEnvRows'),hint=$('nocEnvNote');
 if(body)body.innerHTML=rows.map(([k,v])=>'<div class="logline"><b>'+esc(k)+'</b><div class="tiny muted">'+esc(v)+'</div></div>').join('');
 if(hint)hint.textContent=note;
}
function init(){
 const host=document.querySelector('#dashboard .grid');if(!host||$('nocEnvironmentCard'))return;
 const card=document.createElement('article');card.className='card span-12';card.id='nocEnvironmentCard';
 const h=document.createElement('h2');h.textContent='Leitura automática do ambiente de rede';
 const p=document.createElement('p');p.className='tiny muted';p.textContent='Dados que o navegador disponibiliza sem instalar software adicional.';
 const rows=document.createElement('div');rows.id='nocEnvRows';rows.className='grid';
 const note=document.createElement('p');note.id='nocEnvNote';note.className='notice';
 const button=document.createElement('button');button.type='button';button.className='secondary';button.textContent='Atualizar leitura';button.addEventListener('click',read);
 card.append(h,p,rows,note,button);host.append(card);read();
 window.addEventListener('online',read);window.addEventListener('offline',read);
 const c=navigator.connection||navigator.mozConnection||navigator.webkitConnection;c?.addEventListener?.('change',read);
 document.addEventListener('visibilitychange',()=>{if(!document.hidden)read()});
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();