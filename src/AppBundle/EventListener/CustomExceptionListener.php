<?php
namespace AppBundle\EventListener;


use Symfony\Component\Debug\Exception\ContextErrorException;
use Symfony\Component\HttpKernel\Event\GetResponseForExceptionEvent;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Exception\AccessDeniedHttpException;
use Symfony\Component\Routing\Exception\RouteNotFoundException;
use Symfony\Component\Security\Core\Exception\AccessDeniedException;
use Symfony\Bundle\TwigBundle\TwigEngine;
use Monolog\Logger;


class CustomExceptionListener
{
    //404エラーの場合にメールを送信する場合はtrue
    const E404 = false;

    /**
     * @var TwigEngine
     */
    protected $templating;

    /**
     * @var \Monolog\Logger
     */
    private $logger;

    /**
     * @var \Swift_Mailer
     */
    private $mailer;

    /**
     * Error Event
     */
    public function __construct(TwigEngine $templating, Logger $logger, \Swift_Mailer $mailer, $container)
    {
        $this->templating = $templating;
        $this->logger = $logger;
        $this->mailer = $mailer;
        $this->container = $container;
    }

    /**
     * @param GetResponseForExceptionEvent $event
     */
    public function onKernelException(GetResponseForExceptionEvent $event)
    {
        $exception = $event->getException();

        if (method_exists($exception, 'getStatusCode')) {
            $code = $exception->getStatusCode();
        }

        $response = new Response();

        if ($exception instanceof ErrorException
            || $exception instanceof RouteNotFoundException
            || $exception instanceof ContextErrorException) {
            $title = 'エラー(500)';
            $content = 'ページでエラーが発生しました(500)';
            $message = 'エラーが発生しました。管理者にお問い合わせください。';
            $detail = '['.$exception->getMessage()."]";

            //ログ
            $this->logger->addError($content.$exception->getMessage());

            $template = "AppBundle:Error:error50x.html.twig";
            $msg = $this->templating->render($template,
                [
                    'title' => $title,
                    'content' => $content,
                    'message' => $message,
                    'detail' => $detail,
                ]);
            $response = new Response($msg);
            $event->setResponse($response);

            //500系のエラーの場合はメールを送る
            $mail = \Swift_Message::newInstance()
                ->setSubject('Error Email')
                ->setFrom($this->container->getParameter('mailer_user'))
                ->setTo($this->container->getParameter('repair_env.notice_email'))
                ->setBody($title.$message.$detail, 'text/html');
            $this->mailer->send($mail);

        }
        // HTTP 404 Status
        if (isset($code) && 404 == $code) {

            $title = 'ページが見つかりません(404)';
            $content = 'ページが見つかりません (404)';
            $message = 'ご指定のURLに誤りがあるか、お探しのページが移動または削除された可能性がございます。';

            $this->logger->addError($content.$exception->getMessage());

            $template = "AppBundle:Error:error404.html.twig";
            $msg = $this->templating->render('FaucetAppBundle:Error:error404.html.twig',
                [
                    'title' => $title,
                    'content' => $content,
                    'message' => $message
                ]);
            $response = new Response($msg, $code);
            $event->setResponse($response);

            //400系のエラーの場合はメールを送る
            if(self::E404) {
                $mail = \Swift_Message::newInstance()
                    ->setSubject('Error Email')
                    ->setFrom($this->container->getParameter('mailer_user'))
                    ->setTo($this->container->getParameter('repair_env.notice_email'))
                    ->setBody($message, 'text/html');
                $this->mailer->send($mail);
            }
        }
    }
}
