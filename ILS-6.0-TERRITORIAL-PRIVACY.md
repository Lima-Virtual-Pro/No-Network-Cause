# Integração territorial ILS 6.0

A branch `ils-6.0-territorial-optin` acrescenta uma opção explícita de compartilhamento regional para o Observatório.

- Cidade e UF são informadas manualmente pelo usuário.
- A caixa de consentimento começa desmarcada.
- Somente com consentimento, cidade e UF válidas são incluídas no payload enviado a `connectivity_observatory_events`.
- O payload da integração não inclui latitude, longitude nem nome da operadora.
- O evento continua exigindo sessão Supabase autenticada e a política de inserção vinculada a `auth.uid()`.
- O usuário pode desmarcar a opção para interromper o compartilhamento nos próximos eventos. Eventos anteriores já enviados permanecem no Observatório; a desativação não apaga dados históricos.

## Testes necessários antes de integrar à branch principal
1. Entrar com uma conta Supabase de teste.
2. Salvar cidade/UF com consentimento desmarcado e verificar que o payload não contém os campos.
3. Marcar consentimento, salvar cidade e UF válidas e confirmar a inserção.
4. Conferir no Observatório que cidade e UF aparecem, sem coordenadas.
5. Desmarcar consentimento e verificar que os próximos eventos deixam de enviar cidade/UF.
6. Confirmar que o histórico local continua funcionando sem autenticação.

A integração não realiza geocodificação automática nem infere a localização do usuário.
