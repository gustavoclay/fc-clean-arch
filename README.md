# Clean Architecture - Product Use Cases

Este projeto implementa Use Cases para a entidade **Product** seguindo os princípios de Clean Architecture com TypeScript.

## 📋 Estrutura do Projeto

O projeto está organizado em uma estrutura de camadas seguindo Clean Architecture:

```
src/
├── domain/                 # Camada de Domínio
│   ├── @shared/           # Compartilhado entre todas as entidades
│   └── product/           # Domínio de Product
│       ├── entity/        # Entidades
│       ├── factory/       # Factory pattern
│       ├── repository/    # Interface de repositório
│       ├── service/       # Serviços de domínio
│       └── event/         # Eventos de domínio
│
├── usecase/               # Camada de Use Cases
│   └── product/           # Use Cases de Product
│       ├── create/        # Caso de uso: Criar Produto
│       ├── find/          # Caso de uso: Buscar Produto
│       ├── list/          # Caso de uso: Listar Produtos
│       └── update/        # Caso de uso: Atualizar Produto
│
└── infrastructure/        # Camada de Infraestrutura
    ├── api/               # Camada de API (Web)
    │   ├── routes/        # Rotas da API
    │   ├── presenters/    # Formatadores de saída
    │   └── __tests__/     # Testes E2E
    └── product/
        └── repository/
            └── sequelize/ # Implementação com Sequelize
```

## 🌐 API - Endpoints Disponíveis

### Product Endpoints

#### Listar Produtos
```
GET /product
```

**Resposta (JSON):**
```json
{
  "products": [
    {
      "id": "123",
      "name": "Produto 1",
      "price": 100
    },
    {
      "id": "456",
      "name": "Produto 2",
      "price": 200
    }
  ]
}
```

**Resposta (XML):**
```xml
<?xml version="1.0" encoding="UTF-8"?>
<products>
  <product>
    <id>123</id>
    <name>Produto 1</name>
    <price>100</price>
  </product>
  <product>
    <id>456</id>
    <name>Produto 2</name>
    <price>200</price>
  </product>
</products>
```

**Formato de Resposta:**
- Se `Accept: application/xml` → Retorna em XML
- Caso contrário → Retorna em JSON

## 🎯 Use Cases Implementados

### 1. **Create Product** 
Cria um novo produto no sistema.

- **Arquivo**: `src/usecase/product/create/`
- **Testes**:
  - Unit: `create.product.unit.spec.ts`
  - Integration: `create.product.integration.spec.ts`

### 2. **Find Product**
Busca um produto específico pelo ID.

- **Arquivo**: `src/usecase/product/find/`
- **Testes**:
  - Unit: `find.product.unit.spec.ts`
  - Integration: `find.product.integration.spec.ts`

### 3. **List Product**
Lista todos os produtos do sistema.

- **Arquivo**: `src/usecase/product/list/`
- **Testes**:
  - Unit: `list.product.unit.spec.ts`
  - Integration: `list.product.integration.spec.ts`

### 4. **Update Product**
Atualiza os dados de um produto existente.

- **Arquivo**: `src/usecase/product/update/`
- **Testes**:
  - Unit: `update.product.unit.spec.ts`
  - Integration: `update.product.integration.spec.ts`

## 🧪 Testes

Cada Use Case possui **dois níveis de testes**:

### Testes de Unidade
- Testam a lógica de negócio isolada
- Utilizam mocks para as dependências
- Localização: `*.unit.spec.ts`

### Testes de Integração
- Testam o fluxo completo com o banco de dados
- Usam SQLite in-memory para testes
- Validam a persistência de dados
- Localização: `*.integration.spec.ts`

### Testes E2E (End-to-End)
- Testam a API completa através de requisições HTTP reais
- Validam os endpoints, status codes e formato de resposta
- Testam resposta em JSON e XML
- Localização: `*.e2e.spec.ts`
  - `src/infrastructure/api/__tests__/product.e2e.spec.ts` - Testes da rota GET /product

## � Notification Pattern

A entidade **Product** implementa o **Notification Pattern** para validação. Este padrão permite acumular múltiplos erros de validação e reportá-los de uma única vez, melhorando a experiência do usuário ao fornecer todas as inconsistências simultaneamente.

