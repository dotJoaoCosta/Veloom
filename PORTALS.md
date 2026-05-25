# Veloom Platform - Portais de Acesso

## Login Unificado
**URL:** `/login`  
Sistema de login unificado para todos os portais (Utilizador, Admin, Parceiros).

## Seletor de Portais
**URL:** `/portals`  
Página de seleção rápida de portais com credenciais de demonstração.

## Portais Disponíveis

### 1. App de Utilizador
**URL:** `/home`  
**Login:** `/login` (Tab: Utilizador)  
**Credenciais:**
- Nome: Maria Costa
- Email: `maria.costa@email.com`
- Password: `maria123`

**Descrição:** Aplicação móvel para utilizadores finais  
**Funcionalidades:**
- Mapa interativo com bikes disponíveis
- Desbloqueio de bikes via QR Code/Bluetooth
- Tracking de viagens ativas
- Histórico de viagens
- Gestão de perfil e subscrições

---

### 2. Painel de Administração
**URL:** `/admin`  
**Credenciais:**
- Email: `admin@veloom.pt`
- Password: `admin123`

**Funcionalidades:**
- Volume total de transações (filtros: diário/semanal/mensal)
- Valor médio de viagem (AOV)
- Número de utilizadores e bikes ativas
- Receita por tipo de subscrição
- Desempenho por zona geográfica
- Métricas executivas (MRR, CAC, LTV, Retenção)

**KPIs Disponíveis:**
- Total de Viagens
- Receita Total
- Utilizadores Ativos
- E-bikes Ativas
- Gráficos de evolução temporal
- Comparações período a período

---

### 3. Portal de Parceiros
**URL:** `/partner`  

**Credenciais Demo:**

#### Fórum Aveiro
- Email: `partner@forumaveiro.pt`
- Password: `partner123`
- Tipo: Estação Principal
- Localização: Centro de Aveiro

#### Glicínias Plaza
- Email: `partner@glicinias.pt`
- Password: `partner123`
- Tipo: Estação Principal
- Localização: Universidade de Aveiro

#### Tech Solutions Lda (Familiar)
- Email: `partner@techsolutions.pt`
- Password: `partner123`
- Tipo: Subscrição Familiar
- Localização: Ria de Aveiro

**Funcionalidades:**
- **Visualizações (Impressions):** Número de utilizadores que visualizam a localização
- **Receita Gerada:** Total gerado e comissões pagas à plataforma (15%)
- **Classificação Média:** Rating médio e distribuição de avaliações
- **Análise de Performance:** Zonas e horários com melhor/pior desempenho
- **Comparação Anónima:** Benchmark face à média da rede Veloom
- **Exportação:** Botões para download em Excel e PDF (em desenvolvimento)

**Métricas Disponíveis:**
- Taxa de conversão (visualizações → utilizações)
- Receita por utilização
- Distribuição horária
- Performance por zona interna
- Pontos fortes, oportunidades e recomendações

---

## Change Requests Implementados

### CR #1 - Painel de Indicadores de Desempenho da Plataforma
Dashboard administrativo para apresentação a investidores com KPIs em tempo real.

### CR #2 - Painel de Indicadores para Parceiros
Área reservada para parceiros comerciais consultarem o retorno da presença na plataforma, com dados exportáveis.

---

## Notas Técnicas
- Todos os dados são mock/simulados para demonstração
- Autenticação é básica (localStorage) - apenas para demo
- Exportação PDF/Excel mostra alert (funcionalidade a implementar)
- Gráficos implementados com Recharts
- Mapas implementados com Pigeon Maps (substituiu Leaflet por compatibilidade)
