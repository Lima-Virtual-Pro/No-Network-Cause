# QA — No Network Cause 2.0
Data: 16/11/2026

## Escopo implementado
1. Análise avançada sobre as últimas 30 verificações: taxa amostral de resposta, latência média/máxima e índice indicativo de estabilidade.
2. Destino adicional HTTP/HTTPS configurável localmente.
3. Alertas opcionais do navegador para interrupção e recuperação observadas durante monitoramento.
4. Relatório de análise imprimível/salvável em PDF pelo navegador.
5. Exportação TSV separada por tabulação como alternativa a CSV.
6. Cache PWA atualizado para `no-network-cause-v200`.
7. Mantida a estrutura Supabase anterior; nenhuma migração SQL é necessária nesta versão.

## Verificações estáticas realizadas
- Os elementos da nova navegação e seção de análise foram adicionados ao HTML.
- Os identificadores dos controles de destino personalizado, alertas, impressão e TSV foram conectados ao JavaScript.
- Os cálculos da análise usam apenas eventos locais do tipo diagnóstico e verificação de monitoramento.
- O destino adicional é validado como URL HTTP/HTTPS antes de ser salvo.
- Notificações exigem permissão explícita do navegador.
- A folha de impressão limita a saída à seção de análise.
- O Service Worker foi versionado para invalidar o cache anterior.

## Testes ainda necessários em ambiente real
- Executar `node --check app.js` e `node --check sw.js` após baixar o commit.
- Testar destino personalizado com endpoint próprio que permita requisições de navegador e com host indisponível.
- Testar permissões de notificação e notificações em Android/Windows.
- Imprimir/salvar PDF em Chrome Android e desktop.
- Abrir TSV e CSV em Google Sheets Android, Excel e LibreOffice.
- Repetir login Google, logout, renovação de sessão, sincronização e exclusão com duas contas diferentes.
- Testar PWA instalada e atualização do Service Worker em HTTPS.
- Testar comportamento do monitoramento com tela bloqueada; o navegador pode suspender a página.

## Interpretação e limites
O índice de estabilidade é um indicador heurístico da amostra recente, não um padrão técnico certificado. A taxa de respostas é a proporção de verificações que alcançaram pelo menos um serviço consultado, não disponibilidade contínua da conexão. Latência é tempo aproximado de tentativa HTTP, não ping ICMP. Destinos personalizados podem falhar por CORS, DNS, firewall ou indisponibilidade do serviço; uma falha não identifica sozinha a causa física.

## Resultado
**Implementação v2.0 enviada ao repositório. QA automatizado em navegador e homologação física ainda pendentes.** Não classificar o produto como integralmente homologado ou pronto para venda sem concluir os testes reais acima.
