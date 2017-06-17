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
     * @var \Pref
     *
     * @ORM\ManyToOne(targetEntity="Prefecture")
     * @ORM\JoinColumns({
     *   @ORM\JoinColumn(name="prefecture_id", referencedColumnName="id")
     * })
     */
    private $prefecture;


    /**
     * Set Pref
     *
     * @param \AppBundle\Entity\Prefecture $prefecture
     *
     * @return Prefecture
     */
    public function setPrefecture(\AppBundle\Entity\Prefecture $prefecture = null)
    {
        $this->prefecture = $prefecture;

        return $this;
    }

    /**
     * Get area
     *
     * @return \AppBundle\Entity\Prefecture
     */
    public function getPrefecture()
    {
        return $this->prefecture;
    }



}
