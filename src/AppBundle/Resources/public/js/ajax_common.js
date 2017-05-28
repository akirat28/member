var undefined;
var callAjax_debug = false;

function callAjax(data, url, csrf, responseType, acallAjax_options) {

    var result = {'success': '', 'error': ''};

    var acallAjax_async = false;

    if (acallAjax_options && (acallAjax_options['async'] == true || acallAjax_options['async'] == false)) {
        acallAjax_async = acallAjax_options['async'];
    }

$.ajax({
    type: "POST",
    url: url,
    async: acallAjax_async,
    cache: false,
    /* xhrFields: {
        withCredentials: true
    } , */
    dataType: "html",
    data: { data: data , csrf: csrf } ,
    success: function(html){
      if( callAjax_debug == true) alert("html:"+html);
      if(responseType=='html') { result = html ; return result; };
      result = eval("("+html+")");
      return result;
    },
    error: function(xhr, textStatus, errorThrown){ /*エラーのとき*/
      var err = new Array(3);
      err[0] = xhr;
      err[1] = textStatus;
      err[2] = errorThrown;
      result.error = err;
    },
    complete: function(){ /*終了したとき*/
      //alert("complete: commodities");
    }
 });

 return result;
}


function callAjaxAsync(data, url, csrf, responseType , acallAjaxAsync_options, callback ){

   var result = {'success':'', 'error':''};

   var acallAjax_async = false;


   if ( acallAjaxAsync_options && (acallAjaxAsync_options['async'] == true || acallAjaxAsync_options['async'] == false) ) {
     acallAjaxAsync_async = acallAjaxAsync_options['async'];
   }

   $.ajax({
     type: "POST",
     url: url,
     dataType: "html",
     data: { data: data , csrf: csrf }
   ,
   success: function(html){
        if( callAjax_debug == true) alert("html:"+html);
        if(responseType=='html') { result = html ; return result; };
        result = eval("("+html+")");
        callback(result);
        return ;
      }
   });

}

/**
 * symfonyルートパスの取得
 * @param script_id
 * @returns {{}}
 * @private
 */
function _Routesing (script_id) {
    var scripts = document.getElementById( script_id );
    var src = scripts.src;

    try{
        var query = src.substring( src.indexOf( '?' ) + 1 );
    }catch (e){return {} }

    var parameters = query.split( '&' );

    // URLクエリを分解して取得する
    var params = {}; //new Object();
    for( var i = 0; i < parameters.length; i++ )
    {
        var element = parameters[ i ].split( '=' );

        var paramName = decodeURIComponent( element[ 0 ] );
        var paramValue = decodeURIComponent( element[ 1 ] );

        paramValue = (paramValue.slice(-1)=='/'?paramValue.slice(0,-1):paramValue);
        params[ paramName ] = paramValue;
    }
    return params;
}

var Routesing = null;
$(function() {
    Routesing = _Routesing('app_index');
    console.log(Routesing.uri);
});

/* 非同期通信 */
/*
 callAjaxAsync().done(function(result) {
 // なんか処理
 }).fail(function(result) {
 // なんか処理
 });
 */


function ajaxGetEnv(envs)
{
  for (var env in envs) {
    if(env !== 'env') { continue; }
    var en = envs[env].slice(0,3);
    if( en == 'stg' || en == 'www' || en == 'api' || en == 'adm' ) {}
    else{
      //callAjax_debug = true;
    }
  }
}


/**
 * URLからnemedパラメータを抜き出す。
 */
