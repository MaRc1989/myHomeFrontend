Titanium.include('functions.js');
Titanium.include('suds.js');

Titanium.UI.orientation = Titanium.UI.LANDSCAPE_RIGHT;
Titanium.App.Properties.setBool('licht', false);

var win1 = Titanium.UI.currentWindow;

win1.orientationModes = [Titanium.UI.LANDSCAPE_RIGHT];
 
/*
/var logoutBtn = Titanium.UI.createButton({
	title:'Logout'
});


win1.rightNavButton = logoutBtn;
*/

/*
 * HilfArrays
 */
var blueprintLinksArray = [];
var blueprintLinksLabelsArray = [];


/*
 * Definiton der URL Endpoint.
 */
// var url = Titanium.App.Properties.getString('url') + '/services?wsdl'; 

/*
 * Definition der Parameter, die an SOAP Schnittstelle uebergeben werden soll.
 * Höhe und Breite wird an Server übergeben, entsprechend wird das Bild zurückgegeben
 */
var callparams = {
    userToken: Titanium.App.Properties.getString('userToken'),
	
	blueprintId: parseInt(win1.params, 10),
	//blueprintId: parseInt(2),
	
	//maxHeight: win1.navGroup.height,
	maxHeight: Titanium.Platform.displayCaps.platformHeight,
	//maxHeight: 480,
	
	//maxWidth: win1.navGroup.width
	maxWidth: Titanium.Platform.displayCaps.platformWidth
	//maxWidth: 800
};

Titanium.API.info("Blueprint ID 1: " + parseInt(win1.params, 10));
Titanium.API.info('Height: ' + Titanium.Platform.displayCaps.platformHeight);
Titanium.API.info('With: ' + Titanium.Platform.displayCaps.platformWidth);

/*
 * Neues Objekt SudsClient wird erzeugt (SOAP Client).
 */
var suds = new SudsClient({
	endpoint: url,
	targetNamespace: Titanium.App.Properties.getString('url')
});

try {
	Titanium.API.info('Sending SOAP Query');
    suds.invoke('getBlueprint', callparams, function(xmlDoc) {
        
        Titanium.API.info('Retrieving SOAP Answer');
        var results = xmlDoc.documentElement.getElementsByTagName('return');
        
        Titanium.API.info('results: ' + results.length);
        if (results && results.length>0) {
            
			for(var n = 0; n < results.length; n++){
				
				var result = results.item(n);
				Titanium.API.info('result: ' + result.text);
							
				var ebenenName = result.getElementsByTagName('name').item(0).text;
				Titanium.API.info('name: ' + ebenenName);
				
				var ebenenID = result.getElementsByTagName('id').item(0).text;
				Titanium.API.info('ID: ' + ebenenID);
				
				var image = result.getElementsByTagName('image').item(0).text;
				Titanium.API.info('image: ' + image);
								
				var imagewrite = Titanium.Filesystem.getFile(Titanium.Filesystem.applicationDataDirectory, 'grundriss.png');
                var imageDecode = Titanium.Utils.base64decode(image);
				imagewrite.write( imageDecode );
				Titanium.API.info("Writing image: " + imagewrite.nativePath);
				
								
				win1.backgroundImage = imagewrite.nativePath;	 
							
			}
			
			var results2 = xmlDoc.documentElement.getElementsByTagName('blueprintLinks');
			
			Titanium.API.info('results2: ' + results2.length);
			if (results2 && results2.length>0) {
				for(var m = 0; m < results2.length; m++){
					var result2 = results2.item(m);
					
					var blueprintLinksID = result2.getElementsByTagName('id').item(0).text;
					Titanium.API.info("blueprintsLinksID: " + blueprintLinksID);
					
					var blueprintLinksName = result2.getElementsByTagName('name').item(0).text;
					Titanium.API.info("blueprintsLinksName: " + blueprintLinksName);
					
					var blueprintLinksReferringBlueprintId = result2.getElementsByTagName('referringBlueprintId').item(0).text;
					Titanium.API.info("blueprintLinksReferringBlueprintId: " + blueprintLinksReferringBlueprintId);
					
					var blueprintLinksX = result2.getElementsByTagName('x').item(0).text;
					Titanium.API.info("blueprintsLinksX: " + blueprintLinksX);
					
					var blueprintLinksY = result2.getElementsByTagName('y').item(0).text;
					Titanium.API.info("blueprintsLinksY: " + blueprintLinksY);
					
					//var posX = blueprintLinksX * 480;
					var posX = blueprintLinksY * Titanium.Platform.displayCaps.platformWidth;
					Titanium.API.info("posX: " + posX);
					//var posY = blueprintLinksY * 800;
					var posY = blueprintLinksY * Titanium.Platform.displayCaps.platformHeight;
					Titanium.API.info("posY: " + posY);
					
					blueprintLinksArray[m] = Titanium.UI.createView({
						width: 20,
						height: 20,
						borderRadius: 5,
						backgroundColor: "#000",
						top: posY - 10,
						left: posX - 10,
						zIndex: 11,
						visible: true
					});
					
					blueprintLinksLabelsArray[m] = Titanium.UI.createLabel({
						text: blueprintLinksName,
						height:'auto',
						left: posX - 30,
						top: posY - 30,
						visible: true,
						zIndex: 12
					});
					
					// Unnötig, weil keine Verlinkung der Ebenen untereinander
					// win1.add(blueprintLinksArray[m]);
					// win1.add(blueprintLinksLabelsArray[m]);
					
				}
			} else {
				Titanium.API.info("Keine dazugehöirgen Blueprints gefunden!");
			}
			
			
        } else {
            Titanium.API.info('Error: SOAP call.');
        }
    });
} catch(e) {
    Titanium.API.error('Error: ' + e);
}
Titanium.API.info('TEST');

