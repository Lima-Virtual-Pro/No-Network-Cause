# No Network Cause 4.0
Copyright © Nailson Lima.

## Revisão visual e versão 4.0.2
- Corrigida a apresentação da leitura automática do ambiente de rede em telas estreitas: rótulos e valores agora usam duas colunas legíveis, sem quebra de uma letra por linha.
- Cabeçalho, rodapé, manifesto PWA e cache identificam a versão 4.0.2.
- A aplicação já oferece instalação como PWA em modo standalone; recursos locais funcionam conforme os arquivos armazenados em cache. Login e sincronização Supabase exigem conexão.

## Histórico de funcionalidades
- Registro automático de transições online/offline informadas pelo navegador, separado das falhas de serviços externos.
- Indicador amostral de confiabilidade por destino de teste, com quantidade de respostas, taxa de sucesso e horário da última tentativa.
- Histórico diferencia eventos do estado do dispositivo e resultados de testes HTTP.
- Painel automático de informações de rede disponibilizadas pelo navegador.
- Atualização da leitura quando o dispositivo muda entre online/offline, quando a API de rede notifica alteração e quando a página volta ao primeiro plano.
- Exibição de tipo/perfil de conexão, downlink estimado, RTT estimado, economia de dados e plataforma, somente quando suportados.
- Atualização manual da leitura disponível.
- Cache PWA atualizado para no-network-cause-v250.

## Identificação de antenas: limite técnico
- Navegadores comuns não oferecem API para listar antenas celulares, torres, células, BSSID ou redes Wi-Fi próximas.
- A geolocalização identifica a posição aproximada do dispositivo, não a antena que o atende.
- A API Network Information, quando existe, pode expor apenas tipo/perfil de rede e estimativas; não identifica torre, setor ou ponto de acesso.
- Por isso, esta versão não inventa nomes ou IDs de antenas e não apresenta uma identificação estimada como se fosse real.
- Identificação confiável de célula/antena requer aplicativo nativo com permissões apropriadas e compatibilidade por sistema, ou integração autorizada com equipamento/API/operadora e fonte de inventário. Isso não está disponível no navegador atual.

## Recursos mantidos
- Diagnóstico HTTP, monitoramento periódico iniciado pelo usuário, histórico local, localização opcional e relatórios.
- Motor de recomendações técnicas com hipóteses e cautelas.
- Central local do provedor com telemetria manual/importada, chamados e comparação antes/depois.
- Importação com validação integral, limite de 5 MB e 10.000 registros.

## Limitações reais
- A Central do Provedor continua armazenada localmente no navegador e não sincroniza com Supabase.
- A leitura de rede depende das APIs expostas pelo navegador e pode apresentar campos indisponíveis.
- Downlink/RTT da API são estimativas do navegador; não equivalem a teste de velocidade ou ping.
- CSV usa separador vírgula.
- Não há integração SNMP, TR-069/USP, NMS, OSS/BSS, descoberta de antenas ou alteração de equipamentos.
- Nenhuma configuração de rádio, antena ou roteador é alterada.

## Publicação
Hospedar em HTTPS. Cache PWA atualizado para v250; após publicar, recarregue/atualize a instalação da PWA.

## QA
Consultar QA-RELATORIO.md. Revisão estática não substitui testes funcionais em navegadores e dispositivos reais.

Contato: onsite.limavirtual@gmail.com.


## Melhorias da versão 2.6
- Coleta assistida na Central do Provedor: cinco tentativas HTTP ao destino escolhido, preenchimento da data/hora e do campo de latência média observada.
- Campo de perda passa a receber a taxa de falhas das tentativas HTTP desta coleta; não deve ser interpretado como perda ICMP ou perda real de pacotes.
- Identificação do setor permanece manual/cadastrada. Utilização, usuários simultâneos e throughput não são inventados nem preenchidos por estimativa.
- A coleta não salva automaticamente: o operador confere os valores e confirma em Registrar medição.
- Cache PWA atualizado para no-network-cause-v260.

## Limitações da coleta automática 2.6
- Requisições HTTP dependem de conectividade, DNS, políticas do navegador, CORS e disponibilidade do destino.
- Latência HTTP é tempo de tentativa até a resposta, não ping ICMP.
- Taxa de falhas HTTP é apenas indicador de tentativas sem resposta.
- Throughput real, utilização de rádio, usuários simultâneos, RSSI/SNR e identificação de antena exigem testes dedicados ou integração autorizada com equipamento/NMS.
- Não houve alteração de Supabase nem integração com equipamentos nesta versão.