### Como Funciona

Em vez de lançar uma exceção imediatamente quando uma regra de negócio é violada, a entidade adiciona o erro a um container de notificações:

1. **Validação Silenciosa**: Erros são coletados na `notification`
2. **Múltiplos Erros**: Todos os erros são capturados em uma única passada
3. **Relatório Consolidado**: Ao final, se houver erros, lança `NotificationError` com todos

### Exemplo de Uso

```typescript
// Tentando criar um produto com múltiplos erros
try {
  const product = new Product("", "", -50); // id vazio, name vazio, price negativo
} catch (error) {
  if (error instanceof NotificationError) {
    console.log(error.errors);
    // [
    //   { context: "product", message: "Id is required" },
    //   { context: "product", message: "Name is required" },
    //   { context: "product", message: "Price must be greater than or equal to zero" }
    // ]
  }
}
```

### Teste de Múltiplos Erros

Existe um teste específico que valida a captura de múltiplos erros simultâneos:

```bash
npm test -- src/domain/product/entity/product.spec.ts -t "should throw error with multiple validation errors simultaneously"
```

Este teste garante que a entidade captura todas as 3 violações de regra de negócio de uma vez.

### Componentes do Notification Pattern

- **Entity**: Classe abstrata base que fornece `notification: Notification`
- **Notification**: Container que acumula erros com `addError()` e `hasErrors()`
- **NotificationError**: Exceção que encapsula todos os erros capturados
- **ValidatorInterface**: Interface para implementação de validadores
- **ProductYupValidator**: Implementação de validação usando Yup (validação declarativa)
- **ProductValidatorFactory**: Factory para criar instâncias do validador

## �🚀 Como Executar

### 1. Instalar Dependências

```bash
npm install
```

### 2. Executar Todos os Testes de Product

```bash
npm test -- --testPathPattern=product
```

### 3. Executar Apenas Testes de Unidade de Product

```bash
npm test -- --testPathPattern="product.*unit"
```

### 4. Executar Apenas Testes de Integração de Product

```bash
npm test -- --testPathPattern="product.*integration"
```

### 5. Executar um Use Case Específico

```bash
# Criar Produto
npm test -- src/usecase/product/create

# Buscar Produto
npm test -- src/usecase/product/find

# Listar Produtos
npm test -- src/usecase/product/list

# Atualizar Produto
npm test -- src/usecase/product/update
```

### 6. Executar com Coverage

```bash
npm test -- --testPathPattern=product --coverage
```

### 7. Executar Testes E2E de Product (API)

```bash
npm test -- --testPathPattern="product.e2e"
```

### 8. Iniciar o Servidor de Desenvolvimento

O servidor Express é inicializado automaticamente ao rodar a aplicação. Para testar a API localmente:

```bash
npm start
```

A API ficará disponível em `http://localhost:3000`

**Exemplo de requisição:**
```bash
# JSON
curl -H "Accept: application/json" http://localhost:3000/product

# XML
curl -H "Accept: application/xml" http://localhost:3000/product
```

## 📊 Resultado dos Testes

Todos os testes passam com sucesso, incluindo o novo teste de múltiplos erros simultâneos:

```
✓ Domain - Product Entity: 8 testes (com Notification Pattern)
  - Validação individual de campos
  - Teste de múltiplos erros simultâneos ⭐ (obrigatório)
  - Testes de mudança de nome e preço

✓ Create Product - 3 testes (1 integração + 2 unidade)
✓ Find Product - 3 testes (1 integração + 2 unidade)
✓ List Product - 3 testes (1 integração + 2 unidade)
✓ Update Product - 3 testes (1 integração + 2 unidade)
✓ Product E2E - 3 testes (lista JSON, lista XML, lista vazia)

Total: 81 testes, 100% passando (28 suites)
```

### Resultado da Execução

```
Test Suites: 28 passed, 28 total
Tests:       81 passed, 81 total
Snapshots:   0 total
Time:        ~2s
```

## 📝 DTOs (Data Transfer Objects)

Cada Use Case define seus próprios DTOs para entrada (Input) e saída (Output):

