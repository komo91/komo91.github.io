
Push.create("Hello wolrd!",{
	body: "How's it hangin'?",
	icon: 'img/mountain_icon.png',
	timeout: 10000,
	onClick: function (){
		window.focus();
		this.close();
	}
});
