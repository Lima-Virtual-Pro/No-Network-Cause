# No Network Cause 2.2
Copyright © Nailson Lima.

## Novidades da versão 2.2
- Central técnica local para provedores.
- Registro de telemetria por antena/setor: utilização, usuários simultâneos, throughput, latência e perda.
- Importação de telemetria JSON/CSV com validação.
- Resumo de setores e alerta indicativo de utilização elevada (limiar inicial 85%).
- Gestão local de chamados técnicos com prioridade, responsável e status.
- Comparação de métricas antes/depois de intervenção.
- Exportação JSON da central e limpeza dos dados locais.
- Cache PWA atualizado para no-network-cause-v220.

## Recursos anteriores
- Diagnóstico e monitoramento HTTP, histórico local, localização opcional, análise avançada e exportações.
- Motor de recomendações para nove classes de sintomas, com hipóteses, evidências e cautelas.

## Limitações e segurança
- A Central do Provedor armazena os dados no navegador atual; não sincroniza com Supabase.
- Importação não é integração automática: exige exportar dados do NMS/controlador e importar arquivo.
- SNMP, TR-069/USP, APIs de fabricantes, OSS/BSS e NMS exigem backend seguro, credenciais autorizadas e mapeamento por fabricante.
- O limiar de 85% é indicativo e deve ser ajustado conforme tecnologia e dimensionamento.
- Comparação antes/depois é descritiva e não prova causalidade sem metodologia de medição.
- Nenhuma configuração de antena, rádio ou roteador é alterada.
- Sem multiempresa, RBAC ou auditoria centralizada nesta versão.

## Publicação
Hospedar em HTTPS. Após publicar, atualizar a PWA para carregar o cache v220.

## QA
Consultar QA-RELATORIO.md. Revisão estática não substitui homologação em navegadores e com dados reais.

Contato: onsite.limavirtual@gmail.com.
