# Ponte de telemetria Cloudflare — No Network Cause 3.3

## Arquitetura
Equipamento/roteador/NMS → agente local Python → Cloudflare Worker /ingest → Cloudflare KV → aplicativo /metrics.

IMPORTANTE: o Worker na nuvem não consegue acessar diretamente IPs privados como 192.168.x.x ou 10.x.x.x. O agente deve executar dentro da rede monitorada e enviar as leituras por conexão de saída.

## 1. Criar KV
Cloudflare → Workers & Pages → KV → Create namespace. Nome sugerido NOC_TELEMETRY.
No Worker, Settings → Bindings → Add binding → KV namespace:
- Variable name: TELEMETRY_KV
- Namespace: NOC_TELEMETRY

## 2. Criar Worker
Cloudflare → Workers & Pages → Create Worker. Nome sugerido no-network-cause-bridge.
Substitua o código pelo arquivo cloudflare-worker/worker.js e faça Deploy.
Em Settings → Variables and Secrets, crie o secret INGEST_TOKEN com uma senha aleatória forte.
Opcionalmente defina ALLOWED_ORIGIN como https://lima-virtual-pro.github.io.
Confirme o binding KV com o nome exato TELEMETRY_KV.

## 3. Instalar/configurar o agente local
O arquivo agent/noc_agent.py usa somente Python 3 e precisa de uma API JSON do roteador/NMS. Configure:
- SOURCE_URL: URL real de leitura do equipamento/NMS.
- BRIDGE_URL: URL publicada do Worker, sem barra final.
- INGEST_TOKEN: mesmo secret do Worker.
- SOURCE_BEARER_TOKEN: opcional, se a API de origem exigir Bearer.
- POLL_SECONDS: intervalo, padrão 30 e mínimo 15.
- SECTOR: nome do setor.

Exemplo Linux/macOS:
export SOURCE_URL="http://192.168.1.1/api/metrics"
export BRIDGE_URL="https://no-network-cause-bridge.SUA-CONTA.workers.dev"
export INGEST_TOKEN="SECRET_DO_WORKER"
export SECTOR="Roteador principal"
python3 agent/noc_agent.py

A URL /api/metrics é apenas ilustrativa. Use a rota documentada pelo fabricante ou NMS. Não adivinhe endpoints nem exponha painel administrativo do roteador à internet.

## 4. Conectar o aplicativo
Central do Provedor → Monitoramento híbrido:
Endpoint do agente: https://SEU-WORKER.workers.dev/metrics
Inicie a coleta automática.
GET /metrics é somente leitura e não exige token no navegador; CORS permite a origem publicada do aplicativo. POST /ingest exige o secret. Nunca coloque INGEST_TOKEN no HTML, JavaScript, URL pública ou GitHub.

## Métricas aceitas
sector, timestamp, rssi_dbm, snr_db, latency_ms, packet_loss_pct, throughput_mbps, utilization_pct, users.
Somente valores efetivamente retornados pela API de origem são encaminhados. Campos ausentes não são inventados.

## Segurança e limitações
- Os arquivos no GitHub não implantam o Worker na conta Cloudflare; a criação do KV, secret e deploy precisam ser feitos no painel Cloudflare.
- O agente precisa ficar em execução dentro da rede e ter acesso autorizado à API do equipamento.
- O Worker não acessa diretamente IPs privados da rede.
- Proteja o secret e restrinja a API do roteador. Use HTTPS quando disponível.
- A rota de leitura expõe a última telemetria por setor; use somente em redes/dados que possam ser expostos à origem autorizada.
- Sem API de métricas disponível no roteador/NMS, RSSI/SNR e indicadores de rádio não podem ser coletados automaticamente.


## Campos ópticos — versão 3.3
O Worker aceita opcionalmente, quando fornecidos por uma fonte local autorizada:
- optical_rx_dbm: potência óptica recebida em dBm (-50 a 20).
- optical_tx_dbm: potência óptica transmitida em dBm (-50 a 20).
- optical_voltage_mv: tensão do módulo em mV (0 a 10000).
- optical_bias_ma: corrente de polarização em mA (0 a 200).
- optical_temp_c: temperatura do módulo em °C (-40 a 150).
- onu_state: estado ONU em texto (até 40 caracteres).
- equipment_profile: identificador do perfil (até 80 caracteres).

O agente Python encaminha os campos recebidos da SOURCE_URL sem inventar valores. Para o ZTE ZXHN F6645P, ainda é necessário identificar uma API/rota de leitura autorizada do firmware. As telas administrativas observadas não comprovam a existência de uma API, SNMP ou TR-069 acessível. Não use scraping autenticado improvisado, não desative proteções e não exponha a interface de administração à WAN.
