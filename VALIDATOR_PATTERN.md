# Validator Pattern - Validação Desacoplada na Entidade Product

## 📋 Visão Geral

A entidade **Product** implementa o **Validator Pattern**, delegando toda a lógica de validação para uma classe especializada (`ProductYupValidator`). Isso garante baixo acoplamento e alta coesão na arquitetura.

## 🏗️ Arquitetura do Padrão

```
┌─────────────────────────────────────────────────────────────┐
│                        ENTIDADE PRODUCT                      │
│  - Não contém lógica de validação (if/else soltos)           │
│  - Delega para ProductValidatorFactory.create().validate()   │
│  - Lança NotificationError se houver erros                   │
└─────────────────────────────────────────────────────────────┘
                              ▲
                              │ usa
                              │
                ┌─────────────────────────────────────┐
                │  ProductValidatorFactory (Static)   │
                │  - create(): ValidatorInterface     │
                │  - Factory pattern                  │
                └─────────────────────────────────────┘
                              ▲
                              │ retorna instância de
                              │
         ┌────────────────────────────────────────────────────┐
         │        ProductYupValidator implements              │
         │        ValidatorInterface<Product>                 │
         │                                                    │
         │  ✓ validate(entity: Product): void                │
         │    - Usa Yup para validação declarativa           │
         │    - Captura múltiplos erros (abortEarly: false)  │
         │    - Preenche entity.notification com erros       │
         └────────────────────────────────────────────────────┘
                              ▲
                              │ preenche
                              │
              ┌────────────────────────────────────┐
              │    Notification (Entity base)       │
              │    - addError(error)               │
              │    - hasErrors(): boolean          │
              │    - getErrors(): array            │
              └────────────────────────────────────┘
```

## 📝 Componentes Implementados

### 1. **ProductValidatorFactory** (Factory Pattern)
**Localização**: `src/domain/product/factory/product.validator.factory.ts`

```typescript
export default class ProductValidatorFactory {
  static create(): ValidatorInterface<Product> {
    return new ProductYupValidator();
  }
}
```

**Responsabilidades**:
- Criação centralizada de validadores
- Ponto único de configuração
- Facilita testes e alternância de implementações

**Benefícios**:
- ✅ Baixo acoplamento (Product não conhece ProductYupValidator)
- ✅ Fácil testes (mock do factory)
- ✅ Facilita mudança de implementação (Joi, Valibot, etc.)

### 2. **ProductYupValidator** (Validator Pattern)
**Localização**: `src/domain/product/validator/product.yup.validator.ts`

```typescript
export default class ProductYupValidator
  implements ValidatorInterface<Product>
{
  validate(entity: Product): void {
    try {
      yup
        .object()
        .shape({
          id: yup.string().required("Id is required"),
          name: yup.string().required("Name is required"),
          price: yup
            .number()
            .required("Price is required")
            .min(0, "Price must be greater than or equal to zero"),
        })
        .validateSync(
          {
            id: entity.id,
            name: entity.name,
            price: entity.price,
          },
          {
            abortEarly: false,  // ← Captura TODOS os erros
          }
        );
    } catch (errors) {
      const e = errors as yup.ValidationError;
      e.errors.forEach((error) => {
        entity.notification.addError({
          context: "product",
          message: error,
        });
      });
    }
  }
}
```

**Responsabilidades**:
- Implementa validação declarativa com Yup
- Preenche `entity.notification` com erros
- Utiliza `abortEarly: false` para capturar múltiplos erros

**Benefícios**:
- ✅ Validação declarativa (Schema definido claramente)
- ✅ Múltiplos erros capturados simultaneamente
- ✅ Separação clara de responsabilidades
- ✅ Fácil de testar isoladamente

### 3. **Product Entity** (Refatorada)
**Localização**: `src/domain/product/entity/product.ts`

```typescript
export default class Product extends Entity implements ProductInterface {
  // ...

  constructor(id: string, name: string, price: number) {
    super();
    this._id = id;
    this._name = name;
    this._price = price;
    this.validate();  // ← Chama validador
    if (this.notification.hasErrors()) {
      throw new NotificationError(this.notification.getErrors());
    }
  }

  validate(): void {
    // ← Delegação pura para factory
    ProductValidatorFactory.create().validate(this);
  }
}
```

**Responsabilidades**:
- Chamar validador via factory
- Verificar se há erros na notificação
- Lançar NotificationError se validação falhou

**Benefícios**:
- ✅ Entidade limpa e enxuta
- ✅ Sem lógica de validação direta (if/else)
- ✅ Sem acoplamento direto com validador
- ✅ Comportamento externo inalterado

## 🔄 Fluxo de Validação

### Cenário 1: Validação com Sucesso
```
new Product("id", "name", 100)
  ├─ this.validate()
  │  └─ ProductValidatorFactory.create().validate(this)
  │     └─ ProductYupValidator.validate()
  │        └─ Yup valida ✓ sem erros
  └─ if (notification.hasErrors()) → false
     └─ Produto criado com sucesso ✅
```