/*
 * Parameter für die Abfrage der Lichter (Nodes) für einen Grundriss
*/
var callparamsNodes = {
    userToken: Titanium.App.Properties.getString('userToken'),
	blueprintId: parseInt(win1.params, 10),
	//blueprintId: parseInt(win1.params, 10)
};
/*
 * Neues Objekt SudsClient wird erzeugt (SOAP Client).
 */
var sudsNode = new SudsClient({
	endpoint: url,
	targetNamespace: Titanium.App.Properties.getString('url')
});


Titanium.API.info('Sending second SOAP Query');
try {
    sudsNode.invoke('getNodesByBlueprint', callparamsNodes, function(xmlDoc) {
        var results = xmlDoc.documentElement.getElementsByTagName('item');
        if (results && results.length>0) {
            
			for(var n = 0; n < results.length; n++){
				
				var result = results.item(n);
				// Titanium.API.info('result: ' + result.text);
				/*			
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
				
				var nodesX = result.getElementsByTagName('x').item(0).text;
				Titanium.API.info('nodesX: ' + nodesX);
				
				var nodesY = result.getElementsByTagName('y').item(0).text;
				Titanium.API.info('nodesY: ' + nodesY);	
				
				
				var nodesStatus = result.getElementsByTagName('status');
				for(var i = 0; i < nodesStatus.length; i++ ){
					
					var nodesStatusKey = result.getElementsByTagName('key').item(0).text;
					Titanium.API.info('nodesStatusKey : ' + nodesStatusKey);
					
					var nodesStatusValue = result.getElementsByTagName('value').item(0).text;
					Titanium.API.info('nodesStatusValue : ' + nodesStatusValue);
				
				}
					
				createNodes(win1, nodesID, nodesName, nodesX, nodesY, nodesStatusValue, nodesStatusKey)
				*/
				
				createNode(win1, result);
											
			}
			
			
        } else {
            Titanium.API.info('Error: SOAP call.');
        }
    });
} catch(e) {
    Titanium.API.error('Error: ' + e);
}

/*
// Logout-Button
win1.rightNavButton = logoutBtn;

logoutBtn.addEventListener('click',function(e)
{
	Ti.App.fireEvent('eventLogout');
});
*/

