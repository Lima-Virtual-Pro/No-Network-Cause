# No Network Cause 2.0
Copyright © Nailson Lima.

## Novidades da versão 2.0
- **Análise avançada:** índice indicativo de estabilidade, taxa amostral de respostas, latência média/máxima e contagem de interrupções, calculados sobre até 30 verificações recentes.
- **Destino personalizado:** permite adicionar um endpoint HTTP/HTTPS de propriedade do usuário para teste de alcance.
- **Alertas do navegador:** notificações opcionais quando o monitoramento observa interrupção ou recuperação, mediante permissão do navegador.
- **Relatório técnico imprimível:** página de análise preparada para impressão ou salvamento em PDF pelo navegador.
- **Exportação TSV:** arquivo separado por tabulação, alternativa para abrir em planilhas móveis quando a importação CSV não separa corretamente.
- Mantém diagnóstico HTTP, monitoramento com a página ativa, histórico IndexedDB, mapa local opcional, CSV/JSON, autenticação Google/e-mail e sincronização Supabase.

## Backend
Projeto Supabase existente: `Painel-Lima-Virtual` (`piagfpnjiwpngbikkkfp`). Tabelas isoladas `noc_*`, RLS e chave publicável no navegador. Esta versão não requer migração SQL.

## Publicação
Todos os arquivos devem ser hospedados em HTTPS. O Service Worker usa cache `no-network-cause-v200`. Após a publicação, feche e reabra a PWA ou atualize a página para carregar a nova versão.

## Limitações técnicas
- Os indicadores são amostrais e calculados a partir dos eventos armazenados neste dispositivo; não equivalem a uptime contratual.
- O browser não expõe sempre RSSI, BSSID, gateway, rota, ICMP, jitter ou perda real de pacotes.
- Fetch HTTP não mede throughput nem garante que uma falha seja causada pela operadora.
- Destinos personalizados podem rejeitar ou bloquear requisições originadas no navegador.
- Alertas dependem de permissão e do suporte do navegador; monitoramento em segundo plano não é garantido em celulares.
- A geolocalização continua opcional.

## QA
Consultar `QA-RELATORIO.md`. A revisão estática do código e a verificação das referências DOM não substituem testes reais em Android, Windows, Google Sheets, Excel e contas distintas do Supabase.

Contato: onsite.limavirtual@gmail.com.
