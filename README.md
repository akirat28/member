開発環境SETUP手順
=======

## DB作成
$ mysql -uroot -ppassword  
SQL> create database XXXXXXX char set=utf8;  
SQL> GRANT all ON *.* TO 'root'@'%' IDENTIFIED BY 'password';  
SQL> GRANT all ON *.* TO 'root'@'localhost' IDENTIFIED BY 'password';  
SQL> FLUSH PRIVILEGES;  

## Composer install
$ curl -sS https://getcomposer.org/installer | php  
$ sudo mv composer.phar /usr/local/bin/composer  

## 書き込み権限設定
$ mkdir app/cache app/logs  
$ sudo setfacl -R -m u:www-data:rwx -m u:gridy:rwx app/cache app/logs  
$ sudo setfacl -dR -m u:www-data:rwx -m u:gridy:rwx app/cache app/logs  

## Composerからパッケージのインストール
$ cd member  
$ composer install  

## マイグレーション実行
$ php app/console doctrine:migrations:migrate  

