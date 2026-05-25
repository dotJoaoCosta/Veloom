describe('Reservas', () => {
  beforeEach(() => {
    cy.clearAuth()
    cy.loginAsUserFast()
    cy.visit('/reservations')
  })

  // ── Estrutura da página ──────────────────────────────────────────────────────

  it('mostra o título Reservar E-bike', () => {
    cy.contains('Reservar E-bike').should('be.visible')
  })

  it('mostra a lista de bikes disponíveis', () => {
    cy.contains('VLM001').should('be.visible')
    cy.contains('VLM002').should('be.visible')
    cy.contains('VLM003').should('be.visible')
  })

  it('mostra o campo de duração', () => {
    cy.contains('Duração da Reserva').should('be.visible')
    cy.get('input[type="time"]').should('be.visible')
  })

  it('mostra o aviso de que não é possível cancelar após confirmar', () => {
    cy.contains('Após confirmar, não é possível cancelar a reserva').should('be.visible')
  })

  it('o botão confirmar está desativado sem bike selecionada', () => {
    cy.contains('button', 'Confirmar Reserva').should('be.disabled')
  })

  // ── Selecionar bike ──────────────────────────────────────────────────────────

  it('seleciona uma bike e ativa o botão confirmar', () => {
    cy.contains('VLM001').click()
    cy.contains('button', 'Confirmar Reserva').should('not.be.disabled')
  })

  it('mostra o resumo da reserva ao selecionar bike e duração', () => {
    cy.contains('VLM001').click()
    cy.get('input[type="time"]').clear().type('01:30')
    cy.contains('Resumo da Reserva').should('be.visible')
    cy.contains('VLM001').should('be.visible')
    cy.contains('1h 30min').should('be.visible')
  })

  it('mostra erro se duração for 00:00', () => {
    cy.contains('VLM001').click()
    cy.get('input[type="time"]').clear().type('00:00')
    cy.contains('A duração deve ser maior que 0 minutos').should('be.visible')
    cy.contains('button', 'Confirmar Reserva').should('be.disabled')
  })

  // ── Confirmar reserva ────────────────────────────────────────────────────────

  it('confirma reserva e redireciona para o mapa', () => {
    cy.contains('VLM001').click()
    cy.get('input[type="time"]').clear().type('01:00')
    cy.contains('button', 'Confirmar Reserva').click()
    cy.url().should('include', '/home')
  })

  it('guarda a reserva no localStorage após confirmar', () => {
    cy.contains('VLM001').click()
    cy.get('input[type="time"]').clear().type('01:00')
    cy.contains('button', 'Confirmar Reserva').click()
    cy.window().then((win) => {
      expect(win.localStorage.getItem('scheduledBike')).to.eq('VLM001')
      expect(win.localStorage.getItem('scheduledStartTime')).to.not.be.null
      expect(win.localStorage.getItem('scheduledEndTime')).to.not.be.null
    })
  })

  // ── Cancelar reserva ativa ───────────────────────────────────────────────────

  it('mostra banner de reserva ativa quando existe uma reserva', () => {
    cy.window().then((win) => {
      win.localStorage.setItem('scheduledBike', 'VLM003')
      win.localStorage.setItem('scheduledStartTime', '10:00')
      win.localStorage.setItem('scheduledEndTime', '11:00')
    })
    cy.reload()
    cy.contains('Reserva Ativa').should('be.visible')
    cy.contains('VLM003').should('be.visible')
    cy.contains('das 10:00 às 11:00').should('be.visible')
  })

  it('cancela a reserva ativa ao clicar em Cancelar', () => {
    cy.window().then((win) => {
      win.localStorage.setItem('scheduledBike', 'VLM003')
      win.localStorage.setItem('scheduledStartTime', '10:00')
      win.localStorage.setItem('scheduledEndTime', '11:00')
    })
    cy.reload()
    cy.contains('Reserva Ativa').should('be.visible')
    cy.contains('button', 'Cancelar').click()
    cy.contains('Reserva Ativa').should('not.exist')
    cy.window().then((win) => {
      expect(win.localStorage.getItem('scheduledBike')).to.be.null
    })
  })

  // ── Botão Voltar ─────────────────────────────────────────────────────────────

  it('botão Voltar regressa ao mapa sem fazer reserva', () => {
    cy.contains('button', 'Voltar').click()
    cy.url().should('include', '/home')
    cy.window().then((win) => {
      expect(win.localStorage.getItem('scheduledBike')).to.be.null
    })
  })
})
