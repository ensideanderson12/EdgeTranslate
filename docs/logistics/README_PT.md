# Gestão Logística de Madeira com Google Sheets

Este guia descreve como configurar uma planilha no Google Sheets integrada à API do Google Maps para otimizar rotas de entrega e atualizar automaticamente preços de madeira e custos de frete no Brasil.

## Estrutura da Planilha

1. **Abas Sugeridas**
   - `Precos_Madeira`: registra valores diários de Pinus e Eucalipto por região.
   - `Rotas`: calcula distâncias de entrega e custos estimados de frete.
   - `Fretes`: mantém valores médios de frete por quilômetro de acordo com o tipo de caminhão.

2. **Colunas Principais**
   - `Data`: dia da cotação ou coleta.
   - `Regiao`: localidade de origem ou destino.
   - `Tipo_Madeira`: Pinus ou Eucalipto.
   - `Preco_m3`: valor por metro cúbico.
   - `Origem` e `Destino`: pontos para cálculo de rotas.
   - `Distancia_km`: resultado da consulta à API do Google Maps.
   - `Caminhao`: modelo ou categoria (eixos).
   - `Frete_R$/km`: valor médio aplicado para o caminhão selecionado.
   - `Custo_Frete`: `=Distancia_km * Frete_R$/km`.

## Integração com Google Maps

Use o Google Apps Script na planilha para acessar a API de rotas. Exemplo básico:

```javascript
function obterDistancia(origem, destino) {
  var chave = 'SUA_CHAVE_GOOGLE_MAPS';
  var url = 'https://maps.googleapis.com/maps/api/distancematrix/json?units=metric&origins=' + encodeURIComponent(origem) + '&destinations=' + encodeURIComponent(destino) + '&key=' + chave;
  var resposta = UrlFetchApp.fetch(url);
  var dados = JSON.parse(resposta.getContentText());
  if (dados.rows.length > 0) {
    return dados.rows[0].elements[0].distance.value / 1000; // km
  }
  return 0;
}
```

Crie uma função personalizada no Sheets:

```javascript
function DISTANCIA(origem, destino) {
  return obterDistancia(origem, destino);
}
```

Então, em `Distancia_km` utilize `=DISTANCIA(A2,B2)` (ajuste as referências conforme a planilha).

## Atualização Diária de Dados

1. **Preços de Madeira**: adapte um script para buscar cotações diárias de fontes do setor (ex.: sindicatos, boletins ou APIs especializadas). Salve os valores na aba `Precos_Madeira`.
2. **Valores de Frete**: implemente rotina semelhante consumindo APIs de mercado (ex.: dados públicos da ANTT ou plataformas de frete). Registre o preço médio por km e tipo de caminhão.
3. **Agendamento**: configure gatilhos de tempo no Apps Script (`Triggers > Add Trigger`) para executar a coleta todos os dias.

## Fórmulas Úteis

- Cálculo do custo de frete: `=Distancia_km * Frete_R$/km`.
- Validação de valores não disponíveis: `=SEERRO(formula; 0)` para evitar quebras quando a API não retornar resultado.
- Custo total da carga: `=Preco_m3 * Volume_m3 + Custo_Frete`.

## Visualização e Análise

- Utilize gráficos do Google Sheets para comparar variações de preços por região e tipo de madeira.
- Acompanhe em mapas (Google My Maps) as rotas geradas, importando as distâncias calculadas.

Com essa estrutura, a planilha auxilia no planejamento logístico diário, oferecendo atualização automática de rotas, preços de madeira e custos de transporte.
