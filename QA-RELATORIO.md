# QA — No Network Cause 1.0
Data: 16/11/2026

## Resultado executivo
**Status: QA técnico parcial aprovado; homologação comercial/produção ainda pendente.**
Esta entrega não será descrita como integralmente homologada: o ambiente de execução bloqueou a abertura do Chromium (`ERR_BLOCKED_BY_ADMINISTRATOR`) e o processo headless excedeu o tempo limite. Portanto, testes reais de interação no navegador não puderam ser concluídos aqui.

## Testes efetivamente executados
| Teste | Resultado | Evidência |
|---|---|---|
| Sintaxe JavaScript principal | APROVADO | `node --check app.js` retornou código 0 |
| Sintaxe Service Worker | APROVADO | `node --check sw.js` retornou código 0 |
| Manifest PWA | APROVADO | JSON parseado e campos essenciais conferidos |
| Referências DOM diretas | APROVADO | 56 referências `$()` comparadas; nenhuma ID ausente |
| Documentos legais e links | APROVADO | Dois arquivos HTML presentes e links na aplicação |
| Chave no frontend | APROVADO | Chave publishable; nenhuma `service_role` encontrada |
| Migração de histórico local | APROVADO ESTÁTICO | Mantido o nome do IndexedDB da versão anterior |
| ZIP | APROVADO | `ZipFile.testzip()` retornou `None` |
| Schema Supabase | APROVADO | Consulta SQL confirmou 3 tabelas `noc_*` |
| RLS Supabase | APROVADO | RLS ativa e 4 políticas por tabela |
| Índices de sincronização | APROVADO | Índice UNIQUE por `(user_id, client_event_id)` em diagnósticos e eventos |
| Restrição de tipos de evento | APROVADO | Constraint inclui `diagnostic_completed`, `monitor_check` e eventos de queda/recuperação |

## Testes não concluídos — não declarar como aprovados
- Execução interativa real no Chrome desktop/Android.
- Diagnóstico com queda real de Wi-Fi, Ethernet e rede móvel.
- Download CSV/JSON em dispositivos físicos.
- Instalação PWA e atualização do Service Worker em HTTPS publicado.
- Cadastro, confirmação de e-mail, login, refresh de sessão e logout com conta de teste.
- Inserção, upsert, sincronização offline/online e exclusão no Supabase por sessão autenticada.
- Verificação de isolamento RLS com duas contas distintas.
- Teste de GPS em dispositivo e precisão real.
- Teste de volume, carga e longa duração do monitoramento.

## Limites técnicos conhecidos
A aplicação usa tentativas HTTP no navegador. Não implementa ICMP, traceroute, medição de RSSI/BSSID, inspeção de gateway, jitter, perda de pacotes real ou throughput download/upload. O navegador pode suspender tarefas em segundo plano. Falhas em serviços de teste não identificam por si só a operadora ou o equipamento causador.

## Homologação necessária antes de vender
1. Publicar em HTTPS no domínio definitivo.
2. Criar conta de QA sem dados pessoais reais e testar Auth completo.
3. Testar sincronização e exclusão em duas contas distintas.
4. Testar Chrome Android e Windows em Wi-Fi, Ethernet e rede móvel.
5. Validar exportações, permissões de GPS, funcionamento offline e atualização PWA.
6. Completar dados do controlador e contato nos documentos legais e obter revisão jurídica/LGPD.
7. Definir termos de licença, renovação, cancelamento, reembolso, suporte e política de retenção.

## Conclusão
A versão 1.0 está empacotada e passou verificações estáticas e validações do schema Supabase. Ela é adequada para **piloto controlado / homologação**, mas não deve ser anunciada como produto integralmente testado em produção até concluir a matriz acima.