### Create Product
```typescript
interface InputCreateProductDto {
  name: string;
  price: number;
}

interface OutputCreateProductDto {
  id: string;
  name: string;
  price: number;
}
```

### Find Product
```typescript
interface InputFindProductDto {
  id: string;
}

interface OutputFindProductDto {
  id: string;
  name: string;
  price: number;
}
```

### List Product
```typescript
interface InputListProductDto {}

interface OutputListProductDto {
  products: Array<{
    id: string;
    name: string;
    price: number;
  }>;
}
```

### Update Product
```typescript
interface InputUpdateProductDto {
  id: string;
  name: string;
  price: number;
}

interface OutputUpdateProductDto {
  id: string;
  name: string;
  price: number;
}
```

## 🏗️ Arquitetura Utilizada

A implementação segue os princípios de **Clean Architecture**:

1. **Independência de Frameworks**: A lógica de negócio não depende de frameworks específicos
2. **Testabilidade**: Código altamente testável com mocks e injeção de dependência
3. **Separação de Responsabilidades**: Cada camada tem uma responsabilidade clara
4. **DTOs**: Isolamento entre camadas através de objetos de transferência de dados

## 🔍 Padrões Utilizados

- **Factory Pattern**: Para criação de produtos
- **Repository Pattern**: Para abstração do acesso a dados
- **Use Case Pattern**: Para cada operação de negócio
- **Dependency Injection**: Através do construtor
- **Unit Testing**: Com Jest
- **Integration Testing**: Com SQLite in-memory

## ✅ Cobertura de Testes

- ✓ Validação de entrada (nome e preço)
- ✓ Criação de produtos
- ✓ Busca por ID
- ✓ Listagem de todos os produtos
- ✓ Atualização de dados
- ✓ Tratamento de erros
- ✓ Persistência em banco de dados
- ✓ Endpoint HTTP GET /product
- ✓ Resposta em JSON
- ✓ Resposta em XML
- ✓ Status code 200

## 🧪 Testes E2E (End-to-End)

Os testes E2E validam o fluxo completo da API através de requisições HTTP reais:

### Teste: Listar Produtos em JSON
- Cria 2 produtos no banco de dados
- Faz requisição GET para `/product` com Accept: application/json
- Valida status code 200
- Valida estrutura da resposta JSON
- Verifica se os dados estão corretos

### Teste: Listar Produtos em XML
- Cria 2 produtos no banco de dados
- Faz requisição GET para `/product` com Accept: application/xml
- Valida status code 200
- Valida estrutura XML com declaração `<?xml version="1.0"?>`
- Verifica presença de tags esperadas (`<products>`, `<product>`, etc)
- Valida dados dentro das tags XML

### Teste: Listar Produtos Vazio
- Sem produtos no banco de dados
- Faz requisição GET para `/product`
- Valida status code 200
- Verifica se retorna array vazio

**Arquivo de testes:** `src/infrastructure/api/__tests__/product.e2e.spec.ts`

## 📌 Observações

- A entidade Product segue o mesmo padrão implementado para Customer
- Todos os testes passam com sucesso (36 testes em 13 suites)
- O código está 100% em TypeScript
- Não há dependências externas além do necessário para Clean Architecture
- A API suporta múltiplos formatos de resposta (JSON e XML)
- Testes E2E validam o fluxo completo da API
- O banco de dados é SQLite in-memory para testes e desenvolvimento

## 📖 Estrutura de Arquivos - API Product

```
src/infrastructure/api/
├── routes/
│   └── product.route.ts          # Definição da rota GET /product
├── presenters/
│   └── product.presenter.ts       # Formatador de resposta em XML
├── __tests__/
│   └── product.e2e.spec.ts        # Testes E2E
└── express.ts                     # Configuração da aplicação Express

```

## 🔗 Commits Realizados

1. **Commit 1:** `feat: add Product use cases (Create, Find, List, Update) with unit and integration tests`
   - Use Cases completos com testes

2. **Commit 2:** `feat: add Product API endpoint with E2E tests for product listing`
   - API endpoint GET /product
   - Presenter para formatação XML
   - Testes E2E
