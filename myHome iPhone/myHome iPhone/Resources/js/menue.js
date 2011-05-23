Titanium.UI.orientation = Titanium.UI.PORTRAIT;

Titanium.include('functions.js');

//Titanium.UI.setBackgroundImage('images/darkfade.jpg');

var baseWin = Titanium.UI.currentWindow;
/* Auf dem Basis Window, Window des Login-Menüs, wird ein neues Fenster erzeugt für das Main Menu mit der Auswahl Ebenen,
Räume, Lichter, Kamera
*/
var fenster_hauptmenu = Titanium.UI.createWindow({  
    title:'Menue'
	// backgroundImage: 'images/darkfade.jpg',
});

fenster_hauptmenu.orientationModes = [Titanium.UI.PORTRAIT];

//Titanium.UI.orientation = Titanium.UI.PORTRAIT;
// Logo
var logo = Titanium.UI.createImageView({
	image: "../images/logo.png",
	width: '59px',
	height: '59px',
	top: '10px'
});

fenster_hauptmenu.add(logo);

// Menü Container, Tabelle für Auswahl Ebenen, Räume, Lichter Grundriss etc.
var main_menu = Ti.UI.createTableView({
	style:Titanium.UI.iPhone.TableViewStyle.GROUPED,
	scrollable:true,
	backgroundColor:'transparent',
	rowBackgroundColor:'white',
	top: '79px'
});

// Zeilen der Tabelle, Auswahl Ebenen, Räume, Lichter, Grundriss... etc.
var firstItemRow = Ti.UI.createTableViewRow({
	hasChild: true
});
// Textlabel "Ebenen"  in der Zeile...
var firstItemLabel = Ti.UI.createLabel({
	left: 9,
	text: "Ebenen"
});
firstItemRow.add(firstItemLabel);

main_menu.appendRow(firstItemRow);
// Ende der ersten Zeile

// Zweite Zeile ... Beschreibung siehe oben!
var secondItemRow = Ti.UI.createTableViewRow({
	hasChild: true
});

var secondItemLabel = Ti.UI.createLabel({
	left: 9,
	text: "Raeume"
});
secondItemRow.add(secondItemLabel);

main_menu.appendRow(secondItemRow);
// Ende der zweiten Zeile

// Dritte Zeile ... Beschreibung siehe oben!
var thirdItemRow = Ti.UI.createTableViewRow({
	hasChild: true
});

var thirdItemLabel = Ti.UI.createLabel({
	left: 9,
	text: "Lichter"
});
thirdItemRow.add(thirdItemLabel);

main_menu.appendRow(thirdItemRow);
// Ende der dritten Zeile

// Vierte Zeile ... Beschreibung siehe oben!
var fourthItemRow = Ti.UI.createTableViewRow({
	hasChild: true
});

var fourthItemLabel = Ti.UI.createLabel({
	left: 9,
	text: "Kameras"
});
fourthItemRow.add(fourthItemLabel);

main_menu.appendRow(fourthItemRow);
// Ende der dritten Zeile

//Informative Ausgabe von Username und UserToken
var detailLabel = Titanium.UI.createLabel({
	top: 200,
	left:20,
	color: '#fff',
	text: 'username: ' + Titanium.App.Properties.getString('username') + '\nuserToken: ' + Titanium.App.Properties.getString('userToken') + '\n'
});
//Informative Ausgabe von Userstatus, also ob Admin oder nicht. 
if(Titanium.App.Properties.getBool('isAdmin') == true){
	detailLabel.text += 'isAdmin: true \n';
} else {
	detailLabel.text += 'isAdmin: false \n';
}
main_menu.add(detailLabel);

fenster_hauptmenu.add(main_menu);

var logoutBtn = Titanium.UI.createButton({
	title:'Logout'
});

fenster_hauptmenu.rightNavButton = logoutBtn;
 
var navGroup = Ti.UI.iPhone.createNavigationGroup( {
    window : fenster_hauptmenu
});

addEventToRow(firstItemRow, 'Ebenen', 'menue_ebenen.js', Titanium.UI.currentWindow, navGroup, fenster_hauptmenu);
addEventToRow(secondItemRow, 'Räume', 'menue_raume.js', Titanium.UI.currentWindow, navGroup, fenster_hauptmenu);
addEventToRow(thirdItemRow, 'Lichter', 'menue_lichter.js', Titanium.UI.currentWindow, navGroup, fenster_hauptmenu);
addEventToRow(fourthItemRow, 'Kameras', 'menue_kameras.js', Titanium.UI.currentWindow, navGroup, fenster_hauptmenu);
 
fenster_hauptmenu.navGroup = navGroup;
baseWin.add(navGroup);


logoutBtn.addEventListener('click',function(e)
{
	Ti.App.fireEvent('eventLogout');
});