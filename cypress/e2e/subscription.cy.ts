describe('Subscrição', () => {
  beforeEach(() => {
    cy.clearAuth()
    cy.loginAsUserFast()
    cy.visit('/subscription')
  })

  // ── Estrutura da página ──────────────────────────────────────────────────────

  it('mostra o título Subscrição', () => {
    cy.contains('h1', 'Subscrição').should('be.visible')
  })

  it('mostra o plano atual ativo (Individual)', () => {
    cy.contains('Subscrição Individual').should('be.visible')
    cy.contains('Ativa').should('be.visible')
  })

  it('mostra o preço mensal do plano atual', () => {
    cy.contains('€39.00').should('be.visible')
    cy.contains('/mês').should('be.visible')
  })

  it('mostra a data de próxima renovação', () => {
    cy.contains('Próxima renovação').should('be.visible')
  })

  it('mostra o método de pagamento', () => {
    cy.contains('Visa').should('be.visible')
  })

  // ── Planos disponíveis ───────────────────────────────────────────────────────

  it('mostra os três tipos de subscrição', () => {
    cy.contains('Individual').should('be.visible')
    cy.contains('Estudante').should('be.visible')
    cy.contains('Familiar').should('be.visible')
  })

  it('mostra desconto no plano Estudante', () => {
    cy.contains('20% OFF').should('be.visible')
    cy.contains('€31.20').should('be.visible')
  })

  it('marca o plano Individual como atual', () => {
    cy.contains('Subscrição Atual').should('be.visible')
  })

  it('não mostra botão Alterar no plano ativo', () => {
    // O plano Individual está ativo — não deve ter botão "Alterar para Individual"
    cy.contains('button', 'Alterar para Individual').should('not.exist')
  })

  // ── Mudar de plano ───────────────────────────────────────────────────────────

  it('botão Alterar para Estudante existe e é clicável', () => {
    cy.contains('button', 'Alterar para Estudante').should('be.visible').click()
    // Após clicar, o plano Estudante deve ficar ativo
    cy.contains('Subscrição Estudante').should('be.visible')
    cy.contains('button', 'Alterar para Estudante').should('not.exist')
  })

  it('botão Alterar para Familiar existe e é clicável', () => {
    cy.contains('button', 'Alterar para Familiar').should('be.visible').click()
    cy.contains('Subscrição Familiar').should('be.visible')
  })

  it('após mudar para Estudante, aparece botão para voltar ao Individual', () => {
    cy.contains('button', 'Alterar para Estudante').click()
    cy.contains('button', 'Alterar para Individual').should('be.visible')
  })

  // ── Benefícios ───────────────────────────────────────────────────────────────

  it('mostra secção de benefícios', () => {
    cy.contains('Benefícios da Subscrição').should('be.visible')
    cy.contains('Sem custos escondidos').should('be.visible')
    cy.contains('Manutenção incluída').should('be.visible')
    cy.contains('Seguro incluído').should('be.visible')
  })

  // ── Ações ────────────────────────────────────────────────────────────────────

  it('mostra botão Histórico de Pagamentos', () => {
    cy.contains('button', 'Histórico de Pagamentos').should('be.visible')
  })

  it('mostra botão Cancelar Subscrição', () => {
    cy.contains('button', 'Cancelar Subscrição').should('be.visible')
  })

  // ── Botão Voltar ─────────────────────────────────────────────────────────────

  it('botão voltar regressa ao mapa', () => {
    cy.get('button').first().click()
    cy.url().should('include', '/home')
  })
})