## Versão 2.6.1 — dashboard de sinal
- Gráfico histórico SVG de RSSI (dBm), com filtro por antena/setor e últimas 30 leituras.
- Campo opcional RSSI e SNR no registro manual de telemetria.
- Importação CSV/JSON aceita aliases de RSSI e SNR.
- Sem leitura automática de sinal pelo navegador; dados dependem de registro manual ou telemetria importada.


## Versão 3.0 — versão estável consolidada
- Dashboard técnico com três séries históricas: RSSI, SNR e latência, usando filtro de setor compartilhado.
- Indicadores de última leitura para RSSI, SNR e latência; gráficos limitados aos 30 registros mais recentes da janela selecionada.
- Cada série apresenta apenas pontos efetivamente registrados, sem interpolação ou geração de dados ausentes.
- RSSI/SNR aceitos no registro manual e importação JSON/CSV; latência pode ser registrada manualmente, importada ou observada pelo teste HTTP assistido.
- Correção de handlers duplicados na coleta assistida e atualização de versão/cache PWA.
- Mantidos armazenamento local da Central do Provedor, importação validada, chamados, comparação antes/depois, exportação JSON, diagnóstico, monitoramento, relatórios e sincronização opcional dos eventos gerais com Supabase.

## Limites conhecidos da versão 3.0
- A Central do Provedor continua local (localStorage) e não é sincronizada com Supabase.
- Não há leitura de RSSI/SNR por APIs do navegador, ping ICMP, traceroute, teste de throughput, SNMP, TR-069/USP, NMS, OSS/BSS ou controle remoto de rádio/roteador.
- A latência obtida por fetch é observação HTTP e não deve ser interpretada como ping ICMP. A taxa de falhas HTTP não equivale a perda real de pacotes.
- A sincronização Supabase abrange os eventos/diagnósticos do módulo principal; não sincroniza telemetria, chamados ou comparações da Central do Provedor.
- A publicação estática e a revisão de código não substituem testes funcionais em dispositivos, navegadores e contas reais.


## Versão 3.1 — monitoramento híbrido automático
- Coleta periódica opcional de cinco tentativas HTTP iniciadas pelo navegador, com registro local automático da duração média observada e da proporção de tentativas que não concluíram.
- A duração HTTP no modo no-cors não comprova resposta HTTP válida, ping ICMP nem latência de rede pura; é uma observação de tempo de conclusão da tentativa no navegador.
- Integração opcional com agente externo via endpoint HTTP/HTTPS configurado pelo operador. O endpoint deve aceitar GET, responder JSON e permitir CORS para a origem hospedada do No Network Cause.
- Campos aceitos pelo agente: sector, timestamp, rssi_dbm, snr_db, latency_ms, packet_loss_pct, throughput_mbps, utilization_pct e users; também aceita objeto interno metrics.
- Campos ausentes não são inferidos. RSSI/SNR, throughput, utilização, usuários e perda real dependem de telemetria confiável fornecida pelo agente/equipamento.
- Configurações do monitoramento ficam no localStorage deste navegador; medições são salvas na Central Técnica local. O monitoramento depende da página aberta e pode ser suspenso pelo sistema operacional.
- Cache PWA atualizado para v310.

### Contrato mínimo do agente
GET /metrics (ou URL configurada) deve retornar JSON, por exemplo:
`{"sector":"Roteador principal","timestamp":"2026-11-16T22:00:00-03:00","rssi_dbm":-67,"snr_db":24,"latency_ms":18,"packet_loss_pct":0,"throughput_mbps":120,"utilization_pct":42,"users":8}`
O exemplo é apenas o formato esperado, não uma medição real. Em produção, prefira agente autenticado em rede confiável, HTTPS quando aplicável, CORS restrito à origem do aplicativo e controles de acesso. Não exponha segredos em JavaScript público.

## Limites da versão 3.1
- O No Network Cause não instala nem cria automaticamente o agente de rede. É necessária uma implementação/integração compatível no roteador, computador de monitoramento ou NMS.
- A consulta do agente é feita pelo navegador e depende de conectividade, CORS, disponibilidade e permissões do endpoint.
- A coleta não funciona continuamente com a página fechada ou suspensa.
- Nenhuma configuração de rádio/roteador é alterada e nenhum dado é enviado ao Supabase por esta função.


