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
        function parseDate(input) {
          var parts = input.match(/(\d+)/g);
          // new Date(year, month [, date [, hours[, minutes[, seconds[, ms]]]]])
          return new Date(parts[0], parts[1]-1, parts[2]); // months are 0-based
        }


        
        //read json file
        //loop stations
        $.ajax({
            type : 'GET',
            dataType : 'json',
            url: '/json/weather_stations_mx.json',
            success : function(sdata) {
                var stations = sdata.stations;
                //console.log(stations);
                var j = 0;
                
                for (j = 0, leng = stations.length; j < leng; j++) {
                    //console.log(stations[j].station_id);
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
                            
                        $.ajax({
                            url: apiURI+apiRoute,
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
            }
            doneCallback();
            //end for loop
            },
            error: function (e) {
                // log error in browser
                console.log(e.message);
                }
            });
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