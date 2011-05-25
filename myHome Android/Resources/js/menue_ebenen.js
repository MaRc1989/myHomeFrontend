Titanium.include('functions.js');
Titanium.include('suds.js');

// Hilfsarray um Ebenen aus SOAP Call zu speichern
var ebenenArray = [];
var sectionArray = [];
var itemRowArray = [];
var itemLabelArray = [];
var ebenen = [];

/*
 * Definiton der URL Endpoint.
 */
var url = Titanium.App.Properties.getString('url') + '/services?wsdl'; 

/*
 * Definition der Parameter, die an SOAP Schnittstelle uebergeben werden soll.
 * userToken muss angepasst werden !!!
 */	
var callparams = {
    userToken: '1234'
};
/*
 * Neues Objekt SudsClient wird erzeugt (SOAP Client).
 */
var suds = new SudsClient({
	endpoint: url,
	targetNamespace: Titanium.App.Properties.getString('url')
});

var fenster_ebenenmenu = Titanium.UI.currentWindow;

fenster_ebenenmenu.orientationModes = [Titanium.UI.PORTRAIT];

Titanium.UI.orientation = Titanium.UI.PORTRAIT;

var logo = Titanium.UI.createImageView({
	image: "../images/logo.png",
	width: '59px',
	height: '59px',
	top: '10px'
});

fenster_ebenenmenu.add(logo);

try {
    suds.invoke('getBlueprints', callparams, function(xmlDoc) {
        var results = xmlDoc.documentElement.getElementsByTagName('item');
        if (results && results.length>0) {
            
			for(var n = 0; n < results.length; n++){
				
				var result = results.item(n);
				Titanium.API.info('result: ' + result.text);
							
				var ebenenName = result.getElementsByTagName('name').item(0).text;
				info('name: ' + ebenenName);
				
				var ebenenID = result.getElementsByTagName('id').item(0).text;
				info('ID: ' + ebenenID);
								
				var ebenenPrimary = result.getElementsByTagName('primary').item(0).text;
				info('primary: ' + ebenenPrimary);
				
				if(ebenenPrimary == 'true'){
					
					ebenen[ebenenID] = Titanium.UI.createTableViewSection({
						headerTitle: ebenenName,
						color: '#fff'
					});
					
					var itemRow1 = Ti.UI.createTableViewRow({
						hasChild: true
					});
				
					var itemLabel1 = Ti.UI.createLabel({
						left: 9,
						text: "Grundriss"
					});
					
					var itemRow2 = Ti.UI.createTableViewRow({
						hasChild: true
					});
				
					var itemLabel2 = Ti.UI.createLabel({
						left: 9,
						text: "Räume"
					});
					
					var itemRow3 = Ti.UI.createTableViewRow({
						hasChild: true
					});
				
					var itemLabel3 = Ti.UI.createLabel({
						left: 9,
						text: "Lichter"
					});
					
					var itemRow4 = Ti.UI.createTableViewRow({
						hasChild: true
					});
				
					var itemLabel4 = Ti.UI.createLabel({
						left: 9,
						text: "Kameras"
					});
										
					itemRow1.add(itemLabel1);
					itemRow2.add(itemLabel2);
					itemRow3.add(itemLabel3);
					itemRow4.add(itemLabel4);
					
					addEventToRow(itemRow1, ebenenName, 'menue_grundriss.js', Titanium.UI.currentWindow, fenster_ebenenmenu.rootWindow, ebenenID);
					addEventToRow(itemRow2, ebenenName, 'menue_raume.js', Titanium.UI.currentWindow, fenster_ebenenmenu.rootWindow, ebenenID);
					addEventToRow(itemRow3, ebenenName, 'menue_lichter.js', Titanium.UI.currentWindow, fenster_ebenenmenu.rootWindow, ebenenID);
					addEventToRow(itemRow4, ebenenName, 'menue_kameras.js', Titanium.UI.currentWindow, fenster_ebenenmenu.rootWindow, ebenenID);
					
					ebenen[ebenenID].add(itemRow1);
					ebenen[ebenenID].add(itemRow2);
					ebenen[ebenenID].add(itemRow3);
					ebenen[ebenenID].add(itemRow4);
												
					
					ebenenArray.push(ebenen[ebenenID]);
					
				} 						
				
											
			}
			
			// create the main menu container
								
			main_menu.setData(ebenenArray);
								
			fenster_ebenenmenu.add(main_menu);
			
        } else {
            Titanium.API.info('Error: SOAP call.');
        }
    });
} catch(e) {
    Ti.API.error('Error: ' + e);
}