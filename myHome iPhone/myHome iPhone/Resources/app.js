Titanium.include('js/suds.js'); //Soap Cleint wird eingebunden

// Lokale SQLLite Datenbank wird installiert, wird nur ausgeführt sofern DB noch nicht vorhanden
var db = Titanium.Database.install("db/myHome4.sqlite", 'myHome4');
// Userdaten werden aus der Lokalen DB ausgelesen
var dbLogin = db.execute('SELECT * FROM login WHERE id = 1');
Titanium.App.Properties.setString('loginName', dbLogin.fieldByName('name'));
Titanium.App.Properties.setString('loginPassword', dbLogin.fieldByName('password'));

//Ist kein Loginname in der Datenbank oder eingegeben wird das Speichern des Passworts auf "false" gesetzt
if(dbLogin.fieldByName('name') == ""){
	Titanium.App.Properties.setBool('loginAuto', false);
} else {
	Titanium.App.Properties.setBool('loginAuto', true);	
}

//URL zum Backend aus Datenbank ausgelesen in die Variable url gespeichert
var DBurl = db.execute('SELECT * FROM url WHERE id = 1');
Titanium.App.Properties.setString('url', DBurl.fieldByName('url'));
db.close();

// Ausgabe von URL, Name und Passwort zur Information für den USER
Titanium.API.info("Set Global URL: " + Titanium.App.Properties.getString('url'));
Titanium.API.info("Set Global Name: " + Titanium.App.Properties.getString('loginName'));
Titanium.API.info("Set Global Password: " + Titanium.App.Properties.getString('loginPassword'));

//Hintergrund (gültig für alle neu erzeugten Fenster
Titanium.UI.setBackgroundImage('images/darkfade.jpg');

// TabGroup wird erzeugt
var tabGroup = Titanium.UI.createTabGroup();

var fenster_loginmenu = Titanium.UI.createWindow({  
    title:'myHome',
	tabBarHidden:true,
	navBarHidden: true
});

var tab1 = Titanium.UI.createTab({
	title:'myHome',
	window:fenster_loginmenu
});

// Menüs nur im Porträt Modus anzeigen
fenster_loginmenu.orientationModes = [Titanium.UI.PORTRAIT];

// Logo
var logo = Titanium.UI.createImageView({
	image: "images/logo.png",
	width: '59px',
	height: '59px',
	top: '10px'
});

fenster_loginmenu.add(logo);

/*main menu container (Tabelle) wird erzeugt (beinhaltet später Eingabefelder für
 Benutzername und Passwort)*/
var main_menu = Ti.UI.createTableView({
	style:Titanium.UI.iPhone.TableViewStyle.GROUPED,
	scrollable:false,
	backgroundColor:'transparent',
	rowBackgroundColor:'white',
	top: '79px'
});

// Erste Zeile der Tabelle (Feld Name), Eingabefeld Benutzername
var firstItemRow = Ti.UI.createTableViewRow({});

var firstItemLabel = Ti.UI.createLabel({
	left: 9,
	text: "Name"
});

var username = Titanium.UI.createTextField({
	height: 29,
	left:100,
	width:190,
	keyboardType:Titanium.UI.KEYBOARD_DEFAULT,
	returnKeyType:Titanium.UI.RETURNKEY_DEFAULT,
	clearButtonMode:Titanium.UI.INPUT_BUTTONMODE_ONFOCUS,
	borderStyle: Titanium.UI.INPUT_BORDERSTYLE_NONE,
	value: Titanium.App.Properties.getString('loginName')
});

firstItemRow.add(firstItemLabel);
firstItemRow.add(username);

main_menu.appendRow(firstItemRow);
// Ende erste Zeile

// Zweite Zeile, Passwortfeld
var secondItemRow = Ti.UI.createTableViewRow({});

var secondItemLabel = Ti.UI.createLabel({
	left: 9,
	text: "Passwort"
});

var password = Titanium.UI.createTextField({
	height: 29,
	left:100,
	width:190,
	keyboardType:Titanium.UI.KEYBOARD_DEFAULT,
	returnKeyType:Titanium.UI.RETURNKEY_DEFAULT,
	borderStyle:Titanium.UI.INPUT_BORDERSTYLE_NONE,
	clearButtonMode:Titanium.UI.INPUT_BUTTONMODE_ONFOCUS,
	passwordMask:true,
	value: Titanium.App.Properties.getString('loginPassword')
});

