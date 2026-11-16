# QA — No Network Cause 2.2
Data: 16/11/2026

## Escopo implementado
- Central técnica local para provedores.
- Cadastro manual e importação JSON/CSV de telemetria por setor.
- Métricas: utilização, usuários, throughput, latência e perda.
- Resumo de setores e sinalização indicativa de utilização >= 85%.
- Chamados técnicos locais com prioridade, responsável, descrição e status.
- Comparação antes/depois e exportação JSON.
- Atualização de navegação, manifesto, documentação e cache PWA.

## Limitações
- Dados da central ficam no localStorage do navegador e não sincronizam com Supabase.
- Sem integração direta com SNMP, TR-069/USP, NMS, OSS/BSS ou controladores.
- Importação requer arquivo exportado e mapeamento compatível.
- O limiar de 85% não confirma congestionamento.
- Comparação é descritiva e não demonstra causalidade.
- Sem autenticação multiempresa, RBAC, trilha de auditoria ou sincronização multiusuário.
- Nenhuma configuração de rádio ou antena é aplicada.

## Testes funcionais pendentes
- Executar node --check app.js, node --check recommendations.js e node --check operations.js.
- Testar importação JSON/CSV válidos e inválidos.
- Testar cadastro e atualização de chamados.
- Conferir cálculos antes/depois com valores conhecidos e campos vazios.
- Testar persistência, exportação e exclusão local.
- Testar Android, Windows, Chrome e PWA instalada.
- Homologar formatos de exportação de NMS/controladores reais.

## Resultado
Versão 2.2 registrada no repositório. A central é local; integração automática, backend multiempresa e homologação funcional continuam pendentes. Não usar em operação crítica sem validação e controles de segurança.
