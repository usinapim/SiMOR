// !! Assumes variable fileURL contains a valid URL to a path on the device,
//    for example, cdvfile://localhost/persistent/path/to/downloads/

function downloadJson() {

    var options = new FileUploadOptions();

    options.fileName = "niveles.json";
    options.mimeType = "application/json";

    var fileTransfer = new FileTransfer();
    fileURL = cordova.file.dataDirectory + "niveles.json";
    var uri = encodeURI("http://fundacionpim.com.ar/simor_web_service/api/niveles.json");

    // var networkState = navigator.connection.type;
    if (!conectado) {//si no esta conectado a internet
        return false;
    }

    fileTransfer.download(
        uri,
        fileURL,
        function (entry) {
            console.log("download complete: " + entry.toURL());
            // $$('#prueba').append(" complete: " + entry.toURL());
        },
        function (error) {
            console.log("download error source " + error.source);
            $$('#prueba').append("download error source " + error.source);
            console.log("download error target " + error.target);
            $$('#prueba').append("download error target " + error.target);
            console.log("upload error code" + error.code);
            $$('#prueba').append("upload error code" + error.code);
        },
        true
        // ,
        // {
        //     headers: {
        //         "Authorization": "Basic dGVzdHVzZXJuYW1lOnRlc3RwYXNzd29yZA=="
        //     }
        // }
    );
}

function checkIfFileExists(path) {

    window.resolveLocalFileSystemURL(cordova.file.dataDirectory, function (dir) {
        // $$('#prueba').append("<br>got main dir " + dir.toString());
        dir.getFile("niveles.json", {create: false}, function (file) {
                // $$('#prueba').append("<br>got the file " + file.toString());
                // Request the metadata object for this entry
                dir.getMetadata(successMetadata, failMetadata);

            },
            fileDoesNotExist
        );
    });
}

function fileExists(fileEntry) {
    // $$('#prueba').append("File " + fileEntry.fullPath + " exists!");
    console.log("File " + fileEntry.fullPath + " exists!");
}
function fileDoesNotExist() {
    // $$('#prueba').append("file does not exist");
    console.log("file does not exist");
    downloadJson()
}


function successMetadata(metadata) {
    console.log("Last Modified: " + metadata.modificationTime);

    var ultimaFechaModificacion = metadata.modificationTime;
    ultimaFechaModificacion.setHours(0, 0, 0, 0);

    var fechaActual = new Date();
    fechaActual.setHours(0, 0, 0, 0);

    if (fechaActual > ultimaFechaModificacion) {
        // $$('#prueba').append("<br>es mayor");
        console.log("Es mayor");
        downloadJson()
    }

    var day = ultimaFechaModificacion.getDate();
    var month = ultimaFechaModificacion.getMonth() + 1;
    var year = ultimaFechaModificacion.getFullYear();
    $$('#prueba').html('Fecha de las medidas: ' + day + '/' + month + '/' + year);

}

function failMetadata(error) {
    alert(error.code);
}

