function updateLogistics() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet();
  var apiKey = 'YOUR_GOOGLE_MAPS_API_KEY';
  var range = sheet.getSheetByName('Routes').getDataRange();
  var values = range.getValues();
  for (var i = 1; i < values.length; i++) {
    var origin = values[i][0];
    var destination = values[i][1];
    var url = 'https://maps.googleapis.com/maps/api/distancematrix/json?units=metric&origins=' + encodeURIComponent(origin) + '&destinations=' + encodeURIComponent(destination) + '&key=' + apiKey;
    var response = UrlFetchApp.fetch(url);
    var json = JSON.parse(response.getContentText());
    var element = json.rows[0].elements[0];
    if (element.status === 'OK') {
      range.getCell(i+1, 3).setValue(element.distance.value / 1000); // km
      range.getCell(i+1, 4).setValue(element.duration.value / 3600); // hours
    }
  }
}

/**
 * Retorna o preço do fornecedor informado.
 * A comparação ignora maiúsculas/minúsculas e espaços extras.
 *
 * @param {string} nomeFornecedor Nome do fornecedor a ser buscado
 * @param {'seca'|'verde'} tipo Tipo de madeira ('seca' ou 'verde')
 * @return {number|string} Valor encontrado ou string vazia se não existir
 */
function getPrecoFornecedor(nomeFornecedor, tipo) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('CadastroFornecedores');
  var data = sheet.getDataRange().getValues();
  for (var i = 1; i < data.length; i++) {
    var nome = data[i][0];
    if (nome && nome.toString().trim().toLowerCase() === String(nomeFornecedor).trim().toLowerCase()) {
      return tipo === 'verde' ? data[i][4] : data[i][3];
    }
  }
  return '';
}