secondItemRow.add(secondItemLabel);
secondItemRow.add(password);

main_menu.appendRow(secondItemRow);
//Ende Zweite Zeile

// Das erzeugte Main Menü mit Eingabefeldern für Benutzername werden an das Fenster übergeben
fenster_loginmenu.add(main_menu);

var imageUrl = 'images/checkbox_unchecked.png';

if(Titanium.App.Properties.getBool('loginAuto') == true){
	imageUrl = 'images/checkbox_checked.png';
}
// Checkbox zum Speichern des Passworts
var checkbox = Titanium.UI.createImageView({
	width: '16px',
	height: '16px',
	image: imageUrl,
	top: 210,
	left: 20,
	text: 'Benutzername',
	title: 'Passwort'
});

var checkboxtext = Titanium.UI.createLabel({
	text: 'Name und Passwort speichern?',
	top: 203,
	left: 50,
	color: '#fff',
	height: 30
});

fenster_loginmenu.add(checkboxtext);
fenster_loginmenu.add(checkbox);

var loginBtn = Titanium.UI.createButton({
	title:'Login',
	top:270,
	width:'90%',
	height:35,
	borderRadius:1
});
fenster_loginmenu.add(loginBtn);

// Settings-Menübutton wird erzeugt
var settings_menu = Ti.UI.createTableView({
	style:Titanium.UI.iPhone.TableViewStyle.GROUPED,
	scrollable:false,
	backgroundColor:'transparent',
	rowBackgroundColor:'white',
	top: 320
});

// Erste Zeile der Tabelle in der der Settingsbuttons sich befindet
var settingsRow = Ti.UI.createTableViewRow({
	hasChild: true
});

var settingsRowLabel = Ti.UI.createLabel({
	left: 9,
	text: "Settings"
});
settingsRow.add(settingsRowLabel);

settings_menu.appendRow(settingsRow);

fenster_loginmenu.add(settings_menu);

// Tabs werden hinzugefügt
tabGroup.addTab(tab1); 

// Tab Group wird geöffnet
tabGroup.open();

// Settings Window wird erzeugt
var fenster_settings = Ti.UI.createWindow({title:'Settings', navBarHidden: false, url: 'js/settings.js'});

//Menu Window = Fenster Hauptmenü
var fenster_hauptmenu = Titanium.UI.createWindow({});

// Settingsbutton bekommt Eventlistener, der bei Klick das Settingsfenster öffnet.
settingsRow.addEventListener('click', function (e) {
	Titanium.API.info("Oeffne Settings");
	tab1.open(fenster_settings);
});

// Checkbox bekommt Eventlistener, der Angibt ob das Passwort gespeichert werden soll.
checkbox.addEventListener('click', function(e) {
	if(Titanium.App.Properties.getBool('loginAuto') == true){
		imageUrl = 'images/checkbox_unchecked.png';
		Titanium.App.Properties.setBool('loginAuto', false);
		Titanium.API.info('Setze loginAuto = false');
	} else if(Titanium.App.Properties.getBool('loginAuto') == false){
		imageUrl = 'images/checkbox_checked.png';
		Titanium.App.Properties.setBool('loginAuto', true);
		Titanium.API.info('Setze loginAuto = true');
	}
	checkbox.image = imageUrl;	
});

