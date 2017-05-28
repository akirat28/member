<?php

namespace Application\Migrations;

use Doctrine\DBAL\Migrations\AbstractMigration;
use Doctrine\DBAL\Schema\Schema;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
class Version20170412090244 extends AbstractMigration
{
    /**
     * @param Schema $schema
     */
    public function up(Schema $schema)
    {
        $sql = <<<SQL
truncate user;
INSERT INTO user (username, username_canonical, email, email_canonical, enabled, salt, password, last_login, confirmation_token, password_requested_at, roles) VALUES ('superadmin', 'superadmin', 'superadmin@symfony.vm', 'superadmin@symfony.vm', 1, 'dx7jTnPRGvcZWvNJh5ZQiymzz72a9gYmur7o.Cf1W4w', 'LWFkvoVyzpYse8qWZvJjW6SXzmwnQChk0PRYGUQbg4yf65T5WthuomeZSmxm1SeZeQin9jYHwrzTZkC/LcR5Rg==', null, null, null, 'a:1:{i:0;s:16:"ROLE_SUPER_ADMIN";}');
INSERT INTO user (username, username_canonical, email, email_canonical, enabled, salt, password, last_login, confirmation_token, password_requested_at, roles) VALUES ('admin', 'admin', 'admin@symfony.vm', 'admin@symfony.vm', 1, '5.xc8v/wXp33g1itqMLUX96CNlKsBK6KA.wTCQ8mGLA', 'xvBlFc2uScbAGe0P+O7lI1gTqlkuf4EvqyMCTqoFhDuX6urxgSJ1zL0h/ABee4CUd3YgAjVquF/w6EAvF3bbbg==', null, null, null, 'a:1:{i:0;s:10:"ROLE_ADMIN";}');
INSERT INTO user (username, username_canonical, email, email_canonical, enabled, salt, password, last_login, confirmation_token, password_requested_at, roles) VALUES ('other', 'other', 'other@symfony.vm', 'other@symfony.vm', 1, '4IKDcP6773HIqMMo4cXvm8QaL0U0i8J.PkrGL36iCXs', 'PLsARqSQy8KSQGGRcwx7reApeABIngLKP80VDPad0+XclSH5LAxMtr/v0nOLbgsTMdErrjCoFA55e9+bsstx3w==', null, null, null, 'a:0:{}');
SQL;
        $this->addSql($sql);
    }

    /**
     * @param Schema $schema
     */
    public function down(Schema $schema)
    {
        $sql = <<<SQL
truncate user;
SQL;
        $this->addSql($sql);
    }
}
