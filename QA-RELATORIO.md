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


## QA — versão 3.2 Avançada (revisão estática)
- [x] Cinco sondagens com timeout individual e registro de concluídas/falhas.
- [x] Estado online/offline do navegador incluído no registro, sem confundir com disponibilidade do serviço.
- [x] Persistência confirmada por leitura de retorno do registro gravado.
- [x] Timeout e validação estrutural básica da resposta JSON do agente.
- [x] Painel de validação e autoteste local de armazenamento/estrutura/configuração.
- [x] Distinção explícita entre requisição concluída, resposta HTTP validada e perda real de pacotes.
- [ ] Testes funcionais em Android/desktop, cenários de desconexão, CORS e integração com agente/roteador real permanecem pendentes.
- [ ] Não declarar telemetria física homologada sem fonte real e ensaio de campo.


## QA — versão 3.3 (revisão estática)
- [x] Perfil de equipamento ZTE ZXHN F6645P e firmware observado documentados na interface.
- [x] Campos ópticos adicionados ao registro local e ao resumo da última leitura.
- [x] Validação de limites para RX/TX, tensão, corrente e temperatura.
- [x] Contrato Cloudflare Worker ampliado para aceitar campos ópticos e estado ONU.
- [x] Importação JSON/CSV ampliada com aliases PT/EN.
- [x] Cache PWA atualizado para v330.
- [ ] Não foi executada leitura automática no ZTE; endpoint/API do firmware ainda não foi identificado.
- [ ] Testes funcionais em navegador, agente real, CORS, Worker/KV e equipamento físico pendentes.
- [ ] Leituras ópticas de exemplo vieram de capturas fornecidas pelo operador; não são resultados de teste do software.
- [ ] Não declarar integração ZTE homologada nem coleta física automatizada.


## QA — versão 4.0 (revisão estática)
- [x] Ajustes CSS para reduzir cortes e overflow em celular.
- [x] Alertas com contexto seguro, permissões e fallback interno.
- [x] Estatísticas de média, mediana, P95, máximo e taxa de resposta.
- [x] Gráfico SVG baseado somente nas latências observadas.
- [x] Instruções de investigação contextualizadas e ressalvas técnicas.
- [x] Cache PWA v400.
- [ ] Testes funcionais em Android/iOS/desktop e larguras 320–768 px.
- [ ] Validar permissões de notificações em HTTPS e modo PWA instalado.
- [ ] Testar impressão/salvamento PDF em dispositivos reais.
- [ ] Validar RSSI/SNR e telemetria óptica com fonte autorizada de hardware.
- [ ] Não declarar homologação funcional ou integração física sem ensaios de campo.


## Revisão visual 4.0.1 — baseada nas capturas Android
- [x] Navegação em grade para reduzir corte de menus em telas móveis.
- [x] Redução de tipografia, margens, paddings e altura dos cartões.
- [x] Ajustes específicos para larguras abaixo de 520 px e 360 px.
- [x] Mapa e formulários com limites responsivos.
- [x] Rótulos de monitoramento/telemetria atualizados para 4.0.
- [ ] Conferir em navegador real, PWA instalada e zoom/acessibilidade do Android.
