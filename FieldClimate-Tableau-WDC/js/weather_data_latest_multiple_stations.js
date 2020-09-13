(function () {
    var myConnector = tableau.makeConnector();
    
    myConnector.getSchema = function(schemaCallback) {
        // Schema for weather data
        var weather_variables_url_cols = [{
            id: "date",
            dataType: tableau.dataTypeEnum.datetime
        }, {
            id: "station_id",
            alias: "Station ID",
            dataType: tableau.dataTypeEnum.string
        }, {
            id: "station_name",
            alias: "Station Name",
            dataType: tableau.dataTypeEnum.string
        }, {
            id: "solarRadiationAvg",
            alias: "Solar Radiation Average (W/m2)",
            dataType: tableau.dataTypeEnum.int
        }, {
            id: "precipitationSum",
            alias: "Precipitation Sum (mm)",
            dataType: tableau.dataTypeEnum.float
        }, {
            id: "windSpeedAvg",
            alias: "Wind Speed Avg (m/s)",
            dataType: tableau.dataTypeEnum.float
        }, {
            id: "windSpeedMax",
            alias: "Wind Speed Max (m/s)",
            dataType: tableau.dataTypeEnum.float
        }, {
            id: "airTempAvg",
            alias: "Temperature Avg (°C)",
            dataType: tableau.dataTypeEnum.float
        }, {
            id: "airTempMax",
            alias: "Temperature Max (°C)",
            dataType: tableau.dataTypeEnum.float
        }, {
            id: "airTempMin",
            alias: "Temperature Min (°C)",
            dataType: tableau.dataTypeEnum.float
        }, {
            id: "rhAvg",
            alias: "Relative Humidity Avg (%)",
            dataType: tableau.dataTypeEnum.float
        }, {
            id: "rhMax",
            alias: "Relative Humidity Max (%)",
            dataType: tableau.dataTypeEnum.float
        }, {
            id: "rhMin",
            alias: "Relative Humidity Min (%)",
            dataType: tableau.dataTypeEnum.float
        }];

        var weatherDataUrlTable = {
            id: "weather_data_Url",
            alias: "Weather Data",
            columns: weather_variables_url_cols
        };
        
        schemaCallback([weatherDataUrlTable]);
    };
    
    
    myConnector.getData = function(table, doneCallback) {
        
        var stationsJson = JSON.parse('{"stations": [{"station_id": "00002C5C","station_name": "Arandas","producing_area": "Arandas","filter_name": "Arandas"},{"station_id": "00002CDA","station_name": "Baja California, Chapala","producing_area": "San Quintin","filter_name": "Baja (Chapala)"},{"station_id": "00203866","station_name": "Baja California, Colonet","producing_area": "San Quintin","filter_name": "Baja (Colonet)"},            {"station_id": "00001BD3","station_name": "baja","producing_area": "San Quintin","filter_name": "Baja (Los Pinos)"},            {"station_id": "00002CCE","station_name": "Baja California, Muñoz","producing_area": "San Quintin","filter_name": "Baja (Muñoz)"},            {"station_id": "00002CCD","station_name": "Baja California, San Quintin","producing_area": "San Quintin","filter_name": "Baja (San Quintín)"},            {"station_id": "002037B0","station_name": "Baja California, San Vicente","producing_area": "San Quintin","filter_name": "Baja (San Vicente)"},            {"station_id": "00002C5A","station_name": "CD Guzmán","producing_area": "Ciudad Guzman","filter_name": "Ciudad Guzman (Cd. Guzman)"},            {"station_id": "00002C57","station_name": "Sayula","producing_area": "Ciudad Guzman","filter_name": "Ciudad Guzman (Sayula)"},            {"station_id": "00002C59","station_name": "Huamantla","producing_area": "Viveros","filter_name": "El Seco (Huamantla)"},            {"station_id": "00002C54","station_name": "Jocotepec","producing_area": "Jocotepec","filter_name": "Jocotepec"},            {"station_id": "00002C53","station_name": "Juanacatlán","producing_area": "Jocotepec","filter_name": "Jocotepec (Juanacatlán)"},            {"station_id": "00002C5D","station_name": "Los Reyes Loma","producing_area": "Los Reyes","filter_name": "Los Reyes (Loma)"},            {"station_id": "00002C5F","station_name": "Los Reyes Otelo","producing_area": "Los Reyes","filter_name": "Los Reyes (Otelo)"},            {"station_id": "00002C51","station_name": "Mazamitla","producing_area": "Mazamitla","filter_name": "Mazamitla"},            {"station_id": "00002C56","station_name": "Purepero","producing_area": "Purepero","filter_name": "Purepero"},            {"station_id": "00002C60","station_name": "Valles","producing_area": "Tala","filter_name": "Tala (Valles)"},            {"station_id": "00002C58","station_name": "Tangancícuaro","producing_area": "Tangancicuaro","filter_name": "Tangancicuaro"},            {"station_id": "00002C67","station_name": "Santiago","producing_area": "Tangancicuaro","filter_name": "Tangancicuaro (Santiago)"},            {"station_id": "00002C5B","station_name": "Tapalpa","producing_area": "Tapalpa","filter_name": "Tapalpa"},            {"station_id": "00203DC5","station_name": "Copándaro","producing_area": "Tupataro","filter_name": "Tupataro (Copándaro)"},            {"station_id": "00002C55","station_name": "Huiramba","producing_area": "Tupataro","filter_name": "Tupataro (Huiramba)"},            {"station_id": "00002C6A","station_name": "Zapotitan","producing_area": "Tuxcueca","filter_name": "Tuxcueca (Zapotitan)"},            {"station_id": "00002C52","station_name": "Jacona","producing_area": "Zamora","filter_name": "Zamora (Jacona)"}]}');
        
        var stations = stationsJson.stations;
        //loop stations
        
        var j = 0;
                    
        for (j = 0, leng = stations.length; j < leng; j++) {
    
                    var url = "https://api.fieldclimate.com/v1";
                                        
                    var dateObj = JSON.parse(tableau.connectionData),
                        apiRoute= "/data/normal/" + stations[j].station_id + "/" + dateObj.dataGroup + "/last/" + dateObj.timePerNr + dateObj.timePerUnit,
                        apiURI = "https://api.fieldclimate.com/v1";
                        
                    var publicKey = "a1630d3e5c38188b7c893452bd4b2f0f51aafc70d09d45a3",
                        privateKey = "5fc5f5e4b0e3318faae51c95edcbb024873f2622674788b2";
        
                    var dateStamp = (new Date()).toUTCString();
                
                    var msg = CryptoJS.enc.Utf8.parse("GET" + apiRoute + dateStamp + publicKey),
                        hash = CryptoJS.HmacSHA256(msg, CryptoJS.enc.Utf8.parse(privateKey)),
                        signature = hash.toString(CryptoJS.enc.Hex);
                            
                    $.ajax({url: apiURI+apiRoute,
                            dataType: "json",
                            headers: {'Authorization':"hmac " + publicKey + ":" + signature,
                                'Request-Date':dateStamp,
                                'Accept':"application/json"},
                            iStationId: stations[j].station_id,
                            iStationName: stations[j].filter_name,
                            success: function (data) {
                                
                                var    feat = data.data,
                                    tableData = [];
                    
                                var i = 0;
                                
                                for (i = 0, len = feat.length; i < len; i++) {
                                    tableData.push({
                                        "date": feat[i].date,
                                        "station_id": this.iStationId,
                                        "station_name": this.iStationName,
                                        "solarRadiationAvg": feat[i]["0_X_X_600_avg"],
                                        "precipitationSum": feat[i]["5_X_X_6_sum"],
                                        "windSpeedAvg": feat[i]["6_X_X_5_avg"],
                                        "windSpeedMax": feat[i]["6_X_X_5_max"],
                                        "airTempAvg": feat[i]["18_X_X_506_avg"],
                                        "airTempMax": feat[i]["18_X_X_506_max"],
                                        "airTempMin": feat[i]["18_X_X_506_min"],
                                        "rhAvg": feat[i]["19_X_X_507_avg"],
                                        "rhMax": feat[i]["19_X_X_507_max"],
                                        "rhMin": feat[i]["19_X_X_507_min"]
                                        
                                        });
                                    }
                                
                                table.appendRows(tableData);
                                
                            },
                            error: function (e) {
                                 // log error in browser
                                console.log(e.message);
                            }
                    });
            };
            doneCallback();
            // end for loop
    };
    
    tableau.registerConnector(myConnector);
    
    
    $(document).ready(function() {
        $("#submitButton").click(function() {
            var dateObj = {
                dataGroup: $('#data-group').val().trim(),
                timePerNr: $('#time_period_number').val().trim(),
                timePerUnit: $('#time_period_unit').val().trim(),
            };
    
            function isNumeric(numStr) {
                return !isNaN(numStr);
            }

            if (isNumeric(dateObj.timePerNr)) {
                tableau.connectionData = JSON.stringify(dateObj);
                tableau.connectionName = "FieldClimate Weather Station Data Feed";
                tableau.submit();
            } else {
                $('#errorMsg').html("Enter valid number. For example, 10.");
            }
        });
    });
    
    
})();