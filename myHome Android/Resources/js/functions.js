// ANDROID FUNKTIONEN

// Öffnet neue Fenster, funktioniert anders als in iOS
function openWindow(url, title, anim, paramValue){

	var numberOfWindow = Ti.App.Properties.getInt('countWindow') + 1;
	Ti.App.Properties.setInt('countWindow', numberOfWindow);
	
	// Array der Fenster speichern, um sie nachher zu schließen
	var fenster_array = Titanium.App.Properties.getList('fenster_liste');
		
	if (fenster_array.ise) {
		fenster_array[fenster_array.length + 1] = url;
	} else {
		fenster_array[0] = url;
	}
	
	/*
	Titanium.API.info(fenster_array.length);
	
	Titanium.App.Properties.setList('fenster_liste', fenster_array);
	Titanium.API.info("Füge zu Liste hinzu: " + url);
	Titanium.API.info("Liste hat " + fenster_array.length + " Elemente!");
	
	/
	Titanium.API.info("Gebe Liste aus:");
	
	
	for (var i = fenster_array.length - 1; i <= 0; i--) {
		Titanium.API.info("Liste hat " + fenster_array[i] + " Elemente!");
	}
	*/
	
    var win2 = Titanium.UI.createWindow({
		title: title,
        url: url,
		backgroundImage: '../images/darkfade.jpg',
		params: paramValue
    });
	
    if (Titanium.UI.currentTab != null) {
        Titanium.UI.currentTab.open(win2,{animated:anim});
    } else {
        win2.open({animated:anim,modal:true});
    }

}

// Android Menü
var rootDir = Titanium.Filesystem.getApplicationDataDirectory();
var activity = Ti.Android.currentActivity;

activity.onCreateOptionsMenu = function(e) {
    var menu = e.menu;
	
	// Funktionen
    var menuItem = menu.add({ title: "Funktionen" });
    //menuItem.setIcon("item1.png");
    menuItem.addEventListener("click", function(e) {
        Ti.API.info("Android Menu: Funktion was clicked!");
		//openWindow(rootDir+'menue.js',"Hauptmenü",true);
    });
 };   


/*
 * Erzeugt Event für Menüeintrag
 * Neues Fenster wird in Menüstruktur geöffnet, dadurch gibt es ein "Zurück"-Button
*/
function addEventToRow(theRow, theTitle, theUrl, theCurrentWindow, paramValue)
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
	        //navGroup : theNavGroup,
	        //rootWindow : theRootWindow,
			params: paramValue
    	});
	
	//theNavGroup.open(detailWindow);
	openWindow(theUrl, theTitle, true, paramValue);
	
    });
};


/*
function addEventToRow(theRow,theTitle, theUrl, theCurrentWindow, paramValue)
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
	        //navGroup : theNavGroup,
	        ///rootWindow : theRootWindow,
			params: paramValue
    	});
	});
 };   
*/  


/*	
	// Logout
    var menuItem = menu.add({ title: "Logout" });
    //menuItem.setIcon("item1.png");
    menuItem.addEventListener("click", function(e) {
        Ti.API.info(Ti.App.Properties.getInt('countWindow') + "Android Menu: Beenden was clicked! Exit App!!!");
		for(var c=0;c<=Ti.App.Properties.getInt('countWindow');c++) {
			Ti.API.info('Int:' + c);
			win1.close();
			win2.close();
    	}
    });
	
	// Beenden
    var menuItem = menu.add({ title: "Beenden" });
    //menuItem.setIcon("item1.png");
    menuItem.addEventListener("click", function(e) {
        Ti.API.info(Ti.App.Properties.getInt('countWindow') + "Android Menu: Beenden was clicked! Exit App!!!");
		for(var c=0;c<=Ti.App.Properties.getInt('countWindow');c++) {
			Ti.API.info('Int:' + c);
			win1.close();
			win2.close();
    	}
    });
*/


