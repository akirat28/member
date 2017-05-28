<?php

namespace AppBundle\Controller;

use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Method;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Template;
use JMS\SecurityExtraBundle\Annotation\Secure;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Request;

use AppBundle\Form\UserType;
use AppBundle\Form\UserNewType;
use AppBundle\Entity\User;

//use Monolog\Handler\StreamHandler;
//use Monolog\Logger;

/**
 * Class AdminController
 * @package AppBundle\Controller
 * @Route("/admin/user")
 */
class UserController extends Controller
{
    /**
     * ユーザー一覧
     *
     * @Route("/")
     * @Method("GET")
     * @Secure(roles="ROLE_SUPER_ADMIN,ROLE_ADMIN")
     * @Template()
     * @param Request $request
     * @return array
     */
    public function indexAction(Request $request)
    {

        /* Knp_Pagenator */
        $pagination['pagenator'] = $this->get('knp_paginator');
        $pagination['page'] = $request->query->get('page', 1);
        $pagination['limitPerPage'] = $this->container->getParameter('limit_per_page');
        $pagination['sort'] = $request->query->get('sort', 'u.id');
        $pagination['direction'] = $request->query->get('direction', 'ASC');

        /* Search Param */
        $search_params['word'] = $this->wordAnalyse($request->get('search_word', ''));
        $search_params['alluser'] = $request->get('alluser', false);

        try {
            $userService = $this->get('app_user.service');
            $users = $userService->getUsers($search_params, $pagination);
            $params = array(
                'users' => $users,
                'search_word' => $request->get('search_word', ''),
                'alluser' => $request->get('alluser', false)
            );
            return $params;
        } catch (\Exception $e) {
            $this->get('session')->getFlashBag()->add('caution', 'ユーザー存在しないか、条件が間違っています。');
            return $this->redirect($this->generateUrl('app_user_index '));
        }
    }


    /**
     * wordAnalyse
     * フリーワードの検索支持の場合のキーワード抽出
     *
     * @param string $words
     * @access private
     * @return array
     */
    private function wordAnalyse($words)
    {
        $words = trim(preg_replace("/[　\s]+/u", " ", $words));
        $w = "";
        if (!empty($words)) {
            $w = explode(" ", $words);
        }
        return $w;
    }


    /**
     * 照会（詳細）ページ
     *
     * @Route("/{id}",requirements={"id" = "\d+"})
     * @Method("GET")
     * @Secure(roles="ROLE_SUPER_ADMIN,ROLE_ADMIN")
     * @Template()
     */
    public function showAction(Request $request, $id)
    {
        $userService = $this->get('app_user.service');
        $user = $userService->getUser($id);

        $params = array(
            'user' => $user,
        );

        return $params;
    }

    /**
     * 編集ページ（U)
     *
     * @Route("/{id}/edit",requirements={"id" = "\d+"})
     * @Method("GET")
     * @Secure(roles="ROLE_SUPER_ADMIN,ROLE_ADMIN")
     * @Template()
     */
    public function editAction(Request $request, $id)
    {

        $formType = new UserType();
        $userService = $this->get('app_user.service');

        if ($user = $userService->getUser($id)) {
            $form = $this->createForm($formType, $user);

            $params = array(
                'form' => $form->createView(),
                'id' => $id,
            );
            return $params;
        } else {
            $this->get('session')->getFlashBag()->add('caution', "ユーザー情報が見つかりません、すでに削除された可能性があります");
            return $this->redirect($this->generateUrl('app_user_index'));
        }
    }


    /**
     * 編集完了（修正完了）ページ
     *
     * @Route("/{id}",requirements={"id" = "\d+"})
     * @Method("PUT")
     * @Secure(roles="ROLE_SUPER_ADMIN,ROLE_ADMIN")
     */
    public function updateAction(Request $request, $id)
    {
        try {
            $user = new User();
            $userService = $this->get('app_user.service');
            $form = $this->createForm(UserType::class, $user, array('method' => 'PUT'));
            $form->handleRequest($request);
            if ($form->isValid()) {
                $userService->updateUser($id,$request->get('UserType'));
                $this->get('session')->getFlashBag()->add('notice', "正常に保存されました。");
                //return $this->redirect($this->generateUrl('app_user_index'));
                $params = array('form' => $form->createView(), 'id' => $id);
                return $this->render("AppBundle:User:edit.html.twig", $params);
            } else {
                $this->get('session')->getFlashBag()->add('caution', "更新情報にエラーがあります、各項目をご確認ください。");
                $params = array('form' => $form->createView(), 'id' => $id);
                return $this->render("AppBundle:User:edit.html.twig", $params);
            }
        } catch (\Exception $e) {
            $this->get('session')->getFlashBag()->add('caution', 'エラーが発生しました。更新は失敗しました。');
            return $this->redirect($this->generateUrl('app_user_edit', array('id' => $id )));
        }
    }

    /**
     * 新規ユーザー追加（登録指示）ページ
     *
     * @Route("/new")
     * @Method("GET")
     * @Secure(roles="ROLE_SUPER_ADMIN",roles="IS_AUTHENTICATED_FULLY")
     * @Template()
     */
    public function newAction(Request $request)
    {
        $formType = new UserNewType();

        $form = $this->createForm($formType, new User());

        $params = array(
            'form' => $form->createView(),
        );
        return $params;

    }

    /**
     * 新規ユーザー追加（登録指示）ページ
     *
     * @Route("/")
     * @Method("POST")
     * @Secure(roles="ROLE_SUPER_ADMIN")
     */
    public function createAction(Request $request){
        try {
            $user = new User();
            $userService = $this->get('app_user.service');
            $form = $this->createForm(UserNewType::class, $user);
            $form->handleRequest($request);

            if ($form->isValid()) {
                $params = $request->get('UserNewType', '');
                $factory = $this->get('security.encoder_factory');
                //ユーザーアカウント作成
                $userService->createUser($params,$factory);
                $this->get('session')->getFlashBag()->add('notice', "正常に登録されました。");
                return $this->redirect($this->generateUrl('app_user_index'));
            } else {
                $this->get('session')->getFlashBag()->add('caution', "更新情報にエラーがあります、各項目をご確認ください。");
                $params = array('form' => $form->createView());
                return $this->render("AppBundle:User:new.html.twig", $params);
            }
        } catch (\Exception $e) {
            $this->get('session')->getFlashBag()->add('caution', 'エラーが発生しました。登録は失敗しました。');
            return $this->redirect($this->generateUrl('app_user_new'));
        }
    }
    /**
     * プロフィールページ
     *
     * @Route("/profile")
     * @Method("GET")
     * @Template()
     */
    public function profileAction(){

        $user = $this->container->get('security.token_storage')->getToken()->getUser();

        $params = array(
            'user' => $user,
        );

        return $params;
    }

    /**
     * ダッシュボード用ユーザー数検出
     *
     * @Route("/count")
     * @Method("GET")
     * @Template()
     */
    public function countAction(){

        $userService = $this->get('app_user.service');

        $count =  $userService->getUserCount();
        $params = array(
            'count' => $count,
        );

        return $params;
    }



}
