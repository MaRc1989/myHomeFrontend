/*
 * Definition der Parameter, die für SOAP Client notwendig sind
 *
*/

var url = Titanium.App.Properties.getString('url') + '/services?wsdl';

/**
* Suds: A Lightweight JavaScript SOAP Client
* Copyright: 2009 Kevin Whinnery (http://www.kevinwhinnery.com)
* License: http://www.apache.org/licenses/LICENSE-2.0.html
* Source: http://github.com/kwhinnery/Suds
*/
function SudsClient(_options) {
  function isBrowserEnvironment() {
    try {
      if (window && window.navigator) {
        return true;
      } else {
        return false;
      }
    } catch(e) {
      return false;
    }
  }

  function isAppceleratorTitanium() {
    try {
      if (Titanium) {
        return true;
      } else {
        return false;
      }
    } catch(e) {
      return false;
    }
  }
  
  //Funktion zur Erweiterung von Variablen (Objekten)
  function extend(original, extended) {
    for (var key in (extended || {})) {
      if (original.hasOwnProperty(key)) {
        original[key] = extended[key];
      }
    }
    return original;
  }
  
  //Prüfung ob ein Objekt ein Array ist
  function isArray(obj) {
    return Object.prototype.toString.call(obj) == '[object Array]';
  }
  
  //Holt per get eine XMLHTTPRequest Object
  function getXHR() {
  	return Titanium.Network.createHTTPClient();
  }
  
  //Aus einem String wird ein XML DOM object
  function xmlDomFromString(_xml) {
    xmlDoc = Titanium.XML.parseString(_xml);
    return xmlDoc;
  }
  
  // Konvertiert ein Javascript OBbjekt in ein XML string 
  function convertToXml(_obj, namespacePrefix) {
    var xml = '';
    if (isArray(_obj)) {
      for (var i = 0; i < _obj.length; i++) {
        xml += convertToXml(_obj[i], namespacePrefix);
      }
    } else {
   
      for (var key in _obj) {
        if (namespacePrefix && namespacePrefix.length) {
          xml += '<' + namespacePrefix + ':' + key + '>';
        } else {
          xml += '<'+key+'>';
        }
        if (isArray(_obj[key]) || (typeof _obj[key] == 'object' && _obj[key] != null)) {
          xml += convertToXml(_obj[key]);
        }
        else {
          xml += _obj[key];
        }
        if (namespacePrefix && namespacePrefix.length) {
          xml += '</' + namespacePrefix + ':' + key + '>';
        } else {
          xml += '</'+key+'>';
        }
      }
    }
    return xml;
  }
  
  // Client Konfiguration
  var config = extend({
    endpoint:'http://localhost:8888/service',
    targetNamespace: 'http://localhost:8888/service?wsdl',
    envelopeBegin: '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:fron="http://frontend.myhome.wi08e.de/"><soapenv:Header/><soapenv:Body>',
    envelopeEnd: '</soapenv:Body></soapenv:Envelope>'
  },_options);
  
  // Aufruf web service 'login', callparams (username+passwort), xml function
  this.invoke = function(_soapAction,_body,_callback) {  
	
	//Erstelle request body 
    var body = _body;
    
    //Erlaubt einen String in einen XML body einzufügen - Ansonsten wird dieser aus einem XML Objekt erzeugt.
    if (typeof body !== 'string') {
      body = '<fron:'+_soapAction+'>';
      body += convertToXml(_body);
      body += '</fron:'+_soapAction+'>';
    }
		
    var ebegin = config.envelopeBegin;
    config.envelopeBegin = ebegin.replace('PLACEHOLDER', config.targetNamespace);
    
    //Erzeugt den Soapaction header
    var soapAction = '';
    if (config.targetNamespace.lastIndexOf('/') != config.targetNamespace.length - 1) {
      soapAction = config.targetNamespace+'/'+_soapAction;
    }
    else {
      soapAction = config.targetNamespace+_soapAction;
    }
    	
    //Sende das XML document  per HTTP_Post zum service endpoint
    var xhr = getXHR();
    xhr.onload = function() {
		Titanium.API.info("onload test");
      _callback.call(this, xmlDomFromString(this.responseText));
    };
    xhr.open('POST',config.endpoint);
	xhr.setRequestHeader('Content-Type', 'text/xml;charset=UTF-8');
	xhr.setRequestHeader('SOAPAction', soapAction);
	xhr.send(config.envelopeBegin+body+config.envelopeEnd);
	Titanium.API.info(config.envelopeBegin+body+config.envelopeEnd);
  };
  
}
