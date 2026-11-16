# Registro de validação — No Network Cause 0.2

Data: 16/11/2026

## Verificações executadas nesta montagem
- `node --check app.js`: aprovado, sem erros de sintaxe.
- Conferência estática de referências: todos os IDs referenciados diretamente no JavaScript existem no HTML.
- Arquivos HTML legais presentes e ligados no rodapé.
- Integridade do ZIP verificada com teste CRC (`unzip -t`).
- Conteúdo do ZIP comparado com a pasta de distribuição.

## Verificações não executadas
- Fluxos completos em navegador real, login Supabase com conta de usuário, sincronização REST, GPS, conectividade com perda real de rede e testes em Android/Windows.
- O ambiente não executou teste físico em dispositivos do usuário.

## Pendência crítica de sincronização
- Aplicar `supabase-sync-fix.sql` no SQL Editor do projeto antes de usar o upsert REST; o arquivo corrige a inferência do índice `on_conflict`.
- Revisar Auth, confirmação de e-mail e proteção contra senhas vazadas no painel Supabase.
- Termos e política são modelos iniciais e exigem dados do controlador e revisão jurídica.
