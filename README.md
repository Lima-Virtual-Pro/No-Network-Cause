# No Network Cause 2.3
Copyright © Nailson Lima.

## Melhorias da versão 2.3
- Importação JSON/CSV com validação integral antes de alterar os dados locais.
- Falha em qualquer linha cancela a importação inteira; não deixa registros parciais.
- Normalização de cabeçalhos: espaços, acentos e maiúsculas/minúsculas; aliases em português e inglês.
- Verificação de aspas e cabeçalhos CSV duplicados/vazios.
- Limite de arquivo de 5 MB e de 10.000 registros por importação.
- Proteção para preservar os dados em memória quando o armazenamento local falha ao salvar.
- Cache PWA atualizado para no-network-cause-v230.

## Recursos mantidos
- Diagnóstico e monitoramento HTTP, histórico local, localização opcional, análise avançada e exportações.
- Motor de recomendações para nove classes de sintomas, com hipóteses, evidências e cautelas.
- Central local do provedor: telemetria manual/importada, resumo de setores, chamados e comparação antes/depois.

## Limitações reais
- A central do provedor armazena dados no navegador atual (localStorage); não sincroniza esses dados com Supabase nem com outros dispositivos.
- A importação é por arquivo exportado; não é integração automática com NMS/controladores.
- CSV deve usar separador vírgula e cabeçalho na primeira linha. Arquivos separados por ponto e vírgula não são suportados nesta versão.
- O limite de 85% é indicativo, não confirma congestionamento.
- Comparação antes/depois é descritiva e não prova causalidade.
- O navegador não fornece acesso universal a RSSI, BSSID, gateway, ICMP ou configuração de rádio.
- SNMP, TR-069/USP, APIs de fabricantes, OSS/BSS e NMS não foram implementados.
- Não há multiempresa, RBAC ou auditoria centralizada.
- Nenhuma configuração de antena, rádio ou roteador é alterada.

## Publicação
Hospedar em HTTPS. O cache PWA foi atualizado para v230; após publicar, recarregue/atualize a instalação da PWA.

## QA
Consultar QA-RELATORIO.md. As verificações estáticas não substituem testes funcionais em navegadores e com arquivos reais.

Contato: onsite.limavirtual@gmail.com.
