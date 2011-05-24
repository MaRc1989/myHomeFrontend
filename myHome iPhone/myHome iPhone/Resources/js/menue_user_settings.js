Titanium.UI.orientation = Titanium.UI.PORTRAIT;

Titanium.include('functions.js');
Titanium.include('suds.js');

var win1 = Titanium.UI.currentWindow;

win1.orientationModes = [Titanium.UI.PORTRAIT];

var main_menu = Ti.UI.createTableView({
	style:Titanium.UI.iPhone.TableViewStyle.GROUPED,
	scrollable:true,
	backgroundColor:'transparent',
	rowBackgroundColor:'white'
});

var logoutBtn = Titanium.UI.createButton({
	title:'Logout'
});

win1.rightNavButton = logoutBtn;

logoutBtn.addEventListener('click',function(e)
{
	Ti.App.fireEvent('eventLogout');
});

// Hilfsarray
var sectionArray = [];

var tableSectionPassword = Titanium.UI.createTableViewSection({
	headerTitle: 'Password',
	color: '#fff'
});

var row1 = Ti.UI.createTableViewRow();
var row1_label = Ti.UI.createLabel({
	left: 9,
	text: "Password"
});
var row1_textField = Titanium.UI.createTextField({
	height: 29,
	left:100,
	width:190,
	keyboardType:Titanium.UI.KEYBOARD_DEFAULT,
	returnKeyType:Titanium.UI.RETURNKEY_DEFAULT,
	clearButtonMode:Titanium.UI.INPUT_BUTTONMODE_ONFOCUS,
	borderStyle: Titanium.UI.INPUT_BORDERSTYLE_NONE,
	passwordMask:true,
	value: '1234'
});
row1.add(row1_label);
row1.add(row1_textField);
tableSectionPassword.add(row1);

var row2 = Ti.UI.createTableViewRow();
var row2_label = Ti.UI.createLabel({
	left: 9,
	text: "Retype"
});
var row2_textField = Titanium.UI.createTextField({
	height: 29,
	left:100,
	width:190,
	keyboardType:Titanium.UI.KEYBOARD_DEFAULT,
	returnKeyType:Titanium.UI.RETURNKEY_DEFAULT,
	clearButtonMode:Titanium.UI.INPUT_BUTTONMODE_ONFOCUS,
	borderStyle: Titanium.UI.INPUT_BORDERSTYLE_NONE,
	passwordMask:true,
	value: '1123'
});
row2.add(row2_label);
row2.add(row2_textField);
tableSectionPassword.add(row2);

sectionArray.push(tableSectionPassword);

main_menu.setData(sectionArray);

win1.add(main_menu);

var saveBtn = Titanium.UI.createButton({
	title:'Save new Password',
	width:'90%',
	height:35,
	borderRadius:1
});

win1.add(saveBtn);

saveBtn.addEventListener('click',function(e)
{
	if(row1_textField.value != '' && row2_textField.value != ''){
		if(row1_textField.value == row2_textField.value){
			var callparams = {
				    userToken: Titanium.App.Properties.getString('userToken'),
					username: Titanium.App.Properties.getString('username'),
					password: row1_textField.value
				};

			var suds = new SudsClient({
			    endpoint: url,
			    targetNamespace: Titanium.App.Properties.getString('url')
			});
			
			try {
			    suds.invoke('changePassword', callparams, function(xmlDoc) {
					var results = xmlDoc.documentElement.getElementsByTagName('changePasswordResponse');
			        if (results && results.length>0) {
						// Speichern erfolgreich
						alert("Neues Passwort gespeichert!");
					}
					else  {
						var results = xmlDoc.documentElement.getElementsByTagName('Fault');
						var result = results.item(0);
						alert(result.getElementsByTagName('faultstring').item(0).text);
					}
				});
			} catch(e) {
			  	alert(e);
				Ti.API.error('Error: ' + e);
			}
			
			
		} else {
			alert("Passwörter stimmen nicht überein!");
		}
	} else {
		alert('Bitte Passwort 2 mal eingeben!');
	}
});