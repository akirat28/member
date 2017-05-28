$(function(){
    $("input[type=text],textarea,select").change(function() {
        $(window).on('beforeunload', function() {
            return '投稿が完了していません。このまま移動しますか？';
        });
    });
    $("input[type=submit]").click(function() {
        $(window).off('beforeunload');
    });
});