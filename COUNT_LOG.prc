CREATE OR REPLACE PROCEDURE CH.COUNT_LOG
    (p_str IN VARCHAR2 DEFAULT '111_0')
AS
  l_s varchar2(32767) := p_str;
  l_str LONG := '[';
  l_days NUMBER := 111;
  l_json NUMBER := 0;
BEGIN
  IF (INSTR(l_s, '_') = 0) THEN 
    l_s := l_s||'_0';
  END IF;     
  l_days := TO_NUMBER(SUBSTR(l_s, 1, INSTR(l_s, '_') - 1));
  l_json := TO_NUMBER(SUBSTR(l_s, INSTR(l_s, '_') + 1, 1));
  IF (l_json = 0) THEN
    HTP.PRN('<!DOCTYPE HTML><html><head><title>Log</title><meta http-equiv=Content-Type content="text/html; charset=utf-8">');
    HTP.PRN('<link href="http://localhost:81/css/count_log.css" rel="stylesheet" type="text/css" />');
    HTP.PRN('</head><body><div id="div">');
    HTP.PRN('<table id="log"><caption><div class="inline"><strong>Список визитов на страницы сайта <a href="http://sergechurkin.vacau.com/">http://sergechurkin.vacau.com/</a> за </strong></div><div class="inline">');
    HTP.FORMOPEN( 'CH.COUNT_LOG', 'GET');
    HTP.FORMTEXT('p_str', null, null, l_days, 'class="form-text" id="p_str" onblur="numValidate(this);" onfocus="clearMess(this);"');
    HTP.PRN('<a id="errorp_str" class="errormess"></a><strong> прошедших дней (0 - за текущую дату)</strong>');
    HTP.PRN('<INPUT TYPE="button" VALUE="Получить" class="btn" id="btn">');
    HTP.FORMCLOSE;
    HTP.PRN('</div></caption><thead><tr>');
    HTP.PRN('<th data-type="date"><div class="title">Дата</div><div></div></th>');
    HTP.PRN('<th data-type="string"><div class="title">Страница</div><div></div></th>');
    HTP.PRN('<th data-type="number"><div class="title"></div>Количество просмотров<div></div></th>');
    HTP.PRN('<th data-type="string"><div class="title"></div>ip адрес<div></div></th>');
    HTP.PRN('<th data-type="string"><div class="title">Страна</div><div></div></th>');
    HTP.PRN('<th data-type="string"><div class="title">Город</div><div></div></th>');
    HTP.PRN('<th data-type="string"><div class="title">Регион</div><div></div></th>');
    HTP.PRN('<th data-type="string"><div class="title">Организация</div><div></div></th>');
    HTP.PRN('</tr></thead><tbody id="tbody">');
    HTP.PRN('</tbody><tfoot id="tfoot"></tfoot></table></div>');
    HTP.PRN('<script data-type="text/javascript" type="text/javascript" src="http://localhost:81/js/count_log.js"></script>');
    HTP.PRN('</body></html>');
  ELSE
    FOR rec in (SELECT * FROM countlog WHERE dt >= (SYSDATE - l_days))
    LOOP
      IF (l_str <> '[') THEN
        l_str := l_str||',';
      END IF;
      l_str := l_str||'{"dt":"'||to_char(rec.dt, 'DD-MM-YYYY')||'","page":"'||rec.page||'","view":"'||to_char(rec.nview||'","ip":"'||rec.ip||'"}');
    END LOOP;
    HTP.PRN(l_str||']');
  END IF;
EXCEPTION
  WHEN OTHERS THEN
    HTP.PRN('[{'||'"Error":"Ошибка в процедуре CH.COUNT_LOG:'||SQLERRM||'"}]');
END COUNT_LOG;
/