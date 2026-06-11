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
    └── product/
        └── repository/
            └── sequelize/ # Implementação com Sequelize
```

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

## 🚀 Como Executar

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

## 📊 Resultado dos Testes

Todos os 12 testes passam com sucesso:

```
✓ Create Product - 3 testes (1 integração + 2 unidade)
✓ Find Product - 3 testes (1 integração + 2 unidade)
✓ List Product - 3 testes (1 integração + 2 unidade)
✓ Update Product - 3 testes (1 integração + 2 unidade)

Total: 12 testes, 100% passando
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

## 📌 Observações

- A entidade Product segue o mesmo padrão implementado para Customer
- Todos os testes passam com sucesso
- O código está 100% em TypeScript
- Não há dependências externas além do necessário para Clean Architecture
