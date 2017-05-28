<?php

namespace AppBundle\Twig;

class UtilExtension extends \Twig_Extension
{

    /**
     * フィルター名設定 stab
     *
     * @see Twig_Extension::getFilters()
     */
    public function getFilters()
    {
        return array(
            new \Twig_SimpleFilter('count', array($this, 'countFilter')),
            new \Twig_SimpleFilter('date_ago', array($this, 'dateAgo')),
            new \Twig_SimpleFilter('roleJName', array($this, 'roleJNameFilter')),
            new \Twig_SimpleFilter('zipcode', array($this, 'zipcodeFilter')),

        );
    }

    public function roleJNameFilter($str)
    {
        switch($str){
            case "ROLE_USER":
                return "■一般ユーザー<br>";
                break;
            case "ROLE_SHOP":
                return "■店舗ユーザー<br>";
                break;
            case "ROLE_AGENT":
                return "■代理店ユーザー<br>";
                break;
            case "ROLE_SUPPORT":
                return "■サポートユーザー<br>";
                break;
            case "ROLE_ADMIN":
                return "■管理者<br>";
                break;
            case "ROLE_SUPER_ADMIN":
                return "■スーパーアドミン<br>";
                break;
        }
        return "";
    }


    /**
     * 郵便番号編集
     *
     * 0000000 → 〒000-0000
     * @param $str
     * @return string
     */
    public function zipcodeFilter($str){
        $s = $str;
        if(strlen($str) == 7){
            $s = "〒" . substr($str,0,3) . "-" . substr($str,3,4);
        }
        return $s;
    }


    public function countFilter($arrParam){
        return count($arrParam);
    }

    /**
     * 指定したDateは何日前か
     *
     * @param string $dateTime
     * @throws \InvalidArgumentException
     * @return string
     */
    public function dateAgo($dateTime)
    {
        $delta = time() - strtotime($dateTime);
        if ($delta < 0)
            //throw new \InvalidArgumentException("createdAgo is unable to handle dates in the future");
            return "";
        $duration = "";
        if ($delta < 60) {
            // Seconds
            $time = $delta;
            $duration = $time . "秒前";
        } else if ($delta <= 3600) {
            // Mins
            $time = floor($delta / 60);
            $duration = $time . "分前";
        } else if ($delta <= 86400) {
            // Hours
            $time = floor($delta / 3600);
            $duration = $time . "時間前";
        } else if($delta <= (86400 * 365)) {
            // Days
            $time = floor($delta / 86400);
            $duration = $time . "日前";
        } else {
            // Years
            $time = floor($delta / (86400 * 365));
            $duration = "約".$time . "年前";
        }

        return $duration;
    }
}
