/******************************************************************************************************************************************************
/******************************************************************************************************************************************************
Copyright (c) 2013
Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), 
to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, 
and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, 
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, 
DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR 
THE USE OR OTHER DEALINGS IN THE SOFTWARE.
/*****************************************************************************************************************************************************
/************************************************************ @_juanjos_ *****************************************************************************/
var app = app || {};

$(document).on("ready", function(){

    //** n = 0 run the first query
    //** n = 1 run the second query
    //** n = 2 run the third query
    //** n = 3 run the fourth query
    n = 0;

    //SPARQL queries
    if( n == 0){
        query = 'PREFIX geo: <http://www.w3.org/2003/01/geo/wgs84_pos#>\
        PREFIX w3:  <http://www.w3.org/2000/01/rdf-schema#>\
        PREFIX georss: <http://www.georss.org/georss/>\
        PREFIX dbpedia: <http://dbpedia.org/resource/>\
        SELECT distinct ?label ?coor \
        WHERE {\
            ?res geo:geometry ?geo;\
                a dbpedia-owl:Event;\
                w3:label ?label;\
                georss:point ?coor.\
            FILTER (bif:st_intersects(?geo, bif:st_point (-4, 43.3333), 90) && lang(?label) = "en" && lang(?coor) = "en" )\
        }';

    }
    else if(n == 1){
        query = 'select ?uri ?latitud ?longitud where {\
                        ?uri a dbpedia-owl:Airport.\
                        ?uri ?d dbpedia:Cantabria;\
                            geo:lat ?latitud;\
                            geo:long ?longitud.\
                    }';
    }
    else if( n == 2){
        query = 'select distinct ?label ?pw where {\
                    ?p a dbpedia-owl:AdministrativeRegion;\
                        foaf:name ?label;\
                        dbpedia-owl:municipalityCode ?x;\
                        dbpedia-owl:areaCode "39"@es;\
                        ?link dbpedia:Cantabria.\
                    optional{?p foaf:homepage ?pw}\
                }\
                ORDER BY ASC(?label)';      
    }
    else{
        query = 'select distinct ?p ?nombre ?web where {\
                    ?c <http://es.dbpedia.org/property/nombre> "Santander"@es;\
                    dbpedia-owl:areaCode "39"@es.\
                    ?p a dbpedia-owl:Person;\
                    a dbpedia-owl:Artist;\
                    dbpedia-owl:birthPlace ?c.\
                    optional{\
                        ?p foaf:name ?nombre.\
                        ?p dbpedia-owl:wikiPageExternalLink ?web\
                    }\
                }';
    }

    //Ajax call to return data in JSON format
    $.ajax({
        //JSON with Padding ** necessary for security
        dataType: 'jsonp',
        //The data sent to the endpoint
        data: {
            query: query,
            format: 'application/sparql-results+json'
        },
        //Endpoint path
        url: 'http://dbpedia.org/sparql',
        success: function(data){
            //if it has success, the data are added to the html file
            if(n == 0)
                $("#results").append('<tr><th>Label</th><th>Coordenadas</th></tr>');
            else if(n == 1)
                $("#results").append('<tr><th>Recurso</th><th>Latitud</th><th>Longitud</th></tr>');
            else if( n == 2)
                $("#results").append('<tr><th>Label</th><th>Web</th></tr>');
            else
                $("#results").append('<tr><th>P</th><th>Nombre</th><th>Web</th></tr>');

            $(data.results.bindings).each(function(i, item){
                if(n == 0){
                    $("#results").append("\
                        <tr>\
                            <td>" + item.label.value        + " || </td>\
                            <td>" + item.coor.value  + " </td>\
                        </tr>");
                }
                else if(n == 1)
                    $("#results").append("\
                        <tr>\
                            <td>" + item.uri.value        + " || </td>\
                            <td>" + item.latitud.value  + " || </td>\
                            <td>" + item.longitud.value + " </td>\
                        </tr>");
                else if(n == 2)
                    if(item.pw !== undefined)
                        $("#results").append("\
                            <tr>\
                                <td>" + item.label.value + "  </td>\
                                <td>" + item.pw.value  + "  </td>\
                            </tr>");
                    else
                        $("#results").append("\
                            <tr>\
                                <td>" + item.label.value + "  </td>\
                                <td>  **    </td>\
                            </tr>");
                else
                    if(item.nombre !== undefined && item.web !== undefined)
                        $("#results").append("\
                            <tr>\
                                <td>" + item.p.value + " || </td>\
                                <td>" + item.nombre.value  + " || </td>\
                                <td>" + item.web.value + "  </td>\
                            </tr>");
                    else if(item.nombre === undefined && item.web === undefined)
                        $("#results").append("\
                            <tr>\
                                <td>" + item.p.value + " || </td>\
                                <td> ** </td>\
                                <td> ** </td>\
                            </tr>");
                    else if(item.nombre === undefined)
                        $("#results").append("\
                            <tr>\
                                <td>" + item.p.value + " || </td>\
                                <td> ** </td>\
                                <td>" + item.web.value + "  </td>\
                            </tr>");
                    else
                        $("#results").append("\
                            <tr>\
                                <td>" + item.p.value        + " || </td>\
                                <td>" + item.nombre.value  + " || </td>\
                                <td> ** </td>\
                            </tr>");
                            

            });
        }
    });
});

/**
JSON returned with the second query

{
    "head": {
        "link": [],
        "vars": [
            "uri",
            "latitud",
            "longitud"
        ]
    },
    "results": {
        "distinct": false,
        "ordered": true,
        "bindings": [
            {
                "uri": {
                    "type": "uri",
                    "value": "http://es.dbpedia.org/resource/Aeropuerto_de_Santander"
                },
                "latitud": {
                    "type": "typed-literal",
                    "datatype": "http://www.w3.org/2001/XMLSchema#float",
                    "value": "43.4275016784668"
                },
                "longitud": {
                    "type": "typed-literal",
                    "datatype": "http://www.w3.org/2001/XMLSchema#float",
                    "value": "-3.822222232818604"
                }
            }
        ]
    }
}

**/