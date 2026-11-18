# QA — Inteligência de Dados 5.1

## Alterações incluídas
- Nova área "Inteligência de Dados" no menu.
- Leitura do histórico de eventos no IndexedDB `internet-livre-db/events`.
- Leitura da telemetria local `noc-operations-v22`.
- Recorrência temporal por hora, recorrência espacial aproximada por coordenadas e agrupamento por setor.
- Triagem de valores atípicos de RSSI, SNR, perda real de pacotes, utilização e latência registrada na telemetria.
- Exportação JSON/CSV e impressão para PDF.
- Campos opcionais de latitude/longitude no cadastro manual e aliases de coordenadas na importação CSV/JSON.
- Cache PWA v408.

## Verificações realizadas
- Sintaxe JavaScript de `app.js`, `operations.js` e `intelligence-data.js` verificada por compilação sintática: OK.
- Integração da página, navegação e inclusão do módulo no service worker verificadas por inspeção dos arquivos: OK.
- Campos opcionais de coordenadas, validação conjunta de latitude/longitude e aliases de importação conferidos por inspeção: OK.

## Testes ainda necessários no navegador publicado
1. Abrir o menu Inteligência de Dados em desktop e Android.
2. Registrar telemetria com e sem coordenadas e confirmar persistência após recarregar.
3. Importar CSV e JSON com coordenadas e testar rejeição quando apenas uma coordenada for informada.
4. Confirmar agrupamento temporal, por setor e por célula geográfica com dados reais de teste.
5. Testar exportações JSON/CSV e impressão em PDF.
6. Confirmar atualização do service worker e cache em PWA já instalada.

## Limites
- Não foram executados testes funcionais em dispositivo/navegador real nem testes de produção após publicação.
- A análise é local e não envia telemetria/coordenadas ao Supabase.
- Célula geográfica com arredondamento de três casas é aproximação e não representa precisão garantida nem localização de antena.
- Limiares de triagem são indicativos; não são limites universais para todas as tecnologias.
- O diagnóstico é preliminar e não substitui inspeção, medições calibradas ou validação profissional.
