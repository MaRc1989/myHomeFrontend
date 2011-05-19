Titanium.include('suds.js');

function addEventToRow(theRow,theTitle, theUrl, theCurrentWindow, theNavGroup, theRootWindow, paramValue)
{
    //theOrientationModes = (typeof theOrientationModes == 'undefined') ? Titanium.UI.PORTRAIT : theOrientationModes;
		
	theRow.addEventListener('click',function(e)
    {
        Ti.API.info("menue click event");
		var detailWindow = Ti.UI.createWindow( {
	        title : theTitle,
	        url: theUrl,
			//orientationModes: [theOrientationModes],
	        _parent: theCurrentWindow,
	        navGroup : theNavGroup,
	        rootWindow : theRootWindow,
			params: paramValue
    	});
	
	theNavGroup.open(detailWindow);
	
    });
};

function addShowModalWindow(theLight, theModalWindow){
	
	theLight.addEventListener('click',function(e)
    {
		if(theModalWindow.getVisible == false){
			theModalWindow.setVisible = true;
		} else {
			theModalWindow.setVisible = false;
		}		
	});
	
};

function info(params){
	Titanium.API.info(params);
}

var circlesarray = [];
var circlesLabelsarray = [];
var modalWindowsArray = [];
var switchArray =[];
var buttonArray = [];

function createNodes(win1, id, name, posX, posY, value, key){
	Titanium.API.info("Create Light: " + name + "(Light On/Off: " + value +")");
	
	var lightboolean;
	var farbelight;
	
	if(value == 1){
		lightboolean = true;
		farbelight = "#009900";	
	} else {
		lightboolean = false;
		farbelight = "#660000";
	}
	
	
	posX = posX * win1.navGroup.width;
	posY = posY * win1.navGroup.height;
	
	/*
	 * Licht Nodes werden als Kreise definiert und in einem Array gespeichert, um später darauf zugreifen zu können
	 */
	circlesarray[id] = Titanium.UI.createView({
		width: 20,
		height: 20,
		borderRadius: 10,
		backgroundColor: farbelight,
		top: posY - 10,
		left: posX - 10,
		zIndex: 11,
		visible: true
	});
	
	/*
	 * Beschriftung der Licht Nodes.
	 */
	circlesLabelsarray[id] = Titanium.UI.createLabel({
		text: name,
		height:'auto',
		left: posX - 30,
		top: posY - 30,
		visible: true,
		zIndex: 12
	});
			
	circlesarray[id].addEventListener('click',function(e)
    {
		var newValue;
		
		if(lightboolean == true){
			newValue = 0;
			lightboolean = false;
			
		} else {
			newValue = 1;
			lightboolean = true;
		}
		
		info("Anscheinend wird das hier ausgeführt...wieso?");
	  /*
       * SOAP Request um Licht auszumachen
       */
	  
	  /*
	   * Definiton der URL Endpoint.
	   */
	  var url = Titanium.App.Properties.getString('url') + '/services?wsdl'; 
	
	  /*
	   * Definition der Parameter, die an SOAP Schnittstelle uebergeben werden soll.
	   * userToken muss angepasst werden !!!
	   */
	  	  
	  var callparams = {
	  	userToken: Titanium.App.Properties.getString('userToken'),
		nodeId: id,
		key: key,
		value: newValue
	  };
	  /*
	   * Neues Objekt SudsClient wird erzeugt (SOAP Client).
	   */
	  var suds = new SudsClient({
		endpoint: url,
		targetNamespace: Titanium.App.Properties.getString('url')
	  });
	  
	  try {
	      	suds.invoke('setStatus', callparams, function(xmlDoc) {
		        var results = xmlDoc.documentElement.getElementsByTagName('item');
		        if (results && results.length>0) {
					for(var n = 0; n < results.length; n++){
						var result = results.item(n);
						Titanium.API.info('result: ' + result.text);
						
						var nodesID = result.getElementsByTagName('id').item(0).text;
						Titanium.API.info('nodesID: ' + nodesID);
						
						var nodesCategory = result.getElementsByTagName('category').item(0).text;
						Titanium.API.info('nodesCategory: ' + nodesCategory);
						
						var nodesManufacturer = result.getElementsByTagName('manufacturer').item(0).text;
						Titanium.API.info('nodesManufacturer: ' + nodesManufacturer);
						
						var nodesHardwareId = result.getElementsByTagName('hardwareId').item(0).text;
						Titanium.API.info('nodesHardwareId: ' + nodesHardwareId);
						
						var nodesName = result.getElementsByTagName('name').item(0).text;
						Titanium.API.info('name: ' + nodesName);
						
						var nodesType = result.getElementsByTagName('type').item(0).text;
						Titanium.API.info('nodesType: ' + nodesType);
						
						var nodesStatus = result.getElementsByTagName('status');
						for(var i = 0; i < nodesStatus.length; i++ ){
							
							var nodesStatusKey = result.getElementsByTagName('key').item(0).text;
							Titanium.API.info('nodesStatusKey : ' + nodesStatusKey);
							
							var nodesStatusValue = result.getElementsByTagName('value').item(0).text;
							Titanium.API.info('nodesStatusValue : ' + nodesStatusValue);
						
						}
						
						// Verändere die Farbe des Lichtkrieses
						updateCircle(nodesID, nodesStatusValue);
						
					}
				}else {
		            Titanium.API.info('Error: SOAP call.');
		        }
		    });
		} catch(e) {
		    Ti.API.error('Error: ' + e);
		}			
	});	
	
	win1.add(circlesarray[id]);
	win1.add(circlesLabelsarray[id]);
}

function updateCircle(id, value){
  var farbe;
  if (value == 1){
      farbe = "#009900";
    } else {
      farbe = "#660000";
    }
    circlesarray[id].backgroundColor = farbe;
}


