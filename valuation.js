(()=>{'use strict';
const EMAIL='onsite.limavirtual@gmail.com',USER='bcea361c-3ad5-474c-adcc-07226f6261e1';
const URL='https://piagfpnjiwpngbikkkfp.supabase.co',KEY='sb_publishable_G7GV4Yox1KkbjZtjnYxFAQ_kzo9V05a',SESSION='noc-auth-session';
const ids=['valMrr','valRevenue','valCosts','valCustomers','valGrowth','valChurn','valRevLow','valRevBase','valRevHigh','valProfitMult'];
const defaults={valMrr:0,valRevenue:0,valCosts:0,valCustomers:0,valGrowth:0,valChurn:0,valRevLow:1,valRevBase:2,valRevHigh:3,valProfitMult:4};
const $=id=>document.getElementById(id);
function getSession(){try{return JSON.parse(localStorage.getItem(SESSION)||'null')}catch{return null}}
function isAllowed(s){const u=s?.user||{},providers=u.app_metadata?.providers||[];return !!s?.access_token&&s.auth_method==='google'&&u.id===USER&&String(u.email||'').toLowerCase()===EMAIL&&Array.isArray(providers)&&providers.includes('google')}
function headers(token){return {apikey:KEY,Authorization:'Bearer '+token,'Content-Type':'application/json'}}
function values(){const v={};for(const id of ids){const n=Number($(id).value);v[id]=Number.isFinite(n)?n:0}return v}
function apply(v){for(const id of ids)$(id).value=v?.[id]??defaults[id]}
function money(n){return new Intl.NumberFormat('pt-BR',{style:'currency',currency:'BRL',maximumFractionDigits:0}).format(Number.isFinite(n)?n:0)}
function calculate(){const v=values(),arr=v.valMrr*12+v.valRevenue,ebitda=arr-v.valCosts;const lo=arr*v.valRevLow,base=arr*v.valRevBase,hi=arr*v.valRevHigh,profit=ebitda>0?ebitda*v.valProfitMult:0;
 $('valLowOut').textContent=money(lo);$('valBaseOut').textContent=money(base);$('valHighOut').textContent=money(hi);
 $('valuationMethod').textContent='ARR estimado: '+money(arr)+' · EBITDA simplificado: '+money(ebitda)+' · Referência por EBITDA positivo: '+money(profit)+' · Clientes ativos: '+v.valCustomers+' · Crescimento informado: '+v.valGrowth.toFixed(1)+'% · Churn mensal informado: '+v.valChurn.toFixed(1)+'%.';
}
async function load(){const s=getSession(),ok=isAllowed(s);$('valuationNav')?.classList.toggle('hidden',!ok);if(!ok){$('valuationAccess').textContent='Acesso negado. Esta área exige login Google com onsite.limavirtual@gmail.com.';return}
 $('valuationAccess').textContent='Acesso autorizado para '+EMAIL+'.';try{const r=await fetch(URL+'/rest/v1/noc_valuation_profiles?select=inputs&user_id=eq.'+USER,{headers:headers(s.access_token)});if(!r.ok)throw new Error('HTTP '+r.status);const rows=await r.json();apply(rows[0]?.inputs||defaults);calculate();$('valuationSaveStatus').textContent='Premissas carregadas do Supabase.'}catch(e){$('valuationSaveStatus').textContent='Falha ao carregar premissas: '+e.message}}
async function save(){const s=getSession();if(!isAllowed(s)){$('valuationSaveStatus').textContent='Sessão não autorizada. Entre novamente com a conta Google permitida.';return}
 const inputs=values();if(inputs.valCustomers<0||inputs.valGrowth< -100||inputs.valGrowth>1000||inputs.valChurn<0||inputs.valChurn>100||ids.filter(x=>!['valGrowth','valChurn'].includes(x)).some(x=>inputs[x]<0)){$('valuationSaveStatus').textContent='Revise os valores: números negativos ou percentuais fora dos limites não são permitidos.';return}
 try{const r=await fetch(URL+'/rest/v1/noc_valuation_profiles?on_conflict=user_id',{method:'POST',headers:{...headers(s.access_token),Prefer:'resolution=merge-duplicates,return=minimal'},body:JSON.stringify({user_id:USER,inputs,updated_at:new Date().toISOString()})});if(!r.ok)throw new Error('HTTP '+r.status+' '+(await r.text()).slice(0,180));$('valuationSaveStatus').textContent='Premissas salvas no Supabase.';calculate()}catch(e){$('valuationSaveStatus').textContent='Falha ao salvar: '+e.message}}
function init(){const nav=$('valuationNav');if(!nav)return;nav.classList.add('hidden');$('valuationSave').addEventListener('click',save);$('valuationRefresh').addEventListener('click',calculate);ids.forEach(id=>$(id).addEventListener('input',calculate));window.addEventListener('storage',e=>{if(e.key===SESSION)load()});window.addEventListener('noc-auth-changed',load);nav.addEventListener('click',()=>{if(isAllowed(getSession()))load();else{$('valuationAccess').textContent='Acesso negado. Use a conta Google autorizada.'}});load()}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();