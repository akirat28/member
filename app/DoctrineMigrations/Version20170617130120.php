<?php

namespace Application\Migrations;

use Doctrine\DBAL\Migrations\AbstractMigration;
use Doctrine\DBAL\Schema\Schema;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
class Version20170617130120 extends AbstractMigration
{
    /**
     * @param Schema $schema
     */
    public function up(Schema $schema)
    {
        $sql = <<<SQL
INSERT INTO member.prefecture (id, name, area_id) VALUES (1,'北海道', 1);
INSERT INTO member.prefecture (id, name, area_id) VALUES (2,'青森県', 2);
INSERT INTO member.prefecture (id, name, area_id) VALUES (13,'東京都', 3);
INSERT INTO member.prefecture (id, name, area_id) VALUES (35,'山口県', 6);

INSERT INTO member.area (id, name) VALUES (1,'北海道');
INSERT INTO member.area (id, name) VALUES (2,'東北');
INSERT INTO member.area (id, name) VALUES (3,'関東');
INSERT INTO member.area (id, name) VALUES (4,'中部');
INSERT INTO member.area (id, name) VALUES (5,'近畿');
INSERT INTO member.area (id, name) VALUES (6,'中国');
INSERT INTO member.area (id, name) VALUES (7,'四国');
INSERT INTO member.area (id, name) VALUES (8,'九州');
SQL;
        $this->addSql($sql);
    }

    /**
     * @param Schema $schema
     */
    public function down(Schema $schema)
    {
        // this down() migration is auto-generated, please modify it to your needs

    }
}
