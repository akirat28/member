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


class UserService
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
     * @var Prefecture
     */
    protected $prefecture;

    /**
     * @var Area
     */
    protected $area;


    /**
     * UserService constructor.
     *
     * @param $entityManager
     * @param $container
     */
    public function __construct($entityManager, $container, $prefecture, $area)
    {
        $this->em = $entityManager;
        $this->container = $container;
        $this->prefecture = $prefecture;
        $this->area = $area;
    }

    /**
     * ユーザーリスト取得(R)
     *
     * @param $search_params
     * @param $params
     * @return mixed
     */
    public function getUsers($search_params, $params)
    {
        $qb = $this->em->getRepository('AppBundle:User')
            ->createQueryBuilder('u')
            ->select(array('u'))
            ->orderBy($params['sort'], $params['direction']);

        if (is_array($search_params['word'])) {
            foreach ($search_params['word'] as $key => $value) {
                $qb->andWhere(
                    $qb->expr()->orX(
                        $qb->expr()->like('u.username', ':un_' . $key),
                        $qb->expr()->like('u.email', ':em_' . $key)
                    )
                );
                $qb->setParameter('un_' . $key, "%" . $value . "%");
                $qb->setParameter('em_' . $key, "%" . $value . "%");

            }
        }
        if ($search_params['alluser'] == false) {
            $qb->andWhere('u.enabled = 1');
        }
        $query = $qb->getQuery();
        $paginator = $params['pagenator']->paginate($query, $params['page'], $params['limitPerPage']);
        return $paginator;
    }

    /**
     * 1件取得(R)
     *
     * @param $id
     * @return null|object
     */
    public function getUser($id)
    {

        $user = $this->em->getRepository('AppBundle:User')->find($id);
        return $user;
    }

    /**
     * 登録(C)
     *
     * @param $params
     * @param $factory
     * @return bool|mixed
     */
    public function createUser($params, $factory)
    {
        return $this->em->transactional(function(EntityManager $em) use($params, $factory) {

            $user = new User();
            $user->setUsername($params['username']);
            $user->setEmail($params['email']);
            $user->setPlainPassword($params['plainPassword']);
            $user->setRoles($params['roles']);
            $user->setEnabled(true);
            $em->persist($user);
        });
    }

    /**
     * 変更(U)
     *
     * @param $id
     * @param $params
     * @return bool|mixed
     */
    public function updateUser($id, $params)
    {
        return $this->em->transactional(function(EntityManager $em) use($id, $params) {

            $user = $this->em->getRepository('AppBundle:User')->find($id);
            $user->setUsername($params['username']);
            $user->setEmail($params['email']);

            $pref = $this->prefecture->getPrefecture($params['prefecture']);
            $user->setPrefecture($pref);

            if($params['enabled'] == "1") {
                $user->setEnabled(true);
            }else{
                $user->setEnabled(false);
            }
            $user->setRoles($params['roles']);
        });
    }


    /**
     * ユーザー停止
     * 削除せずに利用不可にする。
     *
     * @param $id
     * @return bool|mixed
     */
    public function disableUser($id)
    {
        return $this->em->transactional(function (EntityManager $em) use ($id) {
            $user = $em->getRepository('AppBundle:User')->find($id);
            $user->setEnable(0);
        });
    }

    /**
     * 削除(D)
     *
     * @param $id
     * @return bool|mixed
     */
    public function deleteUser($id)
    {
        return $this->em->transactional(function (EntityManager $em) use ($id) {
            $user = $em->getRepository('AppBundle:User')->find($id);
            $em->remove($user);
        });
    }

    /**
     * ユーザー数検出
     *
     * @return int
     */
    public function getUserCount()
    {
        $params = ['enabled' => 1];
        $shop = $this->em->getRepository('AppBundle:User')->findBy($params);
        return count($shop);
    }

}
