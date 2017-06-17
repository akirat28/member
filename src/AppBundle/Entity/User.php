<?php
// src/AppBundle/Entity/User.php

namespace AppBundle\Entity;

use Doctrine\Common\Collections\ArrayCollection;
use AppBundle\Entity\Repairshops;
use FOS\UserBundle\Model\User as BaseUser;
use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Entity
 * @ORM\Table(name="user")
 */
class User extends BaseUser
{
    /**
     * @ORM\Id
     * @ORM\Column(type="integer")
     * @ORM\GeneratedValue(strategy="AUTO")
     */
    protected $id;

    public function __construct()
    {
        parent::__construct();
    }

    /************* 追加項目 *********************************************/

    /**
     * @var integer
     *
     * @ORM\Column(name="pref_id", type="integer", nullable=true)
     */
    private $prefId;

    /**
     * Set prefId
     *
     * @param string $prefId
     *
     * @return Prefecture
     */
    public function setPrefId($prefId)
    {
        $this->prefId = $prefId;

        return $this;
    }

    /**
     * Get prefName
     *
     * @return string
     */
    public function getPrefId()
    {
        return $this->prefId;
    }


}
