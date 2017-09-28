function pushtest_hoge() {
  Push.create('Hello world!', {
        body: 'How\'s it hangin\'?',
        icon: 'assets/img/mountain_icon.png',
        link: '/#',
        timeout: 4000,
        onClick: function () {
            console.log("Fired!");
            window.focus();
            this.close();
        },
        vibrate: [200, 100, 200, 100, 200, 100, 200]
    });
}

$(document).ready(function() {
    $("#hoge_test").click(pushtest_hoge);
});
