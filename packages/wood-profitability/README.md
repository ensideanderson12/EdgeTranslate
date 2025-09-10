# Wood Profitability CLI

This simple script calculates revenue, cost and profit from a CSV file.

## Usage

Prepare a CSV file with column headers like (both dot and comma decimal
separators are supported; if you use comma decimals, separate columns with a semicolon):

```
product,volume_m3,buy_price,sell_price,freight_per_m3
Pinus,28,900,1350,211.54
Pinus Seco;7;900;1350;211,54
```

Run the script:

```
npm --workspace packages/wood-profitability start data.csv
```

The output prints the total revenue, cost and profit.
