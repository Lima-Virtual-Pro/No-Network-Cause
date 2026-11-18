# Integração territorial ILS 6.0

A branch `ils-6.0-territorial-optin` implementa dois consentimentos independentes para o Observatório.

## Compartilhamento regional
- Cidade e UF são informadas manualmente pelo usuário.
- A caixa de consentimento começa desmarcada.
- Somente com consentimento, cidade e UF válidas são incluídas no evento público.
- O payload não inclui nome da operadora.

## Compartilhamento de coordenadas
- Há uma segunda caixa de consentimento, separada e desmarcada por padrão.
- O usuário precisa habilitar a geolocalização e obter uma posição no dispositivo antes de ativar o compartilhamento.
- As coordenadas exatas são enviadas somente para eventos de diagnóstico, monitoramento, início de interrupção e recuperação criados depois do aceite.
- Eventos anteriores ao aceite não são retroativamente georreferenciados durante a sincronização local.
- Coordenadas são armazenadas em `connectivity_observatory_geo_private`, com RLS; somente a conta proprietária pode consultar seus próprios registros. A role `anon` não tem permissão de leitura.
- O Observatório público não consulta a tabela privada diretamente. Ele recebe somente agrupamentos aproximados da função `get_connectivity_observatory_geo_aggregates()`, com arredondamento a duas casas decimais e limiar mínimo de cinco participantes distintos por célula.
- Desativar o consentimento impede novos envios, mas não apaga automaticamente coordenadas já compartilhadas.

## Sincronização
- A integração exige sessão Supabase autenticada.
- Cada evento público é gravado primeiro; a coordenada privada fica vinculada ao UUID desse evento.
- A sincronização usa identificador de origem composto por ID local e timestamp para reduzir colisões entre dispositivos.
- Eventos `location_saved` não são tratados como medições de conectividade para o mapa.

## Testes necessários antes de integrar à branch principal
1. Entrar com uma conta Supabase de teste.
2. Executar diagnóstico sem consentimento geográfico e confirmar que nenhuma coordenada é enviada.
3. Ativar consentimento geográfico e verificar a inserção de coordenada privada para um novo evento.
4. Confirmar que a role anônima não consegue consultar a tabela privada.
5. Confirmar que a função pública só retorna células com cinco ou mais participantes distintos.
6. Desativar o consentimento e verificar que os eventos futuros não enviam coordenadas.
7. Confirmar que registros históricos anteriores ao aceite não são enviados retroativamente.

A integração não realiza geocodificação automática nem infere localização. Os resultados do mapa são agregados e não devem ser interpretados como cobertura nacional comprovada.
