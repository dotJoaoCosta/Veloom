describe('Navegação', () => {
  beforeEach(() => {
    cy.clearAuth()
    cy.loginAsUser()
  })

  // ── Ecrã principal (MapView) ─────────────────────────────────────────────────

  it('mostra o mapa e a barra de navegação após login', () => {
    cy.url().should('include', '/home')
    cy.contains('Veloom').should('be.visible')
  })

  it('mostra bikes disponíveis no painel inferior', () => {
    cy.contains('VLM').should('be.visible')
  })

  // ── Navegação para páginas secundárias ──────────────────────────────────────

  it('navega para o Histórico de Viagens', () => {
    // Botão com ícone History na barra de topo
    cy.get('[href="/history"], button').filter(':has(svg)').eq(0).click({ force: true })
    // Alternativa por texto se o botão não tiver href
    cy.visit('/history')
    cy.contains('Histórico').should('be.visible')
  })

  it('navega para a página de Subscrição', () => {
    cy.visit('/subscription')
    cy.contains('Subscrição').should('be.visible')
  })

  it('navega para o Perfil', () => {
    cy.visit('/profile')
    cy.contains('Maria Costa').should('be.visible')
  })

  it('navega para Reservas', () => {
    cy.visit('/reservations')
    cy.contains('Reservar E-bike').should('be.visible')
  })

  // ── Botão Voltar ─────────────────────────────────────────────────────────────

  it('botão voltar no Perfil regressa ao mapa', () => {
    cy.visit('/profile')
    cy.get('button').first().click()
    cy.url().should('include', '/home')
  })

  it('botão voltar na Subscrição regressa ao mapa', () => {
    cy.visit('/subscription')
    cy.get('button').first().click()
    cy.url().should('include', '/home')
  })

  it('botão voltar nas Reservas regressa ao mapa', () => {
    cy.visit('/reservations')
    cy.contains('button', 'Voltar').click()
    cy.url().should('include', '/home')
  })

  it('botão voltar no Histórico regressa ao mapa', () => {
    cy.visit('/history')
    cy.get('button').first().click()
    cy.url().should('include', '/home')
  })

  // ── Admin ────────────────────────────────────────────────────────────────────

  it('admin acede ao dashboard após login', () => {
    cy.clearAuth()
    cy.loginAsAdmin()
    cy.url().should('include', '/admin/dashboard')
    cy.contains('Dashboard').should('be.visible')
  })

  // ── Parceiro ─────────────────────────────────────────────────────────────────

  it('parceiro acede ao dashboard após login', () => {
    cy.clearAuth()
    cy.loginAsPartner()
    cy.url().should('include', '/partner/dashboard')
  })
})
