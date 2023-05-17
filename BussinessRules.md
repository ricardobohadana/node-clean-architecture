## Definição do problema a ser resolvido

1. Precisamos de uma solução que nos permita rastrear cada produto individualmente, definir quantidades mínimas de estoque e receber alertas quando estivermos ficando sem um determinado produto. Também seria útil se pudéssemos visualizar o histórico de vendas e estoque para ajudar a tomarmos decisões futuras de compra.

2. Gostaríamos de poder atribuir um número de identificação único a cada produto, para podermos rastrear facilmente suas movimentações em nosso estoque. Também seria útil se pudéssemos adicionar informações extras, como tamanho e cor, para tornar o rastreamento ainda mais preciso.

3. Gostaríamos de poder definir um limite mínimo para cada produto, de forma que pudéssemos receber um alerta quando o estoque estiver chegando próximo ao fim. Isso nos ajudaria a garantir que nunca fiquemos sem um produto popular e também nos permitiria fazer pedidos mais eficientes.

4. Seria ótimo se pudéssemos receber alertas por meio de uma notificação em nosso sistema de gerenciamento de estoque.

## Tradução do problema

<details>
    <summary>Quais as entidades do domínio?</summary>
    <ul>
      <li>Produto</li>
      <li>Compra/Venda</li>
      <li>Notificação</li>
    </ul>
</details>

## Requisitos funcionais

- `[ ]` Deve ser possível cadastrar um produto
- `[ ]` Deve ser possível obter os produtos cadastrados
- `[ ]` Deve ser possível registrar uma compra
- `[ ]` Deve ser possível registrar uma venda
- `[ ]` Deve ser possível definir (ou alterar) um limite mínimo de estoque para alerta
- `[ ]` Deve ser possível visualizar o histórico de compra e venda de um produto
- `[ ]` Deve ser possível visualizar as notificações do sistema
- `[ ]` Deve ser possível visualizar produtos notificados

## Regras de negócio

- `[ ]` Não deve ser possível cadastrar dois produtos iguais
- `[ ]` Não deve ser possível comprar um produto inexistente
- `[ ]` Não deve ser possível comprar 0 unidades de um produto
- `[ ]` Não deve ser possível vender 0 unidades de um produto
- `[ ]` Não deve ser possível definir um limite mínimo de estoque 0

## Requisitos não-funcionais (técnicos)

- `[ ]` A listagem de produtos deve conter paginação
- `[ ]` A listagem de produtos deve conter filtros opcionais

## Casos de uso

<details>
  <summary>Quais as ações (casos de uso) que essa aplicação deve ter?</summary>
    <ul>
      <li>Cadastrar produto</li>
      <li>Vender produto</li>
      <li>Comprar produto</li>
      <li>Definir limite mínimo de estoque para um produto</li>
      <li>Visualizar historico de compra e venda</li>
      <li>Gerar notificação de produto acabando</li>
    </ul>
</details>
