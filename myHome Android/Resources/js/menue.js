Titanium.include('js/functions.js');

var fenster_hauptmenu = Titanium.UI.currentWindow;

fenster_hauptmenu.orientationModes = [Titanium.UI.PORTRAIT];

Titanium.UI.orientation = Titanium.UI.PORTRAIT;

var logo = Titanium.UI.createImageView({
	image: "images/logo.png",
	width: '59',
	height: '59',
	top: '10'
});

fenster_hauptmenu.add(logo);

// create the main menu container
var main_menu = Ti.UI.createTableView({
	left:0,
	top: '79'
});

// first option row
var firstItemRow = Ti.UI.createTableViewRow({
	hasChild: true,
	leftImage: "/images/layers_1.png"
});
var firstItemLabel = Ti.UI.createLabel({
	left: 40,
	text: "Ebenen"
});
firstItemRow.add(firstItemLabel);
main_menu.appendRow(firstItemRow);
// end first option row

// second option row
var secondItemRow = Ti.UI.createTableViewRow({
	hasChild: true,
	leftImage: "/images/box.png"
});
var secondItemLabel = Ti.UI.createLabel({
	left: 40,
	text: "Räume"
});
secondItemRow.add(secondItemLabel);
main_menu.appendRow(secondItemRow);
// end second option row

// third option row
var thirdItemRow = Ti.UI.createTableViewRow({
	hasChild: true,
	leftImage: "/images/lightbulb.png"
});
var thirdItemLabel = Ti.UI.createLabel({
	left: 40,
	text: "Lichter"
});
thirdItemRow.add(thirdItemLabel);

main_menu.appendRow(thirdItemRow);
// end third option row

/* HEIZUNGEN ERSTMAL RAUS
// fourth option row
var fourthItemRow = Ti.UI.createTableViewRow({
	hasChild: true,
	leftImage: "/images/heating.png"
});

var fourthItemLabel = Ti.UI.createLabel({
	left: 40,
	text: "Heizungen"
});

fourthItemRow.add(fourthItemLabel);*/

main_menu.appendRow(fourthItemRow);
// end fourth option row

// fourth option row
var fourthItemRow = Ti.UI.createTableViewRow({
	hasChild: true,
	leftImage: "/images/preso.png"
});
var fourthItemLabel = Ti.UI.createLabel({
	left: 40,
	text: "Kameras"
});
fourthItemRow.add(fourthItemLabel);

main_menu.appendRow(fifthItemRow);

fenster_hauptmenu.add(main_menu);

firstItemRow.addEventListener('click', function (e) {
	Titanium.API.info("Öffne Ebenen");
	openWindow('js/menue_ebenen.js', 'Ebenen', true);
});

secondItemRow.addEventListener('click', function (e) {
	Titanium.API.info("Öffne Räume");
	openWindow('js/menue_raeume.js', 'Räume', true);
});

thirdItemRow.addEventListener('click', function (e) {
	Titanium.API.info("Öffne Lichter");
	openWindow('js/menue_lichter.js', 'Lichter', true);
});

fourthItemRow.addEventListener('click', function (e) {
	Titanium.API.info("Öffne Kameras");
	openWindow('js/menue_kameras.js', 'Kameras', true);
});