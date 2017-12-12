const DONE = 4; // запрос завершён

function numValidate(e) {
  if (isNaN(e.value)) {
    e.className = "error";
    document.getElementById('error' + e.id).innerHTML = 'Введите число';
  }
}

function clearMess(e) {
  e.className = "input";
  document.getElementById('error' + e.id).innerHTML = '';
}

function isMobile() {
    var useragent = navigator.userAgent;
    return useragent.indexOf('Android') != -1
            || useragent.indexOf('iPhone') != -1
            || useragent.indexOf('iPod') != -1
            || useragent.indexOf('iPad') != -1;
}
function getlog() {
  var days = document.getElementById('p_str').value;
  var str = '', total = 0, totalu = 0;
  var xhr = new XMLHttpRequest();
  if (p_str.className === "error") return;
  xhr.open('GET', 'http://localhost:8080/dd/CH.COUNT_LOG?' + 'p_str=' + days + '_1', true);
//  xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
  xhr.send();
  xhr.onreadystatechange = function() { // (3)
    var data = '';
    if (xhr.readyState != DONE) return;
    if (xhr.status == 200) {
      try {
//alert(xhr.responseText);
        data = JSON.parse(xhr.responseText);
      } catch(e) {
        div.innerHTML =  '<h2>' + e.name  + '<br>' + e.message + '<h2><br>' + xhr.responseText;
        return;
      }
      data.forEach(function(item, i, arr) {
        str = str + '<tr>';
        for (key in data[0]) {
         str = str + '<td>' + item[key] + '</td>';
        }
        if (item.ip != undefined) {
          for (var i = 0; i < 4; i++) str = str +'<td></td>';
        }
        str = str + '</tr>';
        totalu++;
        if (item.view != undefined) total = total + Number(item.view);
      });
      tbody.innerHTML = str;
      str = '';
      if (data[0] != undefined) {
        str = str + '<tr id="total">' + 
             '<td><strong>Всего<strong></td>' +
             '<td><strong>' + totalu + '</strong></td>' +
             '<td><strong>' + total + '</strong></td>' +
             '</tr>';
      }
      tfoot.innerHTML = str;
      data.forEach(function(item, i, arr) {
        if (item.ip != undefined) {
          var xhr = new XMLHttpRequest();
          xhr.open('GET', 'http://ipinfo.io/' + item.ip + '/json');
          xhr.send();
          xhr.onreadystatechange = function() { // (3)
            if (xhr.readyState != DONE) return;
            if (xhr.status == 200) {
              try {
                var data = JSON.parse(xhr.responseText);
              } catch(e) {
                return;
              }
              log.rows[i + 1].cells[4].innerHTML = data.country;
              log.rows[i + 1].cells[5].innerHTML = data.city;
              log.rows[i + 1].cells[6].innerHTML = data.region;
              log.rows[i + 1].cells[7].innerHTML = data.org;
            }
          }
        }
      });
    }  else {
      div.innerHTML =  '<h2>Error: ' + xhr.status + '<h2>';
      return;
    }

    log.onclick = function(e) {
      var thElements = log.getElementsByTagName("TH");
      if (e.target.tagName != 'TH') {
        if (e.target.parentNode.tagName != 'TH') return;
      }
      if (e.target.tagName == 'TH') var et = e.target;
      if (e.target.parentNode.tagName == 'TH') var et = e.target.parentNode;
      if (et.lastChild.className == "arrow-down") et.lastChild.className = "arrow-up";
      else et.lastChild.className = "arrow-down";
      for (var i = 0; i < thElements.length; i++) {
        if (i == et.cellIndex) continue;
        thElements[i].lastChild.className = '';
      }
      sortlog(et.cellIndex, et.getAttribute('data-type'), (et.lastChild.className == "arrow-down"));
    }

    function sortlog(colNum, type, isDown) {
      var tbody = log.getElementsByTagName('tbody')[0];
      // Составить массив из TR
      var rowsArray = [].slice.call(tbody.rows);
      if (rowsArray.length < 2) return;
// определить функцию сравнения, в зависимости от типа
      var compare;
      switch (type) {
        case 'date':
          compare = function(rowA, rowB, ) {
            if (isDown) return rowA.cells[colNum].innerHTML.replace(/(\d+).(\d+).(\d+)/, '$3/$2/$1') > rowB.cells[colNum].innerHTML.replace(/(\d+).(\d+).(\d+)/, '$3/$2/$1');
            else return rowA.cells[colNum].innerHTML.replace(/(\d+).(\d+).(\d+)/, '$3/$2/$1') < rowB.cells[colNum].innerHTML.replace(/(\d+).(\d+).(\d+)/, '$3/$2/$1');
          };
          break;
        case 'number':
          compare = function(rowA, rowB) {
            if (isDown) return rowA.cells[colNum].innerHTML - rowB.cells[colNum].innerHTML;
            else return rowB.cells[colNum].innerHTML - rowA.cells[colNum].innerHTML;
          };
          break;
        case 'string':
          compare = function(rowA, rowB) {
            if (isDown) return rowA.cells[colNum].innerHTML > rowB.cells[colNum].innerHTML;
            else return rowA.cells[colNum].innerHTML < rowB.cells[colNum].innerHTML;
          };
          break;
      }
      // сортировать
      rowsArray.sort(compare);
      log.removeChild(tbody);
      // добавить результат в нужном порядке в TBODY
      // они автоматически будут убраны со старых мест и вставлены в правильном порядке
      for (var i = 0; i < rowsArray.length; i++) {
        tbody.appendChild(rowsArray[i]);
      }
      log.appendChild(tbody);
    }
  } // xhr.onreadystatechange = function()
}

document.onsubmit = function(event) {
  getlog();
  return false;
}
document.getElementById('btn').onclick = function(event) {
  getlog();
}

document.getElementById('p_str').focus();
