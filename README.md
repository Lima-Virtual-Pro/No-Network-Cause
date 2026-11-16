# No Network Cause 1.0
Copyright © Nailson Lima.

## Conteúdo
- PWA responsiva para Chrome Android e desktop.
- Diagnóstico HTTP de acesso externo por dois serviços.
- Monitoramento periódico enquanto a página permanece ativa.
- Histórico local IndexedDB, mapa local opcional, exportação CSV/JSON.
- Autenticação Supabase por e-mail/senha e sincronização de eventos.
- Opção para excluir registros próprios armazenados na nuvem.
- Termos de uso e política de privacidade preliminares.

## Backend configurado
Projeto: `Painel-Lima-Virtual` (`piagfpnjiwpngbikkkfp`), região `us-east-1`.
Tabelas `public.noc_monitoring_sessions`, `public.noc_diagnostics` e `public.noc_events`.
RLS habilitada, quatro políticas por tabela vinculadas a `auth.uid() = user_id`.
Chave publicável no cliente; nenhuma chave service_role é incluída.

## Publicação
Hospedar todos os arquivos da pasta em HTTPS. A aplicação usa Service Worker e IndexedDB, portanto não é recomendado abrir diretamente por `file://`.
Após publicação, validar Auth, confirmação de e-mail e sincronização usando uma conta de teste criada pelo responsável.

## Limitações que devem ser comunicadas
- O browser não expõe sempre RSSI, BSSID, gateway, rota, ICMP, jitter ou perda de pacotes.
- Fetch HTTP com resposta opaca não revela status HTTP detalhado.
- O tempo medido é uma aproximação do tempo da tentativa HTTP, não latência ICMP.
- O monitoramento não é garantido em segundo plano em dispositivos móveis.
- A geolocalização depende de consentimento e permissão do sistema.
- A versão 1.0 não faz teste real de throughput download/upload, traceroute, análise de canal Wi-Fi, nem diagnóstico automático da causa física.
- A versão não possui painel público regional ou integração automática com operadoras.

## QA executado nesta entrega
Consultar `QA-RELATORIO.md` para testes e limitações efetivamente verificadas. Não declarar compatibilidade universal sem testar os dispositivos-alvo.

## Preparação comercial obrigatória
Antes de vender: preencher identificação e contato do controlador/fornecedor nos documentos legais; definir licença, renovação, cancelamento, reembolso e suporte; executar teste de cadastro/login/confirmar e-mail/sincronizar/excluir com conta de teste; validar Chrome Android e Windows reais; revisar termos e política com profissional competente.

## Avaliação comercial
Consultar `AVALIACAO-COMERCIAL.md` para referências públicas, preço sugerido e estimativa preliminar do ativo.
