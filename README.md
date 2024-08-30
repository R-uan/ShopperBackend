# Upload endpoint (/upload)

## Request Body

```typescript
{
	image: string;
	customer_code: string;
	measure_datetime: Date;
	measure_type: string;
}
```

## Possible Responses

### 200 Success

```typescript
{
  image_url: string,
  measure_value: number,
  measure_uuid: string
}
```

### 400 Invalid Data

```typescript
{
  error_code: "INVALID_DATA",
  error_description: [string]
}
```

### 409 Double Report

```typescript
{
  error_code: "DOUBLE_REPORT",
  error_description: "Leitura do mês já realizada"
}
```

# Confirm endpoint (/confirm)

## Request Body

```typescript
{
	measure_uuid: string,
	confirmed_value: number
}
```

## Possible responses

### 200 Success

```typescript
{
	success: true;
}
```

### 400 Invalid Data

```typescript
{
  error_code: "INVALID_DATA",
  error_description: [string]
}
```

### 404 Measure Not Found

```typescript
{
  error_code: "MEASURE_NOT_FOUND",
  error_description: "Não foi possivel achar a leitura"
}
```

### 409 Confirmation Duplicate

```typescript
{
  error_code: "CONFIRMATION_DUPLICATE",
  error_description: "Confirmação já realizada"
}
```

# Customer List endpoint (/{customer_code}/list)

## Possible responses

### 200 Success

```typescript
{
  cusomer_code: string,
  measures: [
    {
      measure_uuid: string,
      measure_datetime: Date,
      measure_type: string,
      has_confirmed: boolean,
      image_url: string
    },
  ]
}
```

### 404 Not found

```typescript
{
  error_code: "MEASURES_NOT_FOUND",
  error_description: "Nenhuma leitura encontrada"
}
```

### 400 Bad Request (/{customer_code}/list?measure_type=type)

_Measure Type only accepts "GAS" or "WATER" (case insensitive)_

```typescript
{
  error_code: "INVALID_TYPE",
  error_description: "Tipo de medição não permitida"
}
```