//Cread Nodes => Zeigt auf dem Grundriss die Nodes an
function createNode(win1, result){
	var nodesType = result.getElementsByTagName('type').item(0).text;
	var nodesCategory = result.getElementsByTagName('category').item(0).text;
	if(nodesType == 'relais'){
		// Erstelle Lichter auf dem Grundriss
		var nodesID = result.getElementsByTagName('id').item(0).text;
		
		var nodesName = result.getElementsByTagName('name').item(0).text;
		
		var nodesX = result.getElementsByTagName('x').item(0).text;
		
		var nodesY = result.getElementsByTagName('y').item(0).text;
		
		var nodesStatus = result.getElementsByTagName('status');
		for(var i = 0; i < nodesStatus.length; i++ ){
			
			var nodesStatusKey = result.getElementsByTagName('key').item(0).text;
			
			var nodesStatusValue = result.getElementsByTagName('value').item(0).text;
		
		}
		
		createNodes(win1, nodesID, nodesName, nodesX, nodesY, nodesStatusValue, nodesStatusKey);
		
	} else if (nodesType == 'heatingonoff') {
		// Erstelle Heizungen af dem Grundriss
		var nodesName = result.getElementsByTagName('name').item(0).text;
		
		var nodesX = result.getElementsByTagName('x').item(0).text;
		
		var nodesY = result.getElementsByTagName('y').item(0).text;
		
		createHeatingOff(win1, nodesName, nodesX, nodesY);
		
	} else if (nodesCategory == 'camera') {
		// Erstelle Kameras auf dem Grundriss
		var nodesName = result.getElementsByTagName('name').item(0).text;
		
		var nodesX = result.getElementsByTagName('x').item(0).text;
		
		var nodesY = result.getElementsByTagName('y').item(0).text;
		
		var nodesID = result.getElementsByTagName('id').item(0).text;
		
		createCamera(win1, nodesName, nodesX, nodesY, nodesID);
		
	}
}



function createHeatingOff(win1, name, posX, posY){
	posX = posX * Titanium.Platform.displayCaps.platformWidth;
	posY = posY * Titanium.Platform.displayCaps.platformHeight;
	
	var imageHeating = Titanium.UI.createImageView({
		image: "../images/heating.png",
		width: '35px',
		height: '20px',
		top: posY - 10,
		left: posX - 10
	});
	
	var labelHeating = Titanium.UI.createLabel({
		text: name,
		height:'auto',
		width:'auto',
		left: 0,
		top: posY - 30,
		visible: true,
		zIndex: 12
	});
	
	labelHeating.left = posX - labelHeating.size.width/2;

	
	win1.add(imageHeating);
	//win1.add(labelHeating);
}

function createCamera(win1, name, posX, posY, nodesID){
	posX = posX * Titanium.Platform.displayCaps.platformWidth;
	posY = posY * Titanium.Platform.displayCaps.platformHeight;
	
	var imageCamera = Titanium.UI.createView({
		backgroundImage: "../images/camera.png",
		width: '24px',
		height: '18px',
		top: posY - 9,
		left: posX - 12
	});
	
	var labelCamera = Titanium.UI.createLabel({
		text: name,
		height:'auto',
		width:'auto',
		left: 0,
		top: posY - 30,
		visible: true,
		zIndex: 12
	});
	
	labelCamera.left = posX - labelCamera.size.width/2;
	
	//addEventToRow(imageCamera, name, 'menue_kamera.js', Titanium.UI.currentWindow, win1.navGroup, win1.rootWindow, nodesID);	
	
	win1.add(imageCamera);
	//win1.add(labelCamera);
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
	
	
	posX = posX * Titanium.Platform.displayCaps.platformWidth;
	posY = posY * Titanium.Platform.displayCaps.platformHeight;
	
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
		width:'auto',
		left: 0,
		top: posY - 30,
		visible: true,
		zIndex: 12
	});
	
	// Automatische Berechnung der x-Position des Labels durch die Breite des Labels
	circlesLabelsarray[id].left = posX - circlesLabelsarray[id].size.width/2;
			
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
		
		Titanium.API.info("Anscheinend wird das hier ausgeführt...wieso?");
	  /*
       * SOAP Request um Licht an-/auszumachen
       */
	  
	  /*
	   * Definiton der URL Endpoint.
	   */
	  // var url = Titanium.App.Properties.getString('url') + '/services?wsdl'; 
	
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
	//win1.add(circlesLabelsarray[id]);
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

