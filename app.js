(function() {

  angular.module('NarrowItDownApp', [])
  .controller('NarrowItDownController',NarrowItDownController).
  directive('foundItems',foundItems).
  service("MenuSearchService",MenuSearchService);

  MenuSearchService.$project = ['$http']
  function MenuSearchService($http) {
    var service = this ;
    service.getMatchedMenuItems = function () {
      var response = $http({
        method:'GET',
        url:'https://davids-restaurant.herokuapp.com/menu_items.json'
      });
      return response;
    }
  }
  function foundItems() {
      var ddo ={
      templateUrl : 'template.html',
      scope : {
        list : '<', // one way binding //'list' is local name which is used in template
        onRemove : '&onRemove' // reference so that when calling it in directive it will still refer to parent(i.e controller)
      },
      // controller : NarrowItDownController,
      // controllerAs : 'menu',
      // bindToController : 'true'
    };
    return ddo;
  }

  NarrowItDownController.$project =['MenuSearchService'];
  function NarrowItDownController(MenuSearchService) {
    var menu = this;

    //menu.search_str="";
    menu.search = function (str) {
      menu.list = [];
      menu.found_list=[];
      console.log("in search");
      console.log(menu.search_str);
      var promise=MenuSearchService.getMatchedMenuItems();
      promise.then(function (response) {
        menu.list = response.data.menu_items;
        for(var i=0;i<menu.list.length;i++)
        {
          var item = menu.list[i];
          if(menu.search_str.length > 0 && item.description.toLowerCase().includes(menu.search_str.toLowerCase()))
          {
            menu.found_list.push(item);
          }
        }
      }).catch(function (error) {
        console.log("Page not found !!");
      });
    }
    menu.remove = function (index) {
      console.log("in remove");
      menu.found_list.splice(index,1);
    }

  }

}());
