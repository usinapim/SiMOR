/**
 * Created by matias on 12/5/16.
 */

var currentRow;
var dbName = 'SiMOR.db';
var dbVersion = '1.0';
var dbDisplayName = 'SiMOR DB';
// Populate the database
//
function populateDB(tx) {
    // tx.executeSql('CREATE TABLE IF NOT EXISTS configuracion (id INTEGER PRIMARY KEY AUTOINCREMENT, descripcion ,slug , valor , fecha )');
    tx.executeSql('CREATE TABLE IF NOT EXISTS configuracion (id INTEGER PRIMARY KEY AUTOINCREMENT, descripcion ,slug , valor , fecha )', [],
        function (tx, result) {
            // alert("Table created successfully");
            console.log('Table created successfully');
            // $$('#prueba').html('Table created successfully');
        },
        function (error) {
            $$('#prueba').html('Ocurrio un error creando la tabla en la BD');
        });
}

// Query the database
//
// function queryDB(tx) {
//     tx.executeSql('SELECT * FROM configuracion', [], querySuccess, errorCB);
// }
//
// function searchQueryDB(tx) {
//     tx.executeSql("SELECT * FROM DEMO where name like ('%" + document.getElementById("txtName").value + "%')",
//         [], querySuccess, errorCB);
// }
// Query the success callback
//
function querySuccess(tx, results) {
    $$('#prueba').html('querySuccess');
    // var tblText = '<table id="t01"><tr><th>ID</th> <th>Name</th> <th>Number</th></tr>';
    // var len = results.rows.length;
    // for (var i = 0; i < len; i++) {
    //     var tmpArgs = results.rows.item(i).id + ",'" + results.rows.item(i).name
    //         + "','" + results.rows.item(i).number + "'";
    //     tblText += '<tr onclick="goPopup(' + tmpArgs + ');"><td>' + results.rows.item(i).id + '</td><td>'
    //         + results.rows.item(i).name + '</td><td>' + results.rows.item(i).number + '</td></tr>';
    // }
    // tblText += "</table>";
    // document.getElementById("tblDiv").innerHTML = tblText;
}

//Delete query
// function deleteRow(tx) {
//     tx.executeSql('DELETE FROM DEMO WHERE id = ' + currentRow, [], queryDB, errorCB);
// }

// Transaction error callback
//
function errorCB(err, sql) {
    myApp.alert("Error processing SQL: " + err+' '+sql);
}

// Transaction success callback
//
function successCB() {
    var db = window.openDatabase(dbName, dbVersion, dbDisplayName, 200000);
    // db.transaction(queryDB, errorCB);
}

// Cordova is ready
//
// function onDeviceReady() {
//     var db = window.openDatabase(dbName, dbVersion, dbDisplayName, 200000);
//     db.transaction(populateDB, errorCB, successCB);
// }

//Insert query
//
// function insertDB(tx) {
//     tx.executeSql('INSERT INTO DEMO (name,number) VALUES ("' + document.getElementById("txtName").value
//         + '","' + document.getElementById("txtNumber").value + '")');
// }
//
// function goInsert() {
//     var db = window.openDatabase(dbName, dbVersion, dbDisplayName, 200000);
//     db.transaction(insertDB, errorCB, successCB);
// }
//
// function goSearch() {
//     var db = window.openDatabase(dbName, dbVersion, dbDisplayName, 200000);
//     db.transaction(searchQueryDB, errorCB);
// }
//
// function goDelete() {
//     var db = window.openDatabase(dbName, dbVersion, dbDisplayName, 200000);
//     db.transaction(deleteRow, errorCB);
//     document.getElementById('qrpopup').style.display = 'none';
// }
//
// //Show the popup after tapping a row in table
// //
// function goPopup(row, rowname, rownum) {
//     currentRow = row;
//     document.getElementById("qrpopup").style.display = "block";
//     document.getElementById("editNameBox").value = rowname;
//     document.getElementById("editNumberBox").value = rownum;
// }
//
// function editRow(tx) {
//     tx.executeSql('UPDATE DEMO SET name ="' + document.getElementById("editNameBox").value +
//         '", number= "' + document.getElementById("editNumberBox").value + '" WHERE id = '
//         + currentRow, [], queryDB, errorCB);
// }
// function goEdit() {
//     var db = window.openDatabase(dbName, dbVersion, dbDisplayName, 200000);
//     db.transaction(editRow, errorCB);
//     document.getElementById('qrpopup').style.display = 'none';
// }

//custom
/**
 *
 * activa desactiva las notificaciones del simor.
 *
 * @param enabled true|fale
 */
function activarDesactivarNotificaciones(enabled) {
    tx.executeSql("SELECT valor FROM configuracion WHERE slug = 'notificacion'", [], function (tx, results) {
        var len = results.rows.length;
        if (len >= 1) {
            tx.executeSql("UPDATE configuracion SET valor =" + enabled +
                "WHERE slug = 'notificacion'", [], function () {
                console.log('ok')
            }, errorCB);
        } else {
            tx.executeSql("INSERT INTO configuracion (descripcion,slug, valor) VALUES ('notificacion','notificacion'," + enabled + ")");
        }
    }, errorCB);

}

function guardarDatos(tx, json) {

    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth() + 1; //January is 0!
    var yyyy = today.getFullYear();
    var hoy = yyyy + '-' + mm + '-' + dd;

    var sqlSelect = "SELECT valor FROM configuracion WHERE slug = 'niveles'";
    tx.executeSql(sqlSelect, [], function (tx, results) {
        var len = results.rows.length;
        if (len >= 1) {
            var sqlUpdate = "UPDATE configuracion SET valor =" + JSON.stringify(json) + ", fecha = '" + hoy + "' WHERE slug = 'niveles'";
            tx.executeSql(sqlUpdate, [], function () {
                    $$('#prueba').html('ok' + sqlUpdate);
                }, function () {
                    $$('#prueba').html('error' + sqlUpdate);
                }
            )
            ;
        } else {

            sqlInsert = "INSERT INTO configuracion (descripcion, slug, valor, fecha) VALUES ('niveles','niveles'," + JSON.stringify(json) + ",'" + hoy + "')";
            $$('#prueba').html(sqlInsert);

            tx.executeSql(sqlInsert);
        }
    }, errorCB(sqlSelect));


}

function getNivelesOffline(tx) {
    var retorno;
    tx.executeSql("SELECT valor, fecha FROM configuracion WHERE slug = 'niveles'", [], function (tx, results) {
        var len = results.rows.length;
        if (len >= 1) {
            retorno = {'niveles': results.rows.item(0).valor, 'fecha': results.rows.item(0).fecha};
        } else {

            retorno = false;
        }
    }, errorCB);

    return retorno;
}

