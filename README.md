# No Network Cause 2.6
Copyright © Nailson Lima.

## Melhorias da versão 2.5\n- Registro automático de transições online/offline informadas pelo navegador, separado das falhas de serviços externos.\n- Indicador amostral de confiabilidade por destino de teste, com quantidade de respostas, taxa de sucesso e horário da última tentativa.\n- Histórico diferencia eventos do estado do dispositivo e resultados de testes HTTP.
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
\n\n## Versão 2.6.1 — dashboard de sinal\n- Gráfico histórico SVG de RSSI (dBm), com filtro por antena/setor e últimas 30 leituras.\n- Campo opcional RSSI e SNR no registro manual de telemetria.\n- Importação CSV/JSON aceita aliases de RSSI e SNR.\n- Sem leitura automática de sinal pelo navegador; dados dependem de registro manual ou telemetria importada.\n