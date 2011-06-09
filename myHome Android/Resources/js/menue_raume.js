

Titanium.include('functions.js');
Titanium.include('suds.js');

var itemRow = [];
var itemSecondRow = [];
var sectionArray = [];
var switchArray = [];
var sliderArray = [];

var fenster_raeumemenu = Titanium.UI.currentWindow;

fenster_raeumemenu.orientationModes = [Titanium.UI.PORTRAIT];
Titanium.UI.orientation = Titanium.UI.PORTRAIT;

var logo = Titanium.UI.createImageView({
	image: "../images/logo.png",
	width: '59px',
	height: '59px',
	top: '10px'
});

fenster_raeumemenu.add(logo);

/*
 * Definiton der URL Endpoint.
 */
// var url = Titanium.App.Properties.getString('url') + '/services?wsdl'; 

/*
 * Definition der Parameter, die an SOAP Schnittstelle uebergeben werden soll.
 * userToken muss angepasst werden !!!
 */
var callparams;
var soapAction;

if(fenster_raeumemenu.params){
	callparams = {
	    userToken: Titanium.App.Properties.getString('userToken'),
		blueprintId: parseInt(fenster_raeumemenu.params, 10),
		maxHeight: 100,
		maxWidth: 100
	};
	soapAction = 'getBlueprint';
} else {
	callparams = {
	    userToken: Titanium.App.Properties.getString('userToken')
	};
	soapAction = 'getBlueprints';
}
/*
 * Neues Objekt SudsClient wird erzeugt (SOAP Client).
 */
var suds = new SudsClient({
	endpoint: url,
	targetNamespace: Titanium.App.Properties.getString('url')
});

var main_menu = Ti.UI.createTableView({
	top: 80,
	left: 0,
	scrollable:true
});

try {
    suds.invoke(soapAction, callparams, function(xmlDoc) {
        if(fenster_raeumemenu.params) {
			var results = xmlDoc.documentElement.getElementsByTagName('blueprintLinks');
	        if (results && results.length > 0) {
			
				for (var n = 0; n < results.length; n++) {
				
					var result = results.item(n);
					
					
					var nodesName = result.getElementsByTagName('name').item(0).text;
					
					var nodesID = result.getElementsByTagName('id').item(0).text;
					
					var nodesRefferingBlueprintId = result.getElementsByTagName('referringBlueprintId').item(0).text;
					
					var nodesPrimary = result.getElementsByTagName('primary').item(0).text;
					
					if (nodesPrimary == 'false') {
						itemRow[nodesID] = Ti.UI.createTableViewRow({
							left: 0,
							hasChild: true
						});
						
						var firstItemLabel = Ti.UI.createLabel({
							left: 9,
							text: nodesName
						});
						
						itemRow[nodesID].add(firstItemLabel);
						main_menu.appendRow(itemRow[nodesID]);
						
						itemRow[nodesID].addEventListener('click', function (e) {
							Titanium.API.info(nodesName);
							openWindow('menue_grundriss.js', nodesName, true);
						});
						
					}
					
				} // for(var n = 0; n < results.length; n++)
			} else {
            	Titanium.API.info('Error: SOAP call.');
        	}
		} // if(fenster_raeumemenu.params)
		else {
				var resultsA = xmlDoc.documentElement.getElementsByTagName('item');
				if (resultsA && resultsA.length > 0) {
				
					for (var i = 0; i < resultsA.length; i++) {
					
						var resultA = resultsA.item(i);
								
						var nodesName2 = resultA.getElementsByTagName('name').item(0).text;
							
						var nodesID2 = resultA.getElementsByTagName('id').item(0).text;
								
						var nodesPrimary2 = resultA.getElementsByTagName('primary').item(0).text;
								
						if (nodesPrimary2 == 'false') {
							itemRow[nodesID2] = Ti.UI.createTableViewRow({
								left: 0,
								hasChild: true
							});
									
							var firstItemLabel2 = Ti.UI.createLabel({
								left: 9,
								text: nodesName2
							});
									
							itemRow[nodesID2].add(firstItemLabel2);
							main_menu.appendRow(itemRow[nodesID2]);
						
							itemRow[nodesID2].addEventListener('click', function (e) {
								Titanium.API.info(nodesName2);
								openWindow('menue_grundriss.js', nodesName2, true);
							});
									
							
						} // for (var i = 0; i < resultsA.length; i++)
						
					} // if (resultsA && resultsA.length > 0) {			
				} else {
		            Titanium.API.info('Error: SOAP call.');
		        }
			
			}
		
						
		}); // suds.invoke			
        
		
} catch(e) {
    Ti.API.error('Error: ' + e);
}


var logoutBtn = Titanium.UI.createButton({
	title:'Logout'
});

fenster_raeumemenu.rightNavButton = logoutBtn;

logoutBtn.addEventListener('click',function(e)
{
	Ti.App.fireEvent('eventLogout');
});

fenster_raeumemenu.add(main_menu);