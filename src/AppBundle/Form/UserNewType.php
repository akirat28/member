<?php

namespace AppBundle\Form;

use Symfony\Component\OptionsResolver\OptionsResolverInterface;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Validator\Constraints as Assert;
use Doctrine\ORM\EntityRepository;

// Type
use Symfony\Component\Form\Extension\Core\Type\ChoiceType;
use Symfony\Component\Form\Extension\Core\Type\BirthdayType;
use Symfony\Component\Form\Extension\Core\Type\TextType;
use Symfony\Component\Form\Extension\Core\Type\EmailType;
use Symfony\Component\Form\Extension\Core\Type\RepeatedType;
use Symfony\Component\Form\Extension\Core\Type\PasswordType;
use Symfony\Component\Form\Extension\Core\Type\DateType;
use Symfony\Component\Form\Extension\Core\Type\NumberType;
use Symfony\Component\Form\Extension\Core\Type\TextareaType;
use Symfony\Bridge\Doctrine\Form\Type\EntityType;

use Symfony\Component\Form\FormEvents;
use Symfony\Component\Form as Form;

class UserNewType extends AbstractType {

    public function buildForm(FormBuilderInterface $builder, array $options) {

        $builder
            ->add('username', TextType::class,
                [
                    'label' => 'ユーザー名',
                    'required' => true,
                    'max_length' => '180',
                    'attr' => [
                        'placeholder' => '例）山田太郎',
                        'class' => 'form-control',
                    ]
                ]
            )
            ->add('email', TextType::class,
                [
                    'label' => 'Eメール',
                    'required' => true,
                    'max_length' => '180',
                    'attr' => [
                        'placeholder' => '例）taro@faucet.jp',
                        'class' => 'form-control',
                    ]
                ]
            )
            ->add('plainPassword', PasswordType::class,
                [
                    'label' => 'パスワード',
                    'required' => true,
                    'attr' => [
                        'class' => 'form-control',
                    ]
                ]
            )
            ->add('rePlainPassword', PasswordType::class,
                [
                    'label' => 'パスワード確認',
                    'required' => true,
                    'mapped' => false,
                    'attr' => [
                        'class' => 'form-control',
                    ]
                ]
            )
            ->add('roles', ChoiceType::class,
                [
                    'label' => '保有権限',
                    'required' => true,
                    'choices'=> [
                        "ROLE_USER"=>"一般ユーザー",
                        "ROLE_STAFF"=>"スタッフ",
                        "ROLE_ADMIN"=>"管理者"
                    ],
                    'expanded' => true,
                    'multiple' => true,
                    'attr' => [
                        'class' => 'panel panel-default panel-body',
                    ]
                ]
            )

        ;
        $builder->addEventListener(FormEvents::POST_SUBMIT,function($event){
            $form = $event->getForm();

            //パスワード不一致
            if ($form['plainPassword']->getData() != $form['rePlainPassword']->getData()) {
                $form['PlainPassword']->addError(new Form\FormError('パスワード確認が不一致です。'));
            }
        });
    }

    public function getName() {
        return "UserNewType";
    }

    public function getDefaultOptions(array $options)
    {
        return array(
            'csrf_protection' => true,
            'csrf_field_name' => '_token',
        );
    }
}