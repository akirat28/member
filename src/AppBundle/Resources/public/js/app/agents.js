/**
 * 代理店管理
 */

$(function(){

    // 検索
    //$("#agent_search").on('click',function(){});

    // 編集へ
    $(".agent_edit").on('click',function(){
        //一覧に戻る準備
        var res = callAjax({
                referrer:document.referrer,
                page:'edit'
            },
            Routesing.uri+'/admin/agent/store' //'./store'
        );

        var id = $(this).data('agent_id');
        location.href = 'edit?agent_id=' + id;
        return false;
    });

    // 紐づけ画面へ
    $(".agent_link").on('click',function(){
        var id = $(this).data('agent_id');
        location.href = Routesing.uri+'/admin/agent/link?agent_id=' + id;
        return false;
    });

    // アカウント追加
    $(".agent_account_issue").on('click',function(){

        var res = callAjax({
            agent_id: $(this).data('agent_id'),
            agent_email: $(this).data('agent_email')
        },Routesing.uri+'/admin/agent/account/issue/agent'); //'account_issue');

        if('errors' in res) {
            for (var err in res.errors) {
                $(this).nextAll('span').text(res.errors[err].message);
            }
        }

        if('user' in res) {
            $(this).data('user_id',res.user.id)
                .data('username',res.user.username)
                .data('email',res.user.email)
                .hide()
            ;
            $(this).parents('tr').find('.col_username:first').text(res.user.username)
                .parents('tr').find('.col_email:first').text(res.user.email)
                .parents('tr').find('.col_email:first').show()
                .parents('tr')
                    .find('.agent_account_notify:first')
                    .attr('data-user_id',res.user.id)
                    .attr('data-username',res.user.username)
                    .attr('data-email',res.user.email)
                    .show()
            ;
        }

        return false;
    });

    // アカウント通知
    $(".agent_account_notify").on('click',function(){
        var params = {
            agent_id:$(this).data('agent_id'),
            shop_id:$(this).data('shop_id'),
            user_id:$(this).data('user_id'),
            username:$(this).data('username'),
            email:$(this).data('email')
        };
        var res = callAjax(params,Routesing.uri+'/admin/agent/account/notify/agent' );
        if('errors' in res) {
            for (var err in res.errors) {
                $(this).nextAll('.col_sendDatetime').text(res.errors[err].message);
            }
        }
        if('response_status' in res) {
            for (var st in res.response_status) {
                $(this).nextAll('.col_sendDatetime').text(res.response_status.sendDatetime);
            }
        }
        return false;
    });

    // 保存
    $("#agent_save").on('click',function(){
        var params = {};
        $("#save_message").text('');
        var elms = [
            'search_agent_id',
            'csrf',
            'id',
            'agent_name',
            'email',
            'sendDate',
            'agentInfoId',
            'createDatetime',
            'updateDatetime'
        ];

        for ( var elm in elms ) {
            $("#"+elms[elm]).next().find('p').text('');
            var el = '';
            if($("#"+elms[elm]).val()) el = $("#"+elms[elm]).val();
            params[elms[elm]] = el;
        }

        var res = callAjax(params, Routesing.uri+'/admin/agent/save'); // 'save');

        if('errors' in res) {
            for (var err in res.errors) {
                //console.log(res.errors[err].key+' '+res.errors[err].message);
                $("#"+res.errors[err].key).nextAll('p').text(res.errors[err].message);
            }
        }
        if('guide' in res) {
            for (var m in res.guide) {
                $("#"+res.guide[m].key).text(res.guide[m].message);
            }
        }
        if('response' in res) {
            for (var r in res.response) {
                $("#"+r).val(res.response[r]);
            }
        }
        return false;
    });

    /**
     * 削除
     */
    $(".agent_delete").on('click',function(){
        var id = $(this).data('agent_id');
        deles(id,return_list);
    });

});

function deles(id,callback){
    callAjax({agent_id: id}, Routesing.uri+'/admin/agent/delete'); //'delete');
    callback();
}

var return_list = function () {
    location.href = $(".agent_delete").attr('href');
};