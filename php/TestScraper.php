<?php

require_once "simple_html_dom.php";

$html = file_get_html('http://slashdot.org/');

//echo $html;//prints all html

//note: is slow

//not working. unsure why
// Find all article blocks
foreach($html->find('div.article') as $article) {
    $item['title'] = $article->find('div.title', 0)->plaintext;
    $item['intro'] = $article->find('div.intro', 0)->plaintext;
    $item['details'] = $article->find('div.details', 0)->plaintext;
    $articles[] = $item;
}

print_r($articles);

?>