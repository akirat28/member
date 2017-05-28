/**
 * 代理店管理 紐づけ
 */

$(function(){
    // 検索
    //$("#agent_search").on('click',function(){});

    /**
     * 代理店一覧に戻る
     * list_list
     */

    /**
     * 店舗検索
     * list_search
     */

    // 一括で紐づけ
    $(".link_select").on('click',function(){
        // 選択した店舗を配列で取得
        var select_shop_ids = $('[class="select_shop_id"]:checked').map(function(){
            return $(this).val();
        }).get();

        if(!select_shop_ids[0]) {
            alert('紐づける店舗を選択してください。');
            return false;
        }

        // 紐づけ、代理店ID
        var search_agent_id = $(this).data('search_agent_id');

        // 紐づけ実行
        var res = callAjax({
                search_agent_id:search_agent_id,
                select_shop_ids:select_shop_ids
                },
                Routesing.uri+'/admin/agent/link_add'
        );

        return false;
    });

    // ００６６番号 発行
    $(".link_ctnum_issue").on('click',function(){
        var id = $(this).data('shop_id');
        var res = callAjax({shop_id:id},Routesing.uri+'/admin/agent/ctnum/issue' );
        if('')
        return false;
    });

    // ００６６番号 取り消し
    $(".link_ctnum_delete").on('click',function(){
        var id = $(this).data('shop_id');
        var res = callAjax({shop_id:id},Routesing.uri+'/admin/agent/ctnum/delete' );
        return false;
    });

    // アカウント追加
    $(".link_account_issue").on('click',function(){
        var id = $(this).data('shop_id');
        var res = callAjax({shop_id:id},Routesing.uri+'/admin/agent/account/issue/shop' );
        if('errors' in res) {
            for (var err in res.errors) {
                $(this).nextAll('span').text(res.errors[err].message);
            }
        }
        if('user' in res) {
            $(this).data('user_id',res.user.id)
                .data('username',res.user.username)
                .data('email',res.user.email)
                .parents('tr').find('.col_username:first').text(res.user.username)
                .parents('tr').find('.col_email:first').text(res.user.email)
                .parents('tr').find('.col_email:first').show()
                .parents('tr')
                    .find('.link_account_notify:first')
                    .attr('data-user_id',res.user.id)
                    .attr('data-username',res.user.username)
                    .attr('data-email',res.user.email)
                    .show();
        }

        return false;
    });

    // アカウント通知
    $(".link_account_notify").on('click',function(){
        var params = {
            shop_id:$(this).data('shop_id'),
            user_id:$(this).data('user_id'),
            username:$(this).data('username'),
            email:$(this).data('email')
        };
        var res = callAjax(params,Routesing.uri+'/admin/agent/account/notify/shop' );
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

});

