# QA — No Network Cause 2.1
Data: 16/11/2026

## Alterações implementadas no repositório
- Motor de recomendações por nove sintomas: cobertura Wi-Fi, congestionamento, latência, perda de pacotes, interrupções, baixa velocidade, backhaul, interferência e capacidade de antena/setor.
- Perfis de contexto: usuário residencial, empresa/rede corporativa e operadora/provedor.
- Coleta manual opcional de dados de ativo/setor, tecnologia, usuários simultâneos, utilização de pico, RSSI e observação de backhaul.
- Cada plano contém hipótese não confirmada, prioridade, nível indicativo de confiança, verificações necessárias, intervenções e cautelas.
- Exportação do plano técnico em JSON e impressão.
- Atualização de navegação, título, documentação e cache do Service Worker para 2.1.
- Corrigido o handler de transição de interrupção/recuperação para função assíncrona, compatível com o uso de await.

## Limites e salvaguardas
- O módulo de recomendações é local e baseado em regras; não é IA treinada, nem diagnóstico de causa-raiz confirmado.
- Dados de antena/setor são inseridos manualmente. O sistema não associa automaticamente o dispositivo a uma antena.
- Não há integração ativa com SNMP, TR-069/USP, controladores Wi-Fi, rádios, OSS/BSS ou NMS nesta entrega.
- Nenhuma alteração de potência, canal, largura, inclinação, roteamento ou configuração é enviada aos equipamentos.
- Recomendações de capacidade e RF exigem telemetria, estudo de cobertura/interferência, compatibilidade do fabricante e validação por profissional habilitado.
- Custos e ROI não são estimados porque ainda não há inventário, preços ou medições suficientes.

## Verificações realizadas nesta etapa
- Conferência estática da presença da nova seção, controles, carregamento do novo script e inclusão no cache do Service Worker.
- Conferência estática de que o tratamento de transição de incidentes foi alterado para async.
- A revisão estática não equivale a execução de testes funcionais.

## Testes pendentes
- Executar `node --check app.js` e `node --check recommendations.js`.
- Testar os nove cenários em Chrome Android e desktop.
- Validar impressão, exportação JSON, navegação e atualização do Service Worker em HTTPS.
- Realizar testes de regressão do diagnóstico, monitoramento, notificações, histórico, login Google/e-mail e sincronização Supabase.
- Validar a experiência em telas pequenas e com leitor de tela.
- Homologar recomendações com profissional de redes/rádio e dados reais de infraestrutura antes de uso operacional.

## Resultado
**Versão 2.1 implementada no branch main.** A integração com equipamentos de provedores e a homologação funcional em navegadores permanecem pendentes. Não classificar como homologada para operação de rede até concluir os testes e validações acima.
