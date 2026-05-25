describe('Login', () => {
  beforeEach(() => {
    cy.clearAuth()
    cy.visit('/')
  })

  // ── Estrutura da página ──────────────────────────────────────────────────────

  it('mostra o título e logo Veloom', () => {
    cy.contains('h1', 'Veloom').should('be.visible')
    cy.contains('Acesso à Plataforma').should('be.visible')
  })

  it('mostra os três tabs de login', () => {
    cy.get('[role="tab"]').contains('Utilizador').should('be.visible')
    cy.get('[role="tab"]').contains('Admin').should('be.visible')
    cy.get('[role="tab"]').contains('Parceiro').should('be.visible')
  })

  it('mostra os campos email e palavra-passe sem credenciais demo', () => {
    cy.get('[placeholder="o seu email"]').should('be.visible')
    cy.get('[placeholder="a sua palavra-passe"]').should('be.visible')

    // Garantir que NÃO aparecem emails demo
    cy.get('[placeholder="maria.costa@email.com"]').should('not.exist')
    cy.get('[placeholder="admin@veloom.pt"]').should('not.exist')
    cy.get('[placeholder="partner@forumaveiro.pt"]').should('not.exist')
  })

  it('não mostra caixas de credenciais demo', () => {
    cy.contains('Conta Demo').should('not.exist')
    cy.contains('Contas Demo').should('not.exist')
    cy.contains('maria123').should('not.exist')
    cy.contains('admin123').should('not.exist')
    cy.contains('partner123').should('not.exist')
  })

  // ── Login de Utilizador ──────────────────────────────────────────────────────

  it('faz login como utilizador com credenciais corretas', () => {
    cy.get('[placeholder="o seu email"]').type('maria.costa@email.com')
    cy.get('[placeholder="a sua palavra-passe"]').type('maria123')
    cy.get('button[type="submit"]').click()
    cy.url().should('include', '/home')
    cy.contains('Veloom').should('be.visible')
  })

  it('mostra erro com credenciais de utilizador inválidas', () => {
    cy.get('[placeholder="o seu email"]').type('errado@email.com')
    cy.get('[placeholder="a sua palavra-passe"]').type('passworderrada')
    cy.get('button[type="submit"]').click()
    cy.contains('Credenciais inválidas').should('be.visible')
    cy.url().should('not.include', '/home')
  })

  it('limpa o erro ao alterar o tab', () => {
    cy.get('[placeholder="o seu email"]').type('errado@email.com')
    cy.get('[placeholder="a sua palavra-passe"]').type('errado')
    cy.get('button[type="submit"]').click()
    cy.contains('Credenciais inválidas').should('be.visible')
    cy.get('[role="tab"]').contains('Admin').click()
    cy.contains('Credenciais inválidas').should('not.exist')
  })

  // ── Login de Admin ───────────────────────────────────────────────────────────

  it('faz login como admin com credenciais corretas', () => {
    cy.get('[role="tab"]').contains('Admin').click()
    cy.get('[placeholder="o seu email"]').type('admin@veloom.pt')
    cy.get('[placeholder="a sua palavra-passe"]').type('admin123')
    cy.get('button[type="submit"]').click()
    cy.url().should('include', '/admin/dashboard')
  })

  it('mostra erro com credenciais de admin inválidas', () => {
    cy.get('[role="tab"]').contains('Admin').click()
    cy.get('[placeholder="o seu email"]').type('admin@veloom.pt')
    cy.get('[placeholder="a sua palavra-passe"]').type('passworderrada')
    cy.get('button[type="submit"]').click()
    cy.contains('Credenciais inválidas').should('be.visible')
  })

  // ── Login de Parceiro ────────────────────────────────────────────────────────

  it('faz login como parceiro (Fórum Aveiro)', () => {
    cy.get('[role="tab"]').contains('Parceiro').click()
    cy.get('[placeholder="o seu email"]').type('partner@forumaveiro.pt')
    cy.get('[placeholder="a sua palavra-passe"]').type('partner123')
    cy.get('button[type="submit"]').click()
    cy.url().should('include', '/partner/dashboard')
  })

  it('faz login como parceiro (Glicínias Plaza)', () => {
    cy.get('[role="tab"]').contains('Parceiro').click()
    cy.get('[placeholder="o seu email"]').type('partner@glicinias.pt')
    cy.get('[placeholder="a sua palavra-passe"]').type('partner123')
    cy.get('button[type="submit"]').click()
    cy.url().should('include', '/partner/dashboard')
  })

  it('mostra erro com credenciais de parceiro inválidas', () => {
    cy.get('[role="tab"]').contains('Parceiro').click()
    cy.get('[placeholder="o seu email"]').type('partner@inexistente.pt')
    cy.get('[placeholder="a sua palavra-passe"]').type('passworderrada')
    cy.get('button[type="submit"]').click()
    cy.contains('Credenciais inválidas').should('be.visible')
  })

  // ── Página de portais removida ───────────────────────────────────────────────

  it('não mostra botão Ver todos os portais', () => {
    cy.contains('Ver todos os portais').should('not.exist')
  })

  it('a rota /portals redireciona para o login', () => {
    cy.visit('/portals')
    cy.url().should('eq', Cypress.config().baseUrl + '/')
  })

  // ── Rota catch-all ───────────────────────────────────────────────────────────

  it('rota desconhecida redireciona para o login', () => {
    cy.visit('/rota-que-nao-existe')
    cy.url().should('eq', Cypress.config().baseUrl + '/')
  })
})
