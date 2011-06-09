Titanium.include('js/functions.js'); // Funktionen importieren
Titanium.include('js/suds.js'); // SOAP Client

var fenster_array = new Array();
fenster_array[0] = 'fenster_loginmenu';

Titanium.App.Properties.setInt('countWindow',1);
Titanium.App.Properties.setList('fenster_liste', fenster_array);

// Datenbank zuweisen
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
var url = db.execute('SELECT * FROM url WHERE id = 1');
Titanium.App.Properties.setString('url', url.fieldByName('url'));
db.close();

// Ausgabe von URL, Name und Passwort zur Information für den USER
Titanium.API.info("Set Global URL: " + Titanium.App.Properties.getString('url'));
Titanium.API.info("Set Global Name: " + Titanium.App.Properties.getString('loginName'));
Titanium.API.info("Set Global Password: " + Titanium.App.Properties.getString('loginPassword'));

// Android-Version
var fenster_loginmenu = Titanium.UI.createWindow({  
    title:'myHome',
	exitOnClose:true
});

fenster_loginmenu.setBackgroundImage('images/darkfade.jpg');
fenster_loginmenu.open({modal:true});

fenster_loginmenu.orientationModes = [Titanium.UI.PORTRAIT];
Titanium.UI.orientation = Titanium.UI.PORTRAIT;

var logo = Titanium.UI.createImageView({
	image: "images/logo.png",
	width: '59',
	height: '59',
	top: '10'
});

fenster_loginmenu.add(logo);

/*main menu Tabelle wird erzeugt (beinhaltet später Eingabefelder für
 Benutzername und Passwort)*/
var main_menu = Ti.UI.createTableView({
	left:0,
	top: '79'
});

// first option row
var firstItemRow = Ti.UI.createTableViewRow({
});

var firstItemLabel = Ti.UI.createLabel({
	left: '9px',
	text: "Name"
});

var username = Titanium.UI.createTextField({
	height: '40px',
	left:'100px',
	width:'190px',
	keyboardType:Titanium.UI.KEYBOARD_DEFAULT,
	returnKeyType:Titanium.UI.RETURNKEY_DEFAULT,
	clearButtonMode:Titanium.UI.INPUT_BUTTONMODE_ONFOCUS,
	borderStyle: Titanium.UI.INPUT_BORDERSTYLE_NONE,
	value: Titanium.App.Properties.getString('loginName')
});

firstItemRow.add(firstItemLabel);
firstItemRow.add(username);
// füge Zeile Tabelle hinzu
main_menu.appendRow(firstItemRow);
// end first option row

// second option row
var secondItemRow = Ti.UI.createTableViewRow({});

var secondItemLabel = Ti.UI.createLabel({
	left: '9',
	text: "Passwort"
});

var password = Titanium.UI.createTextField({
	height: '40',
	left:'100',
	width:'190',
	keyboardType:Titanium.UI.KEYBOARD_DEFAULT,
	returnKeyType:Titanium.UI.RETURNKEY_DEFAULT,
	borderStyle:Titanium.UI.INPUT_BORDERSTYLE_NONE,
	clearButtonMode:Titanium.UI.INPUT_BUTTONMODE_ONFOCUS,
	passwordMask:true,
	value: Titanium.App.Properties.getString('loginPassword')
});

secondItemRow.add(secondItemLabel);
secondItemRow.add(password);
// füge Zeile Tabelle hinzu
main_menu.appendRow(secondItemRow);

// Das erzeugte Main Menü mit Eingabefeldern für Benutzername werden an das Fenster übergeben
fenster_loginmenu.add(main_menu);

var imageUrl = 'images/checkbox_unchecked.png';

if(Titanium.App.Properties.getBool('loginAuto') == true){
	imageUrl = 'images/checkbox_checked.png';
}
// Checkbox zum Speichern des Passworts
var checkbox = Titanium.UI.createImageView({
	width: '16',
	height: '16',
	image: imageUrl,
	top: '210',
	left: '30',
	text: 'Benutzername',
	title: 'Passwort'
});

var checkboxtext = Titanium.UI.createLabel({
	text: 'Name und Passwort speichern?',
	top: '203',
	left: '60',
	color: '#fff',
	height: '30'
});

fenster_loginmenu.add(checkboxtext);
fenster_loginmenu.add(checkbox);

var loginBtn = Titanium.UI.createButton({
	title:'Login',
	top:'270',
	width:'90%',
	height:'35',
	borderRadius:'1'
});
fenster_loginmenu.add(loginBtn);

// create the main menu container
var settings_menu = Ti.UI.createTableView({
	left:0,
	top: '320'
});

// first option row
var settingsRow = Ti.UI.createTableViewRow({
	hasChild: true
});

var settingsRowLabel = Ti.UI.createLabel({
	left: '9',
	text: "Settings"
});
settingsRow.add(settingsRowLabel);
// füge Zeile Tabelle hinzu
settings_menu.appendRow(settingsRow);

// fügt Fenster Einstellungs-Menüpunkt hinzu
fenster_loginmenu.add(settings_menu);

// add the event to the first item
settingsRow.addEventListener('click', function (e) {
	Titanium.API.info("Öffne Settings");
	openWindow('windows/settings.js', 'Einstellungen', true);
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
	
	var url = Titanium.App.Properties.getString('url') + '/services?wsdl'; 
	
	var callparams = {
		    username: username.value,
			password: password.value
		};
/* Im Folgenden der suds Client (SOAP Client), der die SOAP Abfragen ausführt und Werte zurück liefert. 
	Login-Vorgang und Aufruf des Hauptmenüfensters
*/	

	Titanium.API.info(Titanium.App.Properties.getString('url'));

	var suds = new SudsClient({
	    endpoint: url,
	    targetNamespace: Titanium.App.Properties.getString('url')
	});
		
	try {
	    suds.invoke('login', callparams, function(xmlDoc){
	        
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
				
				//Aufruf Hauptmenüfenster
				Titanium.API.info("Öffne Hauptmenü");
				//openWindow('windows/settings.js', 'Einstellungen', true);
				openWindow('js/menue.js', 'Hauptmenü', true);
				
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
	Titanium.App.Properties.removeProperty("username");
	Titanium.App.Properties.removeProperty("userToken");
	Titanium.App.Properties.removeProperty("isAdmin");
	Titanium.API.info("Lösche Einstellungen...");
	win2.close();
});