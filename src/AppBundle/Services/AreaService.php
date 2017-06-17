<?php

namespace AppBundle\Services;

use AppBundle\Entity\User;
use Symfony\Bridge\Doctrine\RegistryInterface;
use Doctrine\ORM\EntityManager;
use Doctrine\DBAL\LockMode;
use Symfony\Component\Security\Core\Exception\AccessDeniedException;
use Symfony\Component\DependencyInjection\ContainerInterface;
use Symfony\Component\HttpKernel\Log\LoggerInterface;
use Symfony\Component\Security\Core\SecurityContext;

use JMS\DiExtraBundle\Annotation as DI;


class AreaService
{

    /**
     * @var EntityManager
     */
    protected $em;

    /**
     * @var Container
     */
    protected $container;



    /**
     * UserService constructor.
     *
     * @param $entityManager
     * @param $container
     */
    public function __construct($entityManager, $container)
    {
        $this->em = $entityManager;
        $this->container = $container;
    }


    /**
     * 1件取得(R)
     *
     * @param $id
     * @return null|object
     */
    public function getArea($id)
    {
        $obj = $this->em->getRepository('AppBundle:Area')->find($id);
        return $obj;
    }
}
