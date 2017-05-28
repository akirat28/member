$(function () {
    /**************************/
    /*** クッキーの値を設定 ***/
    /**************************/
    var cookie = '';
    //クッキーが存在する場合、変数に値を設定
    if ($.cookie('accordion') && $.cookie('accordion') != null) {
        var cookie = $.cookie('accordion');
    }

    /*** クッキー情報から、はじめの開閉状態を判断 ***/
    $('.toggle').each(function (index) {
        if ($.cookie('accordion') == null || cookie.indexOf(index) == -1) {
            //クッキーが存在しない or クッキーにアコーディオンナンバーがない場合、閉じる
            $(this).next().hide();
        } else {
            //クッキーにアコーディオンナンバーがある場合、開ける
            $(this).addClass('opend');
            $(this).next().show();
        }
    });
    /*** アコーディオンのクリックイベントを登録 ***/
    $('.toggle').click(function () {
        index = $('.toggle').index(this);
        $(this).toggleClass('opend')
        //アコーディオンを開閉する
        $(this).next().slideToggle();


        if ($(this).hasClass('opend')) {
            //アコーディオンを開いた場合、アコーディオンナンバーをクッキーに保存
            cookie += index;
            $.cookie('accordion', cookie);
        } else {
            //アコーディオンを閉じた場合、アコーディオンナンバーをクッキーから削除
            cookie = cookie.replace(index, '');

            //クッキー空ならクッキー削除
            if (cookie.length == 0) {
                $.cookie('accordion', '', {expires: -1});
            } else {
                $.cookie('accordion', cookie);
            }
        }
    });
});

