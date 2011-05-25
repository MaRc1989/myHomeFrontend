//Variable für aktuelles Fenster
var fenster_settings = Titanium.UI.currentWindow;
//Logovariable mit Eigenschaften (Position)
var logo = Titanium.UI.createImageView({
	image: "../images/logo.png",
	width: '59px',
	height: '59px',
	top: '10px'
});
// Logo wird dem Fenster hinzugefügt
fenster_settings.add(logo);

// Tabelle für URL
var sub_table1 = Ti.UI.createTableView({
	style:Titanium.UI.iPhone.TableViewStyle.GROUPED,
	scrollable:false,
	backgroundColor:'transparent',
	rowBackgroundColor:'white',
	top: '79px',
	height: 200
});
//Zeile die den Text 'Login URL' enthält
var sub_row1 = Ti.UI.createTableViewRow();
var sub_label1 = Ti.UI.createLabel({
	left: 9,
	text: "Login URL"
});
//Testfeld in der die URL eingegeben wird
var loginUrl = Titanium.UI.createTextField({
	height: 29,
	left:100,
	width:190,
	keyboardType:Titanium.UI.KEYBOARD_DEFAULT,
	returnKeyType:Titanium.UI.RETURNKEY_DEFAULT,
	clearButtonMode:Titanium.UI.INPUT_BUTTONMODE_ONFOCUS,
	borderStyle: Titanium.UI.INPUT_BORDERSTYLE_NONE,
	value: Titanium.App.Properties.getString('url')
});
sub_row1.add(sub_label1);
sub_row1.add(loginUrl);
sub_table1.appendRow(sub_row1);

// Ausgabe der URL
var statusLabel = Titanium.UI.createLabel({
	color: '#fff',
	top: 250,
	left: 25,
	width: '80%',
	height: 100
});
//Ausgabe feld wird dem Fenster hinzugefügt
fenster_settings.add(statusLabel);
// Button zum Speichern
var saveBtn = Titanium.UI.createButton({
	title:'Save',
	top:100,
	width:'90%',
	height:35,
	borderRadius:1
});
// Button zum Speichern wird den Fenster hinzugefügt
sub_table1.add(saveBtn);
//Tabelle mit Eingabefeld fuer URL und Speichern-Button wird dem Fenster hinzugefügt
fenster_settings.add(sub_table1);

//Eventlistener für den Speichernbutton, der die neue URL in die lokale Datenbank schreibt
saveBtn.addEventListener('click',function(e)
{
	if (loginUrl.value != '')
	{
		Titanium.API.info('New URL: ' + loginUrl.value);		
		Titanium.App.Properties.setString('url', loginUrl.value);
		
		var db2 = Titanium.Database.install("../db/myHome4.sqlite", 'myHome4');
		db2.execute("UPDATE url SET url = ? WHERE ID = 1", loginUrl.value);
		db2.close();
		
		statusLabel.text = 'Neue Login URL (' + loginUrl.value + ') gespeichert.';
	}
	else
	{
		Titanium.API.info('No New URL!');
	}
});