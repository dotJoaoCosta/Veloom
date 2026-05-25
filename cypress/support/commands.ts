// Comandos personalizados Veloom

// Login via UI (fluxo completo)
Cypress.Commands.add('loginAsUser', () => {
  cy.visit('/')
  cy.get('[placeholder="o seu email"]').first().type('maria.costa@email.com')
  cy.get('[placeholder="a sua palavra-passe"]').first().type('maria123')
  cy.get('button[type="submit"]').click()
  cy.url().should('include', '/home')
})

// Login via localStorage (rápido, para testes que não testam o login)
Cypress.Commands.add('loginAsUserFast', () => {
  cy.window().then((win) => {
    win.localStorage.setItem('userAuth', 'true')
  })
  cy.visit('/home')
})

Cypress.Commands.add('loginAsAdmin', () => {
  cy.visit('/')
  cy.get('[role="tab"]').contains('Admin').click()
  cy.get('[placeholder="o seu email"]').type('admin@veloom.pt')
  cy.get('[placeholder="a sua palavra-passe"]').type('admin123')
  cy.get('button[type="submit"]').click()
  cy.url().should('include', '/admin/dashboard')
})

Cypress.Commands.add('loginAsPartner', () => {
  cy.visit('/')
  cy.get('[role="tab"]').contains('Parceiro').click()
  cy.get('[placeholder="o seu email"]').type('partner@forumaveiro.pt')
  cy.get('[placeholder="a sua palavra-passe"]').type('partner123')
  cy.get('button[type="submit"]').click()
  cy.url().should('include', '/partner/dashboard')
})

Cypress.Commands.add('clearAuth', () => {
  cy.clearCookies()
    cy.clearLocalStorage()
})

declare global {
  namespace Cypress {
    interface Chainable {
      loginAsUser(): Chainable<void>
      loginAsUserFast(): Chainable<void>
      loginAsAdmin(): Chainable<void>
      loginAsPartner(): Chainable<void>
      clearAuth(): Chainable<void>
    }
  }
}
