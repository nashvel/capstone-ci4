<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

class CreateVerificationCodes extends Migration
{
    public function up()
    {
        $this->forge->addField([
            'id'    => ['type' => 'INT', 'constraint' => 11, 'unsigned' => true, 'auto_increment' => true],
            'email' => ['type' => 'VARCHAR', 'constraint' => 255],
            'code'  => ['type' => 'VARCHAR', 'constraint' => 6],
        ]);
        $this->forge->addPrimaryKey('id');
        $this->forge->createTable('verification_codes');
    }

    public function down()
    {
        $this->forge->dropTable('verification_codes');
    }
}
