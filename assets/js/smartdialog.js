/* smartdialog.js v1.1 */
/* (C)Takekatsu Hiramura ( http://thira.plavox.info/ ) */
/* Licensed under Creative Commons Attribution 2.1 Japan ( http://creativecommons.org/licenses/by/2.1/jp/ ) */
/* Licensed under MIT License http://www.opensource.org/licenses/mit-license.php */

/*
How to use
--
sdlog.show('message1')
sdlog.show('message2',null,{width:'350',height:'200'})
sdlog.show('message3',{opacity:'0.5',duration:'1.0',backgroundColor:'#fff',clickHideDisabled:1},{top:'20%',left:'20%',width:'350',height:'200'})
--
parameter #1: messages

parameter #2: options for overlay  *ex=default
 -opacity('0.0'-'1.0' ex:'0.7')
 -duration(ex:'1.0')
 -backgroundColor(ex:'#fff')
 -noClickHide('0'or'1' default:'0')

parameter #3: options for dialog
 -top(ex:'40%')
 -left(ex:'50%')
 -width(ex:'300')
 -height(ex:'150')
 -TextAlign(ex:'center')
 -padding(ex:'5')
 -border(ex:'2px solid #666')
 -backgroundColor(ex:'#fff')
 -noHideButton('0'or'1' default:'0')
 -nameHideButton(default:'close')
--

*/


var sdlog = Class.create();

sdlog.prototype={
 initialize:function(){
  var objBody = document.getElementsByTagName("body").item(0);
  
  /* append Overlay*/
  var objOverlay = document.createElement("div");
  objOverlay.setAttribute('id','SOverlay');
  objOverlay.style.display='none';
  document.body.appendChild(objOverlay);
  new Effect.Opacity('SOverlay',{from:0.0,to:0.0,duration:0});
  
  /* append Dialog*/
  var objDialog = document.createElement("div");
  objDialog.setAttribute('id','SDialog');
  document.body.appendChild(objDialog);
  
  /* append DialogString*/
  var objDialogString = document.createElement("div");
  objDialogString.setAttribute('id','SDialogString');
  objDialog.appendChild(objDialogString);
  
  /* append DialogButton*/
  var objDialogButton = document.createElement("div");
  objDialogButton.setAttribute('id','SDialogButton');
  objDialog.appendChild(objDialogButton);
 },
 
 show:function(msg,overlayOptions,dialogOptions){
  /* null options set */
  overlayOptions=overlayOptions || {};
  dialogOptions=dialogOptions || {};
  
  /* options set */
  overlayOptions.duration = (overlayOptions.duration!=null) ? overlayOptions.duration : '1';
  overlayOptions.opacity = (overlayOptions.opacity!=null) ? overlayOptions.opacity : '0.7';
  dialogOptions.nameHideButton = (dialogOptions.nameHideButton!=null) ? dialogOptions.nameHideButton : 'close';
  dialogOptions.duration = overlayOptions.duration;
  
  /* set overlay/dialog */
  this.setOverlay(overlayOptions);
  this.setDialog(msg,dialogOptions);
  
 },
 
 setOverlay:function(options){
  var arrayPageSize=getPageSize();
  $("SOverlay").style.position='absolute';
  $("SOverlay").style.top='0px';
  $("SOverlay").style.left='0px';
  $("SOverlay").style.width=arrayPageSize[0]+'px';
  $("SOverlay").style.height=arrayPageSize[1]+'px';
  $('SOverlay').style.backgroundColor = (options.backgroundColor!=null) ? options.backgroundColor :"#fff";
  $('SOverlay').style.zIndex="10";
  $('SOverlay').style.display = "block";
  if(options.noClickHide!='1') {
   $('SOverlay').onclick = function(){ sdlog.hide(options.duration); }
  }
  else{ $('SOverlay').onclick = function(){} }
  
  new Effect.Opacity('SOverlay',{from:0.0,to:options.opacity,duration:options.duration});
 },
 
 setDialog:function(msg,options){
  $('SDialog').style.border = (options.border!=null) ? options.border : '2px solid #666';
  $("SDialog").style.position='absolute';
  $('SDialog').style.top = (options.top!=null) ? options.top :"40%";
  $('SDialog').style.left = (options.left!=null) ? options.left : "50%";
  $('SDialog').style.marginLeft = (options.width!=null) ? options.width/-2+'px' : "-150px";
  $('SDialog').style.marginTop = (options.height!=null) ? options.height/-2+'px' :"-50px";
  $('SDialog').style.padding = (options.padding!=null) ? options.padding+'px' :"5px";
  $('SDialog').style.backgroundColor = (options.backgroundColor!=null) ? options.backgroundColor :"#fff";
  $('SDialog').style.zIndex="90";
  $('SDialog').style.display = "block";
  $('SDialogString').style.width = (options.width!=null) ? options.width+'px' :"300px";
  $('SDialogString').style.height = (options.height!=null) ? options.height+'px' : "100px";
  $('SDialogString').style.textAlign = (options.textAlign!=null) ? options.textAlign :"center";
  if(msg){ $('SDialogString').innerHTML = msg };
  $('SDialogButton').style.textAlign = "center";
  //$('SDialogButton').style.textAlign = (options.textAlign!=null) ? options.textAlign :"center";
  $('SDialogButton').innerHTML = (options.noHideButton!='1') ? '<input type="button" value="'+options.nameHideButton+'" onclick="sdlog.hide(\''+options.duration+'\');">':"";
 },
 
 hide: function(duration){
  duration=duration || "0";
  $('SDialogString').innerHTML = "";
  $('SDialogButton').innerHTML = "";
  $('SDialog').style.display = "none";
  new Effect.Opacity('SOverlay',{
   to: 0.0,
   duration: duration,
   afterFinishInternal:function(e){new Effect.Fade('SOverlay',{from:0.0,to:0.0,duration:0});}
   }
  );
  
 }
}