## Versão 3.1 — Monitoramento híbrido automático
- Coleta periódica de cinco tentativas HTTP, com gravação automática no armazenamento local.
- Integração opcional de leitura com agente/roteador/NMS por endpoint JSON autorizado com CORS.
- RSSI, SNR, utilização, usuários, throughput e perda real de pacotes são preenchidos somente quando fornecidos pelo agente ou por telemetria importada/manual.
- A taxa de falhas HTTP fica em campo separado e nunca é gravada como perda real de pacotes.
- Metadados Network Information (tipo/perfil, downlink e RTT estimados) são registrados quando disponíveis.
- O monitoramento periódico pausa novas coletas quando a página fica oculta; mantenha a página aberta para continuar.
- Não armazena credenciais, não envia comandos ao equipamento e não altera configurações de rede.
- Cache PWA atualizado para no-network-cause-v311.

## Limites e segurança 3.1
- O monitoramento do navegador depende da página aberta; sistemas móveis podem suspender temporizadores em segundo plano.
- Fetch HTTP não é ICMP ping, teste calibrado de velocidade nem medição real de perda de pacotes.
- Valores de downlink/RTT do navegador são estimativas opcionais.
- Integração com agente requer endpoint compatível, acessível e com CORS habilitado; não enviar tokens secretos em URL pública.
- A Central do Provedor permanece local e não sincroniza seus registros com Supabase. Nenhuma alteração de esquema/política Supabase foi realizada.


## Versão 3.2 Avançada — validação da telemetria
- Cada ciclo executa cinco requisições de observação com timeout individual de 8 segundos e registra tentativas concluídas, duração média, estado online/offline do navegador e resultado de leitura do agente.
- Após salvar, o aplicativo relê o armazenamento local e confirma a presença do identificador do registro antes de apresentar persistência aprovada.
- Painel de validação apresenta último ciclo, persistência, resultado das requisições e estado do agente; autoteste local verifica armazenamento, formato dos registros, Network Information API e sintaxe da URL do agente.
- Respostas fetch opacas não expõem status HTTP: requisição concluída não significa resposta HTTP validada nem disponibilidade integral do serviço.
- O agente tem timeout de 8 segundos e validação básica de objeto JSON; métricas numéricas continuam sujeitas aos limites do validador de telemetria.
- O autoteste local não substitui validação de rede, CORS, agente/roteador real nem testes em dispositivos físicos.
- Cache PWA atualizado para no-network-cause-v320.


## Versão 3.3 — adaptador universal e telemetria óptica
- Incluído perfil inicial ZTE ZXHN F6645P / firmware V2.0.12P1N10, selecionável na Central do Provedor.
- Novo registro local de estado ONU, potência óptica RX/TX (dBm), tensão (mV), corrente de polarização (mA) e temperatura (°C).
- O agente e a ponte Cloudflare aceitam os campos ópticos: optical_rx_dbm, optical_tx_dbm, optical_voltage_mv, optical_bias_ma, optical_temp_c e onu_state; equipment_profile é metadado opcional.
- Importação JSON/CSV reconhece aliases em português e inglês para as métricas ópticas.
- O formulário manual registra valores observados no painel do equipamento; não representa coleta automática do roteador.
- Coleta automática óptica depende de uma API local/agent autorizado que realmente exponha esses campos. Nenhuma rota do firmware ZTE foi presumida ou inventada.
- Não habilitar DDNS, UPnP, DMZ, encaminhamento de portas ou acesso WAN para viabilizar a integração. Preferir agente dentro da LAN e envio de saída autenticado à ponte.
- Central do Provedor continua em localStorage e não sincroniza essas métricas com Supabase.
- Cache PWA atualizado para no-network-cause-v330.


## Versão 4.0
- Layout responsivo reforçado para telas estreitas, com contenção de overflow e tabelas roláveis.
- Alertas com verificação de HTTPS, permissão do navegador e fallback interno visível.
- Análise com mediana, P95, média, máximo, taxa de resposta, tamanho e confiança operacional da amostra.
- Gráfico de latência com observações reais, sem interpolar falhas.
- Recomendações de próximos passos condicionadas às evidências e aos limites do teste HTTP.
- RSSI/SNR continuam dependendo de medições reais manuais, importadas ou fornecidas por agente autorizado.
- Cache PWA atualizado para no-network-cause-v400.

Limites: índice de estabilidade é amostral, alertas dependem do navegador e página ativa; não há medição física de sinal via navegador nem integração automática com equipamentos sem fonte autorizada.


## Revisão de interface 4.0.1
- Navegação móvel em grade de duas ou três colunas, evitando menus parcialmente escondidos.
- Escala tipográfica e espaçamentos ajustados para telas estreitas.
- Campos, botões, cartões, tabelas e mapa com limites de largura e alturas mais equilibradas.
- Todos os rótulos visíveis da telemetria e monitoramento atualizados para 4.0.
- Preferências locais do monitoramento passam a usar namespace v40; os dados históricos permanecem no armazenamento existente.
