
Push.create("Hello wolrd!",{
	body: "How's it hangin'?",
	icon: 'img/mountain_icon.png',
	timeout: 10000,
	vibrate: [100,100],
	link: "https://komo91.github.io/PushTest.html",
	onClick: function (){
		window.focus();
		this.close();
	}
});
