// ANDROID FUNKTIONEN

// Öffnet neue Fenster, funktioniert anders als in iOS
function openWindow(url, title, anim){

	var numberOfWindow = Ti.App.Properties.getInt('countWindow') + 1;
	Ti.App.Properties.setInt('countWindow', numberOfWindow);
	
	// Array der Fenster speichern, um sie nachher zu schließen
	var fenster_array = Titanium.App.Properties.getList('fenster_liste');
		
	if (fenster_array.ise) {
		fenster_array[fenster_array.length + 1] = url;
	} else {
		fenster_array[0] = url;
	}
	
	Titanium.API.info(fenster_array.length);
	
	Titanium.App.Properties.setList('fenster_liste', fenster_array);
	Titanium.API.info("Füge zu Liste hinzu: " + url);
	Titanium.API.info("Liste hat " + fenster_array.length + " Elemente!");
	
	Titanium.API.info("Gebe Liste aus:");
	
	for (var i = fenster_array.length - 1; i <= 0; i--) {
		Titanium.API.info("Liste hat " + fenster_array[i] + " Elemente!");
	}
	
    var win2 = Titanium.UI.createWindow({
		title: title,
        url: url,
		backgroundImage: '../images/darkfade.jpg'
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
};