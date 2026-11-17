# No Network Cause 2.6
Copyright © Nailson Lima.

## Melhorias da versão 2.5
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
