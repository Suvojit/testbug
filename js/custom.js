$(document).ready(function () {

    var sideMenuList = '';
    var navList = '';
    var subList = '';
    var currentTab = 0;
    var listItem = [];

	// GET the Navigation and side menu data from data.txt
    $.getJSON("../js/menuData.txt", function (data) {
        listItem = data;

        // form the navigation bar items
		$.each(listItem,function(m,listData){
			navList += '<li><a href="' + listData.tabURL + '">' + listData.tabName + '</a></li>'
		})

        $(".navbar-nav.myList").append(navList);

        // retrive the page name from the URL	
        var documentName = document.location.pathname.match(/[^\/]+$/)[0];
        var lowerDocumentName = documentName.toLowerCase();

        //To activate the navigation tabs based on window.location.href
        if (lowerDocumentName.search("hm_") >= 0) {
            currentTab = 0;
            $(".myList li").removeClass("active");
            $(".myList li:nth-child(1)").addClass("active");
        } else if (lowerDocumentName.search("app_") >= 0) {
            currentTab = 1;
            $(".myList li").removeClass("active");
            $(".myList li:nth-child(2)").addClass("active");
        } else if (lowerDocumentName.search("itis_") >= 0) {
            currentTab = 2;
            $(".myList li").removeClass("active");
            $(".myList li:nth-child(3)").addClass("active");
        } else if (lowerDocumentName.search("pmo_") >= 0) {
            currentTab = 3;
            $(".myList li").removeClass("active");
            $(".myList li:nth-child(4)").addClass("active");
        }

        // GET Side Menu JSON Object from JSON file    
        if (listItem[currentTab]) {
            var currentMenu = listItem[currentTab].sideMenu;
        }

        if (currentMenu) {
            $.each(currentMenu,function(n,currentMenuData) {
                var subListActive = false;
                subList = '';
				
				// form sublist if exists
                if (currentMenuData.hasOwnProperty("subMenuItem")) {					
                    var subMenuItemValue = currentMenuData.subMenuItem;
					
                    $.each(subMenuItemValue, function(p,subMenuItemData){
                        subList += '<li ';

                        if (subMenuItemData.subMenuURL == documentName) {
                            subList += 'class="active"';
                            subListActive = true;
                        }

                        subList += '><a href="' + subMenuItemData.subMenuURL + '">' + subMenuItemData.subMenuText + '</a></li>';
                    });

                    sideMenuList += '<li class="showSubmenu';

                    if (subListActive) {
                        sideMenuList += ' active activeSubMenu';
                    }
                    sideMenuList += '"><a href="#">' + currentMenuData.menuText;
                    sideMenuList += '<span class="glyphicon glyphicon-chevron-down pull-right"></span></a><ul class="ulSubItems">';

                    sideMenuList += subList;

                    sideMenuList += '</ul></li>';
                } else {
                    sideMenuList += '<li ';
                    // Apply active class to list item
                    if (currentMenuData.menuURL == documentName) {
                        sideMenuList += 'class="active"';
                    }
                    sideMenuList += '><a href="' + currentMenuData.menuURL + '">' + currentMenuData.menuText + '</a></li>';
                }
            })
        } else {
            sideMenuList = 'No Side Menu Found';
        }

        $("#sideMenuDiv .sidebarList").append(sideMenuList);
    });
	
	// Get event data for the events section
	var eventList = '';
	
	$.getJSON('../js/eventData.txt',function(eventData){
		
		$.each(eventData,function(i,row){
			eventList +=  '<li><a href="' + row.eventURL + '">' + row.eventName + '</a></li>';
		});
		
		$(".eventList").append(eventList);
	});
	
});