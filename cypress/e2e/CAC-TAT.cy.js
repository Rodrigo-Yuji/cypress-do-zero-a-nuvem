describe('Central de Atendimento ao Cliente TAT', () => {
  beforeEach(() => {
    cy.visit('src/index.html')
  })

  it('verifica o título da aplicação', () => {
    cy.title().should('eq', 'Central de Atendimento ao Cliente TAT')
  })

  
  it('preenche os campos obrigatórios e envia o formulário', () =>{
    cy.clock()
    const longText = Cypress._.repeat('Lorem Ipsum is simply dummy text of the printing and typesetting industry.', 10)

    cy.get('#firstName').type('Rodrigo')
    cy.get('#lastName').type('Tamoto')
    cy.get('#email').type('meuemail@hotmail.com')
    cy.get('#open-text-area').type(longText, {delay: 0})
    cy.get('.button[type="submit"]').click()

    cy.get('.success').should('be.visible')
    cy.tick(3000)
    cy.get('.success').should('not.be.visible')
  })

  it('exibe mensagem de erro ao submeter o formulário com um email com formatação inválida', () => {
    cy.clock()

    cy.get('#firstName').type('Rodrigo')
    cy.get('#lastName').type('Tamoto')
    cy.get('#email').type('meuemail@hotmaiww')
    cy.get('#open-text-area').type('Aqui vai a avaliação', {delay: 0})
    cy.get('.button[type="submit"]').click()

    cy.get('.error').should('be.visible')
    cy.tick(3000)
    cy.get('.error').should('not.be.visible')
  })

  it('valida se telefone aceita só número', () => {
    cy.get('#phone')
      .type('abc')
      .should('have.value', '')
  })

  it('exibe mensagem de erro quando o telefone se torna obrigatório mas não é preenchido antes do envio do formulário', () => {
    cy.clock()

    cy.get('#firstName').type('Rodrigo')
    cy.get('#lastName').type('Tamoto')
    cy.get('#email').type('meuemail@hotmail.com')
    cy.get('#open-text-area').type('Aqui vai a avaliação', {delay: 0})
    cy.get('#phone-checkbox').check()
    cy.get('.button[type="submit"]').click()

    cy.get('.error').should('be.visible')
    cy.tick(3000)
    cy.get('.error').should('not.be.visible')
  })

  Cypress._.times(2, () => {
    it('preenche e limpa os campos nome, sobrenome, email e telefone', () => {
      cy.get('#firstName')
        .type('Rodrigo')
        .should('have.value', 'Rodrigo')
        .clear()
        .should('have.value', '')
      cy.get('#lastName')
        .type('Tamoto')
        .should('have.value', 'Tamoto')
        .clear()
        .should('have.value', '')
      cy.get('#email')
        .type('meuemail@hotmail.com')
        .should('have.value', 'meuemail@hotmail.com')
        .clear()
        .should('have.value', '')
      cy.get('#phone')
        .type('62984158360')
        .should('have.value', '62984158360')
        .clear()
        .should('have.value', '')
    })
  })

  Cypress._.times(3, () => {
    it('exibe mensagem de erro ao submeter o formulário sem preencher os campos obrigatórios', () => {
      cy.clock()

      cy.get('button[type="submit"]').click()

      cy.get('.error').should('be.visible')
      cy.tick(3000)
      cy.get('.error').should('not.be.visible')
    })
  })
  
  it('marca o tipo de atendimento "Feedback"', () => {
    cy.get('input[type="radio"][value="feedback"]')
      .check()
      .should('be.checked')
  })

  it('marca cada tipo de atendimento', () => {
    cy.get('input[type="radio"]')
      .each(typeOfService => {
        cy.wrap(typeOfService)
          .check()
          .should('be.checked')
      })
  })

  it('seleciona um produto (YouTube) por seu texto', () => {
    cy.get('#product').select('YouTube').should('have.value', 'youtube')
  })

  it('seleciona um produto (Mentoria) por seu valor (value)', () => {
    cy.get('#product').select('mentoria').should('have.value', 'mentoria')
  })

  it('seleciona um produto (Blog) por seu índice', () => {
    cy.get('#product').select(1).should('have.value', 'blog')
  })

  it('marca ambos checkboxes, depois desmarca o último', () => {
    cy.get('input[type="checkbox"]')
      .as('checkboxes')
      .check()

    cy.get('@checkboxes')
      .each(checkbox => {
        expect(checkbox[0].checked).to.equal(true)
      })
    
    cy.get('input[type="checkbox"]')
      .last()
      .uncheck()
      .should('not.be.checked')
  })

  it('seleciona um arquivo da pasta fixtures', () => {
    cy.get('#file-upload')
      .selectFile('./cypress/fixtures/example.json')
      .should(input => {
        expect(input[0].files[0].name).to.equal('example.json')
      })
  })

  it('seleciona um arquivo simulando um drag-and-drop', () => {
    cy.get('#file-upload')
      .selectFile('./cypress/fixtures/example.json', {action: 'drag-drop'})
      .should(input => {
        expect(input[0].files[0].name).to.equal('example.json')
      })
  })

  it('seleciona um arquivo utilizando uma fixture para a qual foi dada um alias', () => {
    cy.fixture('example.json').as('file')

    cy.get('#file-upload')
      .selectFile('@file')
      .should(input => {
        expect(input[0].files[0].name).to.equal('example.json')
      })
  })

  it('verifica que a política de privacidade abre em outra aba sem a necessidade de um clique', () => {
    cy.contains('a', 'Política de Privacidade')
      .should('have.attr', 'target', '_blank')
      .and('have.attr', 'href', 'privacy.html')
  })

  it('acessa a página da política de privacidade removendo o target e então clicando no link', () => {
    cy.contains('a', 'Política de Privacidade')
      .invoke('removeAttr', 'target')
      .click()

    cy.contains('h1', 'CAC TAT - Política de Privacidade').should('be.visible')
  })

  it('exibe e oculta as mensagens de sucesso e erro usando .invoke()', () => {
    cy.get('.success')
      .should('not.be.visible')
      .invoke('show')
      .should('be.visible')
      .and('contain', 'Mensagem enviada com sucesso.')
      .invoke('hide')
      .should('not.be.visible')
    cy.get('.error')
      .should('not.be.visible')
      .invoke('show')
      .should('be.visible')
      .and('contain', 'Valide os campos obrigatórios!')
      .invoke('hide')
      .should('not.be.visible')
  })

  it('preenche o campo da área de texto usando o comando invoke', () =>{
    cy.get('#open-text-area')
      .invoke('val', 'um texto qualquer')
      .should('have.value', 'um texto qualquer')
  })

  it('faz uma requisição HTTP', () => {
    cy.request({
      method: 'GET',
      url: 'https://cac-tat-v3.s3.eu-central-1.amazonaws.com/index.html',
    }).should(response => {
        expect(response.status).to.equal(200)
        expect(response.statusText).to.equal('OK')
        expect(response.body).to.include('CAC TAT')
      })
  })

  it('faz uma requisição HTTP com alias', () => {
    cy.request({
      method: 'GET',
      url: 'https://cac-tat-v3.s3.eu-central-1.amazonaws.com/index.html',
    }).as('getRequest')
      .its('status')
      .should('be.equal', 200)

    cy.get('@getRequest')
      .its('statusText')
      .should('be.equal', 'OK')
      
    cy.get('@getRequest')
      .its('body')
      .should('contain', 'CAC TAT')
  })

  it('fazer o gato aparecer', () => {
    cy.get('#cat')
      .invoke('show')
      .should('be.visible')
  })

})