function getParams( a_url ) {
  var params = {};
  var a_urls = {};

  a_url = a_url.split("?");

  // GET
  var url_get = location.search.substring(1).split("&");

  for(var i=0; url_get[i]; i++){
      var kv = url_get[i].split('=');
      a_urls[kv[0]]=kv[1];
  }

  // POST
  var urls = a_url[0].split("/");
  for( u in urls) {
      var ur = urls[u].replace( /#/g , "" );
      if(!ur) continue;
      var p = ur.indexOf(':');
      if( p < 1 ) continue;
      if( (p+1) >= ur.length ) continue;
      var val = ur.slice(p+1);
      a_urls[ ur.slice(0,p) ] = val;
  }
  return a_urls;
}

/**
 * ie9対策
 * 初期起動時に
 * @returns {undefined}
 */
function pushAjax(url, pushAjax_params, pushAjax_url, csrf, options) {

    if( ! $("#first_flag")[0] ) {
        //<input type="hidden" id="first_flag" value="0">
        var $ins = $('<input/>', {'id': "first_flag",'type':'hidden','value':0});
        $($ins).appendTo(document.body);
    }
    try{
      console.log( 'first_flag:' + $("#first_flag").val() );
      console.log( 'is_navigator():' + is_navigator()['navi'] );
    }catch(e){}
    var sql = '';
    var key = '';
    if( is_navigator()['navi_ver'] >= '1' && is_navigator()['navi_ver'] <= '9' ) {
        if( $("#first_flag").val() != '0' ) {
            for ( key in pushAjax_params) {
               sql += "/" + key +':'+ pushAjax_params[key];
            }
            window.location.href = url + sql;
            return {response_body:null};
        }else{
            var res = callAjax( pushAjax_params , pushAjax_url , csrf, options );
            $("#first_flag").val(1);
            return res;
        }
    }else{
        var res = callAjax( pushAjax_params , pushAjax_url , csrf, options );
        $("#first_flag").val(1);
        return res;
    }
}

/**
 * ie9対策
 * 初期起動時に
 * @returns {undefined}
 */
function pushAjax9(url, pushAjax_params, pushAjax_url, csrf, options) {

    if( ! $("#first_flag")[0] ) {
        //<input type="hidden" id="first_flag" value="0">
        var $ins = $('<input/>', {'id': "first_flag",'type':'hidden','value':0});
        $($ins).appendTo(document.body);
    }
    try{
      console.log( 'first_flag:' + $("#first_flag").val() );
      console.log( 'is_navigator():' + is_navigator()['navi'] );
    }catch(e){}
    var sql = '';
    var key = '';

    for ( key in pushAjax_params) {
       sql += "/" + key +':'+ pushAjax_params[key];
    }
    window.location.href = url + sql;
    return {response_body:null};

/*
  if( is_navigator()['navi_ver'] >= '1' && is_navigator()['navi_ver'] <= '9' || (options !== null && ('pushAjax' in options) && options.pushAjax == 'client_sp') ) {
//        if( $("#first_flag").val() != '0' ) {
            for ( key in pushAjax_params) {
               sql += "/" + key +':'+ pushAjax_params[key];
            }
            window.location.href = url + sql;
            return {response_body:null};
//        }else{
//            var res = callAjax( pushAjax_params , pushAjax_url , csrf, options );
//            $("#first_flag").val(1);
//            return res;
//        }
    }else{
        var res = callAjax( pushAjax_params , pushAjax_url , csrf, options );
        $("#first_flag").val(1);
        return res;
    }
*/
}

/**
 * ブラウザの判定
 */
function is_navigator() {
    var userAgent = window.navigator.userAgent.toLowerCase();
    var appVersion = window.navigator.appVersion.toLowerCase();
    var navi = '';
    var navi_ver = '0';
    if (userAgent.indexOf('msie') != -1) {
        //IE全般
        if (appVersion.indexOf("msie 6.") != -1) {
            //IE6
            navi = 'ie6';
            navi_ver = 6;
        }else if (appVersion.indexOf("msie 7.") != -1) {
            //IE7
            navi = 'ie7';
            navi_ver = 7;
        }else if (appVersion.indexOf("msie 8.") != -1) {
            //IE8
            navi = 'ie8';
            navi_ver = 8;
        }else if (appVersion.indexOf("msie 9.") != -1) {
            //IE9
            navi = 'ie9';
            navi_ver = 9;
        }else if (appVersion.indexOf("msie 10.") != -1) {
            //IE10
            navi = 'ie10';
            navi_ver = 10;
        }else if (appVersion.indexOf("msie 11.") != -1) {
            //IE10
            navi = 'ie11';
            navi_ver = 11;
        }else if (appVersion.indexOf("msie 12.") != -1) {
            //IE10
            navi = 'ie12';
            navi_ver = 12;
        }else if (appVersion.indexOf("msie 13.") != -1) {
            //IE10
            navi = 'ie13';
            navi_ver = 13;
        }else if (appVersion.indexOf("msie 14.") != -1) {
            //IE10
            navi = 'ie14';
            navi_ver = 14;
        }
        navi = 'ie';

    }else if (userAgent.indexOf('chrome') != -1) {
        //Chrome
        navi = 'chrome';
        navi_ver = 0;
    }else if (userAgent.indexOf('safari') != -1) {
        //Safari
        navi = 'safari';
        navi_ver = 0;
    }else if (userAgent.indexOf('firefox') != -1) {
        //Firefox
        navi = 'firefox';
        navi_ver = 0;
    }else if (userAgent.indexOf('opera') != -1) {
        //Opera
        navi = 'opera';
        navi_ver = 0;
    }
    return {navi:navi,navi_ver:navi_ver};
}

/**
 *  クッキーを取得する
 * @param {type} name
 * @returns {GetCookie.result}
 */
function getCookie( name )
{
    var result = null;

    var cookieName = name + '=';
    var allcookies = document.cookie;

    var position = allcookies.indexOf( cookieName );
    if( position != -1 )
    {
        var startIndex = position + cookieName.length;

        var endIndex = allcookies.indexOf( ';', startIndex );
        if( endIndex == -1 )
        {
            endIndex = allcookies.length;
        }

        result = decodeURIComponent(
            allcookies.substring( startIndex, endIndex ) );
    }

    return result;
}

/**
 * PCかモバイルか
 * @returns {String}
 */
function is_clientType() {
    var ua = navigator.userAgent.toUpperCase();
    if ( ua.indexOf('IPHONE') != -1 || (ua.indexOf('ANDROID') != -1 && ua.indexOf('MOBILE') != -1) ) {
        return "sp";
    }
    return "pc";
};

/**
 * URL変更
 * @returns {Boolean}
 */
var changePage = function( path, urls, pageTitles, event_allow_flag, callbacks ){

    if ( event_allow_flag ) return event_allow_flag;

    //リンク先URLを取得
//    request = path;
//    url = location.host;
//    thisProt = location.protocol;
//
    //リンク先URLを取得
    var param_s = getParams(location.href);
    if ( urls['_delete_flag'] ) {
        param_s = clearArrays(param_s);
        delete urls['_delete_flag'];
    }
    for (var u in urls) {
        if(  urls[u] !='' ) param_s[u] = urls[u];
        if(  urls[u] ==='' ) delete param_s[u];
    }
    //相対パスの作成
    sql = "";
    for (var p in param_s) {
        sql += "/" + p + ":" + param_s[p];
    }
    path += sql;
    relativePath = path; //request.replace(thisProt,"").replace("//","").replace(url,"");
    //
    //相対パスが空だったときはスラッシュを代入
    if(relativePath == "") relativePath = "/";

    after = function(){
        $("#_tag_loader").remove();
        //ローダーを削除
    };

    refreshInfo = function(){
        //pushStateでアドレスバーを変更

        try{
            history.pushState("", "", relativePath);
        }catch(e){}

        //ページタイトルを変更
        $("title").text(pageTitles);
        //afterを実行
        after();
    };

    displayContent = function(){
        //画面位置を上に戻す
        //$("html,body,#main").animate({scrollTop: 0},1000);
        refreshInfo();
    };

    loadContent = function(){
        displayContent();
    };

    loadContent();
    // _gaq.push(["_trackPageview",relativePath]);

    //GoogleAnalyticsのトラッキングページを変える
    var $div = $("<div/>", {'id': "_tag_loader"});
    //$("body").appendTo( "#_tag_loader" );
    //$($div).appendTo( "#_tag_loader" );
    $($div).appendTo(document.body);
    if ( typeof callbacks === "function" ) callbacks();
    return false;
};

function tag_loader() {
    $("body#_tag_loader").load('/tag/change_pages');
}