function initSDLog() { sdlog=new sdlog(); }
Event.observe(window, 'load', initSDLog, false);


//
// getPageSize()
// Returns array with page width, height and window width, height
// Core code from - quirksmode.com
// Edit for Firefox by pHaez
//
function getPageSize(){
	
	var xScroll, yScroll;
	
	if (window.innerHeight && window.scrollMaxY) {	
		xScroll = window.innerWidth + window.scrollMaxX;
		yScroll = window.innerHeight + window.scrollMaxY;
	} else if (document.body.scrollHeight > document.body.offsetHeight){ // all but Explorer Mac
		xScroll = document.body.scrollWidth;
		yScroll = document.body.scrollHeight;
	} else { // Explorer Mac...would also work in Explorer 6 Strict, Mozilla and Safari
		xScroll = document.body.offsetWidth;
		yScroll = document.body.offsetHeight;
	}
	
	var windowWidth, windowHeight;
	
//	console.log(self.innerWidth);
//	console.log(document.documentElement.clientWidth);

	if (self.innerHeight) {	// all except Explorer
		if(document.documentElement.clientWidth){
			windowWidth = document.documentElement.clientWidth; 
		} else {
			windowWidth = self.innerWidth;
		}
		windowHeight = self.innerHeight;
	} else if (document.documentElement && document.documentElement.clientHeight) { // Explorer 6 Strict Mode
		windowWidth = document.documentElement.clientWidth;
		windowHeight = document.documentElement.clientHeight;
	} else if (document.body) { // other Explorers
		windowWidth = document.body.clientWidth;
		windowHeight = document.body.clientHeight;
	}	
	
	// for small pages with total height less then height of the viewport
	if(yScroll < windowHeight){
		pageHeight = windowHeight;
	} else { 
		pageHeight = yScroll;
	}

//	console.log("xScroll " + xScroll)
//	console.log("windowWidth " + windowWidth)

	// for small pages with total width less then width of the viewport
	if(xScroll < windowWidth){	
		pageWidth = xScroll;		
	} else {
		pageWidth = windowWidth;
	}
//	console.log("pageWidth " + pageWidth)

	arrayPageSize = new Array(pageWidth,pageHeight,windowWidth,windowHeight) 
	return arrayPageSize;
}
