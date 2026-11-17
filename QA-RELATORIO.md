# QA — No Network Cause 2.6
Data: 16/11/2026

## Escopo
- Registro de transições online/offline informado pelo navegador.
- Indicador amostral de confiabilidade separado por destino de teste, calculado sobre as últimas 30 verificações.
- Inclusão do módulo environment.js e painel de leitura automática de rede.
- Leitura condicional de navigator.connection / mozConnection / webkitConnection.
- Eventos online/offline, mudança da API de rede e retorno da página ao primeiro plano atualizam a exibição.
- Campos não suportados são apresentados como indisponíveis, sem inferir dados.
- Cache PWA v250 e documentação atualizados.

## Identificação de antenas
Não implementada: navegador web comum não expõe lista de torres celulares, IDs de célula, BSSID ou pontos de acesso próximos. Geolocalização não identifica antena. Requer app nativo/API autorizada/inventário compatível.

## Limitações
- Dados da Central continuam locais.
- Downlink e RTT são estimativas da API do navegador, não medições independentes.
- Não há SNMP, TR-069/USP, NMS, OSS/BSS nem comando remoto a equipamentos.
- Compatibilidade da Network Information API varia entre navegadores.

## Verificações realizadas
- Módulo environment.js criado e referências inseridas no HTML e cache PWA.
- Revisão estática das referências e documentação.
- Não executados testes funcionais em Chrome/Android/Windows, nem PWA instalada.

## Testes pendentes
- Verificar painel em navegador com e sem navigator.connection.
- Simular eventos online/offline e alteração de rede.
- Confirmar layout responsivo em celular e desktop.
- Confirmar atualização do cache e carregamento offline da nova versão.
- Validar valores exibidos contra as informações disponíveis no dispositivo.

## Resultado
Versão 2.5 registrada com automação limitada às informações efetivamente fornecidas pelo navegador. Não há identificação de antenas nem descoberta de redes próximas.


## Versão 2.6 — coleta assistida de telemetria
- Painel de coleta adicionado à Central do Provedor.
- Coleta de cinco tentativas HTTP ao destino selecionado; preenche data/hora, latência média observada e taxa de falhas HTTP.
- Setor continua sendo informado pelo operador; nenhum dado de rádio ou throughput é inventado.
- A coleta não grava automaticamente; exige conferência e confirmação manual.
- Service worker atualizado para cache v260.
- Verificação estática de IDs, handlers, referências e versão de cache.
- Testes reais em Chrome/Android/Windows e validação de throughput permanecem pendentes; não declarar teste funcional concluído.


## Versão 2.6.1 — dashboard de sinal
- Conferir presença de painel, filtro de setor e gráfico SVG.
- Conferir validação RSSI (-120 a 0 dBm) e SNR (-10 a 80 dB).
- Conferir importação de aliases RSSI/SNR.
- Teste funcional em dispositivos reais permanece pendente.


## QA — versão 3.0 (revisão estática)
- Atualização de títulos, rodapé, manifesto e cache PWA para 3.0/v300.
- Dashboard de RSSI, SNR e latência com filtro único por setor e janela de até 30 registros.
- Verificação estática de IDs dos gráficos e indicadores, chamada dos três renderizadores, filtro compartilhado e remoção dos handlers duplicados.
- Verificação sintática JavaScript pendente de execução em ambiente de navegador; testes funcionais em Chrome/Android/Windows, PWA offline, OAuth Google e sincronização Supabase permanecem pendentes.
- Não declarar versão homologada em campo nem testes de hardware realizados.


## QA — versão 3.1 (revisão estática)
- Inclusão de controles de início, parada, coleta sob demanda e intervalo configurável.
- Configuração local do endpoint opcional do agente e setor/origem.
- Coleta de observações HTTP do navegador e ingestão dos campos de telemetria fornecidos pelo agente.
- Validação de URL HTTP/HTTPS e status HTTP do agente; campos não fornecidos permanecem nulos.
- Persistência local na Central Técnica e cache PWA v310.
- Revisão estática de código/documentação realizada durante a implementação.
- Testes funcionais em navegador/dispositivo, validação de CORS, integração com agente real, RSSI/SNR e demais métricas de hardware permanecem pendentes. Não declarar integração física homologada.


## Revisão estática — versão 3.1
- [x] Coleta HTTP periódica e gravação local automática.
- [x] Integração opcional de leitura JSON de agente autorizado.
- [x] Separação entre falhas HTTP e perda real de pacotes.
- [x] Campos de RSSI/SNR e métricas do rádio preenchidos apenas por fonte de telemetria.
- [x] Metadados opcionais da API Network Information identificados como estimativas.
- [x] Pausa de coleta quando a página está oculta.
- [x] Cache PWA atualizado para v311.
- [ ] Testes funcionais em Android, iOS e desktop ainda necessários.
- [ ] Integração real com roteador/agente depende de endpoint compatível e validação no ambiente do operador.
