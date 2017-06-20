
Push.create("Hello wolrd!",{
	body: "How's it hangin'?",
	timeout: 10000,
	onClick: function (){
		windows.focus();
		this.close();
	}
});