// Loginbutton bekommt Eventlistener, der bei Klick den Login durchführt.
loginBtn.addEventListener('click', function(e) {
	// Datenbank wird erneut initialisiert, falls noch nicht vorhanden
	var db_userdata = Titanium.Database.install("db/myHome4.sqlite", 'myHome4');
// Für den Fall das Benutzername und Passwort gespeichert werden sollen, werden sie hier in die DB geschrieben.
	if(Titanium.App.Properties.getBool('loginAuto') == true){
		Titanium.API.info('Speichere Name und Password in der Datenbank.');
		
		db_userdata.execute("DELETE FROM login");
		db_userdata.execute("INSERT INTO login (id, name, password) VALUES (1, ?, ?)", username.value, password.value);
		Titanium.App.Properties.setString('loginName', username.value);
		Titanium.App.Properties.setString('loginPassword', password.value);
		
	} else {
		db_userdata.execute("DELETE FROM login");
	}
	db_userdata.close();
	
	// var url = Titanium.App.Properties.getString('url') + '/services?wsdl'; 
	
	var callparams = {
		    username: username.value,
			password: password.value
		};
/* Im Folgenden der suds Client (SOAP Client), der die SOAP Abfragen ausführt und Werte zurück liefert. 
	Login-Vorgang und Aufruf des Hauptmenüfensters
*/	
	// URL wird für den Login abgefragt; muss hier gesetzt werden, damit die neu gespeicherte URL abgefragt wird
	var url = Titanium.App.Properties.getString('url') + '/services?wsdl';
	
	var suds = new SudsClient({
	    endpoint: url,
	    targetNamespace: Titanium.App.Properties.getString('url')
	});
	
	try {
	    suds.invoke('login', callparams, function(xmlDoc) {
	        
			var results = xmlDoc.documentElement.getElementsByTagName('return');
	        
	        if (results && results.length>0) {
	            
				var isAdmin = results.item(0).getElementsByTagName('admin');
				if(isAdmin.item(0).text == "true") {
					Titanium.API.info("isAdmin: true");
					Titanium.App.Properties.setBool('isAdmin', true);
				} else {
					Titanium.API.info("isAdmin: false");
					Titanium.App.Properties.setBool('isAdmin', false);
				}
								
				var userToken = results.item(0).getElementsByTagName('userToken');
				Titanium.API.info("userToken: " + userToken.item(0).text);
				Titanium.App.Properties.setString('userToken', userToken.item(0).text); 
				
				Titanium.App.Properties.setString('username', username.value);
				
				//Rein oder raus???
				//alert("Login erfolgreich! \n isAdmin: " + isAdmin.item(0).text + " \n userToken: " + userToken.item(0).text)
				
				// Parameter für das Fenster des Hauptmenüs 
				fenster_hauptmenu.title			=	'Base Menu';
				fenster_hauptmenu.url 			=	'js/menue.js';
				fenster_hauptmenu.tabBarHidden	=	true;
				fenster_hauptmenu.navBarHidden	=	true;
				fenster_hauptmenu.orientationModes= 	[Titanium.UI.PORTRAIT];				
				
				tabGroup.close();
				//mainTabGroup.open();
				fenster_hauptmenu.open();//Aufruf Hauptmenüfenster
				
							
	        } else {
	            	var resultsError = xmlDoc.documentElement.getElementsByTagName('S:Fault');
					var errorString = resultsError.item(0).getElementsByTagName('faultstring');
					Titanium.API.info("error: " + errorString.item(0).text);
					alert(errorString.item(0).text);
		        }
		        
		    });
	} catch(e) {
	    alert(e);
		Ti.API.error('Error: ' + e);
	}
});

/* Eventlistener für den Logout-Button, bei Klick wird das Menüfenster geschlossen und die Variablen username, userToken und is
 isadmin gelöscht
 */

Ti.App.addEventListener('eventLogout', function(event)
{
	var callparams = {
		    userToken: Titanium.App.Properties.getString('userToken')
		};
		
	// URL wird für den Login abgefragt; muss hier gesetzt werden, damit die neu gespeicherte URL abgefragt wird
	var url = Titanium.App.Properties.getString('url') + '/services?wsdl';
	
	var suds = new SudsClient({
	    endpoint: url,
	    targetNamespace: Titanium.App.Properties.getString('url')
	});
	
	try {
	    suds.invoke('logout', callparams, function(xmlDoc) {
			var results = xmlDoc.documentElement.getElementsByTagName('logoutResponse');
	        if (results && results.length>0) {
				// Logou erfolgreich
				Titanium.App.Properties.removeProperty("username");
				Titanium.App.Properties.removeProperty("userToken");
				Titanium.App.Properties.removeProperty("isAdmin");
				Titanium.API.info("Loesche Properties...");
				fenster_hauptmenu.close();
				tabGroup.open();
			}
			else  {
				alert("Fehler beim Logout!");
			}
		});
	} catch(e) {
	  	alert(e);
		Ti.API.error('Error: ' + e);
	}	
});