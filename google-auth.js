(()=>{'use strict';
const SUPABASE_URL='https://piagfpnjiwpngbikkkfp.supabase.co';
const SUPABASE_KEY='sb_publishable_G7GV4Yox1KkbjZtjnYxFAQ_kzo9V05a';
const SESSION_KEY='noc-auth-session';
const $=id=>document.getElementById(id);
function show(message){const el=$('googleAuthMessage');if(el)el.textContent=message;}
function bridge(session){
  if(!session){localStorage.removeItem(SESSION_KEY);return;}
  const mapped={access_token:session.access_token,refresh_token:session.refresh_token,expires_at:(session.expires_at||Math.floor(Date.now()/1000+(session.expires_in||3600)))*1000,user:session.user};
  let current=null;try{current=JSON.parse(localStorage.getItem(SESSION_KEY)||'null')}catch{}
  if(current?.access_token!==mapped.access_token){
    localStorage.setItem(SESSION_KEY,JSON.stringify(mapped));
    if(!sessionStorage.getItem('noc-google-session-bridged')){sessionStorage.setItem('noc-google-session-bridged','1');window.location.reload();}
  }
}
async function start(){
  const button=$('googleSignIn');
  if(!button)return;
  if(!window.supabase?.createClient){button.disabled=true;show('Não foi possível carregar o módulo seguro de autenticação. Atualize a página e tente novamente.');return;}
  const client=window.supabase.createClient(SUPABASE_URL,SUPABASE_KEY,{auth:{flowType:'pkce',persistSession:true,autoRefreshToken:true,detectSessionInUrl:true,storageKey:'noc-google-auth'}});
  button.addEventListener('click',async()=>{
    button.disabled=true;show('Conectando ao Google...');
    try{
      const {error}=await client.auth.signInWithOAuth({provider:'google',options:{redirectTo:window.location.origin+window.location.pathname,queryParams:{prompt:'select_account'}}});
      if(error)throw error;
    }catch(error){show('Falha ao iniciar o Google: '+(error.message||'erro desconhecido'));button.disabled=false;}
  });
  const {data,error}=await client.auth.getSession();
  if(error)show('Não foi possível recuperar a sessão Google: '+error.message);
  else if(data.session)bridge(data.session);
  client.auth.onAuthStateChange((event,session)=>{
    if(event==='SIGNED_IN'&&session)bridge(session);
    if(event==='SIGNED_OUT')localStorage.removeItem(SESSION_KEY);
    if(event==='TOKEN_REFRESHED'&&session)bridge(session);
  });
  const authOut=$('authOut');
  if(authOut)authOut.addEventListener('click',()=>client.auth.signOut());
  const params=new URLSearchParams(window.location.search);
  if(params.has('error_description'))show('Google recusou a autenticação: '+params.get('error_description'));
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start);else start();
})();