### Cenário 2: Validação com Erros Múltiplos
```
new Product("", "", -50)
  ├─ this.validate()
  │  └─ ProductValidatorFactory.create().validate(this)
  │     └─ ProductYupValidator.validate()
  │        ├─ Yup detecta: id vazio ✗
  │        ├─ Yup detecta: name vazio ✗
  │        └─ Yup detecta: price negativo ✗
  │           └─ notification.addError() × 3
  └─ if (notification.hasErrors()) → true
     └─ throw new NotificationError([...]) ✗
```

## ✅ Validação de Desacoplamento

| Aspecto | ANTES | DEPOIS |
|---------|-------|--------|
| **Lógica de validação** | Direta na entidade (if/else) | Delegada ao validador |
| **Acoplamento** | Alta (if/else dentro da classe) | Baixa (interface entre camadas) |
| **Coesão** | Baixa (validação + regras de negócio) | Alta (responsabilidade clara) |
| **Testabilidade** | Difícil isolar validação | Fácil testar validator isoladamente |
| **Flexibilidade** | Difícil trocar validador | Fácil trocar (factory pattern) |
| **Múltiplos erros** | Apenas o primeiro (throw imediato) | Todos capturados (Notification) |

## 🧪 Testes de Desacoplamento

### Teste 1: Validação Desacoplada Funciona
```bash
npm test -- src/domain/product/entity/product.spec.ts \
  -t "should throw error with multiple validation errors simultaneously"
```

### Teste 2: Todos os Cenários Cobertos
```bash
npm test -- src/domain/product/entity/product.spec.ts
# PASS ✅ 8 testes
```

### Teste 3: Regressão - Comportamento Inalterado
```bash
npm test -- --testPathPattern=product
# PASS ✅ 39 testes
```

## 📊 Benefícios da Implementação

### 1. **Separação de Responsabilidades**
- ✅ Product: Regras de negócio
- ✅ ProductYupValidator: Validação
- ✅ ProductValidatorFactory: Criação
- ✅ Entity: Notificações

### 2. **Testabilidade Melhorada**
```typescript
// Fácil mockear validador para testes
const mockValidator = {
  validate: jest.fn()
};
```

### 3. **Flexibilidade Futura**
```typescript
// Trocar para outro validador sem afetar Product
export default class ProductValidatorFactory {
  static create(): ValidatorInterface<Product> {
    // Trocar ProductYupValidator por JoiValidator, ValibotValidator, etc.
    return new JoiValidator();
  }
}
```

### 4. **Captura de Múltiplos Erros**
```typescript
// Antes: throw na primeira validação
if (this._id.length === 0) throw new Error("Id is required");

// Depois: Acumula todos os erros
entity.notification.addError({ context: "product", message: "Id is required" });
entity.notification.addError({ context: "product", message: "Name is required" });
entity.notification.addError({ context: "product", message: "Price must be..." });
```

## 🎓 Padrões Implementados

### 1. **Factory Pattern**
- Centraliza criação de validadores
- Facilita substitução de implementações

### 2. **Strategy Pattern**
- ValidatorInterface define contrato
- Diferentes implementações podem existir

### 3. **Notification Pattern**
- Acumula erros em vez de lançar exceção imediata
- Permite reportar múltiplos problemas

### 4. **Dependency Injection Implícita**
- Product não instancia validador diretamente
- Usa factory para abstração

## ✨ Regras de Negócio Validadas

| Campo | Regra | Implementação |
|-------|-------|----------------|
| **ID** | Obrigatório | `yup.string().required()` |
| **Name** | Obrigatório | `yup.string().required()` |
| **Price** | Não negativo | `yup.number().min(0)` |

## 📈 Resultado: Entidade Clean e Desacoplada

```typescript
// ANTES: Validação acoplada
export default class Product {
  validate(): boolean {
    if (this._id.length === 0) throw new Error("Id is required");
    if (this._name.length === 0) throw new Error("Name is required");
    if (this._price < 0) throw new Error("Price must be...");
    return true;
  }
}

// DEPOIS: Validação desacoplada
export default class Product extends Entity {
  validate(): void {
    ProductValidatorFactory.create().validate(this);
  }
}
```

**Redução de responsabilidades**: 3 if/else → 1 linha delegada ✅

## 🚀 Como Executar Testes

```bash
# Todos os testes de Product
npm test -- --testPathPattern=product

# Apenas testes de validação
npm test -- src/domain/product/entity/product.spec.ts

# Teste específico de múltiplos erros
npm test -- src/domain/product/entity/product.spec.ts \
  -t "multiple validation errors simultaneously"

# Com coverage
npm test -- --testPathPattern=product --coverage
```

## 📊 Status: ✅ COMPLETO

- ✅ Validator Pattern implementado
- ✅ Validation Factory criada
- ✅ Entidade desacoplada
- ✅ Notification Pattern integrado
- ✅ Múltiplos erros capturados
- ✅ Todos os testes passando (81 tests)
- ✅ Comportamento externo inalterado (regressão 0%)
- ✅ Documentação completa
