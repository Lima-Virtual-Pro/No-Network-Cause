# QA — No Network Cause 2.3
Data: 16/11/2026

## Escopo da versão
- Robustez da importação JSON/CSV: validação completa antes da gravação.
- Cancelamento integral em caso de linha inválida.
- Normalização de cabeçalhos, suporte a aliases PT/EN, BOM UTF-8 e aspas CSV.
- Limites de 5 MB e 10.000 registros.
- Proteção contra perda de dados em falha de persistência local.
- Cache PWA atualizado para v230; documentação e identificação visual 2.3.

## Limitações conhecidas
- Telemetria e chamados da central continuam locais no navegador.
- Não há sincronização da central com Supabase nem compartilhamento entre usuários/dispositivos.
- Não há integração direta com SNMP, TR-069/USP, NMS, OSS/BSS ou controladores.
- CSV usa separador vírgula; delimitador ponto e vírgula não é suportado.
- O limiar de 85% é indicativo; comparação antes/depois não prova causalidade.
- Não são aplicadas configurações de rádio, antena ou roteador.

## Verificações realizadas nesta entrega
- Revisão estática das alterações e confirmação dos pontos de integração por leitura dos arquivos do repositório.
- Não foi executado navegador real, node --check, teste em Android/Windows, teste de PWA instalada ou ensaio com exportações reais de fabricantes.

## Testes funcionais pendentes
- Importar JSON e CSV válidos com cabeçalhos em português e inglês.
- Confirmar cancelamento integral com registro inválido no início, meio e fim.
- Testar BOM UTF-8, aspas CSV e cabeçalhos duplicados/vazios.
- Simular quota cheia/erro de localStorage e confirmar preservação dos dados anteriores.
- Testar cadastro/status de chamados, comparações, exportação e limpeza.
- Testar Chrome, Android, Windows e PWA instalada.

## Resultado
Versão 2.3 registrada no repositório. A alteração fortalece a operação local existente, sem alegar integração ou capacidade não implementada. A homologação funcional permanece pendente; não usar como NOC de produção crítica sem validação adicional.
