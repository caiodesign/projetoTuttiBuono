var app=angular.module("app",["ui.router"]),createRoute=function(e,r,l,t,o){return console.log("criou rota"),{url:"/"+e,views:{header:{templateUrl:"../views/"+r+".html",controller:o},main:{templateUrl:"../views/"+t+".html",controller:o},footer:{templateUrl:"../views/"+l+".html"}}}};