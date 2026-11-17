(()=>{'use strict';
const VERSION='NOC-TERMOS-2026-11-17-v1';
const URL='https://piagfpnjiwpngbikkkfp.supabase.co';
const KEY='sb_publishable_G7GV4Yox1KkbjZtjnYxFAQ_kzo9V05a';
const SESSION_KEY='noc-auth-session';
const $=id=>document.getElementById(id);
let contractHash=null,checking=false,accepted=false;
function session(){try{return JSON.parse(localStorage.getItem(SESSION_KEY)||'null')}catch{return null}}
function gate(open){const el=$('nocContractGate');if(!el)return;el.classList.toggle('is-open',!!open);el.setAttribute('aria-hidden',open?'false':'true');document.body.style.overflow=open?'hidden':'';}
function msg(s){$('nocContractStatus').textContent=s}
async function hashContract(){if(contractHash)return contractHash;const r=await fetch('./termos-de-uso.html',{cache:'no-store'});if(!r.ok)throw new Error('Não foi possível carregar o contrato.');const bytes=new TextEncoder().encode(await r.text());const digest=await crypto.subtle.digest('SHA-256',bytes);contractHash=Array.from(new Uint8Array(digest)).map(x=>x.toString(16).padStart(2,'0')).join('');return contractHash}
function headers(token){return {apikey:KEY,Authorization:'Bearer '+token,'Content-Type':'application/json'}}
async function refresh(){
 if(checking)return;checking=true;
 try{
  const s=session();
  if(!s?.access_token){accepted=false;$('nocContractAccount').textContent='Entre na sua conta pela seção Administração para registrar o aceite.';$('nocContractLogin').textContent='Abrir Administração';$('nocContractAccept').disabled=true;gate(true);return}
  if(s.expires_at&&s.expires_at<Date.now()){accepted=false;$('nocContractAccount').textContent='Sua sessão expirou. Entre novamente para continuar.';$('nocContractAccept').disabled=true;gate(true);return}
  $('nocContractAccount').textContent='Conta autenticada: '+(s.user?.email||'usuário conectado');
  const h=await hashContract();
  const q=await fetch(URL+'/rest/v1/noc_contract_acceptances?select=id,contract_sha256&contract_version=eq.'+encodeURIComponent(VERSION)+'&limit=1',{headers:headers(s.access_token)});
  if(!q.ok)throw new Error('Falha ao consultar o registro de aceite (HTTP '+q.status+').');
  const rows=await q.json();
  accepted=rows.length>0&&rows[0].contract_sha256===h;
  if(accepted){gate(false);return}
  gate(true);
  if(rows.length&&rows[0].contract_sha256!==h)msg('O arquivo do contrato mudou sem alteração de versão. O aceite foi bloqueado por segurança; solicite revisão da versão.');
  else msg('Leia o contrato e marque a caixa para habilitar a confirmação.');
 }catch(e){accepted=false;gate(true);msg(e.message||'Não foi possível validar o aceite.')}
 finally{checking=false;updateButton()}
}
function updateButton(){const s=session();$('nocContractAccept').disabled=!($('nocContractAgree').checked&&s?.access_token&&!accepted)}
async function accept(){
 if(!$('nocContractAgree').checked)return;
 const s=session();if(!s?.access_token){msg('Entre na sua conta antes de aceitar.');return}
 const b=$('nocContractAccept');b.disabled=true;msg('Registrando seu aceite no Supabase…');
 try{
  const h=await hashContract();
  const r=await fetch(URL+'/rest/v1/noc_contract_acceptances',{method:'POST',headers:{...headers(s.access_token),Prefer:'return=representation'},body:JSON.stringify({user_id:s.user.id,contract_version:VERSION,contract_sha256:h,accepted_via:'web_checkbox',user_agent:navigator.userAgent.slice(0,500)})});
  if(!r.ok){const detail=(await r.text()).slice(0,250);if(r.status===409){msg('Já existe registro para esta versão. Atualize a página para validar.');}else throw new Error('Não foi possível registrar o aceite (HTTP '+r.status+'): '+detail);return}
  accepted=true;gate(false);msg('Aceite registrado.');$('nocContractAgree').checked=false;
 }catch(e){msg(e.message||'Falha ao registrar aceite.');}
 finally{updateButton()}
}
function openAdmin(){gate(false);const b=document.querySelector('[data-page="admin"]');if(b)b.click();setTimeout(()=>gate(!accepted),250)}
function init(){
 $('nocContractAgree').addEventListener('change',updateButton);
 $('nocContractAccept').addEventListener('click',accept);
 $('nocContractLogin').addEventListener('click',openAdmin);
 window.addEventListener('noc-auth-changed',refresh);
 window.addEventListener('storage',e=>{if(e.key===SESSION_KEY)refresh()});
 refresh();
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();