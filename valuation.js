(()=>{'use strict';
const EMAIL='onsite.limavirtual@gmail.com',USER='bcea361c-3ad5-474c-adcc-07226f6261e1';
const URL='https://piagfpnjiwpngbikkkfp.supabase.co',KEY='sb_publishable_G7GV4Yox1KkbjZtjnYxFAQ_kzo9V05a',SESSION='noc-auth-session';
const $=id=>document.getElementById(id);
const defaults={valRevLow:1,valRevBase:2,valRevHigh:3,valProfitMult:4,valGrowth:0,valChurn:0};
let products=[],snapshots=[];
function session(){try{return JSON.parse(localStorage.getItem(SESSION)||'null')}catch{return null}}
function allowed(s){const u=s?.user||{},p=u.app_metadata?.providers||[];return !!s?.access_token&&s.auth_method==='google'&&u.id===USER&&String(u.email||'').toLowerCase()===EMAIL&&Array.isArray(p)&&p.includes('google')}
function headers(s,extra={}){return {apikey:KEY,Authorization:'Bearer '+s.access_token,'Content-Type':'application/json',...extra}}
function money(n){return new Intl.NumberFormat('pt-BR',{style:'currency',currency:'BRL',maximumFractionDigits:0}).format(Number.isFinite(n)?n:0)}
function num(id){const x=Number($(id)?.value);return Number.isFinite(x)?x:0}
function esc(x){return String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
function assumptions(){return Object.fromEntries(Object.keys(defaults).map(k=>[k,num(k)]))}
async function api(path,s,opts={}){const {headers:extra={},...rest}=opts;const r=await fetch(URL+'/rest/v1/'+path,{...rest,headers:headers(s,extra)});if(!r.ok)throw new Error('HTTP '+r.status+' '+(await r.text()).slice(0,240));return r.status===204?null:r.json()}
async function load(){const s=session(),ok=allowed(s);$('valuationNav')?.classList.toggle('hidden',!ok);if(!ok){$('valuationAccess').textContent='Acesso negado. Esta área exige login Google com onsite.limavirtual@gmail.com.';return}
$('valuationAccess').textContent='Acesso autorizado para '+EMAIL+'.';try{
 const [p,ss,prof]=await Promise.all([
 api('noc_valuation_products?select=*&order=product_name.asc',s),
 api('noc_valuation_snapshots?select=*&order=period_month.asc',s),
 api('noc_valuation_profiles?select=inputs&user_id=eq.'+USER,s)
 ]);
 products=p||[];snapshots=ss||[];const saved=prof?.[0]?.inputs||{};Object.entries(defaults).forEach(([k,v])=>$(k).value=saved[k]??v);
 render();
 $('valuationSaveStatus').textContent='Produtos e históricos carregados do Supabase. Fechamentos ainda são informados manualmente até mapear e validar as integrações de cobrança.';
 }catch(e){$('valuationSaveStatus').textContent='Falha ao carregar dados: '+e.message}}
function currentSnap(key){return snapshots.filter(x=>x.product_key===key).sort((a,b)=>b.period_month.localeCompare(a.period_month))[0]||null}
function evaluate(mrr,costs,ass){const arr=mrr*12,ebitda=arr-costs*12;return {arr,ebitda,low:arr*ass.valRevLow,base:arr*ass.valRevBase,high:arr*ass.valRevHigh}}
function project(mrr,months,growth,churn){const monthlyGrowth=Math.pow(Math.max(0,1+growth/100),1/12)-1;return mrr*Math.pow(Math.max(0,1+monthlyGrowth-churn/100),months)}
function render(){const a=assumptions(),included=products.filter(p=>p.include_in_portfolio&&p.status==='active'),rows=included.map(p=>({p,s:currentSnap(p.product_key)}));
 const active=rows.reduce((n,x)=>n+Number(x.s?.active_licenses||0),0),mrr=rows.reduce((n,x)=>n+Number(x.s?.mrr||0),0),cost=rows.reduce((n,x)=>n+Number(x.s?.costs||0),0),v=evaluate(mrr,cost,a);
 $('valPortfolioProducts').textContent=products.length;$('valPortfolioLicenses').textContent=active;$('valPortfolioMrr').textContent=money(mrr);$('valPortfolioValue').textContent=money(v.base);
 $('valPortfolioStatus').textContent='Baseado no último fechamento registrado por produto. '+rows.filter(x=>!x.s).length+' produto(s) sem fechamento; dados ausentes não são tratados como zero confirmado.';
 $('valLowOut').textContent=money(v.low);$('valBaseOut').textContent=money(v.base);$('valHighOut').textContent=money(v.high);
 const proj=[6,12,24,36].map(m=>({m,val:project(mrr,m,a.valGrowth,a.valChurn)}));
 $('valProjectionDetails').innerHTML='<p>MRR atual informado: <b>'+money(mrr)+'</b>. Receita anualizada: <b>'+money(v.arr)+'</b>. EBITDA simplificado anualizado: <b>'+money(v.ebitda)+'</b>.</p><p>Projeção de MRR: '+proj.map(x=>x.m+' meses: <b>'+money(x.val)+'</b>').join(' · ')+'.</p><p class="tiny">Projeção matemática com crescimento anual e churn mensal informados; não é previsão garantida. Valuation aplica múltiplos de receita anual sobre cada cenário projetado.</p>';
 $('valProductResults').innerHTML=products.length?'<table><thead><tr><th>Produto</th><th>Licenças</th><th>MRR</th><th>ARR</th><th>Valor base</th><th>Dados</th></tr></thead><tbody>'+products.map(p=>{const s=currentSnap(p.product_key),z=evaluate(Number(s?.mrr||0),Number(s?.costs||0),a);return '<tr><td>'+esc(p.product_name)+'</td><td>'+Number(s?.active_licenses||0)+'</td><td>'+money(Number(s?.mrr||0))+'</td><td>'+money(z.arr)+'</td><td>'+money(z.base)+'</td><td>'+esc(s?.confidence||'sem fechamento')+'</td></tr>'}).join('')+'</tbody></table>':'Nenhum produto cadastrado.';
 const months=[...new Set(snapshots.map(x=>x.period_month))].sort();$('valTrendTable').innerHTML=months.length?'<table><thead><tr><th>Mês</th><th>Licenças ativas</th><th>MRR</th><th>Receita não recorrente</th><th>Custos</th></tr></thead><tbody>'+months.map(m=>{const ss=snapshots.filter(x=>x.period_month===m&&included.some(p=>p.product_key===x.product_key));return '<tr><td>'+esc(m.slice(0,7))+'</td><td>'+ss.reduce((n,x)=>n+x.active_licenses,0)+'</td><td>'+money(ss.reduce((n,x)=>n+Number(x.mrr),0))+'</td><td>'+money(ss.reduce((n,x)=>n+Number(x.one_time_revenue),0))+'</td><td>'+money(ss.reduce((n,x)=>n+Number(x.costs),0))+'</td></tr>'}).join('')+'</tbody></table>':'Registre pelo menos um fechamento mensal.';
 const sel=$('vsProduct'),old=sel.value;sel.innerHTML=products.map(p=>'<option value="'+esc(p.product_key)+'">'+esc(p.product_name)+'</option>').join('')||'<option value="">Cadastre um produto primeiro</option>';if(products.some(p=>p.product_key===old))sel.value=old;
}
async function saveProduct(){const s=session();if(!allowed(s))return;const key=$('vpKey').value.trim().toLowerCase(),name=$('vpName').value.trim();if(!/^[a-z0-9][a-z0-9_-]{1,79}$/.test(key)||name.length<2){$('vpStatus').textContent='Informe identificador válido e nome com pelo menos 2 caracteres.';return}
try{await api('noc_valuation_products?on_conflict=user_id,product_key',s,{method:'POST',headers:{Prefer:'resolution=merge-duplicates,return=minimal'},body:JSON.stringify({user_id:USER,product_key:key,product_name:name,category:$('vpCategory').value,billing_model:$('vpBilling').value,price_amount:num('vpPrice'),include_in_portfolio:$('vpInclude').checked,updated_at:new Date().toISOString()})});$('vpStatus').textContent='Produto salvo.';await load()}catch(e){$('vpStatus').textContent='Falha ao salvar produto: '+e.message}}
async function saveSnapshot(){const s=session();if(!allowed(s))return;const key=$('vsProduct').value,month=$('vsMonth').value+'-01';if(!key||!/^\d{4}-\d{2}-01$/.test(month)){$('vsStatus').textContent='Selecione produto e mês.';return}
const fields=['vsActive','vsNew','vsExpired','vsCancelled','vsRenewed','vsMrr','vsOneTime','vsCosts'];if(fields.some(id=>num(id)<0)){$('vsStatus').textContent='Não são permitidos valores negativos.';return}
try{await api('noc_valuation_snapshots?on_conflict=user_id,product_key,period_month',s,{method:'POST',headers:{Prefer:'resolution=merge-duplicates,return=minimal'},body:JSON.stringify({user_id:USER,product_key:key,period_month:month,active_licenses:num('vsActive'),new_licenses:num('vsNew'),expired_licenses:num('vsExpired'),cancelled_licenses:num('vsCancelled'),renewed_licenses:num('vsRenewed'),mrr:num('vsMrr'),one_time_revenue:num('vsOneTime'),costs:num('vsCosts'),confidence:$('vsConfidence').value,source:'manual'})});$('vsStatus').textContent='Fechamento salvo. Fonte: lançamento manual.';await load()}catch(e){$('vsStatus').textContent='Falha ao salvar fechamento: '+e.message}}
async function saveAssumptions(){const s=session();if(!allowed(s))return;const a=assumptions();if(a.valRevLow<0||a.valRevBase<0||a.valRevHigh<0||a.valProfitMult<0||a.valGrowth< -100||a.valGrowth>1000||a.valChurn<0||a.valChurn>100){$('valuationSaveStatus').textContent='Revise as premissas e percentuais.';return}
try{await api('noc_valuation_profiles?on_conflict=user_id',s,{method:'POST',headers:{Prefer:'resolution=merge-duplicates,return=minimal'},body:JSON.stringify({user_id:USER,inputs:a,updated_at:new Date().toISOString()})});$('valuationSaveStatus').textContent='Premissas salvas.';render()}catch(e){$('valuationSaveStatus').textContent='Falha ao salvar premissas: '+e.message}}
function init(){if(!$('valuationNav'))return;$('valuationNav').classList.add('hidden');$('vpSave').addEventListener('click',saveProduct);$('vsSave').addEventListener('click',saveSnapshot);$('valuationSave').addEventListener('click',saveAssumptions);$('valuationRefresh').addEventListener('click',()=>load());$('vsMonth').value=new Date().toISOString().slice(0,7);window.addEventListener('storage',e=>{if(e.key===SESSION)load()});window.addEventListener('noc-auth-changed',load);$('valuationNav').addEventListener('click',()=>{if(allowed(session()))load()});load()